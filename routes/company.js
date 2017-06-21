var express = require('express');
var router = express.Router();
var email = require('nodemailer')

//bring talent model
let Company = require('../models/companies.js')

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('company-form', {title: 'Looking for Job?'})
});

//talent POST hanlder
router.post('/new', (req, res)=>{

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('phone', 'Phone is required').notEmpty()

  let errors = req.validationErrors()
  if (errors){
    res.render('company-form', {title: 'Check your input', errors: errors})
  } else {
    let company = new Company()
    company.name = req.body.name
    company.email = req.body.email
    company.phone = req.body.phone
    // console.log(company)
    company.save((err)=>{
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
          subject: 'Nuevo usuario: ' + company.name,
          text: 'Name: ' + company.name + '\n'
          + 'Email: ' + company.email + '\n'
          + 'Phone: ' + company.phone + '\n'
        }

        var customer = {
          from: 'sendermail87@gmail.com',
          to: company.email,
          subject: 'Hello ' + company.name,
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
