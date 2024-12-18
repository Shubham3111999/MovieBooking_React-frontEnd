import BookingHistory from "./components/BookingHistory";
import LikedMovies from "./components/LikedMovie";
import MovieDetail from "./components/MovieDetail";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import SeatGrid from "./components/SeatGrid";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import TheaterList from "./components/TheaterList";

import {createBrowserRouter, RouterProvider} from "react-router-dom"


function App() {


  const router=createBrowserRouter([
    {
      path:"/",
      element:<Navbar/>,
      errorElement:<NotFound/>,
      children:[
        {path:"/", element:<MovieList/>},
        {path:"/theaters", element:<TheaterList/>},
        {path:"/shows/:theaterId", element:<SeatGrid/>},
        {path:"/history", element:<BookingHistory/>},
        {path:"/likedMovies", element:<LikedMovies/>},
      ]
    },
    {
      path:"/signIn",
      element:<SignIn/>
    },
    {
      path:"/signUp",
      element:<SignUp/>
    }

  ])




  return (
   <>
    {/* <Navbar/>
    <MovieList/>
    <MovieDetail/>
    <TheaterList/>
    <SeatGrid/>
    <SignIn/>
    <SignUp/>
    <BookingHistory/>
    <LikedMovies/> */}
    <RouterProvider router={router}/>
   </>
  );
}

export default App;
