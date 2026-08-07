# Cheapest Basket

## Problem
Prices of the same shopping items can differ depending on shops/stores

Buying each item from the shop with the lowest price may reduce the
basket cost, but visiting a second shop also has an additional cost
such as fuel, parking, public transport, or time.

The goal is to compare single-shop and multi (two)-shop shopping options
and recommend the option with the lowest adjusted cost.

## Target User
Shoppers who regularly compare  prices of individual items at different 
shops to determine whether visiting a second shop is actually worth it.

## Core Feature
1. Add shops, shopping items, quantities and prices.
2. Compare the cheapest single-shop basket with the cheapest 
   two-shop combination.

## Inputs
- Shop names
- Shopping items
- Item quantities
- Item prices at each shop
- Item availability
- Additional cost of visiting a second shop

## Outputs
- Cheapest single-shop option
- Cheapest two-shop option
- Recommended option
- Items to buy from each shop
- Basket subtotal
- Extra trip cost
- Final adjusted total
- Explanation of why the option was recommended

## Main Formula
Adjusted Total = Item Cost + Additional Trip Cost

For one shop:

Adjusted Total = Item Cost

For two shops:

Adjusted Total = Item Cost + Additional Trip Cost

## Assumptions
- Prices are manually entered by the user.
- Compared products are assumed to be equivalent.
- The recommendation can use a maximum of two shops.
- The extra trip cost is entered by the user.
- If two options have the same final cost, the option using fewer shops wins.
- Discounts, loyalty points, promotions, and product quality differences
  are out of scope

## Planned Technology
- React
- TypeScript
- Vite
- Browser Local Storage
- Vitest for testing

## Future Improvements
Possible future improvements include:
- Real supermarket pricing
- Travel distance calculation
- Map integration
- Loyalty discounts
- Price history
- More than two-shop optimisation
