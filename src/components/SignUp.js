import React, { useState } from "react";
import "../css/signIn.css";
import {Link, useNavigate} from "react-router-dom"
import {useDispatch , useSelector} from "react-redux";
import { signUpUser } from "../redux/JwtReducer";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate=useNavigate();
  const dispatch =useDispatch();

  const handleSignUp=(e)=>{
     e.preventDefault();
     dispatch(signUpUser({email,password}))
     navigate("/signIn");
  }

  return (
    <div className="signin-container">
      <h1>Sign Up</h1>
      <form className="signin-form" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
