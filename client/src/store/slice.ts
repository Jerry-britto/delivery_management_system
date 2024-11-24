import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partners: [],
  orders: [],
};

export const deliverySlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPartners: function(state,action){
        state.partners = action.payload;
    },
    addOrders: function(state,action){
        state.orders = action.payload
    }
  },
});

export const { addPartners,addOrders } =
deliverySlice.actions;

export default deliverySlice.reducer;