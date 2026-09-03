import { useState, useEffect } from "react";
import { getBalances } from "../api/expenses";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../api/groups";

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
            <div>
                {Object.entries(balances).map(([userId , amount]) => (
                    <div key={userId}>
                    <p>Name : {getMemberName(userId)}</p>
                    <p>Amount : {amount} </p>
                    </div>
                ))}
            </div>
        </>
    )
}