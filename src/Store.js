import { configureStore } from "@reduxjs/toolkit";
import { jwtReducer } from "./redux/JwtReducer";
import { movieLocationReducer } from "./redux/MovieReducer";
import { theaterReducer } from "./redux/TheaterReducer";
import { bookingHistoryReducer } from "./redux/BookingHistoryReducer";
import { movieDetailReducer } from "./redux/MovieDetailReducer";
import { likedMovieReducer } from "./redux/LikedMovieReducer";


export const Store=configureStore({

    reducer:{
        jwtReducer,
        movieLocationReducer,
        theaterReducer,
        bookingHistoryReducer,
        movieDetailReducer,
        likedMovieReducer
    }
})