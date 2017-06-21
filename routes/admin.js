const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
var email = require('nodemailer')

//models
const Company = require('../models/companies')
const Talent = require('../models/talents')

//admin login form
router.get('/login', (req, res)=>{
  res.render('admin-login', {title: 'LogIn', message: req.flash('error')})
})


//login proccess
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next)
})

//GET dashboard
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
  Talent.find({}, (err, talents)=>{
    Company.find({}, (err, companies)=>{
      if (err){
        console.log(err)
      }
      if (err){
        console.log(err)
      } else {
        res.render('admin', {tilte: 'Hello admin', talents, companies})
      }
    })
  })
})


//logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('error', 'You are logged out')
  res.redirect('/admin/login')
})

//id of the talent
let idT
//GET method, update or delete view Talents
router.get('/dashboard/update/talent/:id', ensureAuthenticated, (req, res)=>{
  // console.log(req.params.id)
  idT = req.params.id
  Talent.findById(idT, (err, talent)=>{
    if (err) throw err
    res.render('talent-edit-remove.pug', {title: 'Details', talent: talent})
  })
})

//POST method, update and delete view
router.post('/dashboard/update/talent/:id', ensureAuthenticated, (req, res)=>{
  let talent = {}
  talent.name = req.body.name
  talent.lastName = req.body.lastName
  talent.email = req.body.email
  talent.phone = req.body.phone

  // console.log(id)
  Talent.update({_id:idT}, talent, (err)=>{
    if(err){
      console.log(err)
    } else {
      req.flash('error', 'Updated')
      res.redirect('/admin/dashboard')
    }
  })
})

//id of a company
let idC
//GET method, update or delete view Company
router.get('/dashboard/update/company/:id', ensureAuthenticated, (req, res)=>{
  // console.log(req.params.id)
  idC = req.params.id
  Company.findById(idC, (err, company)=>{
    if (err) throw err
    res.render('company-edit-remove.pug', {title: 'Details', company: company})
  })
})

//POST method, update and delete view
router.post('/dashboard/update/company/:id', ensureAuthenticated, (req, res)=>{
  let company = {}
  company.name = req.body.name
  company.email = req.body.email
  company.phone = req.body.phone


  Company.update({_id:idC}, company, (err)=>{
    if(err){
      console.log(err)
    } else {
      req.flash('success', 'Updated')
      res.redirect('/admin/dashboard')
    }
  })
})

//delete talent
router.get('/dashboard/delete/talent', ensureAuthenticated, (req, res)=>{
  Talent.findById(idT, (err, talent)=>{
    if (err){throw err}

    Talent.remove({_id: idT}, (err)=>{
      if (err){throw err}

       res.redirect('/admin/dashboard')
    })
  })
})

//delete company
router.get('/dashboard/delete/company', ensureAuthenticated, (req, res)=>{
  Company.findById(idC, (err, company)=>{
    if (err){throw err}

    Company.remove({_id: idC}, (err)=>{
      if (err){throw err}

       res.redirect('/admin/dashboard')
    })
  })
})

//adding talents
router.post('/dashboard/add/talent', (req, res)=>{

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('lastName', 'Last Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('phone', 'Phone is required').notEmpty()

  let errors = req.validationErrors()
  if (errors){
    res.render('admin', {title: 'Check your input', errors: errors})
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

        var customer = {
          from: 'sendermail87@gmail.com',
          to: talent.email,
          subject: 'Hello ' + talent.name,
          text: 'Thank you for be in touch with us. Soon you will hear about us.'
        }

        transporter.sendMail(customer, function(err, info){
          if (err){
            throw err
          } else {
            console.log('email sent: ' + info.response)
          }
        })
        res.redirect('/admin/dashboard')
      }
    })
  }
})




//access control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next()
  } else {
    req.flash('error', 'Please LogIn')
    res.redirect('/admin/login')
  }
}




module.exports = router
