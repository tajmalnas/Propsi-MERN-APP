import { Link} from "react-router-dom"
import AccountNav from "../AccountNav";
import axios from "axios";
import { useEffect, useState } from "react";

const PlacesPage = () => {

    const [places, setPlaces] = useState([])
    useEffect(()=>{
        axios.get('/user-places').then(({data})=>{
            setPlaces(data)
            console.log(data);
        })
    },[])


  return (
    <div>
        <AccountNav/>
        <div className="text-center">
            <Link to={'/account/places/new'} className='inline-flex bg-primary text-white px-4 py-2 gap-2 rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Add new place
            </Link>
        </div>
        <div className="mt-4">
            {
                places.length>0 && places.map((place,i)=>(
                    <Link to={'/account/places/'+place._id} key={i} className='flex gap-4 cursor-pointer bg-gray-100 p-4 rounded-2xl mt-4'>
                        <div className="flex w-32 h-32 bg-gray-300 grow-0 shrink-0">
                            {place.photos.length>0 && (
                                <img className="object-cover" src={'https://propsi-mern-backend.onrender.com/uploads/'+place.photos[0]} alt="" />
                            )} 
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl" >{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default PlacesPage