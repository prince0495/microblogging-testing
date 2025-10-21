'use client';

import { useState, useEffect } from 'react';

// --- UI Components ---

const LoadingScreen = () => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
    <p className="text-xl text-gray-300">Connecting to Mastodon...</p>
  </div>
);

const LoginScreen = () => (
  <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-md mx-auto">
    <h1 className="text-4xl font-bold mb-3 text-white">Mastodon WebClient</h1>
    <p className="text-lg text-gray-400 mb-8">A secure, server-side authenticated client built with Next.js.</p>
    <a 
      href="/api/auth/login"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
    >
      Login with Mastodon
    </a>
  </div>
);

const ProfileHeader = ({ user, onLogout }) => (
  <div className="bg-gray-800 p-5 rounded-xl shadow-lg mb-8 flex items-center">
    <img src={user.avatar_static} alt={user.display_name} className="w-20 h-20 rounded-full border-4 border-blue-500" />
    <div className="ml-5">
      <h2 className="text-2xl font-bold text-white">{user.display_name}</h2>
      <p className="text-gray-400">@{user.username}</p>
    </div>
    <button onClick={onLogout} className="ml-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105">
        Logout
    </button>
  </div>
);

const StatusPostForm = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await onPost(content);
      setContent('');
    } catch (error) {
      alert("Error: Could not post status.");
    } finally {
      setIsPosting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-5 rounded-xl shadow-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition-colors duration-300"
        rows="4"
        maxLength="500"
        required
      />
      <div className="flex justify-end items-center mt-3">
        <span className="text-gray-400 mr-4 text-sm">{500 - content.length} characters remaining</span>
        <button
          type="submit"
          disabled={isPosting || !content.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

const StatusCard = ({ status }) => (
  <div className="bg-gray-800 p-5 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.02]">
    <div className="flex items-center mb-4">
      <img src={status.account.avatar_static} alt={status.account.display_name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <p className="font-bold text-white">{status.account.display_name}</p>
        <p className="text-sm text-gray-400">@{status.account.acct}</p>
      </div>
    </div>
    <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: status.content }} />
  </div>
);


// --- The Main Page Component ---
export default function HomePage() {
  const [user, setUser] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This effect runs once when the component mounts to check the user's login status.
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
          // const timelineRes = await fetch(`${window.location.origin}/api/mastodon/v1/timelines/home?limit=20`);
          const timelineRes = await fetch(`${window.location.origin}/api/timelines?limit=20`);
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

  const handlePostStatus = async (statusText) => {
    // Call our proxy to post the status.
    // Construct an absolute URL to prevent parsing errors.
    const res = await fetch(`${window.location.origin}/api/mastodon/v1/statuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusText }),
    });
    if (!res.ok) {
        throw new Error('API returned an error');
    }
    // Refresh timeline with the new post by prepending it.
    const newStatus = await res.json();
    setTimeline([newStatus, ...timeline]);
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
           <div className="text-center text-red-500 bg-red-900/50 p-4 rounded-lg">{error}</div>
        ) : !user ? (
          <LoginScreen />
        ) : (
          <div>
            <ProfileHeader user={user} onLogout={handleLogout} />
            <StatusPostForm onPost={handlePostStatus} />
            <h3 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2 text-white">Home Timeline</h3>
            <div className="space-y-6">
              {timeline.map(status => <StatusCard key={status.id} status={status} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

