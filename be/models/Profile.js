const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  education: [String],
  experience: [String],
  skills: [String],
  posts: [String],
}, { timestamps: true })

module.exports = mongoose.model('Profile', profileSchema)