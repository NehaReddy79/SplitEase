import api from './axios'

export const recordSettlement = (groupId , to , amount) =>{
    return api.post('/settlements' , {groupId , to , amount})
}

export const confirmSettlement = (settlementId) => {
    return api.put(`/settlements/${settlementId}/confirm`);
}

export const getPendingSettlements = (groupId) => {
    return api.get(`/settlements/${groupId}/pending`);
}