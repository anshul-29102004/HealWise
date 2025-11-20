import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    vacancy: { type: mongoose.Schema.Types.ObjectId, ref: 'vacancy', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    phone: { type: String, required: true, trim: true },
    additionalInfo: { type: String, default: '' },
    profileImageUrl: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'rejected', 'accepted'],
      default: 'submitted'
    },
  },
  { timestamps: true }
);

// Enforce single application per vacancy per user
jobApplicationSchema.index({ vacancy: 1, user: 1 }, { unique: true });

const jobApplicationModel = mongoose.model('job_application', jobApplicationSchema);
export default jobApplicationModel;