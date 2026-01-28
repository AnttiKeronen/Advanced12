import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes";
import Book from "./models/Book";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT ? Number(process.env.PORT) : 1234;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booksdb";
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:3000" }));
}
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api", bookRoutes);
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../../client/dist");
  const buildPath = path.resolve(__dirname, "../../client/build");
  app.use(express.static(distPath));
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    const distIndex = path.join(distPath, "index.html");
    const buildIndex = path.join(buildPath, "index.html");
    res.sendFile(distIndex, (err) => {
      if (err) res.sendFile(buildIndex);
    });
  });
}

async function ensureBooksCollectionExists() {
  await Book.create({ name: "__init__", author: "__init__", pages: 0 });
  await Book.deleteMany({ name: "__init__" });
}
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    if (db) {
      await db.createCollection("books").catch(() => {});
      await db.createCollection("Books").catch(() => {});
      await db.createCollection("book").catch(() => {});
      await db.createCollection("Book").catch(() => {});
    }
    await ensureBooksCollectionExists();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Mongo connection error:", e);
    process.exit(1);
  }
}
start();
