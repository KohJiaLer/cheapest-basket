import { useState } from "react";
import { ShopManager } from "./features/shops/ShopManager";
import { ItemManager } from "./features/items/ItemManager";
import { PriceTable } from "./features/items/PriceTable";
import type { Shop, BasketItem, ItemPrice } from "./types/basket"; 

function App() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [items, setItems] = useState<BasketItem[]>([]);
  const [prices, setPrices] = useState<ItemPrice[]>([]);
  const [extraTripCost, setExtraTripCost] = useState("0");

  function addShop(name: string) {
    const newShop: Shop = {
      id: crypto.randomUUID(),
      name,
    }

    setShops((currentShops) => [
      ...currentShops,
      newShop,
    ]);
  }

function removeShop(shopId: string) {
  setShops((currentShops) =>
    currentShops.filter(
      (shop) => shop.id !== shopId,
    ),
  );

  setPrices((currentPrices) =>
    currentPrices.filter(
      (price) => price.shopId !== shopId,
    ),
  );
}

  function addItem(
    name: string,
    quantity: number,
  ) {
    const newItem: BasketItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
    };

    setItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);
  }

  function removeItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== itemId,
      ),
    );

    setPrices((currentPrices) =>
      currentPrices.filter(
        (price) => price.itemId !== itemId,
      ),
    );
  }

  function updatePrice(
    shopId: string,
    itemId: string,
    unitPrice: string | null,
  ) {
    setPrices((currentPrices) => {
      const existingPrice = currentPrices.find(
        (price) => 
          price.shopId === shopId &&
          price.itemId === itemId,
      );

      if (existingPrice) {
        return currentPrices.map((price) =>
          price.shopId === shopId &&
          price.itemId === itemId
            ? {
              ...price,
              unitPrice,
              } 
            : price,
        );
      }

      return [
        ...currentPrices,
        {
          shopId,
          itemId,
          unitPrice,
        }
      ];
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Cheapest Basket</h1>
          <p>
            Compare shop prices and find out whether
            a second stop is worth it.
          </p>
        </div>
      </header>

      <main className="page-content">
        <div className="two-column-grid">
          <ShopManager
            shops={shops}
            onAddShop={addShop}
            onRemoveShop={removeShop}
          />

          <ItemManager
            items={items}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        </div>

        <PriceTable
          shops={shops}
          items={items}
          prices={prices}
          onUpdatePrice={updatePrice}
        />

        <section className="card">
          <h2>Extra Trip Cost</h2>

          <p className="section-description">
            Estimate the additional cost of visiting a second shop.
          </p>

          <div className="trip-cost-field">
            <label htmlFor="extra-trip-cost">
              Additional trip cost (RM)
            </label>

            <input
              id="extra-trip-cost"
              type="text"
              inputMode="decimal"
              value={extraTripCost}
              onChange={(event) => {
                const value = event.target.value;

              if (/^(?:\d+\.?\d{0,2})?$/.test(value)) {
                setExtraTripCost(value);
                }
              }}
            />
          </div>

          <p className="helper-text">
            This can represent fuel, parking, public transport,
            or the value you place on the extra journey.
          </p>
        </section>

        <section className="card result-placeholder">
          <h2>Recommendation</h2>

          <p className="empty-message">
            Your cheapest basket recommendation will appear here.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;