import React, { useState } from 'react'
import "../css/signIn.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchJwt, updateUserPassword } from '../redux/JwtReducer';


export default function ResetPassword() {

    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setconfirmPass] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPass == currentPass) {
            toast.warn("New and current passwords is same!")
            return;
        }

        if (newPass != confirmPass) {
            toast.warn("New and confirm passwords is diffrent!")
            return;
        }

        let email = localStorage.getItem("email");
        let token=localStorage.getItem("jwtToken")

        let response = await dispatch(fetchJwt({ email, password: currentPass }))


        //call for update password
        if (response.type == "fetchJwt/fulfilled") {
            dispatch(updateUserPassword({email,password: newPass,token}))
            navigate(-1);
        } else if (response.type != "fetchJwt/rejected") {
            toast.error("Unexpected error!")
        }

        //$2a$10$8TJSy/70Zu7E2xnM3fVdpe217GwfbzzyIhoWsGL/yswEMX9SKAmDq

    }

    return (
        <div className="signin-container">

            <h1>Reset Password</h1>

            <form className="signin-form" onSubmit={handleReset}>
                <input
                    type="password"
                    placeholder="Current Passwored"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Passwored"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Passwored"
                    value={confirmPass}
                    onChange={(e) => setconfirmPass(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>

        </div>
    )
}
