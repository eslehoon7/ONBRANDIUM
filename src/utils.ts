export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Use the 'uc' (User Content) endpoint with export=view.
    // This serves the exact original file byte-for-byte without any Google Drive compression or resizing,
    // ensuring the absolute highest possible quality (original resolution) for desktop viewing.
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  return url;
};
