
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actionJwt } from "./JwtReducer";
import { toast } from 'react-toastify';


//add booking for user
export const getAllLikedMovies=createAsyncThunk(
    "getAllLikedMovies",

    async (arg, thunkApi) => {

        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            }
        };

        let response = await fetch(process.env.REACT_APP_BACKEND_URL+"/user/getAllLikedMovies/"+arg.email, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();     //instead of promis returned actual data
    }
)

//initial state
const initialState = {      
    likedMovies: []
}


const likedMoviesSlice=createSlice({
    name:"likedMoviesSlice",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(getAllLikedMovies.fulfilled,(state,action)=>{
            state.likedMovies=[...action.payload];
        })
        .addCase(getAllLikedMovies.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch movies11");
            }else{
                toast.error(action.payload);
            }
        })
    }
})

export const  likedMovieReducer=likedMoviesSlice.reducer;
export const action=likedMoviesSlice.actions;