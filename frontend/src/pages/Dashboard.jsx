import { useState, useEffect } from "react";
import { getMyGroups, createGroup } from "../api/groups";
import { Link } from "react-router-dom";

export function Dashboard() {

    const [name, setName] = useState('')
    const [groups, setGroups] = useState([])

    useEffect(() => {
        async function fetchGroups() {
            const res = await getMyGroups();
            setGroups(res.data)
        }
        fetchGroups()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) {
            alert('Group name cannot be empty')
            return
        }
        try {
            createGroup(name)
            alert('Group created successfully')
            const res = await getMyGroups()
            setGroups(res.data)
            setName('')
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong')
        }
    }
    return (
        <>
            <div>
                {(groups.length === 0) ?
                    <p>You are not in any groups yet.</p> :
                    groups.map((group) => (
                        <div>
                            <p>Group name : {group.name}</p>
                            <p>Group Id : {group._id}</p>
                        </div>
                    ))
                }
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} placeholder="Group name" onChange={(e) => setName(e.target.value)}></input>
                    <button type="submit">Submit</button>

                </form>
            </div>

            {groups.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`}>
                <div>
                    <p>Group name: {group.name}</p>
                </div>
            </Link>
            ))}
        </>
    )
}