let mongoose = require('mongoose')

//talents Schema
let talentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
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

let Talent = module.exports = mongoose.model('Talent', talentSchema)
