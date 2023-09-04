require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
const bcrypt = require("bcrypt")

var database = require('../database/database');
var email;

//OTP is created inside this module
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

//assigned variable to mainOTP
const mainOTP = otp;

console.log(otp);

//Transporter module sets the requirements and where the email will be sent from
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: 'papkay13@gmail.com',
      pass: 'fbrhngvewuksoudt',
    }
});


//This controller sends an email to the users email 
function sendController(req, res) {
  const email = req.body.email;
  const userName = req.body.userName; 
  const password = req.body.password;
  const confirmpassword= req.body.confirmpassword;

  // send mail with defined transport object
  var mailOptions = {
    to: req.body.email,
    subject: "Otp for registration is: ",
    html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log(otp);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('./otp', {
      email: email,
      userName: userName,
      password: password
    });
  });
}


//This controller verifies the OTP password and completes the verification process
async function verifyController(req, res, next) {
    const { email, userName, password, otp} = req.body;

    console.log('Input : ' + otp + '||' + mainOTP);
    
    if (otp == mainOTP) {
      // OTP verification successful
      try {
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds); //hashing password
  
        const data = {
          userName,
          email,
          password: hashedPassword
        };
  
        // Pass the user data to the user controller
        req.userData = data;
        next(); // Move to the next middleware/route
  
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      }
    } else {
      return res.status(403).send("OTP is incorrect");
      //return res.render('otp', { msg: 'OTP is incorrect' });
      return; // Stop further execution
    }
}


async function resendController(req, res) {

  const { email,userName,password } = req.body


  var mailOptions={
      to: email,
     subject: "Otp for registration is: ",
     html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
   };
   
   //This controller resends the email to the account if pressed
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('otp',{
        msg: "otp has been sent",
        email: email,
        userName: userName,
        password: password
      })
  });
}





//////  //This controller resends the email to the account if pressed
async function resendLoginController(req, res) {

    const { email,userName,password,token } = req.body


    var mailOptions={
        to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     //resends the email to the account 
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        //Renders otp2 page made for login 
        res.render('otp2',{
          msg: "otp has been sent",
          email: email,
          userName: userName,
          password: password,
          token: token
        })
    });
}

//This controller sends the email to the account if pressed
async function sendLoginController(req, res) {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  const token= req.body.token;

  // send mail with defined transport object
  var mailOptions = {
    to: req.body.email,
    subject: "Otp for registration is: ",
    html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log(otp);

    res.render('./otp2', {
      email: email,
      userName: userName,
      password: password,
      token: token
    });
  });
}

//This controller finishes the authenication of the account if pressed
async function verifyLoginController(req, res, next) {
  const { email, password, token, otp2 } = req.body;

  if (otp2 == mainOTP) {
    // OTP verification successful
    try {
      const saltRounds = 10; // Number of salt rounds for hashing
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const data = {
        email,
        password: hashedPassword,
      };

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true, // Only send the cookie over HTTPS
        sameSite: "strict", // Prevent cross-site request forgery attacks
      });

      res.redirect("/");
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else {
    return res.status(403).send("OTP is incorrect");
  }
}




module.exports = {
    sendController,verifyController,resendController, resendLoginController, sendLoginController, verifyLoginController
}