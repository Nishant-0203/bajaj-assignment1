const { Router } = require("express");
const { processHierarchy } = require("../controllers/bfhlController");

const router = Router();

router.post("/bfhl", processHierarchy);

module.exports = router;
