import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

//sign up user
export const signUpUser=createAsyncThunk(
    "signUpUser",

    async (arg, thunkApi)=>{
        const data = {
            "email": arg.email,   //get email 
            "password": arg.password,   //get password
            "role":"ROLE_USER"     //role user
        }

        const options = {
            method: "POST", // Specify the request method
            headers: {
                "Content-Type": "application/json", // Indicate JSON payload
            },
            body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
        }

        let response = await fetch(process.env.REACT_APP_BACKEND_URL+"/user/register",options);

        if (!response.ok) {
            return thunkApi.rejectWithValue("Failed to sign up");
        }

        return response.json();
    }
)


//fetch Jwt token for user
export const fetchJwt = createAsyncThunk(
    "fetchJwt",

    async (arg, thunkApi) => {

        const data = {
            "email": arg.email,   //get email 
            "password": arg.password   //get password
        }

        const options = {
            method: "POST", // Specify the request method
            headers: {
                "Content-Type": "application/json", // Indicate JSON payload
            },
            body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
        };

        let response = await fetch(process.env.REACT_APP_BACKEND_URL+"/auth/login", options);

        if (!response.ok) {
           
            return thunkApi.rejectWithValue("Credential failed");
        }

        return response.json();

    }
)

const initialState = {
    jwtToken: ""
}

const jwtSlice = createSlice({
    name: 'jwt',
    initialState,
    reducers: {
        resetJwtToken:(state,action)=>{
            state.jwtToken=""
        },

        setJwtToken:(state,action)=>{
            state.jwtToken=action.payload;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchJwt.fulfilled, (state, action) => {
            state.jwtToken = action.payload.jwtToken;
        }).addCase(fetchJwt.rejected, (state, action) => {    //sign in issue
            if(action.payload==undefined){
                toast.error("Server error");
            }else{
                toast.error(action.payload);  
            }   
        }).addCase(signUpUser.rejected, (state, action) => {   //sign in
                toast.error("Failed to sign up");
        })
    }

})

export const jwtReducer = jwtSlice.reducer;
export const actionJwt = jwtSlice.actions;