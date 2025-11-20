import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import patients_icon from "../../assets/doctor_icon.svg";
import earning_icon from "../../assets/earning_icon.svg";
import appointments_icon from "../../assets/appointments_icon.svg";
import list_icon from "../../assets/list_icon.svg";
import tick_icon from "../../assets/tick_icon.svg";
import cancel_icon from "../../assets/cancel_icon.svg";
import { AppContext } from '../../context/AppContext';
import { AdminContext } from '../../context/AdminContext';
const DoctorDashboard = () => {
  
  const {dashData,getDashData,dToken,completeAppointment,cancelAppointment}=useContext(DoctorContext)
  const {currency,slotDateFormat}=useContext(AppContext)


  useEffect(()=>{
   if(dToken)
   {
    getDashData()
   }
  },[dToken,getDashData])


  return dashData &&  (
    <div className='m-5'>
   <div className="flex flex-wrap gap-3">
             <div className="flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
               <img className="w-14 " src={earning_icon} alt="" />
               <div>
                 <p className="text-xl font-semibold text-gray-600">
                  {currency}{dashData.earning}
                 </p>
                 <p className="text-gray-400">Earning</p>
               </div>
             </div>
   
             <div className="flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
               <img className="w-14 " src={appointments_icon} alt="" />
               <div>
                 <p className="text-xl font-semibold text-gray-600">
                   {dashData.appointments}
                 </p>
                 <p className="text-gray-400">Appointments</p>
               </div>
             </div>
   
             <div className="flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
               <img className="w-14 " src={patients_icon} alt="" />
               <div>
                 <p className="text-xl font-semibold text-gray-600">
                   {dashData.patients}
                 </p>
                 <p className="text-gray-400">Patients</p>
               </div>
             </div>
           </div>
    <div className="bg-white">
              <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                <img src={list_icon} alt="" />
                <p className="font-semibold">Latest Appointment</p>
              </div>
    
              <div className="pt-4 border border-t-0">
                {dashData.latestAppointments.map((item, index) => (
                  <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
                    <img className="rounded-full w-10 " src={item.userData.image} alt="" />
                    <div className="flex-1 text-sm">
                      <p className="text-gray-800 font-medium">{item.userData.name}</p>
                      <p className="text-gray-600">Booking on {slotDateFormat(item.slotDate)}</p>
                    </div>
                    {
                      (() => {
                        const apptDT = item.appointmentDateTime ? new Date(item.appointmentDateTime) : new Date(`${item.slotDate}T${item.slotTime}:00`);
                        const now = new Date();
                        const refunded = item.cancelled && item.payment && apptDT > now;
                        if (refunded) {
                          return <p className='text-orange-500 text-xs font-medium'>Refunded</p>;
                        }
                        if (item.cancelled) {
                          return <p className='text-red-400 text-xs font-medium'>Cancelled</p>;
                        }
                        if (item.isCompleted) {
                          return <p className='text-green-500 text-xs font-medium'>Completed</p>;
                        }
                        return (
                          <div className='flex '>
                            <img onClick={() => cancelAppointment(item?._id)} className='w-10 cursor-pointer' src={cancel_icon} alt="" />
                            <img onClick={() => completeAppointment(item?._id)} className='w-10 cursor-pointer' src={tick_icon} alt="" />
                          </div>
                        );
                      })()
                    }
                  </div>
                ))}
              </div>
            </div>
      
    </div>
  )
}

export default DoctorDashboard