import { useState, useEffect } from "react";
import { getGroupMembers } from "../api/groups";
import { useParams } from "react-router-dom";

export function GroupOverview() {
    const { groupId } = useParams()
    const [groupMembers, setGroupMembers] = useState([])


    useEffect(() => {

        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()

    }, [groupId])

    return (
        <>
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