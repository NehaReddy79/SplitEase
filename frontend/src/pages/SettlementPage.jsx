import { useState, useEffect } from "react";
import { getSettlements } from "../api/expenses";
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

    return(
        <>
            <div>
                {(settlements.length === 0) ? 
                <p>No settlements yet.</p> : 
                settlements.map((settlement , index) => (
                    <div key={index}>
                        <p>From : {getMemberName(settlement.from)} </p>
                        <p>To : {getMemberName(settlement.to)} </p>
                        <p>Amount : {settlement.amount}</p>
                    </div>
                ))
                }
            </div>
        </>
    )

}