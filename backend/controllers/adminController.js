import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import vacancyModel from "../models/vacancyModel.js";
import jobApplicationModel from '../models/jobApplicationModel.js';
import sendEmail from '../utils/sendEmail.js';
import sendSMS from '../utils/sendSms.js';
import https from 'https';
//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    //validating password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //uploading image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added" });
  } catch (error) {
    // Log more context to help debug 500 errors from addDoctor
    console.error("addDoctor error:", error);
    try {
      console.error("req.body:", req.body);
      console.error("req.file:", req.file);
    } catch (logErr) {
      console.error("Error logging request context:", logErr);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
//api for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" } 
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get add all doctors list for admin panel
const allDoctors=async(req,res)=>{
  try {
      const doctors=await doctorModel.find({}).select('-password')
      res.json({success:true,doctors})       

  } catch (error) {
    console.log(error)
    res.status({success:false,message:error.message})
  }
}


//API TO GET ALL APPOINTMENTS LIST
const appointmentsAdmin=async (req,res) => {
   try {
    const appointments=await appointmentModel.find({})
    res.json({success:true,appointments})
   


   } catch (error) {
     onsole.log(error)
    res.status({success:false,message:error.message})
   }
}

//API FOR APPOINTMENT CANCELLATION
const appointmentCancel=async (req,res) => {
    try {
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
      
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

//API FOR DASHBOARD DATA FOR ADMIN
const adminDashboard=async (req,res) => {
  try {
    const doctors=await doctorModel.find({})
    const users=await userModel.find({})
    const appointments=await appointmentModel.find({})
    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }
      res.json({success:true,dashData})
    
  } catch (error) {
     console.log(error);
        res.json({ success: false, message: error.message });
  }
  
}

//API FOR VACANCY
 const createVacancy = async (req, res) => {
  try {
    const { specialization, location, experience, vacancies, description } = req.body;
    if (!specialization || !location || !experience || !vacancies || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const doc = await vacancyModel.create({ specialization, location, experience, vacancies, description });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

 const getVacancies = async (req, res) => {
  try {
    const docs = await vacancyModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, location, experience, vacancies, description, isActive } = req.body;
    const updated = await vacancyModel.findByIdAndUpdate(
      id,
      { specialization, location, experience, vacancies, description, isActive },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Vacancy not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

 const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await vacancyModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Vacancy not found' });
    res.json({ success: true, message: 'Vacancy deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: List all job applications
const listApplications = async (req, res) => {
  try {
    const apps = await jobApplicationModel
      .find({})
      .populate('vacancy', 'specialization location')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: apps });
  } catch (err) {
    console.error('listApplications error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Approve (accept) an application + notify user by email & SMS
const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    // Populate vacancy to get specialization for message
    const appDoc = await jobApplicationModel.findById(id).populate('vacancy', 'specialization');
    if (!appDoc) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (appDoc.status === 'accepted') {
      return res.json({ success: true, data: appDoc, message: 'Already accepted' });
    }

    appDoc.status = 'accepted';
    await appDoc.save();

    const applicantName = appDoc.name || 'Candidate';
    const specialization = appDoc.vacancy?.specialization || 'the position';
    const email = appDoc.email;
    const phone = appDoc.phone;
  const plainMessage = `Congratulations ${applicantName} you have been selected to ${specialization} in HealWise Noida. Our team will contact you with next steps`;
  const emailSubject = `Congratulations ${applicantName} you have been selected to ${specialization} in HealWise Noida. Our team will contact you with next steps`;

    const notifications = { emailSent: false, smsSent: false };
    // Send Email (best-effort) if config present
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email) {
      try {
        await sendEmail(email, emailSubject, plainMessage);
        notifications.emailSent = true;
      } catch (e) {
        console.error('Email send failed:', e.message);
      }
    }
    // Send SMS (best-effort)
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && phone) {
      try {
        await sendSMS(phone, plainMessage);
        notifications.smsSent = true;
      } catch (e) {
        console.error('SMS send failed:', e.message);
      }
    }

    res.json({ success: true, data: appDoc, notifications, message: 'Application approved' });
  } catch (err) {
    console.error('approveApplication error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Reject an application (keep record with status 'rejected')
const removeApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const appDoc = await jobApplicationModel.findById(id);
    if (!appDoc) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (appDoc.status === 'rejected') {
      return res.json({ success: true, data: appDoc, message: 'Already rejected' });
    }
    appDoc.status = 'rejected';
    await appDoc.save();
    res.json({ success: true, data: appDoc, message: 'Application rejected' });
  } catch (err) {
    console.error('rejectApplication error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Stream resume inline via backend (avoids external tab issues)
const streamApplicationResume = async (req, res) => {
  try {
    const { id } = req.params;
    const appDoc = await jobApplicationModel.findById(id);
    if (!appDoc || !appDoc.resumeUrl) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const resumeUrl = appDoc.resumeUrl;
    const urlObj = new URL(resumeUrl);

    const options = {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {}
    };
    if (req.headers.range) {
      options.headers.Range = req.headers.range;
    }

    const proxyReq = https.request(options, (proxyRes) => {
      // Pass through status and key headers for PDF viewing/seek
      res.status(proxyRes.statusCode || 200);
      const ct = proxyRes.headers['content-type'] || 'application/pdf';
      res.setHeader('Content-Type', ct);
      if (proxyRes.headers['content-length']) {
        res.setHeader('Content-Length', proxyRes.headers['content-length']);
      }
      if (proxyRes.headers['accept-ranges']) {
        res.setHeader('Accept-Ranges', proxyRes.headers['accept-ranges']);
      }
      if (proxyRes.headers['content-range']) {
        res.setHeader('Content-Range', proxyRes.headers['content-range']);
      }
      // Prefer inline rendering
      res.setHeader('Content-Disposition', 'inline');

      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Resume proxy error:', err.message);
      res.status(502).json({ success: false, message: 'Failed to fetch resume' });
    });

    proxyReq.end();
  } catch (err) {
    console.error('streamApplicationResume error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export { addDoctor, loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,createVacancy,deleteVacancy,updateVacancy,getVacancies,listApplications,approveApplication,removeApplication,streamApplicationResume };

