require('dotenv').config();
const jwt = require('jsonwebtoken');
const validator = require('validator');
var database = require('../database/database');

//Controller page allows users to insert blog items to the database  

  function addBlogPost(req, res) {

    const { blogID, blogTitle, blogDescription, blogText } = req.body;

    //validated user input ensures no unwanted characters - SANITIZES INPUT
    const validatedblogID = validator.escape(blogID);
    const validatedblogTitle = validator.escape(blogTitle);
    const validatedblogDescription = validator.escape(blogDescription);
    const validatedblogText = validator.escape(blogText);

    const token = req.cookies.jwt;
    try {
      if (token) { //verifies if token is valid 
        jwt.verify(token, process.env.secretkey, (err, token) => {
          if (err) throw err;
  

          const id = token.id; //userID
          //query allows data to be inserted into blogpage
          const query = 'INSERT INTO blogpage ("userID", "blogID", "blogTitle", "blogTime", "blogDescription", "blogText") VALUES ($1, $2, $3, now(), $4, $5)'
          const values = [id, validatedblogID, validatedblogTitle, validatedblogDescription, validatedblogText] //sanitised values of data that comes from req.body
  
          //database query connects to database through the connection and plays the following query 
          database().query(
            query,
            values,
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send('Server Error');
              } else {
                res.redirect('/');
              }
            }
          );
        });
      } else {
        res.status(500).send('Unauthorized');//If token isnt accepted and verified then  user cannot addBlog
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error'); //Try Catch error allows for server to show errors
    }
  };



  async function addnewBlog(req, res) {
    const {blogID, blogTitle, blogDescription, blogText } = req.body;

    //validated user input ensures no unwanted characters - SANITIZES INPUT
    const validatedblogID = validator.escape(blogID);
    const validatedblogTitle = validator.escape(blogTitle);
    const validatedblogDescription = validator.escape(blogDescription);
    const validatedblogText = validator.escape(blogText);

    const token = req.cookies.jwt;
    try {
      if (token) { //if token is requested from the browser and if then verified and compared with the key inside .env
        jwt.verify(token, process.env.secretkey, async (err, token) => {
          if (err) throw err;
          const id = token.id;


          //following db query checks database to ensure that a blog with an existinfg blogID isnt created or added onto.
          const checkifExistQuery = 'SELECT COUNT(*) FROM blogpage WHERE "blogID" = $1';
          const checkifExistValues = [blogID];

          //database query connects to database through the connection and plays the following query 
          //await line allows for database query to finish and return values before the function moves on
          await database().query(checkifExistQuery, checkifExistValues, (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).send('Server Error');
            } else{
              const count = parseInt(results.rows[0].count);
              if (count > 0) {
                res.status(400).send('Blog ID already exists'); //Prevents two blogs from having the same Blog ID
              } else{

                //database query connects to database through the connection and plays the following query 
                //query inserts the new blog from the request of the body from the form.
                const query = 'INSERT INTO blogpage ("userID", "blogID", "blogTitle", "blogTime", "blogDescription", "blogText") VALUES ($1, $2, $3, now(), $4, $5)'
                const values = [id, validatedblogID, validatedblogTitle, validatedblogDescription, validatedblogText]
                database().query(
                  query,
                  values,
                  (error, results) => {
                    if (error) {
                      console.error(error);
                      res.status(500).send('Server Error');
                    } else {
                      res.redirect('/'); //user redirected to homepage if fails
                    }
                  }
                );
              }
            }
          })
        });
      } else {
        res.status(500).send('Unauthorized');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(' Server Error');
    }
  };
  


module.exports={
    addBlogPost, addnewBlog
}

