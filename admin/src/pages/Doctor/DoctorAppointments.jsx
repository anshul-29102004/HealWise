import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import cancel_icon from '../../assets/cancel_icon.svg'
import tick_icon from '../../assets/tick_icon.svg'


const DoctorAppointments = () => {

  const {dToken,appointments,getAppointments,completeAppointment,cancelAppointment}=useContext(DoctorContext)
  const {calculateAge,slotDateFormat,currency}=useContext(AppContext)

  useEffect(()=>{
   if(dToken){
    getAppointments()
   }
  },[dToken])


  return (
    <div  className='w-full max-w-6xl m-6'>
    <p className='mb-3 text-lg font-medium'>All Appointments</p>
    <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
      <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
        <p>#</p>
        <p>Patient</p>
        <p>Payment</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Fees</p>
        <p>Action</p>
      </div>
      {
        appointments.reverse() && Array.isArray(appointments) && appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden '>{isNaN(index + 1) ? '' : index + 1}</p>
            <div className='flex items-center'>
              <img className='w-8 rounded-full ' src={item?.userData?.image || ''} alt="" />
              <p>{item?.userData?.name || ''}</p>
            </div>
            <div>
              <p className='text-xs inline border border-[#5f6FFF] px-2 rounded-full'>
                {item?.payment ? 'ONLINE' : 'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden '>{item?.userData?.dob ? (isNaN(calculateAge(item.userData.dob)) ? '' : calculateAge(item.userData.dob)) : ''}</p>
            <p>{item?.slotDate ? slotDateFormat(item.slotDate) : ''}{item?.slotTime ? ',' + item.slotTime : ''}</p>
            <p>{currency}{isNaN(item?.amount) ? 0 : item.amount}</p>
            {
              item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted 
              ? <p className='text-green-500 text-xs font-medium'>Completed</p>
              : <div className='flex '>
              <img onClick={() => cancelAppointment(item?._id)} className='w-10 cursor-pointer' src={cancel_icon} alt="" />
              <img onClick={() => completeAppointment(item?._id)} className='w-10 cursor-pointer' src={tick_icon} alt="" />
            </div>
            }
            
          </div>
        ))
      }
    </div>
    </div>
  )
}

export default DoctorAppointments