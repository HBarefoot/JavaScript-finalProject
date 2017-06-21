const express = require('express')
const router = express.Router()
var email = require('nodemailer')

//bring talent model
let Talent = require('../models/talents')


/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('talent-form', {title: 'Looking for new guys?'})
});

//talent POST hanlder
router.post('/new', (req, res)=>{

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('lastName', 'Last Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('phone', 'Phone is required').notEmpty()

  let errors = req.validationErrors()
  if (errors){
    res.render('talent-form', {title: 'Check your input', errors: errors})
  } else {
    let talent = new Talent()
    talent.name = req.body.name
    talent.lastName = req.body.lastName
    talent.email = req.body.email
    talent.phone = req.body.phone
    talent.save((err)=>{
      if (err){
        console.log(err)
      } else {
        //sending email
        var transporter = email.createTransport({
          service: 'gmail',
          auth: {
            user: 'sendermail87@gmail.com',
            pass: 'mailsender87'
          },
          secure: true
        })

        var mailOptions = {
          from: 'sendermail87@gmail.com',
          to: 'elgalo1987@gmail.com',
          subject: 'Nuevo usuario: ' + talent.name,
          text: 'Name: ' + talent.name + ' ' + talent.lastName + '\n'
          + 'Email: ' + talent.email + '\n'
          + 'Phone: ' + talent.phone + '\n'
        }

        var customer = {
          from: 'sendermail87@gmail.com',
          to: talent.email,
          subject: 'Hello ' + talent.name,
          text: 'Thank you for be in touch with us. Soon you will hear about us.'
        }

        transporter.sendMail(mailOptions, function(err, info){
          if (err){
            throw err
          } else {
            console.log('email sent: ' + info.response)
          }
        })

        transporter.sendMail(customer, function(err, info){
          if (err){
            throw err
          } else {
            console.log('email sent: ' + info.response)
          }
        })
        res.redirect('/thanks')
      }
    })
  }
})

module.exports = router;
