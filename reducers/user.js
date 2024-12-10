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
            accounts: [{ name: "Test", icon:require("../assets/iconsAccount/sun-outline.png"), charges: [{ name: "TestCharge" }] }],
    
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
            //console.log(action.payload.selectedAccount)
            //   const selectedIndex = state.value.accounts.findIndex(
            //     (account) => account.name == action.payload.selectedAccount
            //   );
          
            //console.log(selectedIndex)
            state.value.user.accounts[state.value.selectedAccount].charges.push(action.payload);
            //console.log(state.value.accounts[selectedIndex].charges)
        },
        removeCharge: (state, action) => {
            //state.value.charges = state.value.charges.filter(e =>e.name  !==action.payload);
        },
        addAccount: (state, action) => {
            state.value.user.accounts.push({
                name: action.payload.accountInput,
                icon: action.payload.iconInput,
                charges: [],
            });
        },
        selectAccount: (state, action) => {
            state.value.selectedAccount = action.payload;
        },
    },
});
export const { addCharge, removeCharge, addAccount, selectAccount } = userSlice.actions;
export default userSlice.reducer;
