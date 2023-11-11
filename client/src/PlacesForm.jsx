import axios from "axios";
import { useEffect, useState } from "react";
import PhotosUploader from "./PhotosUploader";
import Perks from "./Perks";
import AccountNav from "./AccountNav";
import { Navigate, useParams} from "react-router-dom";

const PlacesForm = () => {

    const {id} = useParams();

    const [title,setTite] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkInTime,setCheckInTime] = useState('');
    const [checkOutTime,setCheckOutTime] = useState('');
    const [maxGuest,setMaxGuest] = useState(2);
    const [price,setPrice] = useState(1500);
    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{
        if(!id) return;
        if(id){
            axios.get('/places/'+id).then(({data})=>{
                const {
                    title,
                    address,
                    photos,
                    description,
                    perks,
                    extraInfo,
                    checkIn,
                    checkOut,
                    maxGuests,
                    price
                } = data;
                setTite(title);
                setAddress(address);
                setAddedPhotos(photos);
                setDescription(description);
                setPerks(perks);
                setExtraInfo(extraInfo);
                setCheckInTime(checkIn);
                setCheckOutTime(checkOut);
                setMaxGuest(maxGuests);
                setPrice(price);
            })
        }
    },[id])
    
    const  savePlace =async (e) =>{
        e.preventDefault();

        const token = localStorage.getItem('token');

        if(id){
            await axios.put('/places',
            {   token,
                id,
                title,
                address,
                addedPhotos,
                description,
                perks,
                extraInfo,
                checkInTime,
                checkOutTime,
                maxGuest,
                price
            })
        }
        else{
            await axios.post('/places',
            {   token,
                title,
                address,
                addedPhotos,
                description,
                perks,
                extraInfo,
                checkInTime,
                checkOutTime,
                maxGuest,
                price
            })
        }
        setRedirect(true);
    } 

    if(redirect){
        return <Navigate to={'/account/places'}/>  
    }

  return (
    <div>
        <AccountNav/>
        <form onSubmit={savePlace}>
            <h2 className="text-xl mt-4">Title</h2>
            <p className="text-gray-500 text-sm">title/heading for your place</p>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e)=>setTite(e.target.value)}
            />
            <p className="text-gray-500 text-sm">address of this place</p>
            <h2 className="text-xl mt-4">Address</h2>
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
            />
            <h2 className="text-xl mt-4">Photos</h2>
            <p className="text-gray-500 text-sm">more photos can make it look better</p>
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            <h2 className="text-xl mt-4">Description</h2>
            <p className="text-gray-500 text-sm">describe your place</p>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)}/>
            <h2 className="text-xl mt-4">Perks</h2>
            <p className="text-gray-500 text-sm">describe your perks</p>
            <Perks selected={perks} onChange={setPerks}  />
            <h2 className="text-xl mt-4">Extra Info</h2>
            <p className="text-gray-500 text-sm">describe your place,rules and regulation</p>
            <textarea value={extraInfo} onChange={(e)=>{setExtraInfo(e.target.value)}}/>
            <h2 className="text-xl mt-4">Check-In and Check-Out Time</h2>
            <p className="text-gray-500 text-sm">add check-in or check-out time for guest</p>
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <h3 className="mt-2 mb-1" >Check-In Time</h3>
                    <input type="text" placeholder="12:00" value={checkInTime} onChange={(e)=>setCheckInTime(e.target.value)}/>
                </div>
                <div>
                    <h3 className="mt-2 mb-1">Check-Out Time</h3>
                    <input type="text" placeholder="6:00" value={checkOutTime} onChange={e=>setCheckOutTime(e.target.value)}/>
                </div>
                <div>
                    <h3 className="mt-2 mb-1">Max-Guest</h3>
                    <input type="number" placeholder="4" value={maxGuest} onChange={e=>setMaxGuest(e.target.value)} />
                </div>
                <div>
                    <h1 className="mt-2 mb-1" >Price Per Night</h1>
                    <input type="number" placeholder="1500" value={price} onChange={(e)=>setPrice(e.target.value)}/>
                </div>
            </div> 
            <div>
                <button className="bg-primary rounded-full w-full h-12 text-white my-4" >Save</button>
            </div>                   
        </form>
    </div>
  )
}

export default PlacesForm