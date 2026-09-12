import { useState, useEffect } from "react";
import { getSettlements } from "../api/expenses";
import { recordSettlement, confirmSettlement, getPendingSettlements } from "../api/settlements";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../api/groups";
import './SettlementPage.css'

export function SettlementsPage() {

    const [settlements, setSettlements] = useState([])
    const [groupMembers, setGroupMembers] = useState([])
    const [pendingSettlements, setPendingSettlements] = useState([])
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
        async function fetchPendingSettlements() {
            const res = await getPendingSettlements(groupId)
            setPendingSettlements(res.data)
        }
        fetchGroupMembers()
        fetchSettlements()
        fetchPendingSettlements()
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
            const res2 = await getPendingSettlements(groupId)
            setPendingSettlements(res2.data)
        } catch (error) {
            alert(error.response?.data?.error || "Something went wrong")
        }

    }

    async function handleConfirm(settlementId) {
        try {
            await confirmSettlement(settlementId)
            alert('Settlement confirmed')
            const res = await getSettlements(groupId)
            setSettlements(res.data)
            const res2 = await getPendingSettlements(groupId)
            setPendingSettlements(res2.data)
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

            <div className="overview-section">
                <h3>Awaiting confirmation</h3>
                {(pendingSettlements.length === 0) ?
                    <div className="empty-state">No pending settlements.</div> :

                    <div className="settlement-list">
                        {pendingSettlements.map((settlement) => (
                            <div className="settlement-card" key={settlement._id}>
                                <span className="settlement-text">
                                    {settlement.from.name}
                                    <span className="arrow">→</span>
                                    {settlement.to.name}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="settlement-amount">₹{settlement.amount.toFixed(2)}</span>
                                    {localStorage.getItem('userId') === settlement.to._id && (
                                        <button className="settle-btn" onClick={() => handleConfirm(settlement._id)}>
                                            Confirm received
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