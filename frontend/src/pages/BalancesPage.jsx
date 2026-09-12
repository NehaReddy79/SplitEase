import { useState, useEffect } from "react";
import { getBalances } from "../api/expenses";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../api/groups";
import './BalancesPage.css'

export function BalancesPage() {

    const [balances, setBalances] = useState({})
    const [groupMembers, setGroupMembers] = useState([])
    const { groupId } = useParams()


    useEffect(() => {
        async function fetchBalances() {
            const res = await getBalances(groupId)
            setBalances(res.data)
        }
        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()
        fetchBalances()
    }, [groupId])

    function getMemberName(userId) {
        const member = groupMembers.find(m => m._id === userId);
        return member ? member.name : userId;
    }

    return (
        <>
            <div className="overview-section">
                <h3>Balances</h3>
                {Object.keys(balances).length === 0 ?
                    <div className="empty-state"> No balances yet.</div>
                    :
                    <div className="balance-list">
                        {Object.entries(balances).map(([userId, amount]) => (
                            <div className="balance-card" key={userId}>
                                <span className="balance-name">{getMemberName(userId)}</span>
                                <span className={`balance-amount ${amount >= 0 ? 'positive' : 'negative'}`}>
                                    {amount >= 0 ? `+₹${amount.toFixed(2)}` : `-₹${Math.abs(amount).toFixed(2)}`}
                                </span>
                            </div>
                        ))}
                    </div>
                }
            </div>
            
        </>
    )
}