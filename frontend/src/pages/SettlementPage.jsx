import { useState, useEffect } from "react";
import { getSettlements } from "../api/expenses";
import { recordSettlement } from "../api/settlements";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../api/groups";

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
        }catch(error){
            alert(error.response?.data?.error || "Something went wrong")
        }
        
    }

    return (
        <>
            <div>
                {(settlements.length === 0) ?
                    <p>No settlements yet.</p> :
                    settlements.map((settlement, index) => (
                        <div key={index}>
                            <p>From : {getMemberName(settlement.from)} </p>
                            <p>To : {getMemberName(settlement.to)} </p>
                            <p>Amount : {settlement.amount}</p>
                            {localStorage.getItem('userId') === settlement.from && <button onClick={() => handleSettlement(settlement)}>Settle</button> }
                            
                        </div>
                    ))
                }
            </div>
        </>
    )

}