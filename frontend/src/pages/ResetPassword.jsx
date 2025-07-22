import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const ResetPassword = () => {
   const navigate = useNavigate();
   const {backendURL} = useContext(AppContent);
   axios.defaults.withCredentials=true

   const [email,setEmail]= useState('')
   const [newPassword,setNewpassword]= useState('')
   const [isEmailsent,setisEmailsent]= useState(false)
   const [otp,setOTP]= useState(0);
   const [isOTPSubmited,setIsOTPSubmited]=useState(false);



     const inputRefs = React.useRef([]);
     const handleInput=(e,index)=>{
       if(e.target.value.length>0 && index<inputRefs.current.length- 1){
         inputRefs.current[index+1].focus();
   
       }
   
     }
     const handlekeyDown=(e,index)=>{
       if(e.key==='Backspace' && e.target.value==='' && index>0){
         inputRefs.current[index-1].focus();
   
       }
   
     }
     const handlePaste = (e)=>{
       const paste =e.clipboardData.getData('text');
       const pasteArray = paste.split('');
       pasteArray.forEach((char,index)=>{
         if(inputRefs.current[index]){
           inputRefs.current[index].value=char
   
         }
   
       })
     }
     const onsubmitEmail = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(backendURL + '/api/auth/send-reset-OTP', { email });
        console.log("API Response:", data);
        setisEmailsent(true); // Only set isEmailsent to true if success is true
        
        if (data.success) {
          toast.success(data.message);
         
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("API Error:", error); // More detailed error log
        toast.error(error.message);
      }
    };
    const onsubmitOTP = async(e)=>{
      e.preventDefault();
      const OTParray = inputRefs.current.map(e=>e.value)
      setOTP(OTParray.join(''))
      setIsOTPSubmited(true)
   
    }
    const onSubmitNewpassword=async(e)=>{
      e.preventDefault();
      try {
        const {data }= await axios.post(backendURL+'/api/auth/reset-password',{email,otp,newPassword});
        data.success ? toast.success(data.message):toast.error(data.message);
        navigate('/login')


        
      } catch (error) {
        toast.error(data.message)
        
      }

    }
    
  return (
    // enter email id
   
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>{navigate('/')}}/>
      {!isEmailsent && 
      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onsubmitEmail} >
      <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset password</h1>
      <p className='text-center mb-6 text-indigo-600'>Enter the 6-digit code sent to your email id.</p>
      <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
        <input type="email" placeholder='Email' className='bg-transparent outline-none text-white' value={email} onChange={e=>setEmail(e.target.value)} required/>


      </div>
      <button className='w-full py-5 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-3'>Submit</button>
      </form>
}

      {/* //otp form */}
      {isEmailsent && !isOTPSubmited && (
  <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onsubmitOTP}>
    <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset password OTP</h1>
    <p className='text-center mb-6 text-indigo-600'>Enter the 6-digit code sent to your email id.</p>
    <div className='flex justify-between mb-8 ' onPaste={handlePaste}>
      {Array(6).fill(0).map((_, index) => (
        <input
          type="text"
          maxLength="1"
          key={index}
          required
          className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
          ref={e => inputRefs.current[index] = e}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handlekeyDown(e, index)}
        />
      ))}
    </div>
    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full '>Submit</button>
  </form>
)}

{/* enter new password */}
{isOTPSubmited && isEmailsent &&
<form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitNewpassword} >
      <h1 className='text-white text-2xl font-semibold text-center mb-4 '>New Password</h1>
      <p className='text-center mb-6 text-indigo-600'>Enter new password below.</p>
      <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.lock_icon} alt="" className='w-3 h-3'/>
        <input type="password" placeholder='Password' className='bg-transparent outline-none text-white' value={newPassword} onChange={e=>setNewpassword(e.target.value)} required/>


      </div>
      <button className='w-full py-5 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full mt-3'>Submit</button>
      </form>
}
      


      



    </div>
    
   
  )
}

export default ResetPassword