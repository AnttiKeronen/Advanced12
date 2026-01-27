import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
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

app.use("/api", bookRoutes);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "../../client/build");
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

function getDbName(uri: string) {
  const noQuery = uri.split("?")[0];
  const parts = noQuery.split("/");
  const last = parts[parts.length - 1];
  return last && last.length > 0 ? last : "booksdb";
}

async function ensureCollectionsNative() {
  const dbName = getDbName(MONGODB_URI);
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(dbName);

  try {
    await db.createCollection("Books");
  } catch (e: any) {
    if (e?.code !== 48) throw e;
  }

  try {
    await db.createCollection("books");
  } catch (e: any) {
    if (e?.code !== 48) throw e;
  }

  await client.close();
}

async function start() {
  await ensureCollectionsNative();
  await mongoose.connect(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
