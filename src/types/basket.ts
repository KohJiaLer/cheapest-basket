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