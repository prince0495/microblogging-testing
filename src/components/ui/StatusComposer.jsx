// components/StatusComposer.js

import { useUserStore } from '@/lib/store';
import axios from 'axios';
import { useState } from 'react';


export default function StatusComposer() {
  const [statusText, setStatusText] = useState('');
  const [postType, setPostType] = useState('normal'); // 'normal' or 'stream'
  const [visibility, setVisibility] = useState('public'); // 'public', 'unlisted', 'private', 'direct'
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [scheduleTime, setScheduleTime] = useState('');

  const user = useUserStore(state=>state.user);
  
  const addTimeline = useUserStore(state=>state.addTimeline);

  const handleFileChange = (event) => {
    // Mastodon usually allows up to 4 media attachments.
    if (event.target.files.length > 4) {
      setError('You can only attach a maximum of 4 files.');
      setMediaFiles([]);
      return;
    }
    setError('');
    setMediaFiles(Array.from(event.target.files));
    console.log(Array.from(event.target.files)[0]);
    
  };

  const handlePostStatus = async (e) => {
    e.preventDefault();
    if(postType === 'stream' && new Date(scheduleTime) < new Date) {
      alert('Please select a date in future');
    }
    if (statusText.trim() === '' && mediaFiles.length === 0) {
      setError('You must add some text or attach a file.');
      return;
    }
    
    
    setIsSubmitting(true);
    setError('');

    // We use FormData to send files and text together.
    const formData = new FormData();
    formData.append('status', statusText);
    formData.append('postType', postType);
    formData.append('visibility', visibility);
    formData.append('userId', user?.id);

    // Append stream-specific data if the post type is 'stream'
    if (postType === 'stream') {
      formData.append('price', price);
      formData.append('currency', currency);
      formData.append('scheduleTime', scheduleTime);
    }

    mediaFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      console.log(formData);
      
      const res = await axios.post('/api/create-status', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('resdata');
      
      console.log(res.data);
      
      if(res.data?.status) {
        const newStatus = await res.data?.status;
        if(addTimeline) {
          addTimeline(newStatus);
        }
      }
      else {
        throw new Error('API returned an error');
      }
      
      // Reset form
      setStatusText('');
      setPostType('normal');
      setVisibility('public');
      setMediaFiles([]);
      // Reset new stream-specific fields
      setPrice('');
      setCurrency('INR');
      setScheduleTime('');
      // Clear the file input visually
      if (document.getElementById('media-upload-input')) {
        document.getElementById('media-upload-input').value = '';
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePostStatus} className=" p-4 rounded-lg border border-gray-700 text-white space-y-4">
      {/* Status Text Area */}
      <textarea
        value={statusText}
        onChange={(e) => setStatusText(e.target.value)}
        placeholder="What's happening?"
        className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        rows="4"
      />

      {/* Media Previews (Optional but good UX) */}
      {mediaFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {mediaFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt="media preview" className="w-24 h-24 object-cover rounded-md" />
          ))}
        </div>
      )}

      {/* Controls and Options */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left-side controls: Media and Post Type */}
        <div className="flex items-center gap-4">
          <label htmlFor="media-upload-input" className="cursor-pointer text-blue-400 hover:text-blue-300">
            📎 Attach Media
            <input
              id="media-upload-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <div className="flex items-center gap-2">
            <label>Type:</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="stream">Stream Announcement</option>
            </select>
          </div>
        </div>

        {/* Right-side controls: Visibility and Submit */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label>Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Followers-only</option>
              <option value="direct">Direct</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* --- ADDED: Conditionally Rendered Stream Options --- */}
      {postType === 'stream' && (
        <div className="bg-gray-800 p-3 rounded-lg space-y-3 border border-gray-600">
          <div className="flex flex-wrap items-center gap-4">
            {/* Price Input */}
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <label htmlFor="price" className="font-semibold">Price:</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 10"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            
            {/* Currency Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="currency">Currency:</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          
          {/* Schedule Time Input */}
          <div className="flex items-center gap-2">
            <label htmlFor="scheduleTime" className="font-semibold">Schedule for:</label>
            <input
              id="scheduleTime"
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>
        </div>
      )}
      {/* --- END of ADDED section --- */}
      
      {/* "Who can repost" is controlled by visibility. This note clarifies it for the user. */}
      <p className="text-xs text-gray-400">
        Note: Reposting is limited by visibility. 'Followers-only' restricts interactions to your followers.
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}