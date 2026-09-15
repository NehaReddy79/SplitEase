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

export const exportExpensesCSV = (groupId) => {
    return api.get(`/expenses/${groupId}/export/csv`, { responseType: 'blob' })
}

export const getSpendingByCategory = (groupId) =>{
    return api.get(`/expenses/${groupId}/analytics/category`)
}

export const getSpendingByPerson = (groupId) =>{
    return api.get(`/expenses/${groupId}/analytics/person`)
}
