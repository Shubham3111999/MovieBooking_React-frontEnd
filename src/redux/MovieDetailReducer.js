import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actionJwt } from "./JwtReducer";
import { toast } from 'react-toastify';


export const addMovieToLikedList=createAsyncThunk(
    "addMovieToLikedList",

    async (arg, thunkApi) => {

        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
        };

        let response = await fetch("http://localhost:8080/user/addLikedMovie/"+arg.email+"?movieId="+arg.movieId, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            // thunkApi.dispatch(actionJwt.resetJwtToken());  //set jwtToken to "" //for refresh navbar
            // localStorage.setItem('jwtToken',"");

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();     
    }
)



export const removeMovieToLikedList=createAsyncThunk(
    "removeMovieToLikedList",

    async (arg, thunkApi) => {

        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
        };

        let response = await fetch("http://localhost:8080/user/removeLikedMovie/"+arg.email+"?movieId="+arg.movieId, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            // thunkApi.dispatch(actionJwt.resetJwtToken());  //set jwtToken to "" //for refresh navbar
            // localStorage.setItem('jwtToken',"");

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();     
    }
)


//get movie by id
export const getMovieById=createAsyncThunk(
    "getMovieById",

    async (arg, thunkApi) => {


        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
        };

        let response = await fetch("http://localhost:8080/movie/getMovieByIdLiked/"+arg.id+"/"+arg.email, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            // thunkApi.dispatch(actionJwt.resetJwtToken());  //set jwtToken to "" //for refresh navbar
            // localStorage.setItem('jwtToken',"");

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();     
    }
)

let initialState={
    movieDetails:{}
}

const movieDetailSlice=createSlice({
    name:"movieDetails",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(getMovieById.fulfilled,(state,action)=>{
            state.movieDetails=action.payload;
        })
        .addCase(getMovieById.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch movies11");
            }else{
                toast.error(action.payload);
            }

        })
        

    }
})

export const  movieDetailReducer=movieDetailSlice.reducer;
export const action=movieDetailSlice.actions;