import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <>
      {/* ── Desktop sidebar (md and above) ── */}
      <div className='hidden md:block w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
          <NavLink
            className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
            to='/add'
          >
            <img className='w-5 h-5' src={assets.add_icon} alt='' />
            <p className='text-gray-800'>Add Items</p>
          </NavLink>

          <NavLink
            className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
            to='/list'
          >
            <img className='w-5 h-5' src={assets.order_icon} alt='' />
            <p>List Items</p>
          </NavLink>

          <NavLink
            className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
            to='/order'
          >
            <img className='w-5 h-5' src={assets.order_icon} alt='' />
            <p>Order Items</p>
          </NavLink>
        </div>
      </div>

      {/* ── Mobile bottom navigation bar (below md) ── */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center h-16'>
        <NavLink
          to='/add'
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'text-[#C586A5]' : 'text-gray-500'
            }`
          }
        >
          <img className='w-6 h-6' src={assets.add_icon} alt='' />
          <span>Add</span>
        </NavLink>

        <NavLink
          to='/list'
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'text-[#C586A5]' : 'text-gray-500'
            }`
          }
        >
          <img className='w-6 h-6' src={assets.order_icon} alt='' />
          <span>Products</span>
        </NavLink>

        <NavLink
          to='/order'
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'text-[#C586A5]' : 'text-gray-500'
            }`
          }
        >
          <img className='w-6 h-6' src={assets.order_icon} alt='' />
          <span>Orders</span>
        </NavLink>
      </nav>
    </>
  )
}

export default Sidebar
