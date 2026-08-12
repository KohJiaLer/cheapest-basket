import type {
  Shop,
  BasketItem,
  ItemPrice,
} from "../../types/basket";

type PriceTableProps = {
    shops: Shop[];
    items: BasketItem[];
    prices: ItemPrice[];
    onUpdatePrice: (
        shopId: string,
        itemId: string,
        unitPrice: string | null,
    ) => void;
};

export function PriceTable({
    shops,
    items,
    prices,
    onUpdatePrice,
}: PriceTableProps) {
    function getPrice(
        shopId: string,
        itemId: string,
    ) {
        return prices.find(
            (price) => 
                price.shopId === shopId &&
                price.itemId === itemId,
        );
    }

    if (shops.length === 0 || items.length === 0) {
        return (
            <section className="card">
                <h2>Price Comparison</h2>
            
                <p className="section-description">
                    Enter the price of each item at each shop.
                </p>

                <p className="empty-message">
                    Add at least one shop and one shopping item first.
                </p>
            </section>
        );
    }
    
    return (
        <section className="card">
            <h2>Price Comparison</h2>
            <p className="section-description">
                Enter the price of each item at each shop.
            </p>

            <div className="price-table-wrapper">
                <table className="price-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>

                            {shops.map((shop) => (
                                <th key={shop.id}>
                                    {shop.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>

                                <td>{item.quantity}</td>

                                {shops.map((shop) => {
                                    const price = getPrice(
                                        shop.id,
                                        item.id,
                                    );

                                    return (
                                        <td key={shop.id}>
                                            <input
                                                className="price-input"
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="RM"
                                                value={
                                                    price?.unitPrice ?? ""
                                                }
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    
                                                    if (!/^(?:\d+\.?\d{0,2})?$/.test(value)) {
                                                        return;
                                                    }

                                                    if (value === "") {
                                                        onUpdatePrice(
                                                            shop.id,
                                                            item.id,
                                                            null,
                                                        );
                                                        return;
                                                    }

                                                    onUpdatePrice(
                                                        shop.id,
                                                        item.id,
                                                        value,
                                                    );
                                    
                                                }}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

                                            
