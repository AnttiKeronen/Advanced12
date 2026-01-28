import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type Book = {
  name: string;
  author: string;
  pages: number;
};
export default function BookPage() {
  const { bookName } = useParams();
  const location = useLocation();
  const stateBook = location.state as Book | undefined;
  const [book, setBook] = useState<Book | null>(stateBook ?? null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (book || !bookName) return;
    (async () => {
      try {
        const res = await fetch(`/api/book/${bookName}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Book not found");
        }
        const data = (await res.json()) as Book;
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    })();
  }, [book, bookName]);
  if (!bookName) return <p>Missing book name</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!book) return <p>Loading...</p>;
  return (
    <div>
      <h2>{book.name}</h2>
      <p>author: {book.author}</p>
      <p>pages: {book.pages}</p>
    </div>
  );
}
