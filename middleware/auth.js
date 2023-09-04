//importing modules
const express = require("express");
const db = require("../models");
const jwt = require("jsonwebtoken");
const validator = require("validator");


const User = db.users;

//saveUser function requests the body from the Register Form and checks all requirements 
const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });

    if (username) {
      return res.render('register', {
        message: "Username or Email Taken"
      });
    }

    const validatedEmail = validator.isEmail(req.body.email); //checks if email is a validated email //clean from Sanitisation

    if (validatedEmail) {
      const emailcheck = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (emailcheck) {
        return res.render('register', {
          message: "Username or Email Taken"
        });
      }
    } else {
      return res.render('register', {
        message: "Invalid Email"
      });
    }

    const { password, confirmpassword } = req.body;

    //REGEX protects from password not having following requirements: 2 lowercase, 1 uppercase, 2 numbers, 1 special charcter & minimum 8 characters
    const regex = /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
    const passwordCheck = regex.test(password); //regex tests the passowrd against the expression

    if (!passwordCheck) {
      return res.render('register', {
        message: "Your password does not meet the minimum requirements:\n- 2 lowercase letters\n- 1 uppercase letter\n- 2 numbers\n- 1 special character\n- Minimum length of 8 characters"
      });
    } else if (password !== confirmpassword) {
      return res.render('register', {
        message: "Passwords don't match"
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error"
    });
  }
};


//Checks user and creates a null string that can be used to view data on EJS
const checkUser = async (req, res, next) => {
  const accessToken = req.cookies.jwt;
  res.locals.verifiedUser = null;
  
  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(accessToken, process.env.secretkey);
      //if token has been verified from the cookie 
      const user = await User.findOne({
        where: { id: verifiedToken.id }
      });
      // if the user exists in database then locals variable will be true 
      if (user) {
        res.locals.verifiedUser = true;
      }
      next();
    } catch (error) {
      console.log(error);
      next();
    }
  } else {
    res.locals.verifiedUser = null;
    next();
  }
};//middleware allows for other functions to continue due to containing next()


//Prevents user from accessing pages if their JWT token isnt stored inside the browser
//This can be used on all routes apart from login and register
const loginaccess = async (req, res, next) => {
  const accessToken = req.cookies.jwt;
  
  if (accessToken) {
    try {
      //verifies token 
      const verifiedToken = jwt.verify(accessToken, process.env.secretkey);
      const user = await User.findOne({
        where: { id: verifiedToken.id }
      });
      if (user) {
        next();
      } else {
        res.redirect('login'); //if user isnt logged in, redirected to login page
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect('login')
  }
};//middleware next() allows for other functions to be used


//Logout function sets cookies maxAge to 1 seconds so it deletes itself
const logout = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
};


//exporting module
 module.exports = {
 saveUser, checkUser,logout, loginaccess
};