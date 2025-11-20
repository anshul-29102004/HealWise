import React, { useContext } from 'react'
import { useState } from 'react'
import upload_icon from '../assets/upload_icon.png'
import profile_pic from '../assets/profile_pic.png'
import axios from 'axios'

import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
const MyProfile = () => {
  
const {userData,setUserData,token,backendUrl,loadUserProfileData}=useContext(AppContext)

  const[isEdit,setIsEdit]=useState(false)
  const[image,setImage]=useState(false)

  const updateUserProfileData=async () => {
    try {
      const formData=new FormData()
  formData.append('name',userData.name)
  formData.append('phone',userData.phone)
  formData.append('address',JSON.stringify(userData.address))
  formData.append('gender',userData.gender)
  formData.append('dob',userData.dob)
  formData.append('pincode', userData.pincode || '')
  formData.append('city', userData.city || '')
  formData.append('state', userData.state || '')

  image && formData.append('image',image)

      const{data}=await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})
      if(data.success)
      {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      }
      else
      {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='flex flex-col max-w-xl w-full mx-auto gap-4 text-base bg-white rounded-xl shadow-lg p-6 sm:p-10 border border-zinc-200'>
      {
        isEdit
        ? <label htmlFor='image'>
            <div className='inline-block relative cursor-pointer'>
              <img className='w-32 h-32 rounded-full object-cover border-4 border-[#5f6FFF] shadow-md opacity-80' src={image ? URL.createObjectURL(image) : (userData.image || profile_pic)} alt="" />
              <img className='w-10 absolute bottom-2 right-2' src={upload_icon} alt="" />
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id="image" hidden/>
          </label>
        : <img className='w-32 h-32 rounded-full object-cover border-4 border-[#5f6FFF] shadow-md mx-auto' src={userData.image || profile_pic} alt=""/>
      }
     

  {
   isEdit
   ? <input  className='bg-gray-50 text-2xl font-semibold max-w-xs mt-4 px-3 py-2 rounded border border-zinc-300 focus:outline-[#5f6FFF]' type="text" value={userData.name} onChange={e=>setUserData(prev=>({...prev,name:e.target.value}))}/>
   :<p className='font-semibold text-2xl text-neutral-800 mt-4 text-center'>{userData.name}</p>
  }
  <hr className='bg-zinc-200 h-[2px] border-none my-2'/>
  <div>
   <p className='text-[#5f6FFF] font-semibold text-lg mb-2'>Contact Information</p>
   <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-2 text-neutral-700'>
        <div className='font-medium'>EMAIL id:</div>
        <div className='text-blue-500 break-all'>{userData.email}</div>
        <div className='font-medium'>Phone:</div>
        {
          isEdit
          ? <input className="bg-gray-100 rounded px-2 py-1 w-full max-w-xs" type="text" value={userData.phone} onChange={e=>setUserData(prev=>({...prev,phone:e.target.value}))}/>
          :<div className='text-blue-400'>{userData.phone}</div>
        }
        <div className='font-medium'>Address:</div>
        {
          isEdit
          ? <div className='flex flex-col gap-1'>
              <input className="bg-gray-50 rounded px-2 py-1 w-full max-w-xs" onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={userData.address.line1} type="text" placeholder="Address Line 1" />
              <input className='bg-gray-50 rounded px-2 py-1 w-full max-w-xs' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} value={userData.address.line2} type="text" placeholder="Address Line 2" />
            </div>
          : <div className='text-gray-500'>
              {userData.address.line1}<br/>{userData.address.line2}
            </div>
        }
        <div className='font-medium'>Pincode:</div>
        {
          isEdit
          ? <input
              className="bg-gray-50 rounded px-2 py-1 w-full max-w-xs"
              type="text"
              value={userData.pincode || ''}
              onChange={async (e) => {
                const val = e.target.value;
                setUserData(prev => ({ ...prev, pincode: val }));
                if (val.length === 6 && /^[0-9]{6}$/.test(val)) {
                  try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                    const data = await res.json();
                    if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                      setUserData(prev => ({ ...prev, city: data[0].PostOffice[0].District, state: data[0].PostOffice[0].State }));
                    } else {
                      setUserData(prev => ({ ...prev, city: '', state: '' }));
                    }
                  } catch {
                    setUserData(prev => ({ ...prev, city: '', state: '' }));
                  }
                } else {
                  setUserData(prev => ({ ...prev, city: '', state: '' }));
                }
              }}
            />
          : <div className='text-gray-500'>{userData.pincode}</div>
        }
        <div className='font-medium'>City:</div>
        <div className='text-gray-500'>{userData.city || ''}</div>
        <div className='font-medium'>State:</div>
        <div className='text-gray-500'>{userData.state || ''}</div>
      </div>
     </div>
  <div className='mt-6'>
   <p className='text-[#5f6FFF] font-semibold text-lg mb-2'>Basic Information</p>
   <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-2 text-neutral-700'>
        <p className='font-medium'>Gender:</p>
        {
          isEdit
          ? <select className='max-w-20 bg-gray-100' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}> 
            <option value="Male">MALE</option>
            <option value="Female">FEMALE</option>
          </select>
          :<p className='text-gray-400'>{userData.gender}</p>
        }
        <p className='font-medium'>Birthday:</p>
        {
          isEdit
          ? <input className="max-w-28 bg-gray-100"onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob} type="date" />
          : <p className='text-gray-400'>{userData.dob}</p>
        }
      </div>
     </div>
     <div className='mt-8 flex justify-center'>
      {
        isEdit
        ? <button className='border border-[#5f6FFF] px-8 py-2 rounded-full font-semibold hover:bg-[#5f6FFF] hover:text-white transition-all shadow' onClick={updateUserProfileData}>Save information</button>
        :<button className='border border-[#5f6FFF] px-8 py-2 rounded-full font-semibold hover:bg-[#5f6FFF] hover:text-white transition-all shadow' onClick={()=>setIsEdit(true)}>Edit</button>
      }
     </div>
    </div>
  )
}

export default MyProfile