import { create } from 'zustand';

export type CartItem = {
    productId: number;
    name: string;
    price: number;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    remove: (productId: number) => void;
    clear: () => void;
    update: (productId: number, quantity: number) => void;
};

const calc = (items: CartItem[]) => ({
    totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0)
});

const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    add: (item, quantity = 1) => {
        const exists = get().items.find((i) => i.productId === item.productId);
        let items: CartItem[];
        if (exists) {
            items = get().items.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i));
        } else {
            items = [...get().items, { ...item, quantity }];
        }
        set({ items, ...calc(items) });
    },
    remove: (productId) => {
        const items = get().items.filter((i) => i.productId !== productId);
        set({ items, ...calc(items) });
    },
    update: (productId, quantity) => {
        const items = get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0);
        set({ items, ...calc(items) });
    },
    clear: () => set({ items: [], totalPrice: 0, totalQuantity: 0 })
}));

export default useCartStore;


