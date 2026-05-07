export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Return high resolution thumbnail to avoid Google Drive compression on uc?export=view
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2500`;
  }
  
  // Handle postimg.cc gallery links (if user accidentally pasted gallery link)
  // e.g. https://postimg.cc/zGNxK8M4 -> usually they need i.postimg.cc but we can't fully guess the extension.
  // Actually, we can't perfectly map postimg html to image. We just pass it through.
  
  return url;
};

export const getResizedImageUrl = (url: string, width?: number, quality = 100): string => {
  if (!url) return url;
  const directUrl = getDirectImageUrl(url);
  
  // Ignore local or relative URLs
  if (directUrl.startsWith('/') || directUrl.startsWith('data:')) return directUrl;

  // postimg.cc and drive.google.com block/fail with weserv.nl, so we just return the direct URL for it.
  if (directUrl.includes('postimg.cc') || directUrl.includes('drive.google.com') || directUrl.includes('lh3.googleusercontent.com')) {
    return directUrl;
  }

  // Use weserv.nl for caching, resizing, and webp conversion to improve load speed.
  // Encode the URL carefully.
  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&output=webp&q=${quality}`;
  if (width) {
    return `${proxyUrl}&w=${width}`;
  }
  return proxyUrl;
};
