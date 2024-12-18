import React, { useState, useEffect } from "react";
import "../css/signIn.css";
import {useDispatch , useSelector} from "react-redux";
import { fetchJwt } from "../redux/JwtReducer";
import {Link, useNavigate} from "react-router-dom"

const SignIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch =useDispatch();
  const {jwtToken}=useSelector((state)=>state.jwtReducer)
  const navigate=useNavigate();


  useEffect(()=>{
      if(jwtToken != ""){
        navigate("/");
        localStorage.setItem('jwtToken',jwtToken);  //store in localstorage to use 
        localStorage.setItem("email",email)    //set email for booking
      }
  })

  const handleSignIn=(e)=>{
    e.preventDefault();
    dispatch(fetchJwt({email,password}));
  }

  return (
    <div className="signin-container">

      <h1>Sign In </h1>

      <form className="signin-form" onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <p>
        Or <span className="signup-link"><Link to="/signUp">SignUp</Link></span> instead
      </p>

    </div>
  );
};

export default SignIn;
