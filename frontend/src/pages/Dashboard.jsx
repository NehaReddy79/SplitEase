import { useState, useEffect } from "react";
import { getMyGroups, createGroup } from "../api/groups";
import { Link } from "react-router-dom";
import './Dashboard.css'

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
            <div className="dashboard-page">
                <nav className="dashboard-nav">
                    <h1><span>SplitEase</span></h1>
                </nav>
            
                <div className="dashboard-content">

                    <h2>Your groups</h2>
                    <p className="tagline">Track shared expenses, see who owes what, and settle up in seconds.</p>

                    <div className="create-group-card">
                        <p className="hint">Start a new group for a trip, flat, or event</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" value={name} placeholder="Group name" onChange={(e) => setName(e.target.value)}></input>
                            <button type="submit">Create group</button>

                        </form>
                    </div>

                    <h2 className="dashboard-section-title">Your groups</h2>
                    {(groups.length === 0) ?
                        (<p className="empty-state">You are not in any groups yet. Create one above to get started.</p>) :
                        <div className="group-grid">
                            {groups.map((group) => (
                                <Link key={group._id} to={`/groups/${group._id}`} className="group-card">
                                    <div className="group-card-icon">{group.name.charAt(0).toUpperCase()}</div>
                                    <h3>{group.name}</h3>
                                    <p>Click to view details </p>
                                    <div className="view-arrow">View group →</div>
                                </Link>
                            ))}
                        </div>

                    }
                </div>
            </div>

        </>
    )
}