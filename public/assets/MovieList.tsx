'use client';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

interface MovieListProps {
  movies: Movie[];
  toggleFavorite?: (movieId: string) => void; // Optional for Favorites
  toggleWatchLater?: (movieId: string) => void; // Optional for Watch Later
}

const MovieList: React.FC<MovieListProps> = ({ movies, toggleFavorite, toggleWatchLater }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mx-5 md:mx-10">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            toggleFavorite={toggleFavorite}  // Pass down toggleFavorite function
            toggleWatchLater={toggleWatchLater} // Pass down toggleWatchLater function
          />
        ))
      ) : (
        <p className="text-teal py-10 text-lg font-semibold ps-2">No movies found.</p>
      )}
    </div>
  );
};

export default MovieList;
