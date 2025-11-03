import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function TodoForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [isDone, setIsDone] = useState(false)

    useEffect(() => {
        if (id) load()
    }, [id])

    async function load() {
        const res = await fetch(`/api/todos/${id}`)
        if (res.ok) {
            const data = await res.json()
            setTitle(data.title)
            setIsDone(data.isDone)
        }
    }

    async function submit(e) {
        e.preventDefault()
        const payload = { id: id ? Number(id) : 0, title, isDone }
        if (id) {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        } else {
            await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        }
        navigate('/')
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>Title</label><br />
                <input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={isDone} onChange={e => setIsDone(e.target.checked)} />
                    {' '}Done
                </label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </form>
    )
}
