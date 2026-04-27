export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Handle various Google Drive link formats
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Google Drive 링크를 이미지 태그에 직접 사용할 수 있는 형태로 변환합니다.
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  // Handle postimg.cc gallery links (if user accidentally pasted gallery link)
  // e.g. https://postimg.cc/zGNxK8M4 -> usually they need i.postimg.cc but we can't fully guess the extension.
  // Actually, we can't perfectly map postimg html to image. We just pass it through.
  
  return url;
};

export const getResizedImageUrl = (url: string, width?: number, quality = 80): string => {
  if (!url) return url;
  const directUrl = getDirectImageUrl(url);
  
  // Ignore local or relative URLs
  if (directUrl.startsWith('/') || directUrl.startsWith('data:')) return directUrl;

  // Use weserv.nl for caching, resizing, and webp conversion to improve load speed.
  // Encode the URL carefully.
  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&output=webp&q=${quality}`;
  if (width) {
    return `${proxyUrl}&w=${width}`;
  }
  return proxyUrl;
};
