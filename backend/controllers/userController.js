import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';
import jobApplicationModel from '../models/jobApplicationModel.js';
import vacancyModel from '../models/vacancyModel.js';
import fs from 'fs';
//API TO REGISTER USER
const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, password, phone, gender, dob, address,pincode,city,state } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !phone || !gender || !dob || !address || !pincode || !city || !state) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle image upload
    let imageURL = '';
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        imageURL = imageUpload.secure_url;
      } catch (imgErr) {
        console.log('Image upload error:', imgErr.message);
      }
    }

    // Parse address
    let parsedAddress = {};
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      parsedAddress = { line1: '', line2: '' };
    }

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            dob,
            address: parsedAddress,
            image: imageURL,
            pincode,
            city,
            state
        };

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists with this email" });
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Create token with consistent id field
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API FOR USER LOGIN
 
const loginUser=async (req,res) => {
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user)
        {
         return res.json({success:false,message:'User does not exist'})
       }
       const isMatch=await bcrypt.compare(password,user.password)
       if(isMatch)
       {
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})
       }
       else
       {
          res.json({success:false,message:'Invalid credentials'})
       }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


///API TO GET USER PROFILE DATA
const getProfile=async (req,res) => {
    try {
       const{userId}=req.body
       const userData=await userModel.findById(userId).select('-password')
       res.json({success:true,userData})

    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API TO UPDATE USER PROFILE
const updateProfile=async (req,res) => {
    try {
        const { userId, name, phone, address, dob, gender, pincode, city, state } = req.body;
        const imageFile = req.file;
        if (!name || !phone || !address || !dob || !gender || !pincode || !city || !state) {
            return res.json({ success: false, message: "Data missing" });
        }
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
            pincode,
            city,
            state
        });
        if (imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API TO BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
    try {
        const { userId, doctorId, slotDate, slotTime } = req.body;

        // Get doctor data
        const docData = await doctorModel.findById(doctorId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        // Check if slot is already booked
        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        // Get user data
        const userData = await userModel.findById(userId).select('-password');

        // Create appointment
        const appointmentData = {
            userId,
            docId: doctorId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Update doctor's slots_booked
        await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });

        // Send Email notification to user
        try {
            const sendEmail = (await import('../utils/sendEmail.js')).default;
            if (userData && userData.email) {
                const emailMessage = `Hi ${userData.name}, your appointment with Dr. ${docData.name} on ${slotDate} at ${slotTime} has been booked successfully.`;
                await sendEmail(userData.email, 'Appointment Confirmation', emailMessage);
            }
        } catch (emailErr) {
            console.log('Failed to send email notification:', emailErr.message);
        }
        // Send SMS notification to user
        try {
            const sendSMS = (await import('../utils/sendSms.js')).default;
            if (userData && userData.phone) {
                const smsMessage = `Hi ${userData.name}, your appointment with Dr. ${docData.name} on ${slotDate} at ${slotTime} has been booked successfully.`;
                await sendSMS(userData.phone, smsMessage);
            }
        } catch (smsErr) {
            console.log('Failed to send SMS notification:', smsErr.message);
        }
        res.json({ success: true, message: 'Appointment booked successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API TO GET USER APPOINTMENT FOR FRONTEND IN MY APPOINTMENT PAGE
const listAppointment=async (req,res) => {
    try {
        const {userId}=req.body
        const appointments=await appointmentModel.find({userId})
        res.json({success:true,appointments})
    } catch (error) {
                console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API TO CANCEL APPOINTMENT
const cancelAppointment=async (req,res) => {
    try {
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData.userId!=userId)
        {
            return res.json({success:false,message:"Unathorized action"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        //making slot available for others
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData=await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!=slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Cancelled'})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
//API TO MAKE PAYMENT USING RAZORPAY
const paymentRazorpay=async (req,res) => {
    try {
          const {appointmentId}=req.body
    const appointmentData=await appointmentModel.findById(appointmentId)
    if(!appointmentData || appointmentData.cancelled)
    {
        return res.json({success:false,message:"Appointment Cancelled or not found"})
    }
    //creating options for razorpay payment
    const options={
        amount:appointmentData.amount*100,
        currency:process.env.CURRENCY,
        receipt:appointmentId,
 }
 //CREATION OF AN ORDER
 const order=await razorpayInstance.orders.create(options)
 res.json({success:true,order})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API TO VERIFY PAYMENT
const verifyRazorpay=async (req,res) => {
    try {
        const {razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status==='paid')
        {
          await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
          res.json({success:true,message:'Payment Successful'})
        }
        else
        {
            res.json({success:false,message:'Payment Failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const uploadToCloudinary = async (filePath, resource_type = 'auto') => {
  const res = await cloudinary.uploader.upload(filePath, { resource_type });
  return res.secure_url;
};

const applyToVacancy = async (req, res) => {
  try {
    const { id } = req.params; // vacancy id
    const userId = req?.user?.userId || req.body.userId;
    const { name, email, age, phone, additionalInfo } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Validate vacancy
    const vacancy = await vacancyModel.findById(id);
    if (!vacancy || !vacancy.isActive) {
      return res.status(404).json({ success: false, message: 'Vacancy not found or inactive' });
    }

    if (!name || !email || !age || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Prevent duplicate application (soft check before upload work)
    const existing = await jobApplicationModel.findOne({ vacancy: vacancy._id, user: userId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied to this vacancy.' });
    }

    const files = req.files || {};
    const profileImageFile = files.profileImage?.[0];
    const resumeFile = files.resume?.[0];
    if (!profileImageFile || !resumeFile) {
      return res.status(400).json({ success: false, message: 'Profile image and resume are required' });
    }

    // Backend size checks (optional but recommended)
    try {
      const imgStat = fs.statSync(profileImageFile.path);
      const pdfStat = fs.statSync(resumeFile.path);
      if (imgStat.size > 1 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Profile image exceeds 1MB' });
      }
      if (pdfStat.size > 2 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Resume exceeds 2MB' });
      }
    } catch {}

    // Upload to Cloudinary with stable names and correct resource types
    const profileImageUpload = await cloudinary.uploader.upload(profileImageFile.path, {
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: 'raw', // critical for PDFs
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      // format: 'pdf', // optional
    });

    const profileImageUrl = profileImageUpload.secure_url;
    const resumeUrl = resumeUpload.secure_url;

    // Clean up temp files
    try { fs.unlinkSync(profileImageFile.path); } catch {}
    try { fs.unlinkSync(resumeFile.path); } catch {}

    let appDoc;
    try {
      appDoc = await jobApplicationModel.create({
        vacancy: vacancy._id,
        user: userId,
        name,
        email,
        age: Number(age),
        phone,
        additionalInfo: additionalInfo || '',
        profileImageUrl,
        resumeUrl,
      });
    } catch (e) {
      // Handle race condition hitting unique index
      if (e && e.code === 11000) {
        return res.status(409).json({ success: false, message: 'You have already applied to this vacancy.' });
      }
      throw e;
    }

    return res.status(201).json({ success: true, data: appDoc });
  } catch (err) {
    console.error('applyToVacancy error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// List applications for the currently authenticated user
const myApplications = async (req, res) => {
  try {
    const userId = req?.user?.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const apps = await jobApplicationModel
      .find({ user: userId })
      .populate('vacancy', 'specialization location experience vacancies')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: apps });
  } catch (err) {
    console.error('myApplications error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};




export  {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay,applyToVacancy,myApplications}