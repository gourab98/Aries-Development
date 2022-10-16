const express = require("express");
const apiController = require("../controller/apiController");
const router = express.Router();


router.post("/", apiController.createInvitation);


module.exports = router;