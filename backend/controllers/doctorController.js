import express from "express";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";
const changeAvailablity=async(req,res)=>{
   try {
    
   const docId = req.docId;
   const doctorData=await doctorModel.findById(docId)
   await doctorModel.findByIdAndUpdate(docId,{available:!doctorData.available})
   res.json({success:true,message:'Availability changed'})



   } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
   }
}

const doctorList=async (req,res) => {
   try {
      const doctors=await doctorModel.find({}).select(['-password','-email'])
      res.json({success:true,doctors})
      
   } catch (error) {
      console.log(error)
      res.json({success:true,message:error.message})
   }
}


//API FOR DOCTOR LOGIN
const loginDoctor=async (req,res) => {
   try {
      const{email,password}=req.body
      const doctor=await doctorModel.findOne({email})
      if(!doctor)
      {
         res.json({success:false,message:"Invalid credentials"})
      }
      const isMatch=await bcrypt.compare(password,doctor.password)
      if(isMatch)
      {
         const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
         res.json({success:true,token})
      }
      else
      {
         res.json({success:false,message:"Invalid credentials"})
      }
   } catch (error) {
   console.log(error)
  res.json({success:true,message:error.message})  
   }
}


//API FOR GETTING DOCTOR APPOINTMENT FOR DOCTOR PANEL

const appointmentsDoctor=async (req,res) => {
   try {
      const docId = req.docId;
      const appointments=await appointmentModel.find({docId})
      res.json({success:true,appointments})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})  
   }
}

//API TO MARK APPOINTMENT COMPLETED FOR DOCTOR PANEL
const appointmentComplete=async (req,res) => {
   try {
      const { appointmentId } = req.body;
      const docId = req.docId;
      const appointmentData=await appointmentModel.findById(appointmentId)
      if(appointmentData && String(appointmentData.docId) === String(docId))
      {
         await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
         return res.json({success:true,message:'Appointment Completed'})
      }
      else
      {
         return res.json({success:false,message:'Mark Failed'})
      }
   } catch (error) {
         console.log(error)
      res.json({success:false,message:error.message}) 
   }
}
//API TO CANCEL APPOINTMENT FOR DOCTOR PANEL
const appointmentCancel=async (req,res) => {
   try {
      const { appointmentId } = req.body;
      const docId = req.docId;
      const appointmentData=await appointmentModel.findById(appointmentId)
      if(appointmentData && String(appointmentData.docId) === String(docId))
      {
         await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
         return res.json({success:true,message:'Appointment Cancelled'})
      }
      else
      {
         return res.json({success:false,message:'Cancellation Failed'})
      }
   } catch (error) {
         console.log(error)
      res.json({success:false,message:error.message}) 
   }
}

//API TO GET DASHBOARD DATA FOR DOCTOR PANEL
const doctorDashboard=async (req,res) => {
   try {
      const docId = req.docId;
      const appointments = await appointmentModel.find({ docId });
      let earning = 0;
      const now = new Date();

      appointments.forEach((item) => {
         // Revised rule: Earnings include
         // 1) Completed appointments
         // 2) Paid appointments that are NOT cancelled
         if (item.isCompleted || (item.payment && !item.cancelled)) {
            earning += item.amount;
         }
      });

      // Unique patient count
      let patients = [];
      appointments.forEach((item) => {
         if (!patients.includes(item.userId)) {
            patients.push(item.userId);
         }
      });

      const dashData = {
         earning,
         appointments: appointments.length,
         patients: patients.length,
         latestAppointments: appointments.reverse().slice(0, 5)
      };
      res.json({ success: true, dashData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}


//API TO GET DOCTOR PROFILE FOR DOCTOR PANEL
const doctorProfile=async (req,res) => {
   try {
      const docId = req.docId;
      const profileData=await doctorModel.findById(docId).select('-password')
      res.json({success:true,profileData})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message}) 
   }
}

//API TO UPDATE DOCTOR PROFILE DATA FROM DOCTOR PANEL
const updateDoctorProfile=async (req,res) => {
   try {
      const {fees,address,available}=req.body;
      const docId = req.docId;
      await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
      res.json({success:true,message:"Profile Updated"})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message}) 
   }
}

export {changeAvailablity,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,updateDoctorProfile,doctorProfile}