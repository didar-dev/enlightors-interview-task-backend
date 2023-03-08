const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const {
  AllClients,
  CreateClient,
  DeleteClient,
} = require("../controllers/clients");
router.use(verifyJWT);

router.get("/", AllClients);
router.post("/", CreateClient);

module.exports = router;
