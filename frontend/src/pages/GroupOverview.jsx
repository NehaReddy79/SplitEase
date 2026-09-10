import { useState, useEffect } from "react";
import { getGroupMembers, addMember } from "../api/groups";
import { useParams } from "react-router-dom";
import './GroupOverview.css'

export function GroupOverview() {
    const { groupId } = useParams()
    const [groupMembers, setGroupMembers] = useState([])
    const [newMemberEmail, setNewMemberEmail] = useState('')


    useEffect(() => {

        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()

    }, [groupId])

    async function handleAddMember(e) {
        e.preventDefault()
        try {
            await addMember(groupId, newMemberEmail)
            alert('User added to the group successfully')
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
            setNewMemberEmail('')

        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <>

            <div className="add-member-card">
                <p className="hint">Add someone to this group by their email.</p>
                <form onSubmit={handleAddMember}>
                    <input type="email" value={newMemberEmail} placeholder="Email" onChange={(e) => setNewMemberEmail(e.target.value)}></input>

                    <button type="submit">Add member</button>
                </form>

            </div>
            

            <div className="overview-section">
                <h3>Members</h3>
                {(groupMembers.length === 0) ?
                    <div className="empty-state">No members in the group yet</div> :
                    <div className="member-list">
                        {groupMembers.map((member) => (
                            <div className="member-card" key={member._id}>
                                <div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div>
                                <div className="member-info">
                                    <h4>{member.name}</h4>
                                    <p>{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>

        </>
    )
}