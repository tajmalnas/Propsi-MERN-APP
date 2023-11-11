/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
// import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

const ProfilePage = () => {

    const {ready,user,setUser} = useContext(UserContext);

    const [redirect,setRedirect] = useState('');

    let {subpage} = useParams();

    const logout = async () => {
      try {
          // await axios.post('/logout');
          localStorage.removeItem('token');
          setUser(null);
          setRedirect('/');
      } catch (error) {
          console.error('Error logging out:', error);
      }
  }
  

    if(subpage === undefined){
        subpage = 'profile'
    }

    // if(!ready){
    //     return <div>Loading...</div>
    // }

    if(!user && ready && !redirect){
        return <Navigate to="/login" />
    }


    if(redirect){
        return <Navigate to={redirect} />
    }

  return (
    <div>
        <AccountNav/>
        {
            subpage === 'profile' && (
                <div className="card mt-32 mx-auto p-8 bg-white shadow-2xl rounded-lg max-w-md">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Logged in as {user.data ? user.data.name : user.name}
        </h2>
        <p className="text-gray-600 mb-4">
          {user.data ? user.data.email : user.email}
        </p>
        <button
          className="w-40 px-4 py-2 bg-primary rounded-full text-white hover:bg-primary-dark transition duration-300 ease-in-out"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
            )
        }
        {
            subpage === 'places' && (
                <PlacesPage/>
            )
        }
    </div>
  )
}

export default ProfilePage