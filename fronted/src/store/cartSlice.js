import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, thumbnail, color, material, quantity } = action.payload;
      
      // Find item with same ID, color, and material combination
      const existingItem = state.items.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.material === material
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          name,
          price,
          thumbnail,
          color,
          material,
          quantity,
        });
      }
    },
    removeFromCart: (state, action) => {
      const { id, color, material } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.color === color && item.material === material)
      );
    },
    updateQuantity: (state, action) => {
      const { id, color, material, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.material === material
      );
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
