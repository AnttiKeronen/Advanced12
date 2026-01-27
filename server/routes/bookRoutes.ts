import { Router } from "express";
import Book from "../models/Book";

const router = Router();

router.post(["/book/", "/book"], async (req, res) => {
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
      return res.status(400).send("Invalid body");
    }

    const created = await Book.create({ name, author, pages: pagesNumber });

    return res.status(201).json({
      name: created.name,
      author: created.author,
      pages: created.pages,
    });
  } catch {
    return res.status(500).send("Server error");
  }
});

export default router;
