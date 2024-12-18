import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { actionJwt } from "./JwtReducer";



export const fetchAllMovies=createAsyncThunk(
    "fetchAllMovies",

    async (token, thunkApi)=>{
        
        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${token}` // Include JWT in the Authorization header
            }
        };

        let response = await fetch("http://localhost:8080/movie/getAllMovies",options);

        if (!response.ok) {
            thunkApi.dispatch(actionJwt.resetJwtToken());  //set jwtToken to null //for refresh navbar
            localStorage.setItem('jwtToken',"");
            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        
        return response.json();

    }
)

export const fetchAllLocations=createAsyncThunk(
    "fetchAllLocations",

    async (token, thunkApi)=>{
        
        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${token}` // Include JWT in the Authorization header
            }
        };

        let response =await fetch("http://localhost:8080/location/getAllLocations",options);

        if (!response.ok) {
            thunkApi.dispatch(actionJwt.resetJwtToken());  //set jwtToken to "" //for refresh navbar
            localStorage.setItem('jwtToken',"");
            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }
        return response.json();

    }

)

//initial state
const initialState = {      //set all movies and location
    locations: [],
    movies:[]
}

const movieLocationSlice=createSlice({
    name:"movieLocation",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAllMovies.fulfilled,(state,action)=>{
            state.movies=[...action.payload];
        })
        .addCase(fetchAllMovies.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch movies");
            }else{
                toast.error("Session Expired ! \n Please Sign in");
            }

        })

        .addCase(fetchAllLocations.fulfilled,(state,action)=>{
            state.locations=[...action.payload];
        })
        .addCase(fetchAllLocations.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch locations");
            }

        })
    }
})

export const  movieLocationReducer=movieLocationSlice.reducer;
export const action=movieLocationSlice.actions;