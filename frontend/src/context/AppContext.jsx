import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContent =createContext();
export const AppContextProvider=(props)=>{
    axios.defaults.withCredentials=true;
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setLoggedin]=useState(false);
    const [userData,setUserData ]= useState(false);
 

    const getUserData = async () => {
        try {
            // Make the GET request to fetch user data
            console.log('Fetching user data...');
            const { data } = await axios.get(`${backendURL}/api/user/data`, {
                withCredentials: true
              });
              
            console.log('Received data:', data);
    
            // Check if the request was successful
            if (data.success) {
                setUserData(data.userData);  // Set user data if successful
                console.log('User data set:', data.userData);
            } else {
                console.error('Backend returned an error:', data.message || 'Unknown error');
            }
        } catch (error) {
            // Handle any errors that occurred during the request
            console.error('Error fetching user data:', error);  // Log the error to the console
            toast.error(error?.response?.data?.message || 'Something went wrong while fetching user data');  // Show error toast
        }
    };
    
      
    const value = {
        backendURL,isLoggedin,setLoggedin,userData,setUserData,getUserData
       

    }
    return (
        <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
    )
}