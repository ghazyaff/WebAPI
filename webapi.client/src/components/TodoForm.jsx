import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function TodoForm() {
    const [title, setTitle] = useState('')
    const [isDone, setIsDone] = useState(false)
    const [deadline, setDeadline] = useState('') 
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            fetch(`/api/todos/${id}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title)
                    setIsDone(data.isDone)
                    setDeadline(data.deadline ? data.deadline.slice(0, 16) : '')
                })
        }
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        const todo = { title, isDone, deadline: deadline || null }
        const opts = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id ? { ...todo, id: parseInt(id) } : todo)
        }

        const url = id ? `/api/todos/${id}` : '/api/todos'
        await fetch(url, opts)
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
            <label>Title:</label>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <label style={{ marginTop: 10 }}>Deadline:</label>
            <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            {id && (
                <>
                    <label style={{ marginTop: 10 }}>Is Done:</label>
                    <input
                        type="checkbox"
                        checked={isDone}
                        onChange={e => setIsDone(e.target.checked)}
                    />
                </>
            )}

            <button type="submit" style={{ marginTop: 15 }}>
                {id ? 'Update Todo' : 'Create Todo'}
            </button>
        </form>
    )
}
