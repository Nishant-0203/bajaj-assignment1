const { Router } = require("express");
const { processHierarchy } = require("../controllers/bfhlController");

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    service: "BFHL Hierarchy Analyser API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      "POST /bfhl": "Process edge list and return tree hierarchies",
      "GET /bfhl": "API operation code",
      "GET /health": "Health check",
    },
  });
});

router.get("/bfhl", (_req, res) => {
  res.status(200).json({ operation_code: 1 });
});

router.post("/bfhl", processHierarchy);

module.exports = router;
