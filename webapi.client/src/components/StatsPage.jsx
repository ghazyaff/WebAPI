import { useEffect, useState } from 'react'

export default function StatsPage() {
    const [count, setCount] = useState(0)
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [countRes, todosRes] = await Promise.all([
                    fetch('https://localhost:7243/api/todos/count'), // adjust backend port if needed
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

    // helper to format date in dd/MM/yyyy HH.mm
    function formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '').replace(':', '.')
    }

    // classify todos
    const finishedTodos = todos.filter(t => t.isDone)
    const unfinishedTodos = todos.filter(t => !t.isDone)
    const overdueTodos = todos.filter(
        t => !t.isDone && t.deadline && new Date(t.deadline) < new Date()
    )

    return (
        <div style={{ padding: 20 }}>
            <h2>Todo Statistics</h2>
            <p>Total Todos: <strong>{count}</strong></p>
            <hr />

            <h3>Created Todos</h3>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title} — {formatDate(todo.createdAt)}
                        {todo.deadline && (
                            <span style={{ marginLeft: 10, color: new Date(todo.deadline) < new Date() && !todo.isDone ? 'red' : '#666' }}>
                                (Deadline: {formatDate(todo.deadline)}
                                {new Date(todo.deadline) < new Date() && !todo.isDone ? '  Overdue' : ''}
                                )
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            <hr />

            <h3>Classification</h3>
            <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
                {/* Finished */}
                <div>
                    <h4> Finished ({finishedTodos.length})</h4>
                    {finishedTodos.length > 0 ? (
                        <ul>
                            {finishedTodos.map(t => (
                                <li key={t.id}>
                                    {t.title} — {formatDate(t.createdAt)}
                                    {t.deadline && (
                                        <span style={{ marginLeft: 10 }}>
                                            (Deadline: {formatDate(t.deadline)})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No finished todos yet.</p>
                    )}
                </div>

                {/* Not Finished */}
                <div>
                    <h4> Not Finished ({unfinishedTodos.length})</h4>
                    {unfinishedTodos.length > 0 ? (
                        <ul>
                            {unfinishedTodos.map(t => (
                                <li key={t.id}>
                                    {t.title} — {formatDate(t.createdAt)}
                                    {t.deadline && (
                                        <span
                                            style={{
                                                marginLeft: 10,
                                                color: new Date(t.deadline) < new Date() ? 'red' : '#666'
                                            }}
                                        >
                                            (Deadline: {formatDate(t.deadline)}
                                            {new Date(t.deadline) < new Date()
                                                ? '  Overdue'
                                                : ''}
                                            )
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>All todos are done!</p>
                    )}
                </div>

                {/* Overdue */}
                <div>
                    <h4 style={{ color: 'red' }}> Overdue ({overdueTodos.length})</h4>
                    {overdueTodos.length > 0 ? (
                        <ul>
                            {overdueTodos.map(t => (
                                <li key={t.id}>
                                    {t.title} — {formatDate(t.createdAt)}
                                    <span style={{ marginLeft: 10, color: 'red' }}>
                                        (Deadline: {formatDate(t.deadline)})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No overdue todos. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
