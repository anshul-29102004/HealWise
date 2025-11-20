import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'
import group_profiles from '../assets/group_frontend.png'
import arrow_icon from '../assets/arrow_icon.svg'
import header_img from '../assets/mainpage_frontend.png'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row bg-[#5f6FFF] rounded-lg px-6 md:px-10 lg:px-20 min-h-[550px] overflow-hidden'>

      {/* LEFT SIDE */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 md:py-20'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
          Book Appointment <br/> With Trusted Doctors
        </p>

        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
          <img className='w-28' src={group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className='hidden sm:block'/>schedule your appointment hassle-free.
          </p>
        </div>

        <Link to="/doctors" onClick={()=>window.scrollTo(0,0)}
           className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'>
          Book Appointment
          <img className='w-3' src={arrow_icon} alt=""/>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className='md:w-1/2 flex justify-center items-end relative'>
        <img
          className='w-full max-w-[450px] object-contain md:object-contain'
          src={header_img}
          alt=""
        />
      </div>

    </div>
  )
}

export default Header
