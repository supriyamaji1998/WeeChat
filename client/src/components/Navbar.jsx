import React from 'react'
import { useStore } from '../store/useStore'
export default function Navbar() {
    const { count, increment } = useStore();
  return (
    <div>
      <nav className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">MyApp</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Welcome to MyApp</h1>
        <p className="mt-2">This is a simple application using React and DaisyUI.</p>
    </div>
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
    </div>
  )
}
