import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {

        user: {
            email: null,
            google_credentials: null,
            settings: {
                weeklyNotificationsEnabled: true,
                monthlyNotificationsEnabled: true,
                chargeNotificationsEnabled: true,
              },
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
            console.log(action.payload)
            state.value.user.accounts[state.value.selectedAccount].charges = state.value.user.accounts[state.value.selectedAccount].charges.filter(e=>e.name!==action.payload.name && e.date!==action.payload.date)
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
            state.value.user.accounts.splice(state.value.selectedAccount, 1);
            console.log(state.value.selectedAccount)
            state.value.selectedAccount=0;
            console.log(state.value.selectedAccount)
        },
        selectAccount: (state, action) => {
            state.value.selectedAccount = action.payload;
        },
        toggleWeeklyNotifications(state) {
            state.value.user.settings.weeklyNotificationsEnabled = !state.value.user.settings.weeklyNotificationsEnabled;
          },
          toggleMonthlyNotifications(state) {
            state.value.user.settings.monthlyNotificationsEnabled = !state.value.user.settings.monthlyNotificationsEnabled;
          },
          toggleChargeNotifications(state) {
            state.value.user.settings.chargeNotificationsEnabled = !state.value.user.settings.chargeNotificationsEnabled;
          },
 
    },
});
export const { addCharge, removeCharge, addAccount, selectAccount, updateCharge, updateAccount, removeAccount, toggleWeeklyNotifications, toggleMonthlyNotifications, toggleChargeNotifications, } = userSlice.actions;
export default userSlice.reducer;
