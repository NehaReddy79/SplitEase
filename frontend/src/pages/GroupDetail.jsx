import { useState , useEffect } from "react";
import { getExpenses } from "../api/expenses";
import { getGroupMembers } from "../api/groups";
import { useParams } from "react-router-dom";

export function GroupDetail(){

    const {groupId } = useParams()
    const [expenses , setExpenses] = useState([])
    const [groupMembers , setGroupMembers] = useState([])

    useEffect(() => {

        async function fetchExpenses(){
            const res = await getExpenses(groupId)
            setExpenses(res.data)
        }
        async function fetchGroupMembers(){
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()
        fetchExpenses()

    },[groupId])

    return(
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

          <div>
            {(expenses.length === 0) ? 
            <p>No expenses added yet.</p> :
            expenses.map((e) => (
                <div key={e._id}>
                    <p>Description : {e.description} </p>
                    <p>Amount : {e.amount} </p>
                    <p>Paid By : {e.paidBy.name}</p>
                    <p>Split Type :{e.splitType} </p>
                    <p>Category : {e.category} </p>
                </div>
            ))}
          </div>
        </>
    )
}