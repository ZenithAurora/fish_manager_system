import { Outlet } from 'react-router-dom'
import FooterNav from './components/FooterNav'

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <FooterNav />
    </div>
  )
}

export default App
