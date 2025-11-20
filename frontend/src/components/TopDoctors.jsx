import React,{useContext} from 'react'

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

const navigate=useNavigate();
const {doctors} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
    <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
    <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

    <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 pt-5 px-3 sm:px-0'>
    {doctors.slice(0,10).map((item,index)=>(
     <div
       onClick={()=>{navigate(`/appointment/${item._id}`); window.scrollTo({top:0, behavior:'smooth'})}}
       className='group flex flex-col border border-blue-200 rounded-xl overflow-hidden cursor-pointer bg-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md'
       key={index}
     >
      <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt={item.name}/>
      <div className='p-4 flex-1'>
        <div className={`mt-1 flex items-center gap-2 text-sm ${item.available ?'text-green-600' :'text-gray-500'} `}>
            <span className={`inline-block w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'} `}></span>
            <span>{item.available ?'Available' :'Not Available'}</span>
        </div>
        <p className='text-gray-900 text-base md:text-lg font-medium mt-2'>{item.name}</p>
        <p className='text-gray-600 text-sm'>{item.speciality}</p>
      </div>
     </div>
    ))}
    </div>
    <button onClick={()=>{navigate('/doctors'); window.scrollTo({top:0, behavior:'smooth'})}} className='bg-blue-50 text-gray-700 hover:text-gray-900 px-10 py-2.5 rounded-full mt-10 shadow-sm hover:shadow transition'>more</button>
    </div>
  )
}

export default TopDoctors