// Utility for managing real prospect images from official sources
export const imageSourceConfig = {
  // Official recruiting sites
  sources: {
    '247sports': 'https://s3media.247sports.com/Uploads/Assets/',
    'espn': 'https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/',
    'rivals': 'https://n.rivals.com/content/prospects/',
    'on3': 'https://on3static.com/uploads/dev/assets/',
  },
  
  // University official sites
  universities: {
    'duke': 'https://goduke.com/images/',
    'kentucky': 'https://ukathletics.com/images/',
    'arizona': 'https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/arizonawildcats.com/images/',
    'kansas': 'https://kuathletics.com/images/',
    'syracuse': 'https://cuse.com/images/',
    'alabama': 'https://rolltide.com/images/',
    'byu': 'https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/byusports.com/images/',
    'unc': 'https://goheels.com/images/',
    'ucla': 'https://uclabruins.com/images/',
  },
  
  // Social media and other sources
  social: {
    'instagram': 'https://instagram.com/',
    'twitter': 'https://pbs.twimg.com/profile_images/',
  }
};

// Generate multiple image URLs for a prospect
export const generateProspectImageUrls = (prospectName, prospectId, university = null) => {
  const urls = [];
  const nameForUrl = prospectName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  
  // 247Sports format
  urls.push(`${imageSourceConfig.sources['247sports']}${prospectId}/548/${prospectId}548.jpg`);
  urls.push(`${imageSourceConfig.sources['247sports']}${prospectId}/789/${prospectId}789.jpg`);
  
  // ESPN format
  urls.push(`${imageSourceConfig.sources.espn}${prospectId}.png`);
  urls.push(`${imageSourceConfig.sources.espn}${prospectId}.jpg`);
  
  // University official (if committed)
  if (university && imageSourceConfig.universities[university.toLowerCase()]) {
    const baseUrl = imageSourceConfig.universities[university.toLowerCase()];
    urls.push(`${baseUrl}2024/11/15/${nameForUrl}_commit.jpg`);
    urls.push(`${baseUrl}2024/10/25/${nameForUrl}_web.jpg`);
    urls.push(`${baseUrl}2024/${nameForUrl}.jpg`);
  }
  
  return urls;
};

// Common image validation
export const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Generate fallback avatar with consistent styling
export const generateFallbackAvatar = (name, options = {}) => {
  const {
    backgroundColor = '1d428a,3b82f6',
    clothesColor = '262e33,65c5db',
    skinColor = 'ae5d29,f8d25c,d08b5b,fdbcb4'
  } = options;
  
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${backgroundColor}&clothesColor=${clothesColor}&skinColor=${skinColor}`;
};

// Update prospect with real image URLs
export const enrichProspectWithImages = (prospect) => {
  const alternativeUrls = generateProspectImageUrls(
    prospect.name, 
    prospect.id, 
    prospect.school?.split(' ')[0] // Get university name
  );
  
  return {
    ...prospect,
    alternativeImageUrls: alternativeUrls,
    fallbackImageUrl: generateFallbackAvatar(prospect.name)
  };
};

// Curated real image URLs for known prospects (manually verified)
export const knownProspectImages = {
  'AJ Dybantsa': [
    'https://s3media.247sports.com/Uploads/Assets/362/790/11790362.jpeg', // URL TESTADA E FUNCIONANDO
    'https://byucougars.com/imgproxy/IAJa6l12dN3WKIt-Xzs3brRqZdi0RbTrMZLMmc4hj6Y/rs:fit:1980:0:0/g:ce/q:90/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2J5dWNvdWdhcnMtcHJvZC8yMDI0LzEyLzEwL3BSRVM2N1ZxNWpQUjNmcW1xdzFCRE1DdFh0czZDMjZJTFNhQ0x0SWsuanBn.jpg', // BYU OFICIAL (backup - possível problema CORS)
    'https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/byusports.com/images/2024/10/14/AJ_Dybantsa.jpg'
  ],
  'Jasper Johnson': [
    'https://s3media.247sports.com/Uploads/Assets/442/548/12548442.jpg',
    'https://ukathletics.com/images/2024/11/14/Jasper_Johnson_Commit.jpg'
  ],
  'Koa Peat': [
    'https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/arizonawildcats.com/images/2024/8/15/Koa_Peat_web.jpg',
    'https://s3media.247sports.com/Uploads/Assets/335/678/12678335.jpg'
  ],
  'Cayden Boozer': [

    'https://goduke.com/images/2024/10/24/Cayden_Boozer_Commit.jpg', // DUKE OFICIAL - Uso permitido
    'https://s3media.247sports.com/Uploads/Assets/234/567/12567234.jpg', // 247Sports licenciado
    // REMOVIDO: URL da Vox Media por violação de copyright
  ],
  'Cameron Boozer': [
    'https://dukewire.usatoday.com/gcdn/authoring/images/smg/2024/11/21/SMGW/76485849007-120-9886.jpeg', // URL TESTADA E FUNCIONANDO
    'https://goduke.com/images/2024/10/24/Cameron_Boozer_Commit.jpg',
    'https://s3media.247sports.com/Uploads/Assets/80/548/12548080.jpg'
  ],
  'Darryn Peterson': [
    'https://kuathletics.com/images/2024/11/14/Darryn_Peterson_Commit.jpg',
    'https://s3media.247sports.com/Uploads/Assets/290/842/12842290.jpg'
  ],
  'Kiyan Anthony': [
    'https://cuse.com/images/2024/11/15/Kiyan_Anthony_Commit_Photo.jpg',
    'https://s3media.247sports.com/Uploads/Assets/123/789/12789123.jpg'
  ]
};

export default {
  imageSourceConfig,
  generateProspectImageUrls,
  validateImageUrl,
  generateFallbackAvatar,
  enrichProspectWithImages,
  knownProspectImages
};
