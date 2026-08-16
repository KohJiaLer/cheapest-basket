import type {
  Shop,
  BasketItem,
  ItemPrice,
  ShopAssignment,
  BasketOption,
} from "../types/basket";

function findUnitPrice(
    prices: ItemPrice[],
    shopId: string,
    itemId: string,  
): number | null {
    const priceRecord = prices.find(
        (price) => 
            price.shopId === shopId && 
            price.itemId === itemId,
    );

    if (
        !priceRecord || 
        priceRecord.unitPrice === null ||
        priceRecord.unitPrice === ""
    ) {
        return null;
    }

    const parsedPrice = Number(priceRecord.unitPrice);

    if (Number.isNaN(parsedPrice)) {
        return null;
    }
    
    return parsedPrice;
}

export function calculateSingleShopOption(
    shop: Shop,
    items: BasketItem[],
    prices: ItemPrice[],
): BasketOption {
    const assignments: ShopAssignment[] = [];

    for (const item of items) {
        const unitPrice = findUnitPrice(
            prices, 
            shop.id, 
            item.id
        );

        if (unitPrice === null) {
            return {
                shopIds: [shop.id],
                assignments: [],
                itemSubTotal: 0,
                extraTripCost: 0,
                finalTotal: 0,
                valid: false,
                invalidReason: `${item.name} does not have a price at ${shop.name}.`,
            };
        }

        const totalPrice = unitPrice * item.quantity;

        assignments.push({
            shopId: shop.id,
            itemId: item.id,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
        });
    }

    const itemSubTotal = assignments.reduce(
        (total, assignment) => 
            total + assignment.totalPrice,
        0,
    );

    return {
        shopIds: [shop.id],
        assignments,
        itemSubTotal,
        extraTripCost: 0,
        finalTotal: itemSubTotal,
        valid: true,        
    };
}

export function findBestSingleShop(
    shops: Shop[],
    items: BasketItem[],
    prices: ItemPrice[],
): BasketOption | null {
    const validOptions = shops
        .map((shop) =>
            calculateSingleShopOption(
                shop, 
                items, 
                prices
            ),
        )
        .filter((option) => option.valid);

    if (validOptions.length === 0) {
        return null;
    }

    return validOptions.reduce(
        (bestOption, currentOption) => 
            currentOption.finalTotal < 
            bestOption.finalTotal
                ? currentOption
                : bestOption,
    ); 
}

export function generateShopPairs(
    shops: Shop[],
): [Shop, Shop][] {
    const pairs: [Shop, Shop][] = [];

    for (
        let firstIndex = 0;
        firstIndex < shops.length;
        firstIndex += 1
    ) {
        // Start after the first shop to avoid duplicate pairs
        // such as A+B and B+A, and to avoid pairing a shop with itself.
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < shops.length;
            secondIndex += 1
        ) {
            pairs.push([
                shops[firstIndex],
                shops[secondIndex],
            ]);
        }
    }

    return pairs;
}

export function calculateTwoShopOption(
    firstShop: Shop,
    secondShop: Shop,
    items: BasketItem[],
    prices: ItemPrice[],
    extraTripCost: number,
): BasketOption {
    const assignments: ShopAssignment[] = [];
    const usedShopIds = new Set<string>();

    for (const item of items) {
        const firstPrice = findUnitPrice(
            prices,
            firstShop.id,
            item.id,
        );

        const secondPrice = findUnitPrice(
            prices,
            secondShop.id,
            item.id,
        );

        // A two-shop option is invalid if neither shop
        // can supply one of the required basket items.
        if (
            firstPrice === null &&
            secondPrice === null
        ) {
            return {
                shopIds: [
                    firstShop.id, 
                    secondShop.id
                ],
                assignments: [],
                itemSubTotal: 0,
                extraTripCost: extraTripCost,
                finalTotal: 0,
                valid: false,
                invalidReason: 
                    `${item.name} does not have a price at either shop.`,

            };
        }

        let selectedShop: Shop;
        let selectedPrice: number;

        if (firstPrice === null) {
            selectedShop = secondShop;
            selectedPrice = secondPrice!;
        } else if (secondPrice === null) {
            selectedShop = firstShop;
            selectedPrice = firstPrice;
        } else if (firstPrice <= secondPrice) {
            selectedShop = firstShop;
            selectedPrice = firstPrice;
        } else {
            selectedShop = secondShop;
            selectedPrice = secondPrice;
        }

        const totalPrice = selectedPrice * item.quantity;

        assignments.push({
            shopId: selectedShop.id,
            itemId: item.id,
            quantity: item.quantity,
            unitPrice: selectedPrice,
            totalPrice,
        });

        usedShopIds.add(selectedShop.id);
    }

    const itemSubTotal = assignments.reduce(
        (total, assignment) =>
            total + assignment.totalPrice,
        0,
    );

    // Only charge the extra trip cost when the final
    // basket actually requires purchases from both shops.
    const appliedTripCost =
        usedShopIds.size > 1
            ? extraTripCost
            : 0;

    return {
        shopIds: Array.from(usedShopIds),
        assignments,
        itemSubTotal,
        extraTripCost: appliedTripCost,
        finalTotal:
            itemSubTotal + appliedTripCost,
        valid: true,
    };
}

export function findBestTwoShopOption(
    shops: Shop[],
    items: BasketItem[],
    prices: ItemPrice[],
    extraTripCost: number,
): BasketOption | null {
    const pairs = generateShopPairs(shops);

    const validOptions = pairs
        .map(([firstShop, secondShop]) =>
        calculateTwoShopOption(
            firstShop,
            secondShop,
            items,
            prices,
            extraTripCost,
        ),
    )
    .filter((option) => option.valid);

    if (validOptions.length === 0) {
        return null;
    }

    return validOptions.reduce(
        (bestOption, currentOption) =>
        currentOption.finalTotal <
        bestOption.finalTotal
            ? currentOption
            : bestOption,
    );
}

export function findBestBasketOption(
    shops: Shop[],
    items: BasketItem[],
    prices: ItemPrice[],
    extraTripCost: number,
): BasketOption | null {
    const bestSingleShop = findBestSingleShop(
        shops,
        items,
        prices,
    );

    const bestTwoShop = findBestTwoShopOption(
        shops,
        items,
        prices,
        extraTripCost,
    );

    if (!bestSingleShop && !bestTwoShop) {
        return null;
    }

    if (!bestSingleShop) {
        return bestTwoShop;
    }

    if (!bestTwoShop) {
        return bestSingleShop;
    }
    
    // Use a strict comparison so a single-shop option
    // wins when both options have the same final cost.
    if (
        bestTwoShop.finalTotal <
        bestSingleShop.finalTotal
    ) {
        return bestTwoShop;
    }

    return bestSingleShop;
}