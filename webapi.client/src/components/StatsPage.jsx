import { useEffect, useState } from 'react'

export default function StatsPage() {
    const [count, setCount] = useState(0)
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [countRes, todosRes] = await Promise.all([
                    fetch('https://localhost:7243/api/todos/count'),
                    fetch('https://localhost:7243/api/todos')
                ])
                const countData = await countRes.json()
                const todosData = await todosRes.json()
                setCount(countData)
                setTodos(todosData)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div style={{ padding: 20 }}>
            <h2>Todo Statistics</h2>
            <p>Total Todos: <strong>{count}</strong></p>
            <hr />
            <h3>Created Todos</h3>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title} {''}
                        {new Date(todo.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).replace(',', '').replace(':', '.')}
                    </li>
                ))}
            </ul>
        </div>
    )
}
