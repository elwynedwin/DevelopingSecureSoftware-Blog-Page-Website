require('dotenv').config();
const jwt = require('jsonwebtoken');
var database = require('../database/database');




async function displayMyBlogs(req, res) {
    try {
      const token = req.cookies.jwt
      if (token) { //Verfies the token exists and hasnt been tampered with to prevent session hijacking
        jwt.verify(token, process.env.secretkey, (err, token) => {
          if (err) throw err
          const id = token.id
          const query = 'SELECT * FROM blogpage WHERE \"userID\" = $1 ORDER BY \"blogTime\" DESC' //using placeholders allows protection from SQL injections
          const values = [id]
           database().query(query, values, (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.render('myblogs', {
                data: results.rows //renders the newly generated data to the myblogs page
                });
            }
          });
        });
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  };


  async function searchMyBlogsByTitle(req, res) {
    try {
      
      const onlyLettersPattern = /^[A-Za-z\s]+$/; //if only the input is letters the function will play
      const input = req.body.input;

      if(!input.match(onlyLettersPattern)){ //if only the input is letters the function will play. Prevents SQL injections
        return res.status(400).json({ err: "No special characters allowed!"})
      }

      const query = 'SELECT * FROM blogpage WHERE \"blogTitle\" ILIKE $1' //using placeholders allows protection from SQL injections
      const values = ['%' + input + '%'] 
      res.locals.verifiedUser = true;

      database().query(query, values, (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send('Server Error');
        } else {
          res.render('myblogs', {
            data: results.rows //renders the newly generated data to the myblogs page
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };




//all blogs based inside the blog database will be shown on the dashboard page
  async function displayAllBlogs(req, res) {
    const query = 'SELECT \"blogID\", \"blogTitle\", COUNT(*) AS numblogs, MAX(\"blogTime\") AS latesttime FROM blogpage GROUP BY \"blogID\", \"blogTitle\" ORDER BY latesttime DESC'
    try {
      database().query(query, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render('dashboard', {
            data: results.rows //encodedRows 
          });
        }
      });
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  };



//search function generates new rows based on what is input into the search bar
  async function searchAllBlogsByTitle(req, res) {
    try {
      const onlyLettersPattern = /^[A-Za-z\s]+$/;
      const input = req.body.input;

      if(!input.match(onlyLettersPattern)){ //if only the input is letters the function will play. Prevents SQL injections
        return res.status(400).json({ err: "No special characters allowed!"})
      }

      const query = 'SELECT * FROM blogpage WHERE \"blogTitle\" ILIKE $1'
      const values = ['%' + input + '%']

      database().query(query, values, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render('dashboard', {
            data: results.rows //rows are rendered to dashboard page 
          });
        }
      });
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error');
    }
  };





//blogpage is specified through the URL
  async function displaySpecificBlog(req, res) {
    try {
      const id = req.params.id;
      const query = 'SELECT * FROM blogpage WHERE \"blogID\" = $1'
      const values = [id]
      console.log("blogID : " + id);
      database().query(query, values, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.render('blogpage', {
            data: results.rows
          });
        }
      });
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  };
  


//user will only be able to editblogpage with thier user id 
  async function editBlogPost(req, res) {
    try {

      const token = req.cookies.jwt
      if (token) { //Verfies the token exists and hasnt been tampered with to prevent session hijacking
        jwt.verify(token, process.env.secretkey, (err, token) => {
          if (err) throw err
          const userID = token.id;
          const id = req.params.id;
          const query = 'SELECT * FROM blogpage WHERE id = $1 AND \"userID\" = $2' //used verify from jwt token to make sure it will be the correct userID 
          const values = [id, userID]

          console.log("id : " + id);
          database().query(query, values, (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.render('editpost', {
                data: results.rows
              });
            }
          });
        }
      )}
      
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  }




  async function addBlogPost(req, res) {
    try {
      const id = req.params.id;
      const query = 'SELECT * FROM blogpage WHERE \"blogID\"= $1'
      const values = [id]
      console.log("id : " + id);
      //Following query allows user to add a blogpost to the current blogpage taken from the parameter of the url 
      database().query(query, values, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results.rows.length + ' rows returned.');
          res.render('addpost', {
            data: results.rows 
          });
        }
      });
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  }


module.exports={
    displayMyBlogs, displayAllBlogs, displaySpecificBlog, editBlogPost ,searchMyBlogsByTitle, searchAllBlogsByTitle, addBlogPost
}

