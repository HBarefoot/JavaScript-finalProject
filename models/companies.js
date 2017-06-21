let mongoose = require('mongoose')

//talents Schema
let companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
})

let Company = module.exports = mongoose.model('Company', companySchema)
