import api from './axios'

export const recordSettlement = (groupId , to , amount) =>{
    return api.post('/settlements' , {groupId , to , amount})
}