import { configureStore } from "@reduxjs/toolkit";
import deliverySliceReducer from "./slice.js";


export const store = configureStore({
  reducer: deliverySliceReducer,
});

