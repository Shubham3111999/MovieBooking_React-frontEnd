import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actionJwt } from "./JwtReducer";
import { toast } from 'react-toastify';

//add booking for user
export const bookSeatsForUser=createAsyncThunk(
    "bookSeatsForUser",

    async (arg, thunkApi) => {

        const data = {
            "showId": arg.showId,   //get password 
            "email": arg.email,   //get email
            "seats": arg.seats
        }


        const options = {
            method: "POST", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
            body: JSON.stringify(data)
        };

        let response = await fetch(process.env.REACT_APP_BACKEND_URL+"/booking/addBooking", options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            if(response.status==409){
                return thunkApi.rejectWithValue("Seat alreay booked !");
            }
            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        let resData= await response.json();


        return resData;     //instead of promis returned actual data
    }
)

//get all booking for user
export const getAllBookingForUser=createAsyncThunk(
    "getAllBookingForUser",

    async (arg, thunkApi) => {


        const options = {
            method: "GET", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
        };

        let response = await fetch(process.env.REACT_APP_BACKEND_URL+"/user/getAllBookingForUser/"+arg.email, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }

        return response.json();;     
    }
)

//get all booking for user
export const cancelBooking=createAsyncThunk(
    "cancelBooking",

    async (arg, thunkApi) => {


        const options = {
            method: "DELETE", // HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the data type
                "Authorization": `Bearer ${arg.token}` // Include JWT in the Authorization header
            },
        };

        let response = await fetch(process.env.REACT_BACKEND_URL+"/booking/cancelBooking/"+arg.bookingId, options);


        if (!response.ok) {

            if(response.status==401 || response.status==404){
                return thunkApi.rejectWithValue("Authentication fail! Sign in again");
            }

            return thunkApi.rejectWithValue("Session expired ! please sign in again");
        }
         
        await thunkApi.dispatch(getAllBookingForUser({ token:arg.token, email:arg.email }))
        
        let date= await response.text();   
        return thunkApi.fulfillWithValue(date);

    }
)

//initial state
const initialState = {      
    bookings: []
}


const bookingHistorySlice=createSlice({
    name:"bookingHistory",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(getAllBookingForUser.fulfilled,(state,action)=>{
            state.bookings=[...action.payload];
        })
        .addCase(getAllBookingForUser.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch movies11");
            }else{
                toast.error(action.payload);
            }

        })
        
        .addCase(cancelBooking.rejected,(state,action)=>{
            if(action.payload==undefined){
                toast.error("Server error ! \n Not able to fetch movies22");
            }else{
                toast.error(action.payload);
            }

        })

    }
})

export const  bookingHistoryReducer=bookingHistorySlice.reducer;
export const action=bookingHistorySlice.actions;
