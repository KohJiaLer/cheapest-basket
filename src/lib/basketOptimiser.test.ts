import { describe, expect, it } from "vitest";

import {
    calculateSingleShopOption,
    findBestSingleShop,
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