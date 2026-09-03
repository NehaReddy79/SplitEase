import api from "./axios";

export const createGroup = (name) =>{
    return api.post("/groups/" , {name})
}

export const getMyGroups = () =>{
    return api.get("/groups/")
}

export const addMember = (groupId , userId) =>{
    return api.post(`/groups/${groupId}/members` , {userId})
}

export const getGroupMembers = (groupId) =>{
    return api.get(`/groups/${groupId}/members`)
}