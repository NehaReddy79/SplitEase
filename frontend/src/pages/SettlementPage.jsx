import { useState, useEffect } from "react";
import { getSettlements } from "../api/expenses";
import { recordSettlement } from "../api/settlements";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../api/groups";
import './SettlementPage.css'

export function SettlementsPage() {

    const [settlements, setSettlements] = useState([])
    const [groupMembers, setGroupMembers] = useState([])
    const { groupId } = useParams()

    useEffect(() => {
        async function fetchSettlements() {
            const res = await getSettlements(groupId)
            setSettlements(res.data)
        }
        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()
        fetchSettlements()
    }, [groupId])

    function getMemberName(userId) {
        const member = groupMembers.find(m => m._id === userId);
        return member ? member.name : userId;
    }

    async function handleSettlement(settlement) {
        try {
            await recordSettlement(groupId, settlement.to, settlement.amount)
            alert('Settlement recorded')
            const res = await getSettlements(groupId)
            setSettlements(res.data)
        } catch (error) {
            alert(error.response?.data?.error || "Something went wrong")
        }

    }

    return (
        <>
            <div className="overview-section">
                <h3>Settlements</h3>
                {(settlements.length === 0) ?
                    <div className="empty-state">No settlements yet.</div> :

                    <div className="settlement-list">
                        {settlements.map((settlement, index) => (
                            <div className="settlement-card" key={index}>
                                <span className="settlement-text">
                                    {getMemberName(settlement.from)}
                                    <span className="arrow">→</span>
                                    {getMemberName(settlement.to)}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="settlement-amount">₹{settlement.amount.toFixed(2)}</span>
                                    {localStorage.getItem('userId') === settlement.from && (
                                        <button className="settle-btn" onClick={() => handleSettlement(settlement)}>
                                            Mark as paid
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                }
            </div>
        </>
    )

}