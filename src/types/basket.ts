export type Shop = {
    id: string;
    name: string;
};

export type BasketItem = {
    id: string;
    name: string;
    quantity: number;
};

export type ItemPrice = {
    shopId: string;
    itemId: string;
    unitPrice: string | null;
};

export type ShopAssignment = {
    shopId: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

export type BasketOption = {
    shopIds: string[];
    assignments: ShopAssignment[];
    itemSubTotal: number;
    extraTripCost: number;
    finalTotal: number;
    valid: boolean;
    invalidReason?: string;
};