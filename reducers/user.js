import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        email: null,
        google_credentials: null,
        settings: {},
        token: "",
        accounts: [] 
    },
   
};

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        addCharge:(state, action) => {
            state.value.user.accounts.charges.push(action.payload);
        },
        removeCharge:(state, action) => {
            state.value.charges = state.value.charges.filter(e =>e.name  !==action.payload);
        }, 
        addAccount: (state,action)=>{
            state.value.user.accounts.push({name:action.payload.value})
        }      
    },
});
 export const { addCharge, removeCharge, addAccount} = userSlice.actions;
 export default userSlice.reducer;