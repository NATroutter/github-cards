import "dotenv/config";
import express from "express";
import gistCard from "./api/gist.js";
import activityGraph from "./api/graph.js";
import statsCard from "./api/index.js";
import repoCard from "./api/pin.js";
import langCard from "./api/top-langs.js";

const app = express();
const router = express.Router();

router.get("/", statsCard);
router.get("/pin", repoCard);
router.get("/top-langs", langCard);
router.get("/gist", gistCard);
router.get("/graph", activityGraph);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.status(200);
  res.set("Content-Type", "text/html");
  res.send(Buffer.from("<h2>Listening for requests... 👀</h2>"));
});

// Same path as github-readme-activity-graph, so old URLs only need a new domain.
app.get("/graph", activityGraph);

app.use("/api", router);

const port = process.env.PORT || process.env.port || 9000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
