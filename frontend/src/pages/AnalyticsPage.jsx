import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSpendingByCategory, getSpendingByPerson } from "../api/expenses";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import './AnalyticsPage.css';

const COLORS = ['#fb923c', '#2dd4bf', '#818cf8', '#f472b6', '#facc15', '#4ade80', '#94a3b8']

export function AnalyticsPage() {
    const { groupId } = useParams()
    const [categoryData, setCategoryData] = useState([])
    const [personData, setPersonData] = useState([])

    useEffect(() => {
        async function fetchCategory() {
            const res = await getSpendingByCategory(groupId)
            const formatted = Object.entries(res.data).map(([category, amount]) => ({
                name: category,
                value: Number(amount.toFixed(2))
            }))
            setCategoryData(formatted)
        }
        async function fetchPerson() {
            const res = await getSpendingByPerson(groupId)
            const formatted = Object.values(res.data).map((entry) => ({
                name: entry.name,
                total: Number(entry.total.toFixed(2))
            }))
            setPersonData(formatted)
        }
        fetchCategory()
        fetchPerson()
    }, [groupId])

    return (
        <>
            <div className="overview-section">
                <h3>Spending by category</h3>
                {categoryData.length === 0 ? (
                    <div className="empty-state">No expense data yet.</div>
                ) : (
                    <div className="chart-card">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="overview-section">
                <h3>Spending by person</h3>
                {personData.length === 0 ? (
                    <div className="empty-state">No expense data yet.</div>
                ) : (
                    <div className="chart-card">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={personData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f1ee" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#fb923c" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </>
    )
}