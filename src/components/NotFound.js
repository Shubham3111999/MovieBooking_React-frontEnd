import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {

    const divStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Fixed typo
        height: "100vh",
        color: "white"
    }

    const navigation = useNavigate();

    useEffect(() => {
        setTimeout(() => {
           navigation(-1);
        }, 3000)
    },[])

    return (
        <>
            <div style={divStyle}>
                <h1> Page not found </h1>

            </div>
            <p>Navigating back homepage....</p>

        </>

    )
}
