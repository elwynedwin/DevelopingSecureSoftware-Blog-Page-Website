const express = require("express");
const display = require('../controllers/display')
const middleware = require('../middleware/auth')

const router = express.Router();

//Checks all get page routes if user is logged in
router.get('*', middleware.checkUser);

//Middleware Login Access alllows views to be displayed when user is logged in. Otherwise they are redirected from entering URL
router.get('/', middleware.loginaccess, (req,res) => {res.render('index')});
router.get('/dashboard', middleware.loginaccess, display.displayAllBlogs, (req,res) => {res.render('dashboard')});
router.get('/myblogs', middleware.loginaccess, display.displayMyBlogs,  (req,res) => {res.render('myblogs')});
router.get('/blogpage',middleware.loginaccess, (req,res) => {res.render('blogpage')});
router.get('/addnewblog',middleware.loginaccess, (req,res) => {res.render('addnewblog')});

//Blog  Page routes with specific IDs
router.get('/editpost/:id', middleware.loginaccess,  display.editBlogPost, (req,res) => {res.render('editpost')});
router.get('/addpost/:id', middleware.loginaccess, display.addBlogPost, (req,res) => {res.render('addpost')});
router.get('/blogpage/:id', middleware.loginaccess, display.displaySpecificBlog, (req,res) => {res.render('blogpage')});

//Authentication Routes 
router.get('/login', (req,res) => {res.render('login')});
router.get('/register', (req,res) => {res.render('register')});
router.get('/logout', middleware.logout);
router.get('/hiddenform', (req, res) => {res.render('hiddenform')});

module.exports = router;