import { useState, useEffect } from "react";
import { getExpenses, addExpense } from "../api/expenses";
import { getGroupMembers } from "../api/groups";
import { useParams } from "react-router-dom";
import socket from '../socket'

export function ExpensesPage() {

    const { groupId } = useParams()
    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState(0)
    const [participants, setParticipants] = useState([])
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [splitType , setSplitType] = useState('equal')
    const [groupMembers , setGroupMembers] = useState([])

    async function handleSubmit(e) {
        e.preventDefault()
        try {

            let formatPart

            if(splitType === "equal"){
                formatPart = participants.map(p => p.userId)
            }else if(splitType === "exact"){
                formatPart = participants.map(p => ({userId : p.userId , amount : p.amount}))
            }else if(splitType === "percentage"){
                formatPart = participants.map(p => ({userId : p.userId , percentage : p.percentage}))
            }
            
            await addExpense({ groupId, amount: Number(amount), description, splitType, participants : formatPart, category })
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

    useEffect(() => {
    socket.emit('joinGroup', groupId);

    socket.on('expenseAdded', (newExpense) => {
        setExpenses(prev => [...prev, newExpense]);
    });

    socket.on('expenseDeleted', (deletedExpense) => {
        setExpenses(prev => prev.filter(e => e._id !== deletedExpense._id));
    });

    socket.on('expenseUpdated', (updatedExpense) => {
        setExpenses(prev => prev.map(e => e._id === updatedExpense._id ? updatedExpense : e));
    });

    return () => {
        socket.off('expenseAdded');
        socket.off('expenseDeleted');
        socket.off('expenseUpdated');
    };
}, [groupId]);

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

                    <select value={splitType} onChange={(e) => setSplitType(e.target.value)}> 
                        <option value="equal">Equal</option>
                        <option value="exact">Exact</option>
                        <option value="percentage">Percentage</option>
                    </select>

                    {groupMembers.map((m) => {
                        const isSelected = participants.some(p => p.userId === m._id)
                        return(
                            <div key={m._id}>
                                <label>
                                    <input type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                            if (participants.some(p => p.userId === m._id)) {
                                                setParticipants(participants.filter(p => p.userId !== m._id))
                                            } else {
                                                setParticipants([...participants,{ userId :  m._id , amount : 0 , percentage : 0}])
                                            }
                                        }}
                                    ></input>
                                    {m.name}
                                </label>

                                {isSelected && splitType === "exact" && (
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={participants.find(p => p.userId === m._id).amount}
                                        onChange={(e) =>{
                                            setParticipants(participants.map(p =>
                                                p.userId === m._id ? {...p , amount : Number(e.target.value)} : p
                                            ))
                                        }}
                                    ></input>
                                )}

                                {isSelected && splitType === "percentage" && (
                                    <input
                                        type="number"
                                        placeholder="Percentage"
                                        value={participants.find(p => p.userId === m._id).percentage}
                                        onChange={(e) =>{
                                            setParticipants(participants.map(p =>
                                                p.userId === m._id ? {...p , percentage : Number(e.target.value)} : p
                                            ))
                                        }}
                                    ></input>
                                )}
                            </div>
                            
                        )
                    })}
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