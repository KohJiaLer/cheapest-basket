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