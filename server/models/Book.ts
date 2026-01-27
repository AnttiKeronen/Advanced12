import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true }
  },
  { collection: "Books" }
);

export default mongoose.model("Book", BookSchema);
