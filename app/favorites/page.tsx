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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/favorites?page=${page}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Favorites API Response:`, data);

      if (data.favorites) {
        setFavorites(data.favorites);
        setTotalPages(data.totalPages || 1);
      } else {
        setFavorites([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const toggleFavorite = useCallback(async (movieId: string) => {
    try {
      const response = await fetch(`/api/favorites/${movieId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to remove favorite.');
      }
      setFavorites((prevFavorites) =>
        prevFavorites.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  }, []);

  const toggleWatchLater = useCallback(async (movieId: string) => {
    try {
      const movie = favorites.find((m) => m.id === movieId);
      if (!movie) return;

      const isInWatchLater = movie.watchLater;
      const method = isInWatchLater ? 'DELETE' : 'POST';
      const response = await fetch(`/api/watch-later/${movieId}`, { method });
      if (!response.ok) {
        throw new Error(`Failed to ${isInWatchLater ? 'remove from' : 'add to'} Watch Later.`);
      }

      setFavorites((prevFavorites) =>
        prevFavorites.map((m) =>
          m.id === movieId ? { ...m, watchLater: !isInWatchLater } : m
        )
      );
    } catch (err) {
      console.error('Error toggling watch later:', err);
    }
  }, [favorites]);

  return (
    <main aria-labelledby="favorites-title">
      <h1 id="favorites-title" className="text-4xl md:text-5xl font-bold text-center text-white mb-8 py-10 mt-5">
        Favorites
      </h1>

      <section aria-live="polite" aria-busy={isLoading} role="region">
        {isLoading ? (
          <p className="text-white text-lg font-semibold" role="alert">Loading favorite movies...</p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold" role="alert">{error}</p>
        ) : favorites.length > 0 ? (
          <MovieList
            movies={favorites}
            toggleFavorite={toggleFavorite}
            toggleWatchLater={toggleWatchLater}
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">No favorite movies found.</p>
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
