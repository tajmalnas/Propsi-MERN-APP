/* eslint-disable react/prop-types */
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const SearchedPlaces = () => {
    const [places, setPlaces] = useState([]);
    const {address} = useParams();
    console.log(address+'address');

    useEffect(() => {
        axios.get('/places').then(({ data }) => {
            const filteredPlaces = data.filter(place => {
                const [firstPartOfAddress] = place.address.split(',');
                return firstPartOfAddress.trim().toLowerCase() === address.trim().toLowerCase()
            });
            setPlaces(filteredPlaces);
        });
    }, [address]);

  return (
    <div className="mt-8 grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length>0 && places.map((place,i)=>(
        <Link to={'/place/'+place._id} className="" key={i}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos.length>0 && (
              <img className="rounded-2xl object-cover aspect-square " src={'http://localhost:4000/uploads/'+place.photos[0]} alt="" />
            )}
          </div>
          <h3 className="font-bold truncate">{place.address}</h3>
          <h2 className="text-sm  text-gray-500">{place.title}</h2>
          <div className="mt-1">
              <span className="font-bold"> 
                ${place.price} per Night
              </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SearchedPlaces