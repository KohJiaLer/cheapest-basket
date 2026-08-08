import { useState } from "react";
import { ShopManager } from "./features/shops/ShopManager";
import type { Shop } from "./types/basket"; 

function App() {
  const [shops, setShops] = useState<Shop[]>([]);

  function addShop(name: string) {
    const newShop: Shop = {
      id: crypto.randomUUID(),
      name,
    }

    setShops((currentShops) => [
      ...currentShops,
      newShop,
    ]);
  };

  function removeShop(shopId: string) {
    setShops((currentShops) =>
      currentShops.filter((shop) => shop.id !== shopId),
    );
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

          <section className="card">
            <h2>Shopping List</h2>
            <p className="section-description">
              Add the items you need to buy.
            </p>

            <p className="empty-message">
              Shopping-list management will be added later.
            </p>
          </section>
        </div>

        <section className="card">
          <h2>Price Comparison</h2>
          <p className="section-description">
            Enter the price of each item at each shop.
          </p>

          <p className="empty-message">
            Add shops and shopping items to begin comparing prices.
          </p>
        </section>

        <section className="card">
          <h2>Extra Trip Cost</h2>
          <p className="section-description">
            Estimate the additional cost of visiting a second shop.
          </p>

          <p className="empty-message">
            Trip-cost settings will be added later.
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