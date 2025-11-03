import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function TodoList() {
    const [todos, setTodos] = useState([])

    useEffect(() => { fetchTodos() }, [])

    async function fetchTodos() {
        const res = await fetch('/api/todos')
        const data = await res.json()
        setTodos(data)
    }

    async function del(id) {
        if (!confirm('Delete this todo?')) return
        await fetch(`/api/todos/${id}`, { method: 'DELETE' })
        setTodos(t => t.filter(x => x.id !== id))
    }

    async function toggle(todo) {
        const updated = { ...todo, isDone: !todo.isDone }
        await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        })
        setTodos(t => t.map(x => x.id === todo.id ? updated : x))
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '').replace(':', '.')
    }

    return (
        <div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {todos.map(t => (
                    <li key={t.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 8,
                        background: '#f9f9f9'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={t.isDone}
                                onChange={() => toggle(t)}
                                style={{ marginRight: 8 }}
                            />
                            <strong style={{ textDecoration: t.isDone ? 'line-through' : 'none' }}>
                                {t.title}
                            </strong>
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            Created at: {formatDate(t.createdAt)}
                        </div>
                        <div style={{ marginTop: 6 }}>
                            <Link to={`/edit/${t.id}`} style={{ marginRight: 8 }}>Edit</Link>
                            <button onClick={() => del(t.id)}>Delete</button>
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            Created at: {formatDate(t.createdAt)}
                            {t.deadline && (
                                <div style={{ color: new Date(t.deadline) < new Date() ? 'red' : '#666' }}>
                                    Deadline: {formatDate(t.deadline)}
                                </div>
                            )}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}
