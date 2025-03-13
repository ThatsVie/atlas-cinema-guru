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
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 9;

  // Fetch user's favorite movies
  const fetchFavorites = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/favorites?page=${page}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();

      if (data.favorites) {
        setFavorites(data.favorites);
        setTotalPages(Math.ceil(data.favorites.length / itemsPerPage));
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

  const toggleFavorite = useCallback((movieId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
  }, []);

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
            movies={favorites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">No favorite movies found.</p>
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
