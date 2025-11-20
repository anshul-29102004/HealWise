import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/HealWise.png'
import '../index.css'
import { useState } from 'react'
import drop from '../assets/drop.svg'
import menu_icon from "../assets/menu_icon.svg"
import cross_icon from "../assets/cross_icon.png"
import { AppContext } from '../context/AppContext'
const Navbar = () => {
 
   const navigate = useNavigate();
   const [showMenu,setShowMenu]=useState(false);
   const ADMIN_PANEL_URL=import.meta.env.VITE_ADMIN_URL || '/admin';
  const { token, setToken,userData } = useContext(AppContext);
  
  const goToAdmin=()=>{
    window.open(ADMIN_PANEL_URL,'_blank');
  };
  
  const logout=()=>{
    setToken(false)
    localStorage.removeItem('token')
   }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
  <img onClick={()=>{navigate('/');scrollTo(0,0);}} className="w-28 sm:w-36 md:w-44 max-w-full h-auto object-contain cursor-pointer" src={logo} alt="logo" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to="/"><li className='py-1'>HOME</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' /></NavLink>
        <NavLink to="/doctors"><li className='py-1'>ALL DOCTORS</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/about"><li className='py-1'>ABOUT</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/contact"><li className='py-1'>CONTACT</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/symptom-checker"><li className='py-1'>SYMPTOM CHECKER</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/vacancies"><li className='py-1'>VACANCIES</li><hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/></NavLink>
        <li
          onClick={goToAdmin}
          className="cursor-pointer select-none rounded-full bg-linear-to-r from-[#5f6FFF] via-indigo-500 to-blue-500 px-4 py-2 text-white shadow-md shadow-blue-500/30 ring-1 ring-white/10 hover:shadow-lg hover:shadow-blue-500/40 hover:brightness-110 transition-all duration-200"
        >
          ADMIN PANEL
        </li>
      </ul>
      <div className='flex items-center gap-4'>
        {
            token && userData
            ? <div className='flex items-center gap-2 cursor-pointer  group relative'>
            <img className='w-8 rounded-full' src={userData.image} alt=""/>
            <img className='w-2.5' src={drop} alt=""/>

            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 opacity-0 scale-95 transition-all duration-150 ease-out pointer-events-none
    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
>
  <div className="py-1 text-sm">
    <p
      onClick={() => navigate('/my-profile')}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
    >
      My Profile
    </p>
    <p
      onClick={() => navigate('/my-appointments')}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
    >
      My Appointments
    </p>
    <p
      onClick={() => navigate('/my-applications')}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
    >
      My Applications
    </p>
    <p
      onClick={logout}
      className="block px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
    >
      Logout
    </p>
  </div>
</div>
            </div>
        
        :<button onClick={()=>navigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
        }
  <img onClick={()=>setShowMenu(true)} className="w-6 md:hidden" src={menu_icon} alt=""/>

        {/*----Mobile Menu----*/}
        <div className={`${showMenu ? 'fixed-w-full' :'h-0 w-0'}md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className="w-36 "src={logo} alt=""/>
            <img className='w-7' onClick={()=>setShowMenu(false)}src={cross_icon} alt=""/>
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink  onClick={()=>setShowMenu(false)} to='/'><p  className='px-4 py-2 rounded  inline-block'>Home</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded  inline-block'>All Doctors</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded  inline-block'>About</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded  inline-block'>Contact</p></NavLink>
            <NavLink onClick={()=>setShowMenu(false)} to='/symptom-checker'><p className='px-4 py-2 rounded inline-block'>Symptom Checker</p></NavLink>
            <NavLink onClick={()=>setShowMenu(false)} to='/vacancies'><p className='px-4 py-2 rounded inline-block'>Vacancies</p></NavLink>
            <p
              onClick={()=>{setShowMenu(false); goToAdmin();}}
              className="w-full text-center cursor-pointer select-none rounded-xl bg-linear-to-br from-[#5f6FFF] to-blue-600 px-5 py-2.5 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/10 active:scale-95 transition-all duration-150"
            >
              Admin Panel
            </p>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
