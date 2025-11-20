import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fs from 'fs';
import cron from 'node-cron';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import symptomCheckerRoute from "./routes/symptomCheckerRoute.js";
import userModel from './models/userModel.js';
import appointmentModel from './models/appointmentModel.js';
import sendEmail from "./utils/sendEmail.js";
import sendSMS from "./utils/sendSms.js";

// -------------------- APP CONFIG -------------------- //
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// -------------------- MIDDLEWARES -------------------- //
app.use(express.json());
app.use(cors());

// -------------------- API ENDPOINTS -------------------- //
app.use('/api/admin', adminRouter); // localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorRouter);
app.use("/api", symptomCheckerRoute);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send("Api Working");
});

// ------------------ CRON JOB FOR REMINDERS ------------------ //

// Helper function to silently log to a file (optional)
function logToFile(message) {
  fs.appendFileSync(
    'reminder-cron.log',
    `[${new Date().toISOString()}] ${message}\n`
  );
}

cron.schedule('* * * * *', async () => { // runs every minute
  try {
    const now = new Date();
    const reminderStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    const reminderEnd = new Date(reminderStart.getTime() + 30 * 60 * 1000); // 30 min window

    // Find appointments 24h from now that haven't been reminded yet
    const appointments = await appointmentModel.find({
      reminderSent: { $ne: true },
      appointmentDateTime: { $gte: reminderStart, $lt: reminderEnd }
    });

    for (const app of appointments) {
      let user;
      if (app.userId) {
        user = await userModel.findById(app.userId);
      } else if (app.userData) {
        user = app.userData;
      }

      if (!user) continue;

      const message = `Hi ${user.name || ""}, this is a reminder that you have an appointment with Dr. ${app.doctorName || ""} tomorrow at ${app.appointmentTime || ""}.`;

      try {
        // Send Email
        await sendEmail(user.email, 'Appointment Reminder', message);

        // Send SMS
        await sendSMS(user.phone, message);

        // Mark as reminded
        app.reminderSent = true;
        await app.save();

        // Optional: Log silently to file instead of console
        logToFile(`✅ Reminder sent to ${user.email || "unknown"} / ${user.phone || "N/A"}`);
      } catch (sendErr) {
        // Log send errors silently (no terminal output)
        logToFile(`❌ Failed to send reminder to ${user.email || "unknown"}: ${sendErr.message}`);
      }
    }
  } catch (err) {
    // Log any overall job errors silently
    logToFile(`❌ Reminder job failed: ${err.message}`);
  }
});

// ------------------------------------------------------------ //

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
