import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  appointmentDateTime: { type: Date }, // ✅ Added
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
});

// ✅ Automatically generate appointmentDateTime when saving
appointmentSchema.pre('save', function(next) {
  if (this.slotDate && this.slotTime) {
    this.appointmentDateTime = new Date(`${this.slotDate}T${this.slotTime}:00`);
  }
  next();
});

const appointmentModel =
  mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
