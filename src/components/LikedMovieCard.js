import '../css/movieList.css';
import { useDispatch, useSelector } from "react-redux";
import { removeMovieToLikedList } from '../redux/MovieDetailReducer';
import { getAllLikedMovies } from '../redux/LikedMovieReducer';


const LikedMovieCard = ({url,title,movieId}) => {
    const dispatch = useDispatch();

    const removeFromLikedList=()=>{
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('email');

      //removed liked movie and update the liked movie list
      dispatch(removeMovieToLikedList({ token, movieId, email })).then(()=>dispatch(getAllLikedMovies({ token, email })))
     
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
          <button type="button" className="btn btn-danger " onClick={removeFromLikedList}>Remove</button>
        </div>
      </div>
    );
  };

export default LikedMovieCard;