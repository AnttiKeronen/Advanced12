import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
export default function BookPage() {
    const { bookName } = useParams();
    const location = useLocation();
    const stateBook = location.state;
    const [book, setBook] = useState(stateBook ?? null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (book || !bookName)
            return;
        (async () => {
            try {
                const res = await fetch(`/api/book/${bookName}`);
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || "Book not found");
                }
                const data = (await res.json());
                setBook(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            }
        })();
    }, [book, bookName]);
    if (!bookName)
        return _jsx("p", { children: "Missing book name" });
    if (error)
        return _jsx("p", { role: "alert", children: error });
    if (!book)
        return _jsx("p", { children: "Loading..." });
    return (_jsxs("div", { children: [_jsx("h2", { children: book.name }), _jsxs("p", { children: ["author: ", book.author] }), _jsxs("p", { children: ["pages: ", book.pages] })] }));
}
