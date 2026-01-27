import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT ? Number(process.env.PORT) : 1234;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booksdb";
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}
app.get("/", (_req, res) => {
  res.send("Server is running");
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api", bookRoutes);
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Mongo working good:", MONGODB_URI);
    const db = mongoose.connection.db;
    if (!db) return;
    const existing = await db.listCollections().toArray();
    const names = new Set(existing.map((c) => c.name));
    if (!names.has("Books")) {
      await db.createCollection("Books");
    }
    if (!names.has("books")) {
      await db.createCollection("books");
    }
  })
  .catch((e) => {
    console.error("Mongo error", e);
  });
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "../../client/build");
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server running fine on http://localhost:${PORT}`);
});
