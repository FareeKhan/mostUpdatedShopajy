import { createSlice } from "@reduxjs/toolkit";

const Currency = createSlice({
    name: "Currency",
    initialState: {
        currency: "SYP"
    },
    reducers: {
        changeCurrency: (state, action) => {
            state.currency = action.payload
        }
    }
})

export const { changeCurrency } = Currency.actions
export default Currency.reducer