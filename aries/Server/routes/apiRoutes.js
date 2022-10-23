const express = require("express");
const apiController = require("../controller/apiController");
const webHookController = require("../controller/webHookController");
const router = express.Router();


router.post("/create-invitation", apiController.createInvitation);
router.post("/webhooks/*", webHookController.webHooks);


module.exports = router;