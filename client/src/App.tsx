import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookPage from "./pages/BookPage";
import NotFound from "./pages/NotFound";

type Book = {
  name: string;
  author: string;
  pages: number;
};
function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const book: Book = { name, author, pages: Number(pages) };
    try {
      const res = await fetch("/api/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Request failed");
      }
      const saved = (await res.json()) as Book;
      navigate(`/book/${encodeURIComponent(saved.name)}`, { state: saved });
      setName("");
      setAuthor("");
      setPages(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }
  return (
    <div>
      <h1>books</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pages">pages</label>
          <input
            id="pages"
            type="number"
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
          />
        </div>
        <div>
          <input id="submit" type="submit" value="submit" />
        </div>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:bookName" element={<BookPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
