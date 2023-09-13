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
    ssl: {
      rejectUnauthorized: false,
    },
  });

  let createUsers = `CREATE TABLE IF NOT EXISTS users
  (
      id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
      "userName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
      email character varying(255) COLLATE pg_catalog."default" NOT NULL,
      password character varying(255) COLLATE pg_catalog."default" NOT NULL,
      "createdAt" timestamp with time zone NOT NULL,
      "updatedAt" timestamp with time zone NOT NULL,
      CONSTRAINT users_pkey PRIMARY KEY (id),
      CONSTRAINT users_email_key UNIQUE (email)
  )`;

  let createBlogPage = `CREATE TABLE IF NOT EXISTS blogpage
  (
      id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
      "userID" integer,
      "blogID" integer,
      "blogTitle" character varying(255) COLLATE pg_catalog."default",
      "blogDescription" character varying(255) COLLATE pg_catalog."default",
      "blogTime" timestamp with time zone,
      "blogText" character varying(3000) COLLATE pg_catalog."default",
      CONSTRAINT blogpage_pkey PRIMARY KEY (id)
  )`;

  db.connect(function (error) {
    if (!!error) {
      console.log(error);
    } else {
      db.query(createUsers);
      db.query(createBlogPage);
      console.log("Connected!:)");
    }
  });

  return db;
};
