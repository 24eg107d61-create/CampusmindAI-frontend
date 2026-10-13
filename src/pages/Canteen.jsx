
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getFoodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
} from "../services/canteenService";

function Canteen() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        category: "Snacks",
        price: "",
        available: true,
    });

    async function loadItems() {
        setLoading(true);
        setError("");

        try {
            const data = await getFoodItems();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Could not load food items.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    const updateForm = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            await addFoodItem({
                ...form,
                price: Number(form.price),
            });

            setForm({
                name: "",
                category: "Snacks",
                price: "",
                available: true,
            });

            setShowForm(false);
            setMessage("Food item saved successfully!");
            await loadItems();
        } catch (err) {
            setError(err.message || "Could not save food item.");
        } finally {
            setSaving(false);
        }
    }

    async function toggleAvailability(item) {
        setError("");
        setMessage("");

        try {
            await updateFoodItem(item.id, {
                name: item.name,
                category: item.category,
                price: Number(item.price),
                available: !item.available,
            });

            setMessage("Availability updated successfully!");
            await loadItems();
        } catch (err) {
            setError(err.message || "Could not update availability.");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this food item?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await deleteFoodItem(id);
            setMessage("Food item deleted successfully!");
            await loadItems();
        } catch (err) {
            setError(err.message || "Could not delete food item.");
        }
    }

    const filteredItems = items.filter((item) =>
        `${item.name} ${item.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const availableCount = items.filter((item) => item.available).length;
    const unavailableCount = items.length - availableCount;

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(price));

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>Canteen Management</h1>
                    <p>Manage food items, prices, and availability.</p>
                </div>

                <div className="module-header-icon">🍽️</div>
            </div>

            {message && (
                <div className="module-panel">
                    <p>{message}</p>
                    <button
                        className="back-button"
                        onClick={() => setMessage("")}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {error && (
                <div className="module-panel">
                    <p>Error: {error}</p>
                    <button className="back-button" onClick={loadItems}>
                        Retry
                    </button>
                </div>
            )}

            <div className="module-stats">
                <div className="module-stat-card">
                    <span>Total Food Items</span>
                    <h2>{items.length}</h2>
                    <p>Items in the menu</p>
                </div>

                <div className="module-stat-card">
                    <span>Available Items</span>
                    <h2>{availableCount}</h2>
                    <p>Ready to serve</p>
                </div>

                <div className="module-stat-card">
                    <span>Unavailable Items</span>
                    <h2>{unavailableCount}</h2>
                    <p>Currently unavailable</p>
                </div>

                <div className="module-stat-card">
                    <span>Menu Categories</span>
                    <h2>{new Set(items.map((item) => item.category)).size}</h2>
                    <p>Categories represented</p>
                </div>
            </div>

            <div className="module-panel">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <h2>Food Menu</h2>
                        <p>Add and manage canteen food items.</p>
                    </div>

                    <button
                        className="back-button"
                        onClick={() => {
                            setShowForm((prev) => !prev);
                            setMessage("");
                        }}
                    >
                        {showForm ? "Cancel" : "+ Add Food Item"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "grid",
                            gap: "14px",
                            marginTop: "20px",
                            maxWidth: "500px",
                        }}
                    >
                        <div>
                            <label htmlFor="food-name">Food Name</label>
                            <input
                                id="food-name"
                                name="name"
                                value={form.name}
                                onChange={updateForm}
                                placeholder="e.g. Vegetable Sandwich"
                                required
                                maxLength={80}
                            />
                        </div>

                        <div>
                            <label htmlFor="food-category">Category</label>
                            <select
                                id="food-category"
                                name="category"
                                value={form.category}
                                onChange={updateForm}
                                required
                            >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Meals">Meals</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Desserts">Desserts</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="food-price">Price (₹)</label>
                            <input
                                id="food-price"
                                name="price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.price}
                                onChange={updateForm}
                                placeholder="e.g. 50"
                                required
                            />
                        </div>

                        <label>
                            <input
                                type="checkbox"
                                name="available"
                                checked={form.available}
                                onChange={updateForm}
                            />{" "}
                            Available for purchase
                        </label>

                        <button
                            type="submit"
                            className="back-button"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Food Item"}
                        </button>
                    </form>
                )}

                <div style={{ margin: "20px 0" }}>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by food name or category..."
                        aria-label="Search food items"
                    />
                </div>

                {loading ? (
                    <p>Loading food items...</p>
                ) : filteredItems.length === 0 ? (
                    <p>
                        {items.length === 0
                            ? "No food items yet. Add your first item!"
                            : "No matching food items found."}
                    </p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", textAlign: "left" }}>
                            <thead>
                                <tr>
                                    <th>Food Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{formatPrice(item.price)}</td>
                                        <td>
                                            {item.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </td>
                                        <td>
                                            <button
                                                className="back-button"
                                                onClick={() =>
                                                    toggleAvailability(item)
                                                }
                                            >
                                                {item.available
                                                    ? "Mark Unavailable"
                                                    : "Mark Available"}
                                            </button>{" "}
                                            <button
                                                className="back-button"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Canteen;
