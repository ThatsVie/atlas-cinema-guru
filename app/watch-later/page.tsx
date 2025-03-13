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

  const itemsPerPage = 9;

  // Fetch user's watch later movies
  const fetchWatchLaterMovies = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/watch-later?page=${page}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();

      if (data.watchLater) {
        setWatchLaterMovies(data.watchLater);
        setTotalPages(Math.ceil(data.watchLater.length / itemsPerPage));
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

  const toggleWatchLater = useCallback((movieId: string) => {
    setWatchLaterMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }, []);

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
            movies={watchLaterMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            toggleWatchLater={toggleWatchLater}
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">No movies in watch later list.</p>
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
