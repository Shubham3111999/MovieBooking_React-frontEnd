import '../css/movieList.css';
import { useDispatch, useSelector } from 'react-redux';
import { action, fetchAllTheatersForLocation } from '../redux/TheaterReducer';
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom"

const MovieCard = ({ title ,url,locationName,movieId}) => {
    const naviagete=useNavigate();

    const dispatch =useDispatch();

    const handleBookTicket=(locationName)=>{
      //if location name is "Select Location" send notification to select location and return
      if(locationName=="Select Location"){
        toast.warn("Please select location !")
        return;
      }
      
      dispatch(action.setMovieIdAndLocation({movieId,locationName}))   //set movieId and location


      //dispatch async thunk for get all loation
      const token= localStorage.getItem('jwtToken');
      dispatch(fetchAllTheatersForLocation({token, locationName}))
      
      //naviaget to theater page
      naviagete("/theaters")
    }
   
    return (
      <div className="movie-card">
        <img
          src={url} // Placeholder for movie poster
          alt={title}
          className="movie-card-image"
        />
        <div className="movie-card-content position-relative">
          <h4 className="movie-title">{title}</h4>
          <button type="button" className="btn btn-danger " onClick={()=>handleBookTicket(locationName)}>Book Ticket</button>
        </div>
      </div>
    );
  };

export default MovieCard;