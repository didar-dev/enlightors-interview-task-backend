const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const {
  AllClients,
  CreateClient,
  DeleteClient,
  EditClient,
} = require("../controllers/clients");
router.use(verifyJWT);

router.get("/", AllClients);
router.post("/", CreateClient);
router.patch("/:id", EditClient);
router.delete("/:id", DeleteClient);

module.exports = router;
