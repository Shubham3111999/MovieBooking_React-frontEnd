import React, { useEffect, useState } from 'react';
import '../css/navbar.css'; // Optional for custom styles
import { Outlet ,Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux"
import { actionJwt } from '../redux/JwtReducer';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const {jwtToken}= useSelector((state)=>state.jwtReducer);//usethis only

  const dispatch=useDispatch();
 

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logOutHandler=(e)=>{     //handle logout
    localStorage.setItem("jwtToken","");
    dispatch(actionJwt.setJwtToken(""))
  }

  useEffect(()=>{
    //set state of jwt token == local staorage
    let jwtAvailable = localStorage.getItem("jwtToken");
    dispatch(actionJwt.setJwtToken(jwtAvailable))
  },[])

  return (

    <>
      <nav className="navbar bg-dark border-bottom border-body">
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <strong>Book<span>Movie</span></strong>
          </Link>

          {/* Right Links */}
          <div className="d-flex align-items-center">
            {jwtToken  ?
              <>
                <Link className="nav-link" to="/likedMovies">
                  Liked Movies
                </Link>
                <Link className="nav-link" to="/history">
                  Booking History
                </Link>

                {/* User Profile Dropdown */}
                <div className="dropdown">
                  <button
                    className="btn btn-link dropdown-toggle"
                    onClick={toggleDropdown}
                    style={{ border: 'none', background: 'none' }}
                  >
                    <img
                      src="https://picsum.photos/id/237/200/300" // Placeholder for user logo
                      alt="User"
                      className="rounded-circle"
                    />
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu dropdown-menu-end show">
                      <Link className="dropdown-item" to="/userDetail" onClick={toggleDropdown}>
                        User Details
                      </Link>
                      <Link className="dropdown-item" to="/signIn" onClick={logOutHandler}>
                        Logout
                      </Link>
                    </div>
                  )}
                </div>

              </>
              :
              <Link className="nav-link" to="/signIn">
                Sign In
              </Link>
            }

          </div>
        </div>
      </nav>
      <Outlet />
    </>

  );
};

export default Navbar;
