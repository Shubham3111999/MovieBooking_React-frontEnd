import React, { useState,useEffect } from "react";
import "../css/likedMovies.css"; // Assuming you will style this component in this file
import { getAllLikedMovies } from "../redux/LikedMovieReducer";
import LikedMovieCar from "./LikedMovieCard"
import { useDispatch, useSelector } from "react-redux";

const LikedMovies = () => {
  
  const dispatch = useDispatch();
  const { likedMovies } = useSelector((state) => state.likedMovieReducer)

  useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('email');
      dispatch(getAllLikedMovies({ token, email }));
  }, [])


  return (
    <div className="liked-movies">
      <h1>Liked Movies</h1>
      <div className="liked-movies-grid">
        {likedMovies.map((movie) => (
          <div key={movie.id} className="liked-movie-card position-relative">
            <LikedMovieCar key={movie.id} url={movie.posterUrl} title={movie.movieName} movieId={movie.id}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedMovies;
