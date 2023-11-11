import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import axios from "axios"
import { Navigate } from "react-router-dom"
import { UserContext } from "./UserContext"

/* eslint-disable react/prop-types */
const BookingWidget = ({place}) => {
    const [checkIn,setCheckIn] = useState(new Date().toISOString().split('T')[0])
    const [checkOut,setCheckOut] = useState(new Date().toISOString().split('T')[0])
    const [guests,setGuests] = useState(1)

    const [name,setName] = useState('')
    const [mobile,setMobile] = useState('')
    const [redirect,setRedirect] = useState('')

    const {user} = useContext(UserContext)

    useEffect(()=>{
        if(user){
            setName(user.name)
        }
    },[user])

    let days = 0;
    if(checkIn && checkOut){
        days = differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
        console.log(days)
    }

    const bookThisPlace = async ()=>{
        if(!user){
            setRedirect('/login')
            return;
        }
        const token = localStorage.getItem('token');
        await axios.post('/bookings',
        {
            token,
            checkIn,
            checkOut,
            guests,
            name,
            mobile,
            price:days*place.price,
            place:place._id
        })

        setRedirect('/account/bookings/');
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
    <div className="text-2xl text-center">
        price : ${place.price} / night
    </div>
    <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4">
            <label>Check in : </label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        </div>
        <div className="py-3 px-4">
            <label>Check out : </label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        </div>
        <div className="py-3 px-4">
            <label>Number of Guests:</label>
            <input type="number" value={guests} onChange={e => setGuests(e.target.value)} />
        </div>
        {days > 0 && (
            <div className="py-3 px-4">
                <label>Your Full Name</label>
                <input type="text" placeholder="Taj" value={name} onChange={e => setName(e.target.value)} />
                <label>Your Mobile Number</label>
                <input type="text" placeholder="7796327571" value={mobile} onChange={e => setMobile(e.target.value)} />
            </div>
        )}
    </div>
    <button onClick={bookThisPlace} className="bg-primary rounded-full p-2 text-white mt-4 w-full">
        Book This Place
        {days > 0 && (<span> ${days * place.price}</span>)}
    </button>
</div>

  )
}

export default BookingWidget