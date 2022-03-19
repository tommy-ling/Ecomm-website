const express = require('express')

const { handleErrors } = require('./middleware')
const usersRepo = require('../../repositories/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')
const { 
  requireEmail, 
  requirePassword, 
  requirePasswordConfirmation, 
  requireEmailExist, 
  requireValidPasswordForUser } = require('./validators')

// Create a second router, export it, link it up (require it) in index.js and app.use it as a middleware
const router = express.Router()

// rquest from browser to server and response from server to browser
// Pass in Method (get, post... etc.) and Path
router.get('/signup', (req, res) => {
  res.send(signupTemplate({}))
})

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password })

    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out')
})

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}))
})

router.post('/signin', 
  [requireEmailExist, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email })
    req.session.userId = user.id

    res.redirect('/admin/products')
})

module.exports = router