import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     value: {
//         email: null,
//         google_credentials: null,
//         settings: {},
//         token: "",
//         accounts: []
//     },
// };

const initialState = {
    value: {

        user: {
            email: null,
            google_credentials: null,
            settings: {},
            token: "",
            accounts: [{ name: "Test", icon:"person-outline", charges: [{amount: "32", chargeType: 0, date: "2024-12-10T13:42:18.784Z", name: "TestCharge", priority: true, recurrence: 1}] }],
    
        },
        selectedAccount: 0,
    },
};

//account:[{name:Test, charges:[]}, {name:test2, charges:[]}]

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addCharge: (state, action) => {
            state.value.user.accounts[state.value.selectedAccount].charges.push(action.payload);
        },       
        updateCharge:(state, action)=>{
            const chargeToUpdateIndex = state.value.user.accounts[state.value.selectedAccount].charges.findIndex(e=>e.name===action.payload.oldCharge.name && e.date===action.payload.oldCharge.date)
            state.value.user.accounts[state.value.selectedAccount].charges[chargeToUpdateIndex] = action.payload.updatedCharge;
        },
        removeCharge:(state, action)=>{
            state.value.user.accounts[state.value.selectedAccount].charges = state.value.user.accounts[state.value.selectedAccount].charges.filter(e=>e===action.payload)
        },
        addAccount: (state, action) => {
            state.value.user.accounts.push({
                name: action.payload.accountInput,
                icon: action.payload.iconInput,
                charges: [],
            });
        },
        updateAccount:(state, action)=>{
            state.value.user.accounts[state.value.selectedAccount].name=action.payload.accountInput;
            state.value.user.accounts[state.value.selectedAccount].icon=action.payload.iconInput;
        },
        removeAccount:(state, action)=>{
            state.value.user.accounts = state.value.user.accounts.splice(state.value.selectedAccount, 1);
            if (state.value.user.accounts.length===0){
                state.value.selectedAccount=null;
            }
        },
        selectAccount: (state, action) => {
            state.value.selectedAccount = action.payload;
        },
 
    },
});
export const { addCharge, removeCharge, addAccount, selectAccount, updateCharge, updateAccount, removeAccount } = userSlice.actions;
export default userSlice.reducer;
