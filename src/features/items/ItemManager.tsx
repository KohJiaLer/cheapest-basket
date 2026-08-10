import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { BasketItem } from "../../types/basket";

type ItemManagerProps = {
    items: BasketItem[];
    onAddItem: (name: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
};

export function ItemManager({
    items,
    onAddItem,
    onRemoveItem,
}: ItemManagerProps) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    function handleSubmit(
        event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
    ) {
        event.preventDefault();

        const trimmedName = itemName.trim();

        if (!trimmedName) {
            setError("Item name cannot be empty.");
            return;
        }

        if (quantity < 1) {
            setError("Quantity must be at least 1.")
            return;
        }

        const duplicate = items.some(
            (item) =>
                item.name.toLowerCase() ===
            trimmedName.toLowerCase(),
        );

        if (duplicate) {
            setError("That item has already been added.");
            return;
        }

        onAddItem(trimmedName, quantity);

        setItemName("");
        setQuantity(1);
        setError("");
    }

    return (
    <section className="card">
        <h2>Shopping List</h2>

        <p className="section-description">
        Add the items you need to buy.
        </p>

        <form className="item-form" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="e.g. Milk"
            value={itemName}
            onChange={(event) =>
            setItemName(event.target.value)
            }
        />

        <input
            className="quantity-input"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
            setQuantity(Number(event.target.value))
            }
        />

        <button type="submit">
            Add item
        </button>
        </form>

        {error && (
        <p className="error-message">
            {error}
        </p>
        )}

        {items.length === 0 ? (
        <p className="empty-message">
            No shopping items added yet.
        </p>
        ) : (
        <ul className="item-list">
            {items.map((item) => (
            <li key={item.id}>
                <span>
                {item.name} x {item.quantity}
                </span>

                <button
                type="button"
                className="delete-button"
                onClick={() =>
                    onRemoveItem(item.id)
                }
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