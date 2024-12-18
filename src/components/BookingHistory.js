import React, { useEffect, useState } from "react";
import "../css/BookingHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, getAllBookingForUser } from "../redux/BookingHistoryReducer";

const BookingHistory = () => {

  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingHistoryReducer)

  const [localBookingState, setLocalBookingState] = useState([]);

  const onCancel = (bookingId) => {
    const token = localStorage.getItem('jwtToken');
    const email = localStorage.getItem('email');
    dispatch(cancelBooking({ token, email,bookingId }));
  }

  useEffect(() => {

    const token = localStorage.getItem('jwtToken');
    const email = localStorage.getItem('email');
    dispatch(getAllBookingForUser({ token, email }));

  }, [])

  useEffect(() => {

    let bookingObj = bookings.map((booking) => {

      return {
        id: booking.id,
        totalPrice: booking.totalPrice,
        dateTime: booking.bookingDateAndTime,
        seats: booking.seats.map((seat) => seat.seatNumber),
        theaterName: booking.theater,
        movieName: booking.movie,
        show:booking.show
      }
    })

    setLocalBookingState(bookingObj)
  }, [bookings])


  return (
    <>
      <h1 className="Booking-history-text">Booking History</h1>

      <div className="booking-history-container">

        {localBookingState.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h2 className="movie-name">{booking.movieName}</h2>
            <p><strong>Theater:</strong> {booking.theaterName}</p>
            <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
            <p><strong>Date and Time:</strong> {`${booking.show.date} ${booking.show.time}`}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            

            {new Date().getTime()<new Date(`${booking.show.date}T${booking.show.time}`).getTime()?  <button
              className="cancel-button"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </button>: ""}
            
           
          </div>

        ))}
      </div>
    </>

  );
};

export default BookingHistory;
