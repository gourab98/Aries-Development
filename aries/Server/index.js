const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//routes
app.use("/", apiRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Api handling listening on port ${port}`)
  })

