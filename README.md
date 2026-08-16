## Live Demo

Deployed application: https://cheapest-basket-5q77ous5g-kohjialers-projects.vercel.app/

# Cheapest Basket

Cheapest Basket is a React and TypeScript web application that helps users determine the lowest-cost way to purchase a shopping basket from either one shop or a combination of two shops.

Users can enter their regular shops, shopping items, quantities, item prices, and an estimated extra-trip cost. The application then compares valid shopping options and recommends the cheapest complete basket.

---

## Features

- Add and remove shops.
- Add and remove shopping-list items.
- Specify the quantity required for each item.
- Enter item prices for each shop.
- Enter an estimated extra-trip cost for visiting a second shop.
- Compare all valid single-shop options.
- Compare all unique combinations of two shops.
- Automatically assign each item to the cheaper shop in a two-shop combination.
- Apply the extra-trip cost only when both shops are actually required.
- Prefer a single-shop solution when it costs the same as a two-shop solution.
- Display which items should be purchased from each recommended shop.
- Store shops, items, prices, and trip cost using browser localStorage.
- Clear outdated recommendations whenever the input data changes.
- Treat blank item prices as unavailable at that shop.

---

## Technology Used

- React
- TypeScript
- Vite
- CSS
- Vitest
- Browser localStorage

---

## Project Structure

```text
src/
├── features/
│   ├── items/
│   │   ├── ItemManager.tsx
│   │   └── PriceTable.tsx
│   ├── shops/
│   │   └── ShopManager.tsx
│   └── recommendation/
│       └── RecommendationPanel.tsx
│
├── lib/
│   ├── basketOptimiser.ts
│   └── basketOptimiser.test.ts
│
├── types/
│   └── basket.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

The application separates the user interface from the optimisation logic.

Shared application state such as shops, shopping items, prices, and trip cost is managed in `App.tsx`.

UI responsibilities are separated into components such as:

- `ShopManager`
- `ItemManager`
- `PriceTable`
- `RecommendationPanel`

The optimisation logic is stored separately in `basketOptimiser.ts`. This makes the calculation logic independent from the React interface and allows it to be tested directly using Vitest.

---

## Optimisation Approach

### Single-Shop Calculation

The application first evaluates each shop individually.

A single-shop option is considered valid only when that shop has a price available for every item in the shopping basket.

For every item, the total is calculated as:

```text
Item Total = Unit Price × Quantity
```

The item totals are then added together to calculate the complete basket cost for that shop.

After all valid shops have been evaluated, the application selects the cheapest complete single-shop option.

---

### Two-Shop Calculation

The application also generates every unique pair of shops.

For example, if the user enters:

```text
Shop A
Shop B
Shop C
```

the following combinations are checked:

```text
Shop A + Shop B
Shop A + Shop C
Shop B + Shop C
```

Duplicate combinations such as `Shop B + Shop A` are not evaluated again.

For each item in the basket, the optimiser compares the available price at both shops and assigns the item to the cheaper shop.

For example:

```text
Milk

Shop A = RM4.00
Shop B = RM6.00

Recommendation = Shop A
```

If one shop does not have a price for an item, the item can still be purchased from the other shop.

If neither shop has a price for a required item, that two-shop combination is considered invalid.

---

## Extra-Trip Cost

A second shop may have cheaper item prices, but visiting another shop may also introduce an additional travel cost.

The application therefore allows the user to enter an estimated extra-trip cost.

For example:

```text
Milk from Shop A  = RM4.00
Bread from Shop B = RM3.00

Item subtotal     = RM7.00
Extra-trip cost   = RM2.00

Final total       = RM9.00
```

The extra-trip cost is only applied when items are actually purchased from both shops.

For example, the optimiser may evaluate `Shop A + Shop B`, but if Shop A is cheaper for every item, Shop B is not actually required. In this case, the extra-trip cost is not applied.

---

## Final Recommendation

After calculating the cheapest valid single-shop option and the cheapest valid two-shop option, the application compares their final totals.

For example:

```text
Best single shop = RM12.00

Best two-shop option:
Items            = RM7.00
Extra-trip cost  = RM2.00
Final total      = RM9.00

Recommendation = Two shops
```

If the single-shop and two-shop solutions have the same final cost, the application prefers the single-shop solution.

For example:

```text
Single shop = RM10.00
Two shops   = RM10.00

Recommendation = Single shop
```

This avoids recommending an unnecessary additional journey when there is no financial saving.

---

## Input Handling

Different input types use different validation rules.

### Quantity

Quantities must be positive whole numbers.

Valid examples:

```text
1
2
15
```

Invalid examples:

```text
0
2.5
-3
2+3
abc
```

### Prices and Trip Cost

Currency values allow non-negative numbers with a maximum of two decimal places.

Valid examples:

```text
5
5.5
5.50
20.40
```

Invalid examples:

```text
-5
20+40
5.555
1e5
abc
```

Input values are stored as strings while the user is editing them so values such as `5.50` can be entered naturally.

They are converted to numbers when calculations are performed.

---

## Missing Prices

Blank prices are treated as unavailable at that shop.

For example:

```text
             Shop A     Shop B

Milk         RM5.00     RM4.00
Bread        blank      RM3.00
```

Shop A cannot supply the complete basket alone because Bread does not have a price.

However, a two-shop solution may still use:

```text
Milk  → Shop A or Shop B
Bread → Shop B
```

If an item has no available price at any shop in a possible recommendation, that option is considered invalid.

---

## Data Persistence

The application uses browser `localStorage` to store:

- Shops
- Shopping-list items
- Item prices
- Extra-trip cost

This means the user's entered data remains available after refreshing the browser.

The calculated recommendation itself is not stored.

A recommendation is derived from the current input data, so it is recalculated when the user requests it.

If the user changes a shop, item, price, quantity, or trip cost after calculating a recommendation, the previous recommendation is cleared to avoid displaying an outdated result.

---

## Testing

The optimisation logic is tested using Vitest.

Automated tests cover areas including:

- Calculating a complete single-shop basket.
- Multiplying unit prices by item quantities.
- Rejecting a single shop when an item price is unavailable.
- Selecting the cheapest valid single shop.
- Generating every unique shop pair.
- Preventing duplicate shop combinations.
- Assigning items to the cheaper shop.
- Using the second shop when the first shop does not have an item.
- Rejecting a pair when neither shop has a required item.
- Applying extra-trip cost when both shops are used.
- Not applying extra-trip cost when only one shop is actually required.
- Finding the cheapest valid two-shop option.
- Comparing single-shop and two-shop recommendations.
- Choosing a single shop when extra-trip cost removes the benefit of splitting the basket.
- Preferring one shop when single-shop and two-shop totals are equal.

The project was also manually tested for:

- Adding and removing shops.
- Adding and removing shopping-list items.
- Quantity validation.
- Currency input validation.
- Dynamic price-table updates.
- Missing prices.
- One-shop recommendations.
- Two-shop recommendations.
- Extra-trip-cost changes.
- Recommendations with more than two available shops.
- Clearing stale recommendations after data changes.
- localStorage persistence after browser refresh.

The following development checks were also run successfully:

```bash
npm run test:run
npm run build
npm run lint
```

---

## Assumptions and Design Decisions

### Maximum of Two Shops

Users may enter more than two shops into the application.

However, a recommendation can contain a maximum of two shops.

The optimiser evaluates:

```text
Every individual shop
+
Every unique pair of shops
```

and selects the cheapest valid option.

This keeps the solution aligned with the intended problem while still allowing users to compare several regular shops.

### Blank Price Means Unavailable

A blank price is interpreted as the item being unavailable at that shop.

A future version could provide an explicit `Unavailable` option to distinguish between:

```text
Price has not been entered yet
```

and:

```text
Item is definitely unavailable
```

### Trip Cost

The current version uses one user-defined extra-trip cost for every two-shop combination.

For example:

```text
Shop A + Shop B = RM5 travel cost
Shop A + Shop C = also treated as RM5 travel cost
```

In reality, travel cost may differ between shop combinations.

This simplified model was chosen to keep the user interface and optimisation logic focused on the main challenge.

---

## Limitations and Future Improvements

Possible future improvements include:

- Allowing different extra-trip costs for different shop pairs.
- Using shop locations and distance information to estimate travel costs automatically.
- Adding an explicit unavailable-item option instead of treating blank prices as unavailable.
- Allowing users to directly edit existing shopping-item quantities.
- Showing how much money the recommendation saves compared with the best single-shop option.
- Supporting optimisation across more than two shops.
- Adding richer responsive and mobile styling.
- Supporting automatic or imported supermarket price information.
- Providing more detailed comparison views between alternative recommendations.

One important future improvement would be pair-specific trip costs.

For example:

```text
Shop A → Shop B = RM5
Shop A → Shop C = RM10
Shop B → Shop C = RM3
```

The optimiser could then use the actual travel cost of each shop combination rather than applying one value to every possible pair.

---

## AI Usage

AI-assisted tools were used during development for code suggestions, implementation discussions, debugging support, and explanations of programming concepts.

AI-generated or AI-suggested code was reviewed before being accepted. Suggestions were checked against the intended application behaviour and modified where necessary.

The implementation was verified using:

- Automated Vitest tests.
- Manual functional testing.
- TypeScript/Vite production builds.
- ESLint checks.

During development, failed tests were investigated rather than changing expected results simply to make the tests pass.

This process helped ensure that the final implementation was understood and verified rather than relying only on generated suggestions.

---

## Running the Project

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

### Run Automated Tests

```bash
npm run test:run
```

### Run ESLint

```bash
npm run lint
```

### Create a Production Build

```bash
npm run build
```

---

## Summary

Cheapest Basket provides a simple way to compare shopping costs across multiple shops while accounting for both item prices and the cost of making an additional trip.

The main focus of the implementation was to keep the optimisation logic transparent, testable, and easy to explain.

The application evaluates all valid single-shop and two-shop options, handles unavailable prices, accounts for item quantities and additional travel cost, and provides the user with a clear recommendation showing where each item should be purchased.