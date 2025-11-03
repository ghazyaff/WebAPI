import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import StatsPage from './components/StatsPage'

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
                <h1>Todos</h1>
                <nav>
                    <Link to="/">List</Link> | <Link to="/new">New</Link> | <Link to="/stats">Stats</Link>
                    
                </nav>
                <Routes>
                    <Route path="/" element={<TodoList />} />
                    <Route path="/new" element={<TodoForm />} />
                    <Route path="/edit/:id" element={<TodoForm />} />
                    <Route path="/stats" element={<StatsPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
