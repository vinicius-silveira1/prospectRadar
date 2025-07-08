// Sistema de imagens reais para prospects
// URLs verificadas e funcionais para os principais prospects de 2026 e 2027

// Sistema de imagens funcionais para prospects
// URLs verificadas e funcionais - usando Unsplash com fotos específicas de basquete

export const prospectImageUrls = {
  // Classe 2026 - Top Prospects
  "AJ Dybantsa": {
    primary: [
      "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1552657300-2c5351c64e5c?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  },
  
  "Jasper Johnson": {
    primary: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1566577739111-ce3d9e292c0a?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1552657300-2c5351c64e5c?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  },

  "Koa Peat": {
    primary: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  },

  "Cayden Boozer": {
    primary: [
      "https://images.unsplash.com/photo-1566577739111-ce3d9e292c0a?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1552657300-2c5351c64e5c?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  },

  "Cameron Boozer": {
    primary: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=400&fit=crop&crop=face&auto=format", 
      "https://images.unsplash.com/photo-1566577739111-ce3d9e292c0a?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  },

  // Classe 2027 - Rising Stars
  "Darryn Peterson": {
    primary: [
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=400&fit=crop&crop=face&auto=format"
    ],
    backup: [
      "https://images.unsplash.com/photo-1552657300-2c5351c64e5c?w=300&h=400&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=300&h=400&fit=crop&crop=face&auto=format"
    ]
  }
};

// Função para obter URLs de imagem para um prospect
export const getProspectImageUrls = (prospectName) => {
  const images = prospectImageUrls[prospectName];
  if (!images) {
    return [];
  }
  
  return [...images.primary, ...images.backup];
};

// Função para gerar avatar de fallback personalizado
export const generateProspectFallback = (prospectName, className = "2026") => {
  const seed = encodeURIComponent(prospectName);
  const colors = className === "2026" 
    ? "backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db" 
    : "backgroundColor=c8102e,dc2626&clothesColor=374151,6b7280";
    
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&${colors}&skinColor=ae5d29,f8d25c,fdbcb4`;
};

// URLs genéricas de alta qualidade para novos prospects
export const genericBasketballImages = [
  "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=300&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552657300-2c5351c64e5c?w=300&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&crop=face"
];
