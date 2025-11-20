import React from 'react'
import logo from '../assets/HealWise.png'
const Footer = () => {
  return (
    <div className='md:mx-10'>

     <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
    <div>
  <img className="mb-5 w-28 sm:w-32 md:w-40 max-w-full h-auto object-contain" src={logo} alt="logo" />
       <p className='w-full md:w-2/3 text-gray-600 leading-6'>HealWise helps patients make smarter healthcare decisions by recommending the right doctors based on their diseases and symptoms. </p> 
    </div>   

    <div>
        <p className='text-xl font-medium mb-5'>Company</p>
     <ul className='flex flex-col gap-2 text-gray-600'>
        <li>Home</li>
        <li>About us</li>
        <li>Delivery</li>
        <li>Privacy policy</li>
     </ul>
      </div>

      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+918707267182</li>
            <li>anshulakgec@gmail.com</li>
        </ul>
      </div>
     </div>

      <div>
    <hr/>
    <p className='py-5 text-sm text-center'>Copyright 2025 @ HealWise - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer