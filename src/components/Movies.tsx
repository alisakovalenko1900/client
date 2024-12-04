import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Movies.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  video_url: string;
  thumbnail_url: string;
  views: number;
}

interface MoviesProps {
  isKidsMode: boolean;
}

const Movies: React.FC<MoviesProps> = ({ isKidsMode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/movies');
        let filteredMovies = response.data;

        if (isKidsMode) {
          filteredMovies = filteredMovies.filter((movie: Movie) => movie.genre === 'animation');
        }

        setMovies(filteredMovies);
      } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
      }
    };

    fetchMovies();
  }, [isKidsMode]);

  useEffect(() => {
    const recommendations = movies
      .filter((movie) => (selectedGenre ? movie.genre === selectedGenre : true))
      .sort((a, b) => b.views - a.views);
    setRecommendedMovies(recommendations);
  }, [selectedGenre, movies]);

  const handleWatch = (movie: Movie) => {
    setSelectedMovie(movie);
    axios.post(`http://localhost:3001/movies/${movie.id}/increment-views`).catch((error) =>
      console.error('Ошибка обновления просмотров:', error)
    );
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div className="movies-container">
      <div className="netflix-banner">
        <img
          src="https://images.ctfassets.net/4cd45et68cgf/6AMzOQyMYk02XdEjP91Nf3/18841575615f67237add46b9f9ae9753/Netflix_Ads_Blog_Image_.png?w=2560"
          alt="Netflix Banner"
        />
      </div>
      {!selectedMovie ? (
        <>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => window.location.replace('http://localhost:3000/')}>
              Главная
            </button>
          </div>
          <div className="columns">
            <div className="popular-movies">
              <h2>Популярные фильмы</h2>
              <div className="movies-list">
                {movies
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <iframe src={movie.thumbnail_url} allow="autoplay" className="movie-thumbnail"></iframe>
                      <h3>{movie.title}</h3>
                      <p>Жанр: {movie.genre}</p>
                      <p>Просмотры: {movie.views}</p>
                      <button className="watch-button" onClick={() => handleWatch(movie)}>
                        Смотреть
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="recommendations">
              <div className="recommendations-header">
                <h2>Рекомендации</h2>
                <select onChange={handleGenreChange} value={selectedGenre}>
                  <option value="">Все жанры</option>
                  {Array.from(new Set(movies.map((movie) => movie.genre))).map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="movies-list">
                {recommendedMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <iframe src={movie.thumbnail_url} allow="autoplay" className="movie-thumbnail"></iframe>
                    <h3>{movie.title}</h3>
                    <p>Жанр: {movie.genre}</p>
                    <p>Просмотры: {movie.views}</p>
                    <button className="watch-button" onClick={() => handleWatch(movie)}>
                      Смотреть
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="movie-player">
          <iframe src={selectedMovie.video_url} allow="autoplay" className="video-player"></iframe>
          <button className="back-button" onClick={() => setSelectedMovie(null)}>
            Назад к списку
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;

