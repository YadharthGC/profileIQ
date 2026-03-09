import { Linkedin, Plus, LogOut } from 'lucide-react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewProfileDialog from './newProfileDialog';
import { profileAPI, authAPI } from '../api';

interface Profile {
  _id: string;
  name: string;
  createdAt: string;
}

interface SideBarProps {
  onSelectProfile: (profileId: string, name: string) => void;
  selectedProfileId: string | null;
}

export default function SideBar({ onSelectProfile, selectedProfileId }: SideBarProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  // Fetch saved profiles
  const fetchProfiles = async () => {
    try {
      const res = await axios.get(profileAPI + 'profiles', { withCredentials: true });
      setProfiles(res.data.profiles);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await axios.get(authAPI + 'me', { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchUser();
  }, []);

  // After new profile added
  const handleNewProfile = (profileId: string, name: string) => {
    fetchProfiles(); // refresh list
    onSelectProfile(profileId, name);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(authAPI + 'logout', {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    } finally {
      navigate('/');
    }
  };

  // Format time
  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  const filtered = profiles.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="flex flex-col h-full bg-[#0F0F17] border-r border-white/5">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4">
        <Linkedin size={22} className="text-[#0A66C2]" />
        <span className="font-bold text-lg bg-gradient-to-r from-[#0A66C2] to-[#00D4FF] bg-clip-text text-transparent"
          style={{ fontFamily: 'Syne, sans-serif' }}>
          ProfileIQ
        </span>
      </div>

      <div className="mx-1 border-t border-white/5" />

      {/* New Profile button */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 border border-[#0A66C2]/20 text-[#00D4FF] transition-all duration-200 font-semibold hover:cursor-pointer"
        >
          <Plus size={15} />
          New Profile
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-2">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search profiles..."
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white placeholder-[#444460] outline-none focus:border-[#0A66C2]/50 transition-all"
        />
      </div>

      {/* Label */}
      <p className="px-4 pt-4 pb-1 text-[0.65rem] font-semibold text-[#333355] uppercase tracking-widest">
        Recent
      </p>

      {/* Profile list */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto custom-scroll">
        {filtered.length === 0 && (
          <p className="text-center text-[0.75rem] text-[#333355] py-6">
            No profiles yet
          </p>
        )}

        {filtered.map((profile) => (
          <button
            key={profile._id}
            onClick={() => onSelectProfile(profile._id, profile.name)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left hover:cursor-pointer
              ${selectedProfileId === profile._id
                ? 'bg-[#0A66C2]/18 border border-[#0A66C2]/20'
                : 'hover:bg-white/[0.04] border border-transparent'
              }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5
              ${selectedProfileId === profile._id ? 'bg-[#0A66C2] text-white' : 'bg-white/[0.06] text-[#555570]'}`}>
              {initials(profile.name)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[0.82rem] font-semibold truncate ${selectedProfileId === profile._id ? 'text-white' : 'text-[#AAAABC]'}`}>
                  {profile.name}
                </p>
                <span className="text-[0.65rem] text-[#333355] shrink-0">
                  {formatTime(profile.createdAt)}
                </span>
              </div>
              <p className="text-[0.72rem] text-[#444460] truncate mt-0.5">
                Click to chat
              </p>
            </div>
          </button>
        ))}
      </nav>

      <div className="mx-4 border-t border-white/5" />

      {/* Logout */}
      <div className="px-2 pt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group text-[#888899] hover:bg-red-500/10 hover:text-red-400 hover:cursor-pointer"
        >
          <LogOut size={17} className="text-[#444460] group-hover:text-red-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* User strip */}
      <div className="mx-3 mb-3 mt-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user ? initials(user.name) : '?'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[0.82rem] font-semibold text-[#E0E0F0] truncate">
            {user?.name || 'Loading...'}
          </p>
          <p className="text-[0.72rem] text-[#555570] truncate">
            {user?.email || ''}
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0" />
      </div>

      <NewProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleNewProfile}
      />
    </div>
  );
}