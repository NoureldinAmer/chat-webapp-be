exports.detectLink = (message) => {
  //supported links
  const patterns = [
    /https?:\/\/(?:www\.)?dailymotion\.com\/.+/i,
    /https?:\/\/(?:www\.)?facebook\.com\/.*\/videos\/.+/i,
    /https?:\/\/(?:www\.)?figma\.com\/(?:file|proto)\/.+\/.+/i,
    /https?:\/\/(?:www\.)?gfycat\.com\/(?:watch|ifr)\/.+/i,
    /https?:\/\/(?:www\.)?gist\.github\.com\/.+\/.+/i,
    /https?:\/\/(?:www\.)?google\.com\/maps\/.+/i,
    /https?:\/\/(?:www\.)?imgur\.com\/(?:a|gallery|topic)\/.+/i,
    /https?:\/\/(?:www\.)?instagram\.com\/(?:p|tv|reel)\/.+/i,
    /https?:\/\/(?:www\.)?jsfiddle\.net\/.+\/.+/i,
    /https?:\/\/(?:www\.)?mixcloud\.com\/.+\/.+/i,
    /https?:\/\/(?:www\.)?replit\.com\/@.+\/.+/i,
    /https?:\/\/(?:www\.)?soundcloud\.com\/.+\/.+/i,
    /https?:\/\/(?:www\.)?twitch\.tv\/.+\/(channel|video)\/.+/i,
    /https?:\/\/(?:www\.)?twitter\.com\/.+\/status(es)?\/.+/i,
    /https?:\/\/(?:www\.)?vimeo\.com\/.+/i,
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=.+/i,
    /https?:\/\/(?:www\.)?dropbox\.com\/.+\/.+/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(message);
    if (match) {
      return match[0];
    }
  }

  return null;
}