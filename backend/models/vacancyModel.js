import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema(
  {
    specialization: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    vacancies: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const vacancyModel = mongoose.model('vacancy', vacancySchema);
export default vacancyModel;
