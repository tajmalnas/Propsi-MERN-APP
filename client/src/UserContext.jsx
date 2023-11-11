/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

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

    const getProfile=async(token)=>{
        await axios.get('/profile', {
            headers: {
                Authorization: `${token}`,
            }
        })
        .then(({ data }) => {
            console.log(data);
            if (!data) {
                setUser(null);
            } 
            else {
                setUser(data);
            }
            setReady(true);
        })
        .catch(error => {
            // Handle the error, e.g., show an error message or redirect to an error page
            console.error('Error fetching user data:', error);
        });
    }

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
