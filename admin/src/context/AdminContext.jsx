import { createContext } from "react";
import { useState } from "react";
export const AdminContext=createContext();
import axios from 'axios'
import {toast} from 'react-toastify'
const AdminContextProvider=(props)=>{
    const[aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const[doctors,setDoctors]=useState([])
    const[appointments,setAppointments]=useState([])
    const[dashData,setDashData]=useState(false)
     


    const backendUrl=import.meta.env.VITE_BACKEND_URL


    const getAllDoctors=async()=>{
    try {
        // send token as header 'atoken' to match backend middleware
        const {data}=await axios.post(backendUrl+'/api/admin/all-doctors',{}, { headers: { atoken: aToken } })
        if(data.success)
        {
            setDoctors(data.doctors)
            console.log(data.doctors)
        }
        else
        { 
            toast.error(data.message)

        }
    } 
    catch (error) {
        // better error display
        console.error('getAllDoctors error:', error)
        toast.error(error.response?.data?.message || error.message)
    }
    }

    const changeAvailablity=async (docId) => {
        try {
            const{data}=await axios.post(backendUrl+'/api/admin/change-availability',{docId}, { headers: { atoken: aToken } })
            if(data.success)
            {
                toast.success(data.message)
                getAllDoctors()
            }
            else
            {
             toast.error(data.message)
            }

        } catch (error) {
            console.error('changeAvailablity error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
        
    }

    const getAllAppointments=async () => {
        try {
            const{data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{atoken: aToken}})
            if(data.success)
            {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else
            {
                toast.error(data.message)
            }
        } 
        catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment=async (appointmentId) => {
        try {
          const{data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{atoken: aToken}})
          if(data.success)
            {
                toast.success(data.message)
                getAllAppointments()
            }  
            else
            {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }
 
    const getDashData=async (params) => {
       try {
    const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{atoken: aToken}})
        if(data.success)
        {
            setDashData(data.dashData)
            console.log(data)
        }
        else
        {
            toast.error(data.message)
        }
       } catch (error) {
        toast.error(error.message)
       } 
    }
    

    const value={
       aToken,setAToken,
       backendUrl,doctors,getAllDoctors,changeAvailablity,appointments,setAppointments,getAllAppointments,
       cancelAppointment,dashData,getDashData
  }
    return (
        <AdminContext.Provider value={value}>
        {props.children}
        </AdminContext.Provider>
    )


}

export default AdminContextProvider;