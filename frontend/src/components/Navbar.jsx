import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#fff',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <NavLink 
            to="/"
            style={({ isActive }) => ({
              color: isActive ? '#007bff' : '#333',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            })}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/expenses"
            style={({ isActive }) => ({
              color: isActive ? '#007bff' : '#333',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            })}
          >
            Expenses
          </NavLink>
        </div>
        <NavLink 
          to="/add-expense"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>+</span> Add Expense
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar 