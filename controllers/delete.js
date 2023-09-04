require('dotenv').config();
const jwt = require('jsonwebtoken');
var database = require('../database/database');

//Controller page allows users to delete blog items inside the database  

async function deleteBlogPost(req, res) {
    try {
      const token = req.cookies.jwt
      if (token) { //verifies if token is valid 
        jwt.verify(token, process.env.secretkey, (err, token) => { //if token is compared against the key stored in .env and is verified to be correct
          if (err) throw err

          const id = req.body.id;
          const query = 'DELETE FROM blogpage WHERE id = $1' //query takes the request from the bpody of id anf deletes all from the database with this id
          const values = [id]


          //database query connects to database through the connection and plays the following query 
          database().query(query, values, (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).send('Server Error');
            } else {
              console.log(`Blog post : ${id} has been deleted.`);
              return res.redirect('/')  //user redirected to homepage after blog has been deleted
            }
          });

        }
      )}
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }


module.exports = {
    deleteBlogPost
}