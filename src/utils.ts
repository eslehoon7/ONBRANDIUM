export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle Google Drive links
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Convert to direct download link using Google's lh3 service which is more reliable for images
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  
  return url;
};
