const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//session
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  }));


//routes
app.use("/", apiRoutes);


const port = process.env.PORT || 5000;
app.listen(port, (req,res) => {
    console.log(`Api handling listening on port ${port}`)
  })

