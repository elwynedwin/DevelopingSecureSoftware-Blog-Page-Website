
//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const userAuth = require('../middleware/auth')
const editControlller = require('../controllers/edit')
const displayController = require('../controllers/display')
const deleteController = require('../controllers/delete')
const addController = require('../controllers/add')
const emailController = require('../controllers/email')
const rateLimit = require('express-rate-limit')


const router = express.Router()

//Stops heavy requests from being made
const limiter = rateLimit({
    max: 5, //maximum of five attempts
    windowMs: 1 * 60 * 1000 //cant enter anything  for a minute
})

//register OTP Verification POST routes
router.post('/signup', limiter, userAuth.saveUser, userController.signup)
router.post('/send',userAuth.saveUser, emailController.sendController)
router.post('/verify', emailController.verifyController, userController.signup)
router.post('/resend', emailController.resendController)


//login OTP Verification POST routes
router.post('/login', limiter, userController.login)
router.post('/sendlogin',  emailController.sendLoginController)
router.post('/verifylogin', emailController.verifyLoginController)
router.post('/resendLogin', emailController.resendLoginController)


//Adding Blog Forms
router.post('/addnewblog', addController.addnewBlog)
router.post('/searchmyblogs',displayController.searchMyBlogsByTitle)
router.post('/searchallblogs', displayController.searchAllBlogsByTitle)
router.post('/deleteblog', deleteController.deleteBlogPost)


//Editing Posts and Adding Posts
router.post('/editpost', editControlller.editBlogPost)
router.post('/addpost', addController.addBlogPost)



module.exports = router