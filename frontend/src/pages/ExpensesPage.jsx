import { useState, useEffect } from "react";
import { getExpenses, addExpense } from "../api/expenses";
import { getGroupMembers } from "../api/groups";
import { useParams } from "react-router-dom";

export function ExpensesPage() {

    const { groupId } = useParams()
    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState(0)
    const [participants, setParticipants] = useState([])
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [groupMembers , setGroupMembers] = useState([])

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await addExpense({ groupId, amount: Number(amount), description, splitType: "equal", participants, category })
            alert("Expense added successfully!")
            const res = await getExpenses(groupId)
            setExpenses(res.data)
            setAmount(0)
            setDescription('')
            setCategory('')
            setParticipants([])


        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong.')
        }
    }

    useEffect(() => {

        async function fetchExpenses() {
            const res = await getExpenses(groupId)
            setExpenses(res.data)
        }
        async function fetchGroupMembers() {
            const res = await getGroupMembers(groupId)
            setGroupMembers(res.data)
        }
        fetchGroupMembers()
        fetchExpenses()

    }, [groupId])


    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input value={description} type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input>
                    <input value={amount} type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />

                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="shopping">Shopping</option>
                        <option value="utilities">Utilities</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                    </select>

                    {groupMembers.map((m) => (
                        <label key={m._id}>
                            <input type="checkbox"
                                checked={participants.includes(m._id)}
                                onChange={() => {
                                    if (participants.includes(m._id)) {
                                        setParticipants(participants.filter(id => id !== m._id))
                                    } else {
                                        setParticipants([...participants, m._id])
                                    }
                                }}
                            ></input>
                            {m.name}
                        </label>
                    ))}
                    <button type="submit">Submit</button>
                </form>
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