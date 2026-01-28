import { Router } from "express";
import Book from "../models/Book";

const router = Router();
router.post("/books", async (req, res) => {
  try {
    const { name, author, pages } = req.body ?? {};
    const pagesNumber =
      typeof pages === "number"
        ? pages
        : typeof pages === "string"
        ? Number(pages)
        : NaN;
    if (
      typeof name !== "string" ||
      typeof author !== "string" ||
      !Number.isFinite(pagesNumber)
    ) {
      return res
        .status(400)
        .send("{ name: string, author: string, pages: number }");
    }
    const created = await Book.create({
      name,
      author,
      pages: pagesNumber
    });
    return res.status(201).json({
      name: created.name,
      author: created.author,
      pages: created.pages
    });
  } catch (e) {
    return res.status(500).send("Server error");
  }
});
router.get("/books", async (_req, res) => {
  try {
    const books = await Book.find({}).lean();
    return res.json(
      books.map(b => ({
        name: b.name,
        author: b.author,
        pages: b.pages
      }))
    );
  } catch {
    return res.status(500).send("Server error");
  }
});
router.get("/books/:name", async (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params.name);
    const found = await Book.findOne({ name: decoded }).lean();
    if (!found) {
      return res.status(404).send("Book not found");
    }
    return res.json({
      name: found.name,
      author: found.author,
      pages: found.pages
    });
  } catch {
    return res.status(500).send("Server error");
  }
});
export default router;
