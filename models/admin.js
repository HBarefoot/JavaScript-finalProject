const mongoose = require('mongoose')

//user schema
const AdminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})


const Admin = module.exports = mongoose.model('Admin', AdminSchema)
