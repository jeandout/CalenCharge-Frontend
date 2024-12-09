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
    email: null,
    google_credentials: null,
    settings: {},
    token: "",
    accounts: [{ name: "Test", charges: [{ name: "TestCharge" }] }],
  },
};

//account:[{name:Test, charges:[]}, {name:test2, charges:[]}]

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addCharge: (state, action) => {
      //console.log(action.payload.selectedAccount)
      const selectedIndex = state.value.accounts.findIndex(
        (account) => account.name == action.payload.selectedAccount
      );
      //console.log(selectedIndex)
      state.value.accounts[selectedIndex].charges.push({
        name: action.payload.name,
      });
      //console.log(state.value.accounts[selectedIndex].charges)
    },
    removeCharge: (state, action) => {
      //state.value.charges = state.value.charges.filter(e =>e.name  !==action.payload);
    },
    addAccount: (state, action) => {
      state.value.accounts.push({
        name: action.payload.accountInput,
        icon: action.payload.iconInput,
        charges: [],
      });
    },
  },
});
export const { addCharge, removeCharge, addAccount } = userSlice.actions;
export default userSlice.reducer;
