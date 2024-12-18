import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { actionJwt } from "./JwtReducer";

export const fetchAllTheatersForLocation = createAsyncThunk(
    "fetchAllTheatersForLocation",

    async (arg, thunkApi) => {

        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            }
        };

        let response = await fetch("http://localhost:8080/theater/getAllTheaterByLocation/" + arg.locationName, options);


        if (!response.ok) {
            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();
    }
)

//on theater page show theatrs with available movie
const initialState = {
    theaters: [],      //releted theater based upon movie selected
    movieSelected: -1,
    locationName: ""
}


const theaterSlice = createSlice({
    name: "theater",
    initialState,
    reducers: {
        setMovieIdAndLocation: (state, action) => {
            state.movieSelected = action.payload.movieId;
            state.locationName = action.payload.locationName;
        },

        setAllThreeState:(state, action)=>{
            state.theaters=action.payload.theaters;
            state.movieSelected = action.payload.movieId;
            state.locationName = action.payload.locationName;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTheatersForLocation.fulfilled, (state, action) => {
            console.log('theaters ', action.payload);
            console.log('state.movieSelected ', state.movieSelected);
            console.log('state.locationName ', state.locationName);

            let filteredTheaterByMovieShow=[];  //check theater have show for selected movie

            action.payload.map((theater) => {
                for (let index = 0; index < theater.shows.length; index++) {
                    if (theater.shows[index].movie.id == state.movieSelected) {
                        filteredTheaterByMovieShow.push(theater);
                        break;
                    }
                }
            })

            console.log('filteredTheaterByMovieShow ', filteredTheaterByMovieShow);

            state.theaters = filteredTheaterByMovieShow;
        })
            .addCase(fetchAllTheatersForLocation.rejected, (state, action) => {
                if (action.payload == undefined) {
                    toast.error("Server error ! \n Not able to fetch theater");
                } else {
                    toast.error(action.payload);
                }
            })

    }
})

export const theaterReducer = theaterSlice.reducer;
export const action = theaterSlice.actions;
