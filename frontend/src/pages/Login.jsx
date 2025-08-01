import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const {backendURL,setLoggedin,getUserData }=useContext(AppContent)

  const [state,setState]=useState('Sign up')
  const [name,SetName]=useState('');
  const [email,SetEmail]=useState('');
  const [password,SetPassword]=useState('');
  const onsubmitHandler = async(e)=>{
    try {
      e.preventDefault();

      axios.defaults.withCredentials=true
      if(state==='Sign up'){
      const {data}=  await axios.post(`${backendURL}/api/auth/register`, { name, email, password }, {
        withCredentials: true
      });
      
      if(data.success){
        setLoggedin(true)
        getUserData()

        navigate('/')
      }else{
        toast.error(data.message)
      }

      }else{
        const {data}= await axios.post(`${backendURL}/api/auth/login`, { email, password }, {
          withCredentials: true
        });

        if(data.success){
          setLoggedin(true)
          getUserData()
          navigate('/')
        }else{
          console.error('Login failed:', data); // Log the entire data response to inspect the error
          toast.error(data.message || 'Login failed. Please try again.');
        }

      }
      
    } catch (error) {
      console.error("Login/Register Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      
    }

  }


  return (
 

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'><img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>{navigate('/')}}/>
    <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm '>
      <h2 className='text-3xl font-semibold text-white text-center mb-3 '>{state==='Sign up' ? 'Create account ':'Login '}</h2>
      <p className='text-center text-sm mb-6'>{state==='Sign up' ? 'Create your account ':'Login into your account '}</p>

      <form onSubmit={onsubmitHandler}>
      {state==='Sign up' && (  <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.person_icon} alt="" />
          <input type="text" placeholder='Full name' required className='bg-transparent outline-none' onChange={e=>SetName(e.target.value)} value={name}/>
        
        </div>)}

      
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt="" />
          <input type="email" placeholder='Email' required className='bg-transparent outline-none' onChange={e=>SetEmail(e.target.value)} value={email}/>
        </div>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.lock_icon} alt="" />
          <input type="password" placeholder='Password' required className='bg-transparent outline-none' onChange={e=>SetPassword(e.target.value)} value={password}/>
        </div>
        <p className='mb-4 text-indigo-500 cursor-pointer' onClick={()=>navigate('/reset-password')}> Forgot password?</p>
        <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white font-medium hover:from-indigo-900 hover:to-indigo-500'>
  {state}
</button>

      </form>
      {state==="Sign up" ? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{''} <span className='text-blue-400 cursor-pointer underline' onClick={()=>setState('Login')}>Login here</span></p>):(<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{''} <span className='text-blue-400 cursor-pointer underline' onClick={()=>setState('Sign up')}>Sign up</span></p>)}

     
     
    </div>
  
    
    </div>
  )
}

export default Login