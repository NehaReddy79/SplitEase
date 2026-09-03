import api from "./axios";

export const getExpenses = (groupId) =>{
    return api.get(`/expenses/${groupId}`)
}

export const addExpense = (data) =>{
    return api.post(`/expenses`, data)
}

export const getBalances = (groupId) =>{
    return api.get(`/expenses/${groupId}/balances`)
}

export const getSettlements = (groupId) =>{
    return api.get(`/expenses/${groupId}/settlements`)
}