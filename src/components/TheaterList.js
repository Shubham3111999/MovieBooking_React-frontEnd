import React, { useEffect, useState } from 'react';
import '../css/theaterList.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { action } from '../redux/TheaterReducer';
import MovieDetail from './MovieDetail';

export default function TheaterList() {

  const { theaters, movieSelected, locationName } = useSelector((state) => state.theaterReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [localTheaters, setLocalTheaters] = useState([]);

  const navigateToShow = (theaterId) => {
    navigate("/shows/" + theaterId);     //navigate to show
  }

  useEffect(() => {

    if (movieSelected == -1) {
      let TheaterObj = JSON.parse(localStorage.getItem("TheaterObj"));

      //set redux state as per locastorage
      dispatch(action.setAllThreeState({ theaters: TheaterObj.theaters, movieId: TheaterObj.movieSelected, locationName: TheaterObj.locationName }))

    } else {
      setLocalTheaters(theaters);

      localStorage.setItem("TheaterObj", JSON.stringify({ theaters, movieSelected, locationName }))   //store in localstorage for persistance
    }
  }, [theaters])


  return (

    <>
      <MovieDetail  movieId={movieSelected}/>
      <div className="theater-list">
        <h1 className="movie-title">Select Theater</h1>
        <div className="theater-cards-container">
          {localTheaters.map((theater, index) => (
            <div className="theater-card" key={index}>
              <h4 className="theater-name">{theater.name}</h4>
              <p className="theater-address">{theater.address}</p>
              <button className="book-ticket-btn" onClick={() => navigateToShow(theater.id)}>Book Tickets</button>
            </div>
          ))}
        </div>
      </div>

    </>

  );
}
