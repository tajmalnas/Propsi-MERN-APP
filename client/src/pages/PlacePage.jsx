import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";

const PlacePage = () => {
    const {id} = useParams();
    const [place,setPlace] = useState({});
    const [showAllPhotos,setShowAllPhotos] = useState(false);
    useEffect(()=>{
        if(!id) return;
        if(id){
            axios.get('/places/'+id).then(({data})=>{
                setPlace(data);
            })
        }
    },[id])

    if(!place){
        return <div>Loading...</div>
    }

    if(showAllPhotos){
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen ">
                <div className="p-8 bg-black grid gap-4">
                <div>
                    <h2 className="text-3xl" >Photos of {place.title}</h2>
                    <button onClick={()=>setShowAllPhotos(false)} className="fixed right-12 top-8 flex items-center justify-center gap-2 rounded-2xl px-4 py-2 bg-gray-100 text-black shadow-md shadow-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h2 className="text-lg">
                            Close
                        </h2>
                    </button>
                </div>
                    <div className="flex flex-col justify-center items-center">
                    {place?.photos?.length>0 && place.photos.map((photo,i)=>(
                        <div key={i}>
                        <img  className="aspect-square object-cover mb-4" src={"http://localhost:4000/uploads/"+photo} alt=""/>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
    <div className="mt-4 rounded-xl bg-gray-100 -mx-4 pt-8 px-8">
        <h1 className="text-2xl" >{place.title}</h1>
        <a target="_blank" href={'https://maps.google.com/?q='+place.address} className="block font-semibold underline" rel="noreferrer">{place.address}</a>
        <div className="relative">
            <div className="grid gap-2 relative grid-cols-[2fr_1fr] rounded-3xl overflow-hidden lg:grid-cols-[1fr_2fr]">
                <div >
                    {place.photos && place.photos.length>0 && (
                        <div>
                            <img onClick={()=>setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={"http://localhost:4000/uploads/"+place.photos[0]} alt=""/>
                        </div>
                    )}
                </div>
                <div className="grid lg:grid-cols-2 lg:gap-4">
                    <div className="overflow-hidden">
                    {place.photos && place.photos.length>1 && (
                        <img onClick={()=>setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={"http://localhost:4000/uploads/"+place.photos[1]} alt=""/>
                    )}
                    </div>
                    <div className="overflow-hidden">
                        {place.photos && place.photos.length>2 && (
                            <img onClick={()=>setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover relative top-2" src={"http://localhost:4000/uploads/"+place.photos[2]} alt=""/>
                        )} 
                    </div>
                </div>
                <button onClick={()=>setShowAllPhotos(true)} className=" flex absolute bottom-2 right-2 px-2 py-2 bg-white rounded-2xl shadow-lg shadow-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Show More
                </button>
            </div>
            <div className="mt-8 mb-4 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4 ">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    <b>check-in </b>: {place.checkIn}<br/>
                    <b>check-out</b> : {place.checkOut}<br/>
                    <b>max guests</b> : {place.maxGuests}<br/>
                    <div className="py-2">
                        <h2 className="font-semibold text-2xl">Amenities</h2>
                        <div className="grid grid-cols-1 gap-2 py-2">
                            {place.perks && place.perks.length>0 && place.perks.map((amenity,i)=>(
                                <div key={i} className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" color="#059669" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                
                    </div>
                </div>
                <div>
                    <BookingWidget place={place}/>
                </div>
                <div className=" bg-white -mx-8 px-8 py-8 border-t md:rounded-xl md:border ">
                    <div>
                        <h2 className="font-semibold text-2xl">Exta Info</h2>
                    </div>
                    <div className="mb-4 mt-2 text-sm text-gray-700 leading-4">
                        {place.extraInfo}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlacePage