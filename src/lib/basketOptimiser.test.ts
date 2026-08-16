import { describe, expect, it } from "vitest";

import {
    calculateSingleShopOption,
    findBestSingleShop,
    generateShopPairs,
    calculateTwoShopOption,
    findBestTwoShopOption,
    findBestBasketOption,
} from "./basketOptimiser";

import type {
    Shop,
    BasketItem,
    ItemPrice,
} from "../types/basket";

describe("calculateSingleShopOption", () => {
    it("calculates the total cost of a complete basket", () => {
        const shop: Shop = {
            id: "shop-a",
            name: "Shop A",
        };

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 2,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "6.50",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "4.00",
            },
        ];

        const result = calculateSingleShopOption(
            shop, 
            items, 
            prices,
        );

        expect(result.valid).toBe(true);
        expect(result.itemSubTotal).toBe(14.5);
        expect(result.finalTotal).toBe(14.5);
    });

    it("marks the shop as invalid when an item has no price", () => {
        const shop: Shop = {
            id: "shop-a",
            name: "Shop A",
        };
        
        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];
        
        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "6.50",
            },
        ];

        const result = calculateSingleShopOption(
            shop,
            items,
            prices,
        );

        expect(result.valid).toBe(false);
    });
});     

describe("findBestSingleShop", () => {
    it("returns the cheapest valid single shop", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "6",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "5",
            },
            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "5",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "4",
            },
        ];

        const result = findBestSingleShop(
            shops,
            items,
            prices,
        );
        expect(result).not.toBeNull();
        expect(result?.shopIds).toEqual(["shop-b"]);
        expect(result?.finalTotal).toBe(9);
    });

    it("ignores shops that cannot supply the full basket", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "1",
            },

            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "6",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "5",
            },
        ];

        const result = findBestSingleShop(
            shops,
            items,
            prices,
        );

        expect(result?.shopIds).toEqual(["shop-b"]);
        expect(result?.finalTotal).toBe(11);
    });

    it("returns null when no shop can supply the full basket", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "6",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "4",
            },
        ];

        const result = findBestSingleShop(
            shops,
            items,
            prices,
        );

        expect(result).toBeNull();
    });   
});

describe("generateShopPairs", () => {
    it("generates all unique pairs of shops", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
            {
                id: "shop-c",
                name: "Shop C",
            },
        ];

        const pairs = generateShopPairs(shops);
        
        expect(pairs).toHaveLength(3);

        expect(
            pairs.map(([firstShop, secondShop]) => [
                firstShop.id, 
                secondShop.id
            ]),
        ).toEqual([
            ["shop-a", "shop-b"],
            ["shop-a", "shop-c"],
            ["shop-b", "shop-c"],
        ]);
    });

    it("returns no pairs when fewer than two shops exist", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
        ];

        const pairs = generateShopPairs(shops);

        expect(pairs).toEqual([]);
    });

    it("returns no pairs when shop list is empty", () => {
        const pairs = generateShopPairs([]);

        expect(pairs).toEqual([]);
    });
});

describe("calculateTwoShopOption", () => {
    it("assigns each item to the cheaper shop", () => {
        const firstShop: Shop = {
            id: "shop-a",
            name: "Shop A",
        };

        const secondShop: Shop = {
            id: "shop-b",
            name: "Shop B",
        };

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "4",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "5",
            },
            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "6",  
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "3",
            },
        ];

        const result = calculateTwoShopOption(
            firstShop,
            secondShop,
            items,
            prices,
            2,
        );        

        expect(result.valid).toBe(true);
        expect(result.itemSubTotal).toBe(7);
        expect(result.extraTripCost).toBe(2);
        expect(result.finalTotal).toBe(9);     
    });

    it("does not apply trip cost when all items come from one shop", () => {
        const firstShop: Shop = {
            id: "shop-a",
            name: "Shop A",
        };

        const secondShop: Shop = {
            id: "shop-b",
            name: "Shop B",
        };

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,                
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "4",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "3",
            },
            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "6",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "5",
            },
        ];

        const result = calculateTwoShopOption(
            firstShop,
            secondShop,
            items,
            prices,
            10,
        );

        expect(result.itemSubTotal).toBe(7);
        expect(result.extraTripCost).toBe(0);
        expect(result.finalTotal).toBe(7);
        expect(result.shopIds).toEqual(["shop-a"]);
    });

    it("uses the other shop when one shop has no price for an item", () => {
        const firstShop: Shop = {
            id: "shop-a",
        name: "Shop A",
        };

        const secondShop: Shop = {
            id: "shop-b",
            name: "Shop B",
        };

        const items: BasketItem[] = [
            {
            id: "milk",
            name: "Milk",
            quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
            shopId: "shop-b",
            itemId: "milk",
            unitPrice: "5",
            },
        ];

        const result = calculateTwoShopOption(
            firstShop,
            secondShop,
            items,
            prices,
            3,
        );

        expect(result.valid).toBe(true);
        expect(result.finalTotal).toBe(5);
        expect(result.shopIds).toEqual(["shop-b"]);
    });

    it("marks the pair as invalid when neither shop has an item", () => {
        const firstShop: Shop = {
            id: "shop-a",
            name: "Shop A",
        };

        const secondShop: Shop = {
            id: "shop-b",
            name: "Shop B",
        };

        const items: BasketItem[] = [
            {
            id: "milk",
            name: "Milk",
            quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [];

        const result = calculateTwoShopOption(
            firstShop,
            secondShop,
            items,
            prices,
            3,
        );

        expect(result.valid).toBe(false);
    });
});

describe("findBestTwoShopOption", () => {
    it("returns the cheapest valid two-shop option", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
            {
                id: "shop-c",
                name: "Shop C",
            },
        ];

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "4",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "8",
            },

            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "6",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "3",
            },

            {
                shopId: "shop-c",
                itemId: "milk",
                unitPrice: "5",
            },
            {
                shopId: "shop-c",
                itemId: "bread",
                unitPrice: "4",
            },
        ];

        const result = findBestTwoShopOption(
            shops,
            items,
            prices,
            2,
        );

        expect(result).not.toBeNull();
        expect(result?.finalTotal).toBe(9);
        expect(result?.shopIds).toEqual([
        "shop-a",
        "shop-b",
        ]);
    });

    it("returns null when no pair can supply the full basket", () => {
        const shops: Shop[] = [
            {
            id: "shop-a",
            name: "Shop A",
            },
            {
            id: "shop-b",
            name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
            id: "milk",
            name: "Milk",
            quantity: 1,
            },
            {
            id: "bread",
            name: "Bread",
            quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
            shopId: "shop-a",
            itemId: "milk",
            unitPrice: "4",
            },
        ];

        const result = findBestTwoShopOption(
            shops,
            items,
            prices,
            2,
        );

        expect(result).toBeNull();
    });
});

describe("findBestBasketOption", () => {
    it("chooses two shops when splitting the basket is cheaper overall", () => {
        const shops: Shop[] = [
            {
                id: "shop-a",
                name: "Shop A",
            },
            {
                id: "shop-b",
                name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
                id: "milk",
                name: "Milk",
                quantity: 1,
            },
            {
                id: "bread",
                name: "Bread",
                quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
                shopId: "shop-a",
                itemId: "milk",
                unitPrice: "4",
            },
            {
                shopId: "shop-a",
                itemId: "bread",
                unitPrice: "10",
            },
            {
                shopId: "shop-b",
                itemId: "milk",
                unitPrice: "9",
            },
            {
                shopId: "shop-b",
                itemId: "bread",
                unitPrice: "3",
            },
        ];

        const result = findBestBasketOption(
            shops,
            items,
            prices,
            2,
            );

        expect(result).not.toBeNull();
        expect(result?.shopIds).toEqual([
            "shop-a",
            "shop-b",
        ]);
        expect(result?.itemSubTotal).toBe(7);
        expect(result?.extraTripCost).toBe(2);
        expect(result?.finalTotal).toBe(9);
    });

    it("chooses one shop when the extra trip cost removes the saving", () => {
        const shops: Shop[] = [
            {
            id: "shop-a",
            name: "Shop A",
            },
            {
            id: "shop-b",
            name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
            id: "milk",
            name: "Milk",
            quantity: 1,
            },
            {
            id: "bread",
            name: "Bread",
            quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
            shopId: "shop-a",
            itemId: "milk",
            unitPrice: "4",
            },
            {
            shopId: "shop-a",
            itemId: "bread",
            unitPrice: "10",
            },
            {
            shopId: "shop-b",
            itemId: "milk",
            unitPrice: "9",
            },
            {
            shopId: "shop-b",
            itemId: "bread",
            unitPrice: "3",
            },
        ];

        const result = findBestBasketOption(
            shops,
            items,
            prices,
            6,
        );

        expect(result).not.toBeNull();
        expect(result?.shopIds).toEqual(["shop-b"]);
        expect(result?.finalTotal).toBe(12);
    });

    it("prefers one shop when single and split options cost the same", () => {
        const shops: Shop[] = [
            {
            id: "shop-a",
            name: "Shop A",
            },
            {
            id: "shop-b",
            name: "Shop B",
            },
        ];

        const items: BasketItem[] = [
            {
            id: "milk",
            name: "Milk",
            quantity: 1,
            },
            {
            id: "bread",
            name: "Bread",
            quantity: 1,
            },
        ];

        const prices: ItemPrice[] = [
            {
            shopId: "shop-a",
            itemId: "milk",
            unitPrice: "4",
            },
            {
            shopId: "shop-a",
            itemId: "bread",
            unitPrice: "6",
            },
            {
            shopId: "shop-b",
            itemId: "milk",
            unitPrice: "6",
            },
            {
            shopId: "shop-b",
            itemId: "bread",
            unitPrice: "4",
            },
        ];

        const result = findBestBasketOption(
            shops,
            items,
            prices,
            2,
        );

        expect(result).not.toBeNull();
        expect(result?.shopIds).toHaveLength(1);
        expect(result?.finalTotal).toBe(10);
    });
});