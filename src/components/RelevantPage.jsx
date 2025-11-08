import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/lib/store';

const DUMMY_SUGGESTED_ACCOUNTS = [
  { "id": "1", "display_name": "Casey Smith", "username": "caseysmith", "acct": "caseysmith@stream.hub", "avatar": "https://randomuser.me/api/portraits/women/75.jpg" },
  { "id": "2", "display_name": "Alex Vision", "username": "alexvision", "acct": "alexvision@stream.hub", "avatar": "https://randomuser.me/api/portraits/men/32.jpg" },
  { "id": "3", "display_name": "RetroGamerJess", "username": "retrogamerjess", "acct": "retrogamerjess@stream.hub", "avatar": "https://randomuser.me/api/portraits/women/44.jpg" },
];

const DUMMY_TRENDING_TAGS = [
    { "id": "353414", "name": "SilentSunday", "url": "https://mastodon.social/tags/silentsunday", "posts": "5.4k" },
    { "id": "353415", "name": "TechLaunch", "url": "https://mastodon.social/tags/techlaunch", "posts": "3.1k" },
    { "id": "353416", "name": "IndieDev", "url": "https://mastodon.social/tags/indiedev", "posts": "2.8k" },
    { "id": "353417", "name": "PhotoOfTheDay", "url": "https://mastodon.social/tags/photooftheday", "posts": "1.9k" },
];

const SidebarCard = ({ title, children }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
    <h2 className="text-xl font-bold text-gray-100 px-4 py-3">{title}</h2>
    {children}
    <div className="px-4 py-3">
      <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
        Show more
      </a>
    </div>
  </div>
);

const AccountItem = ({ account }) => (
  <li className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-200 hover:bg-neutral-800/50">
    <div className="flex items-center gap-3">
      <img src={account.avatar} alt={account.display_name} className="w-10 h-10 rounded-full bg-neutral-700" />
      <div>
        <p className="font-semibold text-gray-100 leading-tight">{account.display_name}</p>
        <p className="text-sm text-neutral-400 leading-tight">@{account.username}</p>
      </div>
    </div>
    <button className="px-4 py-1.5 text-sm font-semibold bg-white text-black rounded-full transition-colors duration-200 hover:bg-neutral-200">
      Follow
    </button>
  </li>
);

const TrendItem = ({ trend }) => {
  const setTimeline = useUserStore(state=>state.setTimeline);
  
  const handleClick = async() => {
     const res = await axios.get(`https://mastodon.social/api/v1/timelines/tag/${trend.name}?limit=20`);
     if(res.data?.length > 0) {
        setTimeline(res.data)
     }
  }
  
  return(
  <li className="px-4 py-3 transition-colors duration-200 hover:bg-neutral-800/50">
    <div className="flex justify-between items-center"
       onClick={handleClick}
    >
        <div>
            <p className="text-sm text-neutral-400">Trending</p>
            <p className="font-bold text-gray-100">#{trend.name}</p>
            <p className="text-sm text-neutral-400">{trend.history.length || 0} k posts</p>
        </div>
        <button className="text-neutral-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
    </div>
  </li>
)};


const RelevantPage = () => {
  const [tags, setTags] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async() => {
      const response = await axios.get('https://mastodon.social/api/v1/trends/tags');      
      if(response.data) {
        setTags(response.data)
      }
    })()
  }, [])
  const setTimeline = useUserStore(state=>state.setTimeline);
  
  const fetchStatusWithTrend = async(trend) => {
     const res = await axios.get(`https://mastodon.social/api/v1/timelines/tag/${trend}?limit=20`);
     if(res.data?.length > 0) {
        setTimeline(res.data)
     }
  }

  return (
    <aside className="sticky top-20 space-y-6">
      
      <SidebarCard title="Who to follow">
        <ul>
          {DUMMY_SUGGESTED_ACCOUNTS.map(account => (
            <AccountItem key={account.id} account={account} />
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="Trends for you">

        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <input
                      type="text"
                      placeholder="Search Trends, e.g., Trading"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-800 text-gray-100 rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow duration-200"
                  />
                  {searchQuery && (
                      <button 
                          onClick={async() => {
                            const timelineRes = await fetch(`${window.location.origin}/api/timelines?limit=20`);
                            if (timelineRes.ok) {
                              const timelineData = await timelineRes.json();
                              setTimeline(timelineData);
                              
                            } else {
                              throw new Error('Could not fetch timeline.');
                            }
                            setSearchQuery('')
                          }} 
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white transition-colors duration-200"
                          aria-label="Clear search"
                      >
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                  )}
              </div>
              <button
                  onClick={() => {
                    fetchStatusWithTrend(searchQuery)
                  }}
                  className="flex-shrink-0 bg-sky-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  aria-label="Search"
              >
                  Search
              </button>
          </div>
      </div>
         <ul>
            {tags.map(tag => (
                <TrendItem key={tag.id} trend={tag} />
            ))}
        </ul>
      </SidebarCard>

    </aside>
  );
};

export default RelevantPage;
