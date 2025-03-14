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
  toggleFavorite?: (movieId: string) => void;
  toggleWatchLater?: (movieId: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies = [], toggleFavorite, toggleWatchLater }) => {
  console.log("Movies received by MovieList:", movies);

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mx-5 md:mx-10"
      aria-labelledby="movie-list-heading"
      role="list"
    >
      <h2 id="movie-list-heading" className="sr-only">Movie List</h2>

      {movies.length > 0 ? (
        movies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard
              movie={movie}
              toggleFavorite={toggleFavorite}
              toggleWatchLater={toggleWatchLater}
            />
          </div>
        ))
      ) : (
        <p
          className="text-teal py-10 text-lg font-semibold ps-2"
          aria-live="polite"
          tabIndex={0}
          role="alert"
        >
          No movies found.
        </p>
      )}
    </section>
  );
};


export default MovieList;
