import React, { useEffect, useState } from "react";
import "../css/seatGrid.css";
import DropdownShow from "./DropdownShow";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { bookSeatsForUser } from "../redux/BookingHistoryReducer";
import { toast } from 'react-toastify';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchAllTheatersForLocation } from "../redux/TheaterReducer";
import { action } from '../redux/TheaterReducer';
import MovieDetail from "./MovieDetail";


const SeatGrid = ({ rows = 3, columns = 3 }) => {

  //based on this state build dateTimeShowObj in useEffect and other states 
  const { theaters, movieSelected, locationName } = useSelector((state) => state.theaterReducer);

  const dispatch = useDispatch();

  let { theaterId } = useParams();

  let navigate = useNavigate();

  //for storing seleted seat
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [dateTimeShowObj, setDateTimeShowObj] = useState({});
  const [dates, setDates] = useState([]);  //to show date drop down
  const [times, setTimes] = useState([]);  //to times drop down
  const [show, setShow] = useState({});   //will include seats and showId

  const [selectedDate, setSelectedDate] = useState("Select Date");
  const [selectedTime, setSelectedTime] = useState("Select Time");

  const [seatGrid, setSeatGrid] = useState([]);


  // Toggle seat selection
  const toggleSeat = (seatId) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId)
        ? prevSelected.filter((id) => id !== seatId)
        : [...prevSelected, seatId]
    );
  };

  const findShowId = (date, time) => {
    let timeObj = dateTimeShowObj[date].find((timeObj) => timeObj.time == time)
    return timeObj.showId;
  }

  const handleBookingTicket = async () => {

    if (selectedSeats.length == 0) {  //check seats are selected first
      toast.warning("Please Select seats")
      return;
    }

    let arg = {
      showId: findShowId(selectedDate, selectedTime),   //get showId
      email: localStorage.getItem("email"),
      token: localStorage.getItem("jwtToken"),
      seats: selectedSeats.map(seatId => ({ "id": seatId })),
      locationName: locationName
    }


    let response;
    if (arg.showId && arg.email && arg.token && arg.seats.length > 0 && arg.locationName) {

      response = await dispatch(bookSeatsForUser(arg));

    } else {
      toast.error("Please sign in again !, there is incomplete information for booking seat")
      return;
    }

    if (response.error) {
      toast.error(response.payload)
    } else {
      navigate("/history")
    }
  }


  useEffect(() => {
    //to handle refresh
    if (movieSelected == -1) {
      let TheaterObj=JSON.parse(localStorage.getItem("TheaterObj"));
      //set redux state as per locastorage
      dispatch(action.setAllThreeState({ theaters: TheaterObj.theaters, movieId: TheaterObj.movieSelected, locationName: TheaterObj.locationName }))

      return;
    }


    //create showDateTime object based on that data and time ,seats  we extract
    const showDateTimeSeat = {};

    theaters.map((theater) => {
      if (theater.id == theaterId) {
        for (let index = 0; index < theater.shows.length; index++) {
          let currentShow = theater.shows[index];

          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set today's time to midnight

          if (new Date(currentShow.date) < today) { // Compare only the date part
            continue; // Skip older dates
          }


          if (!showDateTimeSeat.hasOwnProperty(currentShow.date)) {
            showDateTimeSeat[currentShow.date] = [{ time: currentShow.time, seats: currentShow.seats, showId: currentShow.id }];
          } else {
            showDateTimeSeat[currentShow.date] = [...showDateTimeSeat[currentShow.date], { time: currentShow.time, seats: currentShow.seats, showId: currentShow.id }]
          }

        }

      }
    })

    setDateTimeShowObj(showDateTimeSeat)   //set dateTimeObject
    
    //build dates state
    const datesArray = [];
    for (const key in showDateTimeSeat) {
      datesArray.push(key);
    }
    setDates(datesArray);



    let grid = [];
    //get seats here using dateTimeShowObj
    if (selectedDate != "Select Date" && selectedTime != "Select Time") {

      let totalSeats;

      for (let index = 0; index < showDateTimeSeat[selectedDate].length; index++) {
        if (showDateTimeSeat[selectedDate][index].time == selectedTime) {

          //sets totalSeats used for grid creation
          totalSeats = showDateTimeSeat[selectedDate][index].seats;

          setShow({ seats: showDateTimeSeat[selectedDate][index].seats, showId: showDateTimeSeat[selectedDate][index].showId })    //set show here

          break;

        }
      }

      //make grid to render
      let totalSeatsIndex = 0;

      for (let i = 0; i < rows; i++) {    //rows and columns come from props
        let row = []
        for (let j = 0; j < columns; j++) {
          row.push(totalSeats[totalSeatsIndex]);
          totalSeatsIndex++;
        }

        grid.push(row);
      }

      setSeatGrid(grid);

    }

    if (selectedTime == "Select Time") {
      setSeatGrid([]);    //when time not selected dont shown grid
    }




    //websocket connection
    const socket = new SockJS("http://localhost:8080/ws"); // SockJS endpoint
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Auto-reconnect in 5 seconds
      debug: (str) => console.log(str),
    });


    client.onConnect = () => {

      client.subscribe("/topic/seats/" + findShowId(selectedDate, selectedTime), (message) => {

        let updatedBookedseat = JSON.parse(message.body).map((seatObj) => seatObj.id);


        const updatedGrid = grid.map((row) =>
          row.map((seat) => ({
            ...seat,
            isBooked: updatedBookedseat.includes(seat.id) ? true : seat.isBooked,
          }))
        );

        setSeatGrid(updatedGrid);

        //if u change time and come again to same time will show updated seat booked

        setTimeout(() => {
          dispatch(fetchAllTheatersForLocation({
            token: localStorage.getItem("jwtToken"),
            locationName: locationName
          }));
        }, 1000); // 500ms delay 

      });
    };

    client.activate();

    return () => client.deactivate();

  }, [selectedDate, selectedTime, theaters])





  return (
    <>
      <MovieDetail movieId={movieSelected}/>


      <div className="dropdown-flex">
        <DropdownShow btnText={selectedDate} data={dates} setTimes={setTimes} dateTimeShowObj={dateTimeShowObj} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime} />
        <DropdownShow btnText={selectedTime} data={times} setSelectedTime={setSelectedTime} />
      </div>

      <div className="screen">SCREEN</div>

      <div className="seat-grid">

        {seatGrid.map((seatRow, index) => (
          <div key={index} className="row">
            {seatRow.map(seat => {

              const isSelected = selectedSeats.includes(seat.id);

              return (<div
                key={seat.id}
                className={`seat ${isSelected ? "selected" : ""} ${seat.isBooked ? "disableSeat" : ""}`}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.seatNumber}
              </div>)

            })}

          </div>

        )
        )}

      </div>

      <button className="booking-btn" onClick={handleBookingTicket}>Book tickets</button>
    </>

  );
};

export default SeatGrid;