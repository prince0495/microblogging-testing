'use client'

import ContentPage from "@/components/ContentPage";
import HomeWrapper from "@/components/HomeWrapper";
import { useUserStore } from "@/lib/store";
import { useEffect } from "react";

export default function Home() {
  const setUser = useUserStore(state => state.setUser);
  const setTimeline = useUserStore(state => state.setTimeline);
  const setIsLoading = useUserStore(state => state.setIsLoading);
  const setError = useUserStore(state => state.setError);

  useEffect(() => {
      const checkAuthAndFetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const userRes = await fetch(`${window.location.origin}/api/mastodon/v1/accounts/verify_credentials`);
          
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
            console.log(userData);
            console.log('scope', userData.scopes, userData.scope);

            const timelineRes = await fetch(`${window.location.origin}/api/timelines?limit=20`);
            if (timelineRes.ok) {
              const timelineData = await timelineRes.json();
              setTimeline(timelineData);
              console.log('timelines',  timelineData);
              
            } else {
              throw new Error('Could not fetch timeline.');
            }
          } else {
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
