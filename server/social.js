// Turns a social handle into a full, navigable URL. Users type "@ben" or "ben"
// during onboarding / profile editing; we store the real URL so the icon links
// somewhere. If they already pasted a full URL we leave it alone.
const BUILDERS = {
  instagram: (h) => `https://instagram.com/${h}`,
  tiktok: (h) => `https://tiktok.com/@${h}`,
  youtube: (h) => `https://youtube.com/@${h}`,
  facebook: (h) => `https://facebook.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  twitter: (h) => `https://x.com/${h}`,
  linkedin: (h) => `https://linkedin.com/in/${h}`,
  github: (h) => `https://github.com/${h}`,
  twitch: (h) => `https://twitch.tv/${h}`,
  pinterest: (h) => `https://pinterest.com/${h}`,
  threads: (h) => `https://threads.net/@${h}`,
  spotify: (h, raw) => (raw.includes('.') ? `https://${raw}` : `https://open.spotify.com/user/${h}`),
  whatsapp: (h, raw) => {
    const digits = raw.replace(/[^\d]/g, '');
    return digits ? `https://wa.me/${digits}` : raw;
  },
  website: (h, raw) => (raw.includes('.') ? `https://${raw}` : raw)
};

// Platforms that render as an icon in the top social row (all of the above).
const SOCIAL_PLATFORMS = new Set(Object.keys(BUILDERS));

function socialUrl(platform, value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw; // already a full URL
  if (/^mailto:|^tel:/i.test(raw)) return raw;
  const handle = raw.replace(/^@+/, '').replace(/^\/+/, '');
  const build = BUILDERS[platform];
  if (build) return build(handle, raw);
  // Unknown platform: if it looks like a domain, make it a URL; else leave as-is.
  return raw.includes('.') ? `https://${raw}` : raw;
}

// Normalize a whole socials object ({platform: value}) in place-safe fashion.
function normalizeSocials(socials) {
  const out = {};
  for (const [k, v] of Object.entries(socials || {})) {
    const url = socialUrl(k, v);
    if (url) out[k] = url;
  }
  return out;
}

module.exports = { socialUrl, normalizeSocials, SOCIAL_PLATFORMS };
