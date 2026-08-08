import { useState } from "react";
import type { Shop } from "../../types/basket";

type ShopManagerProps = {
    shops: Shop[];
    onAddShop: (name: string) => void;
    onRemoveShop: (shopID: string) => void;
};

export function ShopManager({
    shops,
    onAddShop,
    onRemoveShop,
}: ShopManagerProps) {
    const [shopName, setShopName] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = shopName.trim();

        if (!trimmedName) {
            setError("Shop name cannot be empty.");
            return;
        }

        const duplicate = shops.some(
            (shop) => 
                shop.name.toLowerCase() === trimmedName.toLowerCase(),

        );

        if (duplicate) {
            setError("That shop has already been added.")
            return;
        }

        onAddShop(trimmedName);

        setShopName("");
        setError("");   
    }

    return (
        <section className="card">
            
        
        <p className="section-description">
            Add the shops you want to compare.
        </p>

        <form className="input-row" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="e.g. Lotus's"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            />

            <button type="submit">Add shop</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {shops.length === 0 ? (
            <p className="empty-message">No shops added yet.</p>
        ) : (
            <ul className="shop-list">
            {shops.map((shop) => (
                <li key={shop.id}>
                <span>{shop.name}</span>

                <button
                    type="button"
                    className="delete-button"
                    onClick={() => onRemoveShop(shop.id)}
                >
                    Remove
                </button>
                </li>
            ))}
            </ul>
        )}
        </section>
    );
    }