
//importing modules
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");



const User = db.users;

//signup function creates a user and stores it inside the user table using the model. A token is then signed to then be stored inside the browser
const signup = async (req, res) => {
 try {
   const { userName, email, password } = req.body;
   const data = {
     userName,
     email,
     password: await bcrypt.hash(password, 10)
   };

   //AWAIT allows for the user data to be retrieved 
   const user = await User.create(data);

   if (user) { //if the user exists then sign a token with their user.id inside 
     let token = jwt.sign({ id: user.id }, process.env.secretkey, {
       expiresIn: '1d', //token has one day to expire
     });

    res.cookie("jwt", token,{
      
        httpOnly: true,
        secure: true, // Only send the cookie over HTTPS
        sameSite: 'strict' // Prevent cross-site request forgery attacks
      
    });
    console.log(token);

    //Renders register page after user has logged in
    return res.render('register',{
            messageSuccess: 'User Logged in',
            verifiedUser: true
     })

   } else { //renders correct error mesage 
      return res.render('register', {
        message: "Details are not correct"
      })
   }
 } catch (error) {
   console.log(error);
 }
};


//login function finds user inside database and compares the password taken in from the req.body
//JWT is then signed  and sent to the browser
const login = async (req, res) => {
 try {
const { email, password } = req.body;
   const user = await User.findOne({
     where: {
     email: email
   }
     
   });
   if (user) {
     const isSame = await bcrypt.compare(password, user.password); //bCrypt compares the password input with the encrypted one from the database
     if (isSame) {
       let token = jwt.sign({ id: user.id }, process.env.secretkey, {
        expiresIn: '1d',
       });

       res.render('hiddenform',{
        email: req.body.email,
        password: req.body.password,
        token: token, // Add the token to the rendered template
       });
        
     } else {
        return res.render('login', {
          message: "Details are not correct"
        })
     }
   } else {
      return res.render('login', {
        message: "Details are not correct"
      })
   }
 } catch (error) {
   console.log(error);
 }
};

module.exports = {
 signup,
 login,
};