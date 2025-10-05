'use client'

import ContentPage from "@/components/ContentPage";
import Navbar from "@/components/Navbar";
import RelevantPage from "@/components/RelevantPage";
import { useUserStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Home() {
  
  const user = useUserStore(state => state.user);
  const timeline = useUserStore(state => state.timeline);
  const isLoading = useUserStore(state => state.isLoading);
  const error = useUserStore(state => state.error);

  const setUser = useUserStore(state => state.setUser);
  const setTimeline = useUserStore(state => state.setTimeline);
  const setIsLoading = useUserStore(state => state.setIsLoading);
  const setError = useUserStore(state => state.setError);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar's open/closed state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
      const checkAuthAndFetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // We call our OWN API proxy, not Mastodon directly.
          // Construct an absolute URL to prevent parsing errors.
          const userRes = await fetch(`${window.location.origin}/api/mastodon/v1/accounts/verify_credentials`);
          
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
            console.log(userData);
            
            // If user is logged in, fetch their timeline.
            // Construct an absolute URL to prevent parsing errors.
            const timelineRes = await fetch(`${window.location.origin}/api/mastodon/v1/timelines/home?limit=20`);
            if (timelineRes.ok) {
              const timelineData = await timelineRes.json();
              setTimeline(timelineData);
              console.log('timelines',  timelineData);
              
            } else {
              throw new Error('Could not fetch timeline.');
            }
          } else {
            // If verify_credentials fails, it means the user is not logged in.
            setUser(null);
            setTimeline([]);
          }
        } catch (e) {
          console.error("Initialization error:", e);
          setError('Failed to connect to the server. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      checkAuthAndFetchData();
    }, []);

  return (
    <>
      <div className='relative h-full font-sans'>
        {/* The Navbar is always rendered and receives the toggle function */}
        <Navbar onMenuToggle={toggleSidebar} />

        {/* The main content area */}
        <ContentPage />

        {/* Mobile Sidebar (Drawer) */}
        {/* This section is only for mobile and appears as an overlay */}
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

        {/* Overlay for when mobile sidebar is open, clicking it closes the sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 opacity-[0.43] bg-black z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
}
