'use client';

import { useState, useEffect, useCallback } from 'react';
import MovieList from '../components/MovieList';
import Pagination from '../components/Pagination';

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

export default function WatchLaterPage() {
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchLaterMovies = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/watch-later?page=${page}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Watch Later API Response:`, data);

      if (data.watchLater) {
        setWatchLaterMovies(data.watchLater);
        setTotalPages(data.totalPages || 1);
      } else {
        setWatchLaterMovies([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching watch later movies:', err);
      setError('Failed to load watch later movies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchLaterMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);


  const toggleWatchLater = useCallback(async (movieId: string) => {
    try {
      const response = await fetch(`/api/watch-later/${movieId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to remove from Watch Later.');
      }
      setWatchLaterMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      console.error('Error removing from Watch Later:', err);
    }
  }, []);

  const toggleFavorite = useCallback(async (movieId: string) => {
    try {
      const movie = watchLaterMovies.find((m) => m.id === movieId);
      if (!movie) return;

      const isFavorited = movie.favorited;
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`/api/favorites/${movieId}`, { method });
      if (!response.ok) {
        throw new Error(`Failed to ${isFavorited ? 'remove from' : 'add to'} Favorites.`);
      }

      setWatchLaterMovies((prevMovies) =>
        prevMovies.map((m) =>
          m.id === movieId ? { ...m, favorited: !isFavorited } : m
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [watchLaterMovies]);

  return (
    <main aria-labelledby="watch-later-title">
      <h1 id="watch-later-title" className="text-4xl md:text-5xl font-bold text-center text-white mb-8 py-10 mt-5">
        Watch Later
      </h1>

      <section aria-live="polite" aria-busy={isLoading} role="region">
        {isLoading ? (
          <p className="text-white text-lg font-semibold" role="alert">Loading watch later movies...</p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold" role="alert">{error}</p>
        ) : watchLaterMovies.length > 0 ? (
          <MovieList
            movies={watchLaterMovies}
            toggleWatchLater={toggleWatchLater} 
            toggleFavorite={toggleFavorite} 
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">No movies in watch later list.</p>
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
