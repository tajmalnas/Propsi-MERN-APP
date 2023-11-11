/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!user) {
            const token = localStorage.getItem('token');
            getProfile(token);
        }
    }, [user]); // Include user in the dependency array if you want the effect to run on user changes

    const navigate = useNavigate();

    const getProfile=async(token)=>{
        const res = await axios.get('/profile', {
            headers: {
                Authorization: `${token}`,
            }
        })

        if(res!==null){
            setUser(res.data);
            setReady(true);
        }
        else{
            navigate('/');
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
