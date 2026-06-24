const { Router } = require("express");
const { processHierarchy } = require("../controllers/bfhlController");

const router = Router();

// GET / — API info (so the deployed URL shows something useful in the browser)
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

// GET /bfhl — required by BFHL spec
router.get("/bfhl", (_req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST /bfhl — main processing endpoint
router.post("/bfhl", processHierarchy);

module.exports = router;

