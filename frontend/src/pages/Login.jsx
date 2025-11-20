import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  
  const{backendUrl,token,setToken}=useContext(AppContext)

  const navigate=useNavigate()
  const[state,setState]=useState('Sign Up')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[name,setName]=useState('')
  const[mobile,setMobile]=useState('')
  const[image,setImage]=useState(null)
  const[address1,setAddress1]=useState('')
  const[address2,setAddress2]=useState('')
  const[gender,setGender]=useState('male')
  const[birthday,setBirthday]=useState('')
  const[pincode,setPincode]=useState('')
  const[city,setCity]=useState('')
  const[stateName,setStateName]=useState('')
  
  const onSubmitHandler=async(event)=>{
    event.preventDefault()

    try {
      if(state==='Sign Up')
      {
        if (!mobile.trim()) {
          toast.error('Mobile number is required');
          return;
        }
        if (!address1.trim()) {
          toast.error('Address Line 1 is required');
          return;
        }
        if (!birthday) {
          toast.error('Birthday is required');
          return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', mobile);
  formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
  formData.append('pincode', pincode);
  formData.append('city', city);
  formData.append('state', stateName);
        formData.append('gender', gender);
        formData.append('dob', birthday);
        if (image) formData.append('image', image);
        console.log('Sending registration request:', {name, email, password, phone: mobile, address1, address2, gender, birthday, image});
        console.log('Backend URL:', backendUrl);
        const {data}=await axios.post(backendUrl+'/api/user/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if(data.success)
        {
          localStorage.setItem('token',data.token)
          setToken(data.token)
          navigate('/')
        }
        else
        {
          toast.error(data.message)
        }
      }
      else
      {
        //LOGIN API
        const {data}=await axios.post(backendUrl+'/api/user/login',{password,email})
        if(data.success)
        {
          localStorage.setItem('token',data.token)
          setToken(data.token)
          navigate('/')
        }
        else
        {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>
  {
    if(token)
    {
      navigate('/')
    }
  },[token, navigate])

  
  return (
  <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center bg-gray-50'>
  <div className='flex flex-col gap-3 items-center m-auto p-3 w-full max-w-xs sm:max-w-md border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
  <p className='text-2xl font-semibold text-center'>{state==='Sign Up' ? "Create Account" : "Login"}</p>
  <p className='text-center mb-2'>Please {state==='Sign Up' ? "sign up" : "log in"} to book appointment</p>
      {
        state==='Sign Up' ? (
          <div className='grid grid-cols-1 gap-3 w-full'>
            {/* Small Image Upload Option at Top */}
            <div className='flex flex-col items-center mb-1'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-1 border border-zinc-300'>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt='Profile' className='w-full h-full object-cover rounded-full' />
                ) : (
                  <span className='text-gray-400 text-xs'>No Image</span>
                )}
              </div>
              <input className='hidden' id='profile-image-upload' type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              <label htmlFor='profile-image-upload' className='bg-[#5f6FFF] text-white px-2 py-1 rounded cursor-pointer text-xs mt-1'>Choose Image</label>
            </div>
            <div className='w-full flex flex-col'>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="text" onChange={(e)=>setName(e.target.value)} value={name} required/>
            </div>
            <div className='w-full flex flex-col'>
              <p>Email</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
            </div>
            <div className='w-full flex flex-col'>
              <p>Password</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required/>
            </div>
            <div className='w-full flex flex-col'>
              <p>Mobile Number</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="tel" pattern="[0-9]{10}" maxLength={10} minLength={10} onChange={(e)=>setMobile(e.target.value)} value={mobile} required />
            </div>
            <div className='w-full flex flex-col'>
              <p>Address Line 1</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="text" onChange={e => setAddress1(e.target.value)} value={address1} required />
            </div>
            <div className='w-full flex flex-col'>
              <p>Address Line 2</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="text" onChange={e => setAddress2(e.target.value)} value={address2} required />
            </div>
            <div className='w-full flex flex-col'>
              <p>Gender</p>
              <div className='flex gap-4 mt-1'>
                <label className='flex items-center gap-2'>
                  <input type="radio" name="gender" value="male" checked={gender==='male'} onChange={e => setGender(e.target.value)} /> Male
                </label>
                <label className='flex items-center gap-2'>
                  <input type="radio" name="gender" value="female" checked={gender==='female'} onChange={e => setGender(e.target.value)} /> Female
                </label>
              </div>
            </div>
            <div className='w-full flex flex-col'>
              <p>Birthday</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type="date" onChange={e => setBirthday(e.target.value)} value={birthday} required />
            </div>
            <div className='w-full flex flex-col'>
              <p>Pincode</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5f6FFF]' type='text' maxLength={6} minLength={6} pattern='[0-9]{6}' value={pincode} onChange={async (e) => {
                const val = e.target.value;
                setPincode(val);
                if (val.length === 6 && /^[0-9]{6}$/.test(val)) {
                  // Fetch city/state from pincode API
                  try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                    const data = await res.json();
                    if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                      setCity(data[0].PostOffice[0].District);
                      setStateName(data[0].PostOffice[0].State);
                    } else {
                      setCity('');
                      setStateName('');
                    }
                  } catch {
                    setCity('');
                    setStateName('');
                  }
                } else {
                  setCity('');
                  setStateName('');
                }
              }} required />
            </div>
            <div className='w-full flex flex-col'>
              <p>City</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 bg-gray-100 focus:outline-none' type='text' value={city} readOnly />
            </div>
            <div className='w-full flex flex-col'>
              <p>State</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1 bg-gray-100 focus:outline-none' type='text' value={stateName} readOnly />
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-4 w-full'>
            <div className='w-full'>
              <p>Email</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required/>
            </div>
          </div>
        )
      }
      
    

  <button type="submit" className='bg-[#5f6FFF] text-white rounded-md w-full py-2 text-base mt-2'>{state==='Sign Up' ? "Create Account" : "Login"}</button>
    {
      state==='Sign Up' ? <p>Already have an account?<span onClick={()=>setState('Login')} className='text-[#5f6FFF] underline cursor-pointer'>Login here</span></p>
      : <p>Create an new account?<span onClick={()=>setState('Sign Up')} className='text-[#5f6FFF] underline cursor-pointer'>Click here</span></p>
    }
    </div>
    
    </form>
  )
}

export default Login