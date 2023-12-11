import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const IndexPage = () => {
  const [places,setPlaces] = useState([])
  useEffect(()=>{
    axios.get('/places').then(({data})=>{
      setPlaces(data)
    })
  },[])
  if(places.length===0){
    return(
      <div>
        <h2>
          The places are loading it may take some seconds for first time
        </h2>
      </div>
    )
  }
  return (
    <div className="mt-8 grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length>0 && places.map((place,i)=>(
        <Link to={'/place/'+place._id} className="" key={i}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos.length>0 && (
              <img className="rounded-2xl object-cover aspect-square " src={'https://propsi-mern-backend.onrender.com/uploads/'+place.photos[0]} alt="" />
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

export default IndexPage
