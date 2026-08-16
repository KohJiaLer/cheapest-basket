import { useState, useEffect } from "react";
import { ShopManager } from "./features/shops/ShopManager";
import { ItemManager } from "./features/items/ItemManager";
import { PriceTable } from "./features/items/PriceTable";
import type { Shop, BasketItem, ItemPrice, BasketOption } from "./types/basket"; 
import { findBestBasketOption } from "./lib/basketOptimiser";
import RecommendationPanel from "./features/recommendation/RecommendationPanel";

function App() {
  function loadStoredValue<T>(
    key: string,
    fallback: T,
  ): T {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return fallback;
    }
  }

  const [shops, setShops] = useState<Shop[]>(() =>
    loadStoredValue("cheapest-basket-shops", []),
  );

  const [items, setItems] = useState<BasketItem[]>(() =>
    loadStoredValue("cheapest-basket-items", []),
  );

  const [prices, setPrices] = useState<ItemPrice[]>(() =>
    loadStoredValue("cheapest-basket-prices", []),
  );

  const [extraTripCost, setExtraTripCost] =
    useState<string>(() =>
      loadStoredValue(
        "cheapest-basket-trip-cost",
        "0",
      ),
    );
  const [recommendation, setRecommendation] = useState<BasketOption | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "cheapest-basket-shops",
      JSON.stringify(shops),
    );
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(
      "cheapest-basket-items",
      JSON.stringify(items),
    );
  }, [items]);

  useEffect(() => {
    localStorage.setItem(
      "cheapest-basket-prices",
      JSON.stringify(prices),
    );
  }, [prices]);

  useEffect(() => {
    localStorage.setItem(
      "cheapest-basket-trip-cost",
      JSON.stringify(extraTripCost),
    );
  }, [extraTripCost]);

  function clearRecommendation() {
    setRecommendation(null);
    setHasCalculated(false);
  }
  
  function hasIncompletePrices() {
    return items.some((item) =>
      shops.some((shop) => {
        const price = prices.find(
          (price) =>
            price.shopId === shop.id &&
            price.itemId === item.id,
        );

        return (
          !price ||
          price.unitPrice === null ||
          price.unitPrice === ""
        );
      }),
    );
  }

  function addShop(name: string) {
    const newShop: Shop = {
      id: crypto.randomUUID(),
      name,
    }

    setShops((currentShops) => [
      ...currentShops,
      newShop,
    ]);

    clearRecommendation();
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

    clearRecommendation();
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

    clearRecommendation();
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

    clearRecommendation();
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

    clearRecommendation();
  }

  function handleFindCheapestBasket() {
    const numericTripCost =
      extraTripCost === ""
        ? 0
        : Number(extraTripCost);

    const result = findBestBasketOption(
      shops,
      items,
      prices,
      numericTripCost,
    );

    setRecommendation(result);
    setHasCalculated(true)
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
                clearRecommendation();
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

          <p className="section-description">
            Find the cheapest way to buy your complete basket.
          </p>

          {hasIncompletePrices() && (
            <p className="helper-text">
              Blank prices are treated as unavailable at that shop.
            </p>
          )}
          
          <button
            type="button"
            onClick={handleFindCheapestBasket}
            disabled={
              shops.length === 0 ||
              items.length === 0
            }
          >
            Find Cheapest Basket
          </button>

          <RecommendationPanel
            recommendation={recommendation}
            shops={shops}
            items={items}
            hasCalculated={hasCalculated}
          />
        </section>
      </main>
    </div>
  );
}

export default App;