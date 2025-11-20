import express from "express";
import { addDoctor,adminDashboard,allDoctors,appointmentCancel,appointmentsAdmin,loginAdmin,listApplications,approveApplication,removeApplication,streamApplicationResume } from "../controllers/adminController.js";
import {changeAvailablity} from "../controllers/doctorController.js"
import upload from '../middlewares/multer.js';
import authAdmin from "../middlewares/authAdmin.js";
import { createVacancy, getVacancies, updateVacancy, deleteVacancy } from "../controllers/adminController.js";

const adminRouter=express.Router()
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)

adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.get('/vacancies', getVacancies);
adminRouter.post('/vacancies', authAdmin, createVacancy);
adminRouter.put('/vacancies/:id', authAdmin, updateVacancy);
adminRouter.delete('/vacancies/:id', authAdmin, deleteVacancy);

// Applications (Admin)
adminRouter.get('/applications', authAdmin, listApplications);
adminRouter.patch('/applications/:id/approve', authAdmin, approveApplication);
adminRouter.delete('/applications/:id', authAdmin, removeApplication);
adminRouter.get('/applications/:id/resume', authAdmin, streamApplicationResume);


export default adminRouter
