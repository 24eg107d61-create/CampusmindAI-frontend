import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Library() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        quantity: 1,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddBook = (event) => {
        event.preventDefault();

        const title = form.title.trim();
        const author = form.author.trim();
        const isbn = form.isbn.trim();
        const category = form.category.trim();
        const quantity = Number(form.quantity);

        if (!title || !author || !isbn || !category) {
            setMessage("Please fill in all book details.");
            return;
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            setMessage("Quantity must be at least 1.");
            return;
        }

        if (books.some((book) => book.isbn === isbn)) {
            setMessage("A book with this ISBN already exists.");
            return;
        }

        const newBook = {
            id: Date.now(),
            title,
            author,
            isbn,
            category,
            quantity,
            available: quantity,
        };

        setBooks((previous) => [...previous, newBook]);

        setForm({
            title: "",
            author: "",
            isbn: "",
            category: "",
            quantity: 1,
        });

        setMessage("Book added successfully.");
        setShowForm(false);
    };

    const handleDeleteBook = (id) => {
        setBooks((previous) =>
            previous.filter((book) => book.id !== id)
        );
        setMessage("Book removed from this page.");
    };

    const filteredBooks = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return books;

        return books.filter((book) =>
            [book.title, book.author, book.isbn, book.category].some(
                (value) => value.toLowerCase().includes(term)
            )
        );
    }, [books, search]);

    const totalBooks = books.reduce(
        (total, book) => total + book.quantity,
        0
    );

    const availableBooks = books.reduce(
        (total, book) => total + book.available,
        0
    );

    const issuedBooks = totalBooks - availableBooks;

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>Library Management</h1>
                    <p>
                        Manage book inventory, availability, and library
                        resources across the campus.
                    </p>
                </div>

                <div className="module-header-icon">📚</div>
            </div>

            <div className="module-stats">
                <div className="module-stat-card">
                    <span>Total Book Copies</span>
                    <h2>{totalBooks}</h2>
                    <p>Copies in this page's inventory</p>
                </div>

                <div className="module-stat-card">
                    <span>Books Available</span>
                    <h2>{availableBooks}</h2>
                    <p>Available copies</p>
                </div>

                <div className="module-stat-card">
                    <span>Books Issued</span>
                    <h2>{issuedBooks}</h2>
                    <p>Currently issued copies</p>
                </div>

                <div className="module-stat-card">
                    <span>Book Titles</span>
                    <h2>{books.length}</h2>
                    <p>Unique book records</p>
                </div>
            </div>

            <div className="module-panel">
                <div className="panel-title">
                    <div>
                        <h2>Book Inventory</h2>
                        <p>Search and manage library books</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm((previous) => !previous);
                            setMessage("");
                        }}
                    >
                        {showForm ? "Cancel" : "+ Add Book"}
                    </button>
                </div>

                {message && (
                    <p
                        role="status"
                        style={{
                            margin: "12px 0",
                            color: "#2563eb",
                        }}
                    >
                        {message}
                    </p>
                )}

                {showForm && (
                    <form
                        onSubmit={handleAddBook}
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "12px",
                            margin: "20px 0",
                        }}
                    >
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Book title"
                            aria-label="Book title"
                            required
                        />

                        <input
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            placeholder="Author"
                            aria-label="Author"
                            required
                        />

                        <input
                            name="isbn"
                            value={form.isbn}
                            onChange={handleChange}
                            placeholder="ISBN"
                            aria-label="ISBN"
                            required
                        />

                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Category"
                            aria-label="Category"
                            required
                        />

                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                            aria-label="Quantity"
                            required
                        />

                        <button type="submit">Save Book</button>
                    </form>
                )}

                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, author, ISBN, or category..."
                    aria-label="Search books"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "12px",
                        margin: "12px 0 20px",
                    }}
                />

                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                        }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Title",
                                    "Author",
                                    "ISBN",
                                    "Category",
                                    "Quantity",
                                    "Available",
                                    "Action",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        style={{
                                            padding: "12px",
                                            borderBottom: "1px solid #e5e7eb",
                                        }}
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td style={{ padding: "12px" }}>
                                        {book.title}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {book.author}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {book.isbn}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {book.category}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {book.quantity}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {book.available}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteBook(book.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        style={{
                                            textAlign: "center",
                                            padding: "36px 12px",
                                            color: "#7b8495",
                                        }}
                                    >
                                        {books.length === 0
                                            ? "No books added yet. Click Add Book to create your first record."
                                            : "No books match your search."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Library;