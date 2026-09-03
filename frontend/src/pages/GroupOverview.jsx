import { useState, useEffect } from "react";
import { getGroupMembers  , addMember } from "../api/groups";
import { useParams } from "react-router-dom";

export function GroupOverview() {
    const { groupId } = useParams()
    const [groupMembers, setGroupMembers] = useState([])
    const [newMemberEmail , setNewMemberEmail] = useState('')


    useEffect(() => {

        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()

    }, [groupId])

    async function handleAddMember(e){
        e.preventDefault()
        try{
            await addMember(groupId , newMemberEmail)
            alert('User added to the group successfully')
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
            setNewMemberEmail('')

        }catch (error) {
            alert(error.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <>

            <div>
                <form onSubmit={handleAddMember}>
                    <input type="email" value={newMemberEmail} placeholder="Email" onChange={(e) => setNewMemberEmail(e.target.value)}></input>

                    <button type="submit">Submit</button>
                </form>
            </div>

            <div>
                {(groupMembers.length === 0) ?
                    <p>No members in the group yet</p> :
                    groupMembers.map((member) => (
                        <div key={member._id}>
                            <p>Name : {member.name}</p>
                            <p>Email : {member.email} </p>
                            <p>Id : {member._id}</p>
                        </div>
                    ))}
            </div>

        </>
    )
}