import React, { useCallback, useEffect, useState } from 'react';
import '../css/movieList.css'; // Import custom CSS for styling
import MovieCard from './MoveCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLocations, fetchAllMovies } from '../redux/MovieReducer';
import debounce from 'lodash.debounce';

const MovieList = () => {
  
  const dispatch =useDispatch();
  const {locations,movies}=useSelector((state)=>state.movieLocationReducer);


  //local state to handle movies and location filer
  const[localMovies,setLocalMovies]=useState([]);
  const [locationBtnText, setLocationBtnText]=useState("Select Location")
  const [searchText,setSearchText]=useState("");

  const handleDropDownClick=(locationName)=>{

    let filteredMovies= movies.filter((movie)=>{
      
      //check for movies in location array
      let locationIndex=movie.locations.findIndex((location)=>location.name==locationName);

      return locationIndex != -1;
    });

    if(searchText != ""){  //if any search input avaialble
      filteredMovies=filteredMovies.filter((movie)=>{
        return movie.movieName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
      })
    }

    setLocalMovies(filteredMovies);
    setLocationBtnText(locationName);
  }


  let setSearchToLocalMovie=useCallback(debounce((value)=>{

    let searchedMovies=movies.filter((movie)=>{
      return movie.movieName.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    });

    if(locationBtnText != "Select Location"){  //if any location selcted
      searchedMovies=searchedMovies.filter((movie)=>{
      
        //check for movies in location array
        let locationIndex=movie.locations.findIndex((location)=>location.name==locationBtnText);
  
        return locationIndex != -1;
      })
    }

    setLocalMovies(searchedMovies)

  },400),
    [movies,searchText,locationBtnText]
  )

  const handleSearch=(e)=>{
    const value = e.target.value;
    setSearchText(value);

    setSearchToLocalMovie(value);  //debounce function
  }

  //on refresh or direct hitting movielist
  useEffect(()=>{
    //get token from localhost
    const token= localStorage.getItem('jwtToken');
   
    dispatch(fetchAllMovies(token))
    dispatch(fetchAllLocations(token))
  },[])

  useEffect(()=>{
     //set local states
     setLocalMovies(movies);
  },[movies])          //when store state change run

  return (
    <div className='movie-list'>
     
      <div className="search-location-container">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for movies..."
            className="search-bar"
            onChange={handleSearch}
            value={searchText}
          />
        </div>

        {/* Location Dropdown */}
        <div className="location-dropdown">
          <button className="dropdown-btn">{locationBtnText}</button>
          <ul className="dropdown-menu">
            {locations.map((location,index)=><li className="dropdown-item" key={index} onClick={()=>handleDropDownClick(location.name)}>{location.name} </li>)}
          </ul>
        </div>
      </div>

      {/* Movie Cards Section */}
      <div className="movie-cards-container">
       
        {localMovies.map ((movie,index)=> <MovieCard title={movie.movieName} url={movie.posterUrl} key={index}  locationName={locationBtnText} movieId={movie.id}/>) }
      </div>
    </div>
  );
};



export default MovieList;
