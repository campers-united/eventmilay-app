import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes     from "./routes/auth.route.js";
import eventRoutes    from "./routes/event.route.js";
import speakerRoutes  from "./routes/speakers.route.js";
import sessionRoutes  from "./routes/session.route.js";
import roomRoutes     from "./routes/room.route.js";
import questionRoutes from "./routes/question.route.js";
import favoriteRoutes from "./routes/favorite.route.js";

const app  = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth",      authRoutes);
app.use("/api/events",    eventRoutes);
app.use("/api/speakers",  speakerRoutes);
app.use("/api/sessions",  sessionRoutes);
app.use("/api/rooms",     roomRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => res.send("EventMilay API is running."));

app.listen(port, () => {
  console.log(`EventMilay backend: http://localhost:${port}`);
});
