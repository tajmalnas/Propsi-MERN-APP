/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        if (!user) {
            let isMounted = true; // Flag to check if the component is still mounted
            const token = localStorage.getItem('token');
            axios.get('/profile',{
                headers: {
                Authorization: `${token}`,
            }
            }
            )
                .then(({ data }) => {
                    if (isMounted) {
                        // Check if the component is still mounted before updating state
                        if (Object.keys(data).length === 0) {
                            setUser(null);
                        } else {
                            setUser(data);
                        }
                        setReady(true);
                    }
                })
                .catch(error => {
                    // Handle the error, e.g., show an error message or redirect to an error page
                    console.error('Error fetching user data:', error);
                });
            
            // Cleanup function to set isMounted to false when the component is unmounted
            return () => {
                isMounted = false;
            };
        }
    }, []); // Empty dependency array to run the effect only once, similar to componentDidMount

    

    return (
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )
}