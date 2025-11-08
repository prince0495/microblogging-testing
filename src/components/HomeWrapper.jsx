'use client'
import React, { useState } from 'react'
import Navbar from './Navbar';
import RelevantPage from './RelevantPage';

const HomeWrapper = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='relative h-full font-sans'>
        <Navbar onMenuToggle={toggleSidebar} />
        {children}
        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm  z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!isSidebarOpen}
          role="dialog"
        >
          <div className="flex justify-end p-2">
              <button
                onClick={toggleSidebar} 
                className="p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Close menu"
              >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
          </div>
          <div className='overflow-y-auto h-[calc(100%-3rem)] hide-scrollbar'>
              <RelevantPage/>
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 opacity-[0.43] bg-black z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
    </div>
  )
}

export default HomeWrapper
