import React, { useState, useEffect } from 'react';
import { Settings, Edit2, UserCheck, AtSign, Calendar, FileText, Lock, Globe, Search, Link as LinkIcon, EyeOff, Bot, Server, X, Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';
import { PostCard } from './BlogsPage';

const DUMMY_FOLLOWERS = [
  { id: "1020382", username: "atul13061987", acct: "atul13061987", display_name: "Atul", avatar_static: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "1020381", username: "linuxliner", acct: "linuxliner", display_name: "Linux Liner", avatar_static: "https://randomuser.me/api/portraits/women/11.jpg" },
  { id: "963411", username: "randomdev", acct: "randomdev", display_name: "Dev Random", avatar_static: "https://randomuser.me/api/portraits/men/33.jpg" },
];

const DUMMY_FOLLOWING = [
  { id: "963410", username: "gautambhatia", acct: "gautambhatia", display_name: "Gautam Bhatia", avatar_static: "https://randomuser.me/api/portraits/men/55.jpg" },
  { id: "1007400", username: "seafrog", acct: "seafrog@glitterkitten.co.uk", display_name: "Heck Partridge", avatar_static: "https://randomuser.me/api/portraits/women/21.jpg" }
];

const formatCount = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date(dateString));
};

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 shadow-lg">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
      {icon} {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const UserListItem = ({ user }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 transition-all duration-200 hover:border-sky-500 hover:bg-neutral-800">
    <div className="flex items-center gap-3">
      <img src={user.avatar_static} alt={user.display_name || user.username} className="w-10 h-10 rounded-full bg-neutral-700" />
      <div>
        <p className="font-semibold text-gray-100 leading-tight">{user.display_name || user.username}</p>
        <p className="text-sm text-neutral-400 leading-tight">@{user.acct}</p>
      </div>
    </div>
    <button className="px-4 py-1.5 text-sm font-semibold bg-neutral-700 text-white border border-neutral-600 rounded-full transition-colors duration-200 hover:bg-red-500 hover:border-red-500">
      Unfollow
    </button>
  </div>
);

const SkeletonUserListItem = () => (
    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
        <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse"></div>
        <div className="flex-grow">
            <div className="h-4 w-2/4 rounded bg-neutral-700 animate-pulse mb-2"></div>
            <div className="h-3 w-1/4 rounded bg-neutral-700 animate-pulse"></div>
        </div>
    </div>
);

const EditProfileModal = ({ account, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        display_name: account.display_name || '',
        note: account.note || '',
        locked: account.locked || false,
        bot: account.bot || false,
        discoverable: account.discoverable || false,
        hide_collections: account.hide_collections || false,
        indexable: account.indexable ?? true,
    });
    const [fields, setFields] = useState(account.fields || []);
    const [avatarFile, setAvatarFile] = useState(null);
    const [headerFile, setHeaderFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(account.avatar);
    const [headerPreview, setHeaderPreview] = useState(account.header);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);
            if (name === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(previewUrl);
            } else if (name === 'header') {
                setHeaderFile(file);
                setHeaderPreview(previewUrl);
            }
        }
    };

    const handleFieldChange = (index, e) => {
        const newFields = [...fields];
        newFields[index][e.target.name] = e.target.value;
        setFields(newFields);
    };

    const addField = () => setFields([...fields, { name: '', value: '' }]);
    const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const submissionData = new FormData();

        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        
        if (avatarFile) submissionData.append('avatar', avatarFile);
        if (headerFile) submissionData.append('header', headerFile);

        fields.forEach((field, index) => {
            submissionData.append(`fields_attributes[${index}][name]`, field.name);
            submissionData.append(`fields_attributes[${index}][value]`, field.value);
        });
        
        await onSave(submissionData);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-24">
                            <label htmlFor="avatar-upload" className="block text-sm font-medium text-neutral-300 mb-2">Avatar</label>
                            <div className="relative group">
                                <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover"/>
                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <UploadCloud size={24} />
                                </label>
                            </div>
                            <input id="avatar-upload" name="avatar" type="file" onChange={handleFileChange} className="sr-only" accept="image/*" />
                        </div>
                        <div className="flex-1">
                             <label htmlFor="header-upload" className="block text-sm font-medium text-neutral-300 mb-2">Header</label>
                            <div className="relative group">
                                <img src={headerPreview} alt="Header Preview" className="w-full h-24 rounded-lg object-cover bg-neutral-800"/>
                                <label htmlFor="header-upload" className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <UploadCloud size={24} />
                                </label>
                            </div>
                            <input id="header-upload" name="header" type="file" onChange={handleFileChange} className="sr-only" accept="image/*"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="display_name" className="block text-sm font-medium text-neutral-300 mb-1">Display Name</label>
                        <input type="text" name="display_name" id="display_name" value={formData.display_name} onChange={handleInputChange} className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                     <div>
                        <label htmlFor="note" className="block text-sm font-medium text-neutral-300 mb-1">Bio</label>
                        <textarea name="note" id="note" value={formData.note} onChange={handleInputChange} rows="4" className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                    
                    <div>
                         <h3 className="text-lg font-semibold mb-2">Profile Metadata</h3>
                         <div className="space-y-3">
                             {fields.map((field, index) => (
                                 <div key={index} className="flex items-center gap-2">
                                     <input type="text" name="name" placeholder="Label" value={field.name} onChange={(e) => handleFieldChange(index, e)} className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2"/>
                                     <input type="text" name="value" placeholder="Content" value={field.value} onChange={(e) => handleFieldChange(index, e)} className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2"/>
                                     <button type="button" onClick={() => removeField(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><Trash2 size={18}/></button>
                                 </div>
                             ))}
                         </div>
                         <button type="button" onClick={addField} className="mt-3 flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
                             <Plus size={16}/> Add Field
                         </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg"><span className="font-medium">Require follow requests</span><input type="checkbox" name="locked" checked={formData.locked} onChange={handleInputChange} className="toggle"/></label>
                        <label className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg"><span className="font-medium">This is a bot account</span><input type="checkbox" name="bot" checked={formData.bot} onChange={handleInputChange} className="toggle"/></label>
                        <label className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg"><span className="font-medium">Suggest account to others</span><input type="checkbox" name="discoverable" checked={formData.discoverable} onChange={handleInputChange} className="toggle"/></label>
                        <label className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg"><span className="font-medium">Hide your network</span><input type="checkbox" name="hide_collections" checked={formData.hide_collections} onChange={handleInputChange} className="toggle"/></label>
                        <label className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg"><span className="font-medium">Index profile and posts</span><input type="checkbox" name="indexable" checked={formData.indexable} onChange={handleInputChange} className="toggle"/></label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-full font-semibold border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-full font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors flex items-center gap-2 disabled:bg-sky-800 disabled:cursor-not-allowed">
                            {isSaving ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProfilePage = ({ account: initialAccount, userId }) => {
  const [account, setAccount] = useState(initialAccount);
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState('posts'); // 'posts', 'followers', or 'following'
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => { setAccount(initialAccount) }, [initialAccount]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 800)); 
      if (activeView === 'followers') {
        setFollowers(DUMMY_FOLLOWERS);
      } else if (activeView === 'following') {
        setFollowing(DUMMY_FOLLOWING);
      }
      setIsLoading(false);
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const timelineRes = await axios.get(`/api/user/statuses?userId=${userId}`);
            if(timelineRes.data?.statuses) {
                setUserPosts(timelineRes.data.statuses);
            }
        } catch (error) {
            console.error("Failed to fetch user posts:", error);
        }
        setIsLoading(false);
    };

    if ((activeView === 'followers' && followers.length === 0) || (activeView === 'following' && following.length === 0)) {
      fetchData();
    }
    else if(activeView === 'posts') {
      fetchPosts();
    }
  }, [activeView, followers.length, following.length, userId]);

  const handleProfileUpdate = async (formData) => {
    try {
        const response = await axios.patch('/api/user/updateProfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        
        if(response.data?.updatedAccount) {
          setAccount(response.data.updatedAccount);
        }
        else {
          console.log(response.data);
          
        }
        setIsEditing(false);

    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Error updating profile. Please try again.");
    }
  };

  if (!account) return <div className="bg-neutral-950 text-center py-20">Loading profile...</div>;

  return (
    <>
      {isEditing && <EditProfileModal account={account} onClose={() => setIsEditing(false)} onSave={handleProfileUpdate} />}

      <div className="min-h-screen bg-neutral-950 text-gray-100 font-sans antialiased relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
          <div className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${account.header || 'https://via.placeholder.com/1500x500/1e293b/475569?text=Your+Header'})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </div>

            <div className="p-6 relative -mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <img
                    src={account.avatar || 'https://via.placeholder.com/150/0f172a/64748b?text=You'}
                    alt={account.display_name || account.username}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-neutral-800 object-cover shadow-lg"
                  />
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                      {account.display_name || account.username}
                    </h1>
                    <p className="text-sky-400 text-lg flex items-center">
                      <AtSign size={18} className="mr-2" />
                      {account.acct}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button onClick={() => setIsEditing(true)} className="flex-grow sm:flex-grow-0 px-5 py-2 rounded-full font-semibold bg-white text-black hover:bg-neutral-200 transition-colors duration-200 flex items-center justify-center">
                    <Edit2 size={16} className="mr-2" /> Edit Profile
                  </button>
                  <button className="px-3 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors duration-200">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-6 text-neutral-300">
                {account.note ? (
                  <p dangerouslySetInnerHTML={{ __html: account.note }}></p>
                ) : (
                  <p className="italic text-neutral-500">You haven't added a bio yet. Click 'Edit Profile' to add one!</p>
                )}
              </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {account.emojis?.length > 0 && account.emojis.map(emoji => (
                        <img key={emoji.shortcode} src={emoji.url} alt={emoji.shortcode} className="h-6 w-6" title={`:${emoji.shortcode}:`} />
                    ))}
                    {account.roles?.length > 0 && account.roles.map(role => (
                        <span key={role.id} className="text-xs font-semibold bg-sky-800 text-sky-200 px-2 py-1 rounded-full">{role.name}</span>
                    ))}
                </div>
            </div>

            <div className="flex border-t border-neutral-800">
              {['posts', 'following', 'followers'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex-1 text-center py-4 px-2 transition-colors duration-200 ${activeView === view ? 'text-white border-b-2 border-sky-500 bg-sky-500/10' : 'text-neutral-400 hover:bg-neutral-800/50'}`}
                >
                  <span className="font-bold text-lg">{formatCount(account[`${view === 'posts' ? 'statuses' : view}_count`])}</span>
                  <span className="block text-sm capitalize">{view}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[200px]">
              {activeView === 'posts' && (
                  <div>
                      {isLoading ? (
                           <div className="text-center py-10 text-neutral-500">Loading posts...</div>
                      ) : userPosts.length > 0 ? (
                          userPosts.map((post) => <PostCard key={post.id} post={post} />)
                      ) : (
                          <div className="text-center py-10 text-neutral-500">You haven't made any posts yet.</div>
                      )}
                  </div>
              )}
              {(activeView === 'followers' || activeView === 'following') && (
                  <div className="space-y-3">
                      {isLoading ? (
                          Array.from({ length: 3 }).map((_, i) => <SkeletonUserListItem key={i} />)
                      ) : (
                          (activeView === 'followers' ? followers : following).map(user => <UserListItem key={user.id} user={user} />)
                      )}
                  </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <InfoCard title="About You" icon={<UserCheck size={20} className="mr-3 text-green-400" />}>
                  {account.fields?.length > 0 ? (
                      account.fields.map((field, i) => (
                          <div key={i} className="border-b border-neutral-800 pb-2">
                              <p className="text-sm text-neutral-400">{field.name}</p>
                              <p className="text-md text-white" dangerouslySetInnerHTML={{ __html: field.value }}></p>
                          </div>
                      ))
                  ) : <p className="text-neutral-500 text-sm">No additional info provided. Add fields in your profile settings.</p>}
                   <div className="border-b border-neutral-800 pb-2">
                      <p className="text-sm text-neutral-400">Joined On</p>
                      <p className="text-md text-white flex items-center"><Calendar size={16} className="mr-2"/>{formatDate(account.created_at)}</p>
                  </div>
                  <div className="pb-2">
                      <p className="text-sm text-neutral-400">Last Post</p>
                      <p className="text-md text-white flex items-center"><FileText size={16} className="mr-2"/>{formatDate(account.last_status_at) || 'No posts yet'}</p>
                  </div>
              </InfoCard>

               <InfoCard title="Account Settings" icon={<Settings size={20} className="mr-3 text-purple-400" />}>
                  <div className="flex items-center justify-between"><span className="flex items-center"><Lock size={16} className="mr-2"/>Locked Account</span><span className={`font-bold ${account.locked ? 'text-red-400' : 'text-green-400'}`}>{account.locked ? 'Yes' : 'No'}</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center"><Globe size={16} className="mr-2"/>Discoverable</span><span className={`font-bold ${account.discoverable ? 'text-green-400' : 'text-red-400'}`}>{account.discoverable ?? 'No'}</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center"><Search size={16} className="mr-2"/>Search Engine Indexed</span><span className={`font-bold ${!account.noindex ? 'text-green-400' : 'text-red-400'}`}>{!account.noindex ? 'Yes' : 'No'}</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center"><EyeOff size={16} className="mr-2"/>Hide Collections</span><span className={`font-bold ${account.hide_collections ? 'text-red-400' : 'text-green-400'}`}>{account.hide_collections ? 'Yes' : 'No'}</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center"><Bot size={16} className="mr-2"/>Bot Account</span><span className={`font-bold ${account.bot ? 'text-green-400' : 'text-neutral-500'}`}>{account.bot ? 'Yes' : 'No'}</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center"><Server size={16} className="mr-2"/>Group Actor</span><span className={`font-bold ${account.group ? 'text-green-400' : 'text-neutral-500'}`}>{account.group ? 'Yes' : 'No'}</span></div>
                  {account.url && <a href={account.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sky-400 hover:underline pt-2"><LinkIcon size={16} className="mr-2"/>View Public Profile</a>}
               </InfoCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;