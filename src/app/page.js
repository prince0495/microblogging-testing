'use client'

import ContentPage from "@/components/ContentPage";
import HomeWrapper from "@/components/HomeWrapper";
import Navbar from "@/components/Navbar";
import RelevantPage from "@/components/RelevantPage";
import { useUserStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Home() {
  
  // const user = useUserStore(state => state.user);
  // const timeline = useUserStore(state => state.timeline);
  // const isLoading = useUserStore(state => state.isLoading);
  // const error = useUserStore(state => state.error);

  const setUser = useUserStore(state => state.setUser);
  const setTimeline = useUserStore(state => state.setTimeline);
  const setIsLoading = useUserStore(state => state.setIsLoading);
  const setError = useUserStore(state => state.setError);

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
            console.log('scope', userData.scopes, userData.scope);
            
            
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
        <HomeWrapper>
          <ContentPage />
        </HomeWrapper>

    </>
  );
}
