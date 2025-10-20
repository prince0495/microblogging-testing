"use client"
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = ({ onMenuToggle }) => {
  const user = useUserStore(state => state.user);
  const timeline = useUserStore(state => state.timeline);
  const isLoading = useUserStore(state => state.isLoading);
  const error = useUserStore(state => state.error);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const handleProfileClick = () => {
    console.log("Profile clicked");
    setIsDropdownOpen(false);
    router.push('/profile')
  };

  const handleLogoutClick = () => {
    window.location.href = '/api/auth/logout';
    setIsDropdownOpen(false);
  };
  

  return (
    <header className='sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 bg-neutral-900/60 backdrop-blur-lg border-b border-neutral-700/50'>
      <div className="mx-auto flex h-16 items-center justify-between">
        
        {/* Left Column: Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className='w-16 h-16 rounded-full bg-cover'>
            <img src="/logo.png" alt="logo" />
          </div>
          <h1 className="sm:block text-2xl font-bold text-gray-100"
             onClick={() => {
              router.push('/');
             }}
          >
            MicroBlog
          </h1>
        </div>

        {/* Center Column: Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full py-2.5 pl-12 pr-4 bg-neutral-800/70 border border-neutral-700 text-gray-200 placeholder:text-neutral-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-3 relative">
            {isLoading ? (
              // Skeleton while loading
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-neutral-700"></div>
                <div className="h-4 w-24 bg-neutral-700 rounded"></div>
              </div>
            ) : user ? (
              // User logged in with dropdown
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="focus:outline-none"
                >
                  <img
                    src={user.avatar_static || "https://placehold.co/40x40/111111/FFFFFF?text=U"}
                    alt={user.display_name || "User Avatar"}
                    className="w-10 h-10 rounded-full border-2 border-neutral-600 hover:border-gray-300 transition-all duration-300 hover:cursor-pointer"
                  />
                </button>
                <span className="text-gray-200 font-medium">
                  {user.display_name || user.username}
                </span>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 z-50 ">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-neutral-700 transition hover:cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-500 transition hover:cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // No user, show Sign In button
              <a
                href="/api/auth/login"
                className="px-4 py-2 bg-[#288fd2] hover:bg-[#1560a1] text-white font-semibold rounded-lg shadow-sm transition-all duration-300"
              >
                Sign In
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-neutral-300 hover:bg-neutral-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;


// export default Navbar;

