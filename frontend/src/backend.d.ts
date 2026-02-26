import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Listing {
    id: string;
    stockQuantity: bigint;
    title: string;
    expiryTimestamp?: bigint;
    originalPrice: number;
    dealPrice: number;
    description: string;
    isActive: boolean;
    imageUrl: string;
    category: Category;
}
export interface Order {
    id: string;
    customerName: string;
    status: OrderStatus;
    customerPhone: string;
    listingId: string;
    customerAddress: string;
    timestamp: bigint;
    quantity: bigint;
}
export enum Category {
    flashSale = "flashSale",
    resell = "resell",
    offer = "offer",
    deal = "deal",
    loot = "loot",
    quickSale = "quickSale"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    fulfilled = "fulfilled",
    processing = "processing"
}
export interface backendInterface {
    createListing(_id: string, _title: string, _description: string, _originalPrice: number, _dealPrice: number, _category: Category, _imageUrl: string, _stockQuantity: bigint, _expiryTimestamp: bigint | null, pin: string): Promise<void>;
    deleteListing(id: string, pin: string): Promise<void>;
    getActiveListings(): Promise<Array<Listing>>;
    getAllListings(): Promise<Array<Listing>>;
    getAllOrders(pin: string): Promise<Array<Order>>;
    getListing(id: string): Promise<Listing | null>;
    getOrder(orderId: string, pin: string): Promise<Order | null>;
    placeOrder(id: string, listingId: string, customerName: string, customerPhone: string, customerAddress: string, quantity: bigint, timestamp: bigint): Promise<void>;
    toggleListingActive(id: string, pin: string): Promise<void>;
    updateListing(_id: string, _title: string, _description: string, _originalPrice: number, _dealPrice: number, _category: Category, _imageUrl: string, _stockQuantity: bigint, _expiryTimestamp: bigint | null, pin: string): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus, pin: string): Promise<void>;
}
