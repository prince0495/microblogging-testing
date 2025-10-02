// const RelevantPage = () => {
//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Details Panel</h2>
//             <p className="text-gray-700">
//                 This sidebar is always visible on desktop. On mobile, it appears as a drawer. The content inside it can scroll independently if it overflows.
//             </p>
            
//         </div>
//     )
// }
// export default RelevantPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';


// --- DUMMY DATA PROVIDED IN THE PROMPT ---
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

// --- COMPONENTS ---

// A reusable container for the sidebar sections
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

// Component for a single suggested account item
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

// Component for a single trending tag item
const TrendItem = ({ trend }) => (
  <li className="px-4 py-3 transition-colors duration-200 hover:bg-neutral-800/50">
    <div className="flex justify-between items-center">
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
);


const RelevantPage = () => {
  const [tags, setTags] = useState([])

  useEffect(() => {
    (async() => {
      const response = await axios.get('https://mastodon.social/api/v1/trends/tags');
      if(response.data) {
        setTags(response.data)
      }
    })()
  }, [])
  

  return (
    // This container is designed to be placed in a sidebar layout.
    // It's sticky so it remains visible on scroll.
    <aside className="sticky top-20 space-y-6">
      
      {/* "Who to follow" Card */}
      <SidebarCard title="Who to follow">
        <ul>
          {DUMMY_SUGGESTED_ACCOUNTS.map(account => (
            <AccountItem key={account.id} account={account} />
          ))}
        </ul>
      </SidebarCard>

      {/* "Trends for you" Card */}
      <SidebarCard title="Trends for you">
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
