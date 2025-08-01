import React, { useContext } from 'react'
import {assets }from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const navigate = useNavigate();
    const {userData,backendURL,setUserData,setLoggedin}=useContext(AppContent)

    const sendVerificationOtp = async()=>{
      try {
        axios.defaults.withCredentials=true;
        const {data}= await axios.post(backendURL+'/api/auth/verify-OTP');

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const logout = async()=>{
      try {
        axios.defaults.withCredentials=true;
        const {data}= await axios.post(backendURL +'/api/auth/logout');

        data.success && setLoggedin(false);
        data.success && setUserData(false);
        navigate('/');
        
      } catch (error) {
        toast.error(error.message)
        
      }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'><img src={assets.logo} alt="" className='w-28 sm:w-32' onClick={()=>navigate('/')}/>
    {userData?<div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>{userData.name[0].toUpperCase()} <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 '><ul className='list-none m-0 p-2 bg-gray-100 text-sm'> {!userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={sendVerificationOtp}>Verify email</li> }<li className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10' onClick={logout}>Logout</li></ul> </div></div>: <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all' onClick={()=>navigate('/login')}>Login <img src={assets.arrow_icon}/></button>}
    
    </div>
  )
}

export default Navbar