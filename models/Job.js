const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxLength: 30,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxLength: 70,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'please provide user'],
    },
  },
  // autmoatycznie daje createdAt i updatedAt
  { timestamps: true }
)

module.exports = mongoose.model('Job', JobSchema)
