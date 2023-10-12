import { useEffect, useState } from "react"
import AccountNav from "../AccountNav"
import axios from "axios"
import { differenceInCalendarDays, format } from "date-fns"
import { Link } from "react-router-dom"

const BookingsPage = () => {
    const [bookings,setBookings] = useState([])
    useEffect(()=>{
        axios.get('/bookings').then(({data})=>{
            console.log(data);
            setBookings(data)
        })
    },[])
  return (
    <div>
        <AccountNav/>
        <div className="">
            {bookings.length>0 && (
                bookings.map((booking,i)=>(
                    <Link to={"/place/"+booking.place._id} key={i} className="flex gap-4 cursor-pointer bg-gray-200 p-4 rounded-2xl mt-4 ">
                        {booking.place.photos.length>0 && (
                            <div className="flex w-36 bg-gray-300 grow-0 shrink-0">
                                <img className="object-cover" src={'http://localhost:4000/uploads/'+booking.place.photos[0]} alt="" />
                            </div>
                        )}
                        <div className="py-2">
                            <h2 className="text-xl" >{booking.place.title}</h2>
                            <div className="py-1">
                                From : {format(new Date(booking.checkIn),'dd MMM yyyy')} <br/> To : {format(new Date(booking.checkOut),'dd MMM yyyy')}
                            </div>
                            <div className="flex py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                                {differenceInCalendarDays(new Date(booking.checkOut),new Date(booking.checkIn))} Nights
                            </div>
                            <div>
                                Total price : ${booking.price*differenceInCalendarDays(new Date(booking.checkOut),new Date(booking.checkIn))}
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    </div>
  )
}
export default BookingsPage