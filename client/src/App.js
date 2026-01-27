import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookPage from "./pages/BookPage";
import NotFound from "./pages/NotFound";
function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [pages, setPages] = useState(0);
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        const payload = { name, author, pages: Number(pages) };
        try {
            const res = await fetch("/api/book/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Request failed");
            }
            const saved = (await res.json());
            navigate(`/book/${encodeURIComponent(saved.name)}`, { state: saved });
            setName("");
            setAuthor("");
            setPages(0);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "books" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", children: "name" }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "author", children: "author" }), _jsx("input", { id: "author", type: "text", value: author, onChange: (e) => setAuthor(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "pages", children: "pages" }), _jsx("input", { id: "pages", type: "number", value: pages, onChange: (e) => setPages(Number(e.target.value)) })] }), _jsx("div", { children: _jsx("input", { id: "submit", type: "submit", value: "submit" }) }), error && _jsx("p", { role: "alert", children: error })] })] }));
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/book/:bookName", element: _jsx(BookPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
}
