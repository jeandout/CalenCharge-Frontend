import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {

        user: {
            email: null,
            settings: {
                weeklyNotificationsEnabled: false,
                monthlyNotificationsEnabled: false,
                chargeNotificationsEnabled: false,
              },
            token: "",
            accounts: [
                {
                    "charges":
                        [{ "amount": "9.99", "chargeType": 0, "date": "2024-09-16T22:00:00.000Z", "name": "Xbox live", "priority": false, "recurrence": 0, "recurrenceList": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                        { "amount": "42", "chargeType": 3, "date": "2024-07-20T22:00:00.000Z", "name": "Abonnement Canard PC", "priority": false, "recurrence": 1, "recurrenceList": [6, 9, 0, 3] },
                        { "amount": "59", "chargeType": 3, "date": "2024-04-08T22:00:00.000Z", "name": "iCloud", "priority": true, "recurrence": 2, "recurrenceList": [3] }],

                    "icon": "person-outline", "name": "Perso"
                },
                {
                    "charges":
                        [{ "amount": "25", "chargeType": 0, "date": "2024-06-08T22:00:00.000Z", "name": "Netflix ", "priority": false, "recurrence": 0, "recurrenceList": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                        { "amount": "456", "chargeType": 1, "date": "2024-01-01T23:00:00.000Z", "name": "Copro", "priority": true, "recurrence": 1, "recurrenceList": [0, 3, 6, 9] },
                        { "amount": "75", "chargeType": 0, "date": "2024-08-12T22:00:00.000Z", "name": "Amazon Prime", "priority": false, "recurrence": 2, "recurrenceList": [7] }],
                    "icon": "people-outline", "name": "Commun"
                }


            ],

        },
        selectedAccount: 0,
    },
};

const logOutState = {
        user: {
            email: null,
            settings: {
                weeklyNotificationsEnabled: false,
                monthlyNotificationsEnabled: false,
                chargeNotificationsEnabled: false,
              },
            token: "",
            accounts: [{icon: "person-outline", name: "Compte Personnel", charges:[]}],
        },
        selectedAccount: 0,
    };

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addCharge: (state, action) => {
            state.value.user.accounts[state.value.selectedAccount].charges.push(action.payload);
        },
        updateCharge: (state, action) => {
            const chargeToUpdateIndex = state.value.user.accounts[state.value.selectedAccount].charges.findIndex(e => e.name === action.payload.oldCharge.name && e.date === action.payload.oldCharge.date)
            state.value.user.accounts[state.value.selectedAccount].charges[chargeToUpdateIndex] = action.payload.updatedCharge;
        },
        removeCharge: (state, action) => {
            const chargeToDeleteIndex = state.value.user.accounts[state.value.selectedAccount].charges.findIndex(e => e.name === action.payload.name && e.date === action.payload.date)
            state.value.user.accounts[state.value.selectedAccount].charges.splice(chargeToDeleteIndex, 1)
        },
        addAccount: (state, action) => {
            state.value.user.accounts.push({
                name: action.payload.accountInput,
                icon: action.payload.iconInput,
                charges: [],
            });
        },
        updateAccount: (state, action) => {
            state.value.user.accounts[state.value.selectedAccount].name = action.payload.accountInput;
            state.value.user.accounts[state.value.selectedAccount].icon = action.payload.iconInput;
        },
        removeAccount: (state, action) => {
            state.value.user.accounts.splice(state.value.selectedAccount, 1);
            console.log(state.value.selectedAccount)
            state.value.selectedAccount = 0;
            console.log(state.value.selectedAccount)
        },
        selectAccount: (state, action) => {
            state.value.selectedAccount = action.payload;
        },
        toggleWeeklyNotifications:(state)=> {
            state.value.user.settings.weeklyNotificationsEnabled = !state.value.user.settings.weeklyNotificationsEnabled;
          },
          toggleMonthlyNotifications:(state) =>{
            state.value.user.settings.monthlyNotificationsEnabled = !state.value.user.settings.monthlyNotificationsEnabled;
          },
          toggleChargeNotifications:(state) =>{
            state.value.user.settings.chargeNotificationsEnabled = !state.value.user.settings.chargeNotificationsEnabled;
          },
        addToken : (state, action)=>{
            state.value.user.token = action.payload;
        },
        removeToken : (state, action)=>{
            state.value.user.token = "";
        },
        addEmail : (state, action)=>{
            state.value.user.email=action.payload
        },
        logOut:(state, action)=>{
            state.value=logOutState;
        },
        syncDB:(state,action)=>{
            state.value.user.settings = action.payload.settings;
            state.value.user.accounts = action.payload.accounts;
        },
        
 
    },
});
export const { addCharge, removeCharge, addAccount, selectAccount, updateCharge, updateAccount, removeAccount, toggleWeeklyNotifications, toggleMonthlyNotifications, toggleChargeNotifications, addToken, removeToken, addEmail, logOut, syncDB} = userSlice.actions;
export default userSlice.reducer;
