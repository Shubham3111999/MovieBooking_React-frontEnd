import React, { useEffect, useState,useCallback } from "react";
import "../css/movieDetail.css"; // Assuming CSS file for styling
import { useDispatch, useSelector } from "react-redux";
import { addMovieToLikedList, getMovieById, removeMovieToLikedList } from "../redux/MovieDetailReducer";
import debounce from 'lodash.debounce';


const MovieDetail = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useDispatch();
  const { movieDetails } = useSelector((state) => state.movieDetailReducer)


  const handleFavoriteAction = useCallback(
    debounce((shouldAdd) => {
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('email');

      if (shouldAdd) {
       
        dispatch(addMovieToLikedList({ token, movieId, email }));
      } else {
        
        dispatch(removeMovieToLikedList({ token, movieId, email }));
      }
    }, 1000), // 1 seconds debounce
    []
  );

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);

    handleFavoriteAction(!isFavorite);  //used debouce here
  };

  useEffect(() => {

    const token = localStorage.getItem('jwtToken');
    const email = localStorage.getItem('email');


    if (movieId == -1) {
      movieId = JSON.parse(localStorage.getItem("TheaterObj")).movieSelected
    }

    //get movie by id
    dispatch(getMovieById({ token, id: movieId, email }));


  }, [])

  useEffect(() => {
    setIsFavorite(movieDetails.liked);
  }, [movieDetails])


  return (
    <div className="wrapper">
      
      <div className="movie-detail">
        <div className="movie-image">
          <img
            src={movieDetails.posterUrl} // Replace with real URL
            alt={movieDetails.posterUrl}
          />
        </div>
        <div className="movie-info">
          <div className="header">
            <h1>{movieDetails.movieName}</h1>
            <div className="favorite-icon" onClick={toggleFavorite}>
              {isFavorite ? "❤️" : "🤍"}
            </div>
          </div>
          <div className="rating">
            <span>⭐ {movieDetails.rating}/10</span>
          </div>
          <div className="formats">
            <span>2D, 3D, ICE, IMAX 2D, 4DX, IMAX 3D, 4DX 3D</span>
          </div>
          <div className="languages">
            <span>Telugu, Bengali, Hindi, Malayalam, Tamil, Kannada</span>
          </div>
          <div className="details">
            <span>{movieDetails.duration}</span><br />
            <span>{movieDetails.genre}</span>
          </div>
          {/* <button className="book-ticket">Book tickets</button> */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
