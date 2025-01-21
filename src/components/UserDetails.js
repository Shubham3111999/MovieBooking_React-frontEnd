import React from 'react'
import "../css/UserDetails.css"
import { useNavigate } from 'react-router-dom';

export default function UserDetails() {
    let user=localStorage.getItem("email");
    const navigate=useNavigate();

    const handleResetPassword=()=>{
        navigate("/resetPass")
    }

    return (
        <>
        <h1 className='user-detail'>User Details</h1>
        <div className='container'>
            <div>
                <p><strong>Email:</strong> {user}</p>
                <button className='button' onClick={handleResetPassword}>Reset Password</button>
            </div>
        </div>
        </>
        
    )
}

