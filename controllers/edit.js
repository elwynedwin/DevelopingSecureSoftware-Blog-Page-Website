require('dotenv').config();
const jwt = require('jsonwebtoken');
const validator = require('validator');
var database = require('../database/database');


//Controller page allows users to edit blog items to the database  

function editBlogPost(req, res) {
    try {
        const {id, userID, blogID, blogTitle, blogDescription, blogText} = req.body

        //validated user input ensures no unwanted characters - SANITIZES INPUT
        const validatedID = validator.escape(id);
        const validatedblogID = validator.escape(blogID);
        const validatedblogTitle = validator.escape(blogTitle);
        const validatedblogDescription = validator.escape(blogDescription);
        const validatedblogText = validator.escape(blogText);

        const token = req.cookies.jwt
          if (token) { //verifying the token stored into the browser to ensure session hijacking isnt occuring 
            jwt.verify(token, process.env.secretkey, (err, token) => {
              if (err) throw err

              const tokenuserID = token.id;
              console.log(tokenuserID);
              console.log(userID);
              if(tokenuserID.toString() !== userID.toString()){ //making sure that other userIDs cannot be accessed... cannot set another post as another user
                return res.status(400).json({ err: "Invalid Token, Please reauthenticate by login!"})
              }


              //the following query updates the blogpage and regardless if the user has chnaged these details from the request
              //The user will not be able to update without the correct userID taken and verified from the JWT token
              const query = 'UPDATE blogpage SET \"userID\" = $1, \"blogID\" = $2, \"blogTitle\" = $3, \"blogTime\" = now(), \"blogDescription\" = $4, \"blogText\" = $5 WHERE id = $6'
              const values = [userID, validatedblogID, validatedblogTitle, validatedblogDescription, validatedblogText, validatedID]

              database().query(query, values, (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  res.redirect('/');
                }
              });
            }
        )}
      } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error');
      }
  };


module.exports={
    editBlogPost
}

