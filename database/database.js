const { Pool } = require("pg");

module.exports = () => {
  //new databse connected
  db = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    multipleStatements: false, //multiple statements allow for SQL injections
  });

  db.connect(function (error) {
    if (!!error) {
      console.log(error);
    } else {
      console.log("Connected!:)");
    }
  });

  return db;
};
