const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(process.env.PGURL, {dialect: "postgres"})

const sequelize = new Sequelize(process.env.PGURL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to Data`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.users = require("./userModel")(sequelize, DataTypes);

//exporting the module
module.exports = db;
