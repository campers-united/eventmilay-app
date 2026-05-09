import "dotenv/config";
import express from "express";
import cors from "cors";

import eventRoutes from "./routes/event.route.js";
import speakerRoutes from "./routes/speakers.route.js";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.use("/api/events", eventRoutes);
app.use("/api/speakers", speakerRoutes);

app.get("/", (req, res) => res.send("EventFlow API is running."));

app.listen(port, () => {
  console.log(`EventFlow backend running on http://localhost:${port}`);
});
