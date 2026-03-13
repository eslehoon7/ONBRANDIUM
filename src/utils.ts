export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Use Google Drive's thumbnail endpoint with a large size parameter (w3000-h3000) 
    // to ensure high resolution. The previous lh3.googleusercontent.com/d/ endpoint 
    // often compresses images heavily.
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w3000-h3000`;
  }
  
  return url;
};
