/**
 * Generates a deterministic username, avatar, and bio based on a user's unique ID.
 * This is used as a robust fallback system when a profile table is not available
 *.
 * @param {string} userId - The unique identifier of the user
 * @param {object} currentUser - The active user object from Supabase Auth
 * @returns {object} { username, avatar, bio }
 */
export function getDeterministicUser(userId, currentUser = null) {
  if (!userId) {
    return {
      username: 'anonymous',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous',
      bio: 'Just passing through.'
    };
  }

  // If this is the current active user and their user_metadata has a custom bio/username/avatar, use it
  if (currentUser && currentUser.id === userId && currentUser.user_metadata) {
    const meta = currentUser.user_metadata;
    return {
      username: meta.username || `u/${currentUser.email?.split('@')[0] || userId.substring(0, 6)}`,
      avatar: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email || 'user'}`,
      bio: meta.bio || 'Productive Redditor. Custom profile configured.'
    };
  }

  // Seed hash from userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const adjectives = [
    'Sleek', 'Quantum', 'Nebula', 'Cyber', 'Alpha', 'Arcane', 'Solar', 
    'Aether', 'Hyper', 'Nova', 'Vortex', 'Chrono', 'Pixel', 'Sonic', 'Cosmic',
    'Vibrant', 'Satoshi', 'Stellar', 'Prism', 'Orbit', 'Zephyr', 'Apex', 'Retro'
  ];
  
  const nouns = [
    'Coder', 'Redditor', 'Pioneer', 'Voyager', 'Nomad', 'Specter', 'Seeker', 
    'Master', 'Guardian', 'Helix', 'Horizon', 'Striker', 'Shadow', 'Knight', 'Sage',
    'Explorer', 'Architect', 'Techno', 'Ghost', 'Catalyst', 'Bespoke', 'Warlock'
  ];

  const bios = [
    "Exploring the depths of SaaS and development.",
    "Building things on the web. Coffee enthusiast.",
    "Web Designer & Frontend Explorer.",
    "Debugging life, one line of code at a time.",
    "Building clean interfaces and writing clean code.",
    "Always learning, always coding. Into open-source.",
    "SaaS lover, React developer, UI enthusiast.",
    "Frontend architect mapping the decentralized world."
  ];

  const adjIdx = Math.abs(hash) % adjectives.length;
  const nounIdx = Math.abs((hash >> 4) ^ 0x1234) % nouns.length;
  const num = Math.abs(hash >> 8) % 1000;
  const bioIdx = Math.abs(hash >> 2) % bios.length;
  
  const username = `u/${adjectives[adjIdx]}${nouns[nounIdx]}${num}`;

  // Deterministic avatar style choice
  const avatarStyles = [
    'identicon', 'bottts', 'lorelei', 'micah', 'shapes', 'personas'
  ];
  const style = avatarStyles[Math.abs(hash) % avatarStyles.length];
  const avatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(userId)}`;

  return {
    username,
    avatar,
    bio: bios[bioIdx]
  };
}

/**
 * Format timestamp into human readable relative time (e.g. "3 hours ago")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  // Return formatted month & day
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
