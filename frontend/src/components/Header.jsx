import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const mobileNavBase = 'flex flex-col items-center justify-center gap-1 text-xs font-medium px-3 py-2 rounded-xl transition'

  const mobileNavClass = ({ isActive }) =>
    `${mobileNavBase} ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:text-emerald-700'}`

  return (
    <>
      <header className="bg-white/90 backdrop-blur sticky top-0 z-30 border-b border-gray-200">
        <div className="container h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-600 grid place-items-center text-white font-bold">EB</div>
            <span className="text-lg sm:text-xl font-semibold truncate">Eco Basket</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <Link to="/cart" className="hover:text-emerald-700">Cart</Link>
            {user && <Link to="/orders" className="hover:text-emerald-700">Orders</Link>}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Hi, <span className="font-medium">{user.name}</span></span>
                <button className="btn btn-outline" onClick={() => { signOut(); navigate('/signin') }}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-outline">Sign in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <button
                className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 text-sm font-semibold"
                onClick={() => { signOut(); navigate('/signin') }}
              >
                Sign out
              </button>
            ) : (
              <Link to="/signin" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur px-3 py-2">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <NavLink to="/" className={mobileNavClass}>
            <span>Home</span>
          </NavLink>
          <NavLink to="/cart" className={mobileNavClass}>
            <span>Cart</span>
          </NavLink>
          <NavLink to="/orders" className={mobileNavClass}>
            <span>Orders</span>
          </NavLink>
        </div>
      </nav>
    </>
  )
}
