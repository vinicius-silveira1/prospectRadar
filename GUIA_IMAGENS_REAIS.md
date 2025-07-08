# 📸 Guia de Imagens para Prospects

Este guia explica o sistema atual de imagens e como implementar imagens reais de prospects no futuro.

## 🎯 **Status Atual: Sistema Temporário**

**⚠️ IMPORTANTE**: Atualmente o projeto utiliza **imagens profissionais do Unsplash** enquanto desenvolvemos o sistema para imagens reais dos prospects.

### **Por que Unsplash?**
- ✅ **URLs sempre funcionam** - Sem problemas de 404 ou links quebrados
- ✅ **Qualidade consistente** - Todas as imagens têm alta resolução
- ✅ **Performance** - CDN rápido e confiável
- ✅ **Legal** - Licença livre para uso
- ✅ **Demonstração** - Mostra como o sistema funciona

### **Sistema Atual**
```javascript
// Imagens funcionando 100%
imageUrl: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=500&fit=crop&crop=face"
```

## 🚀 **Roadmap: Imagens Reais dos Prospects**

### **1. Sites de Recrutamento (Mais Confiáveis)**

#### **247Sports** - *Melhor fonte geral*
- **URL Base**: `https://247sports.com/`
- **Formato de Imagem**: `https://s3media.247sports.com/Uploads/Assets/[ID]/548/[ID]548.jpg`
- **Qualidade**: Excelente, constantemente atualizada
- **Exemplo**: AJ Dybantsa, Jasper Johnson

#### **ESPN Recruiting** - *Fonte oficial ESPN*
- **URL Base**: `https://espn.com/college-sports/basketball/recruiting/`
- **Formato**: `https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/[name].png`
- **Qualidade**: Boa, padronizada

#### **Rivals** - *Tradicional no recrutamento*
- **URL Base**: `https://rivals.com/`
- **Qualidade**: Boa, especialmente para jogadores top-100

#### **On3** - *Site moderno de recrutamento*
- **URL Base**: `https://on3.com/`
- **Qualidade**: Boa, foco em prospects atuais

### **2. Sites Universitários Oficiais** - *Mais confiáveis para jogadores commitados*

#### **Universidades Top (URLs Oficiais)**
```javascript
const universities = {
  'duke': 'https://goduke.com/images/',
  'kentucky': 'https://ukathletics.com/images/',
  'arizona': 'https://arizonawildcats.com/images/',
  'kansas': 'https://kuathletics.com/images/',
  'syracuse': 'https://cuse.com/images/',
  'alabama': 'https://rolltide.com/images/',
  'byu': 'https://byusports.com/images/',
  'unc': 'https://goheels.com/images/',
  'ucla': 'https://uclabruins.com/images/'
};
```

#### **Formato Típico de Commit Photos**
- `[university]/images/2024/10/25/[Player_Name]_Commit.jpg`
- `[university]/images/2024/[Player_Name]_web.jpg`

### **3. Outras Fontes Oficiais**

#### **Ligas Juvenis**
- **Nike EYBL**: Imagens de alta qualidade dos eventos
- **Adidas 3SSB**: Prospects patrocinados pela Adidas  
- **Under Armour Association**: Eventos UA
- **FIBA Youth**: Competições internacionais

#### **High Schools e Prep Schools**
- **IMG Academy**: `https://imgacademy.com/`
- **Montverde Academy**: Site oficial da escola
- **Oak Hill Academy**: Tradicional escola de basquete

## 🛠️ **Como Implementar no Projeto**

### **1. Sistema de Fallback Múltiplo**
```javascript
const prospect = {
  name: "AJ Dybantsa",
  imageUrl: "https://byusports.com/images/2024/10/14/AJ_Dybantsa.jpg", // Oficial
  alternativeImageUrls: [
    "https://s3media.247sports.com/Uploads/Assets/948/548/12548948.jpg", // 247Sports
    "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/aj-dybantsa.png" // ESPN
  ],
  fallbackImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AJDybantsa" // Avatar gerado
};
```

### **2. Componente com Fallback Inteligente**
```jsx
const ProspectImage = ({ prospect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImagesFailed, setAllImagesFailed] = useState(false);

  const imageUrls = [
    prospect.imageUrl,
    ...prospect.alternativeImageUrls
  ].filter(Boolean);

  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setAllImagesFailed(true);
    }
  };

  return (
    <img 
      src={allImagesFailed ? prospect.fallbackImageUrl : imageUrls[currentImageIndex]}
      onError={handleImageError}
      alt={prospect.name}
    />
  );
};
```

## 🔍 **Como Encontrar Imagens Específicas**

### **Método 1: Busca por Nome**
1. Vá para 247Sports.com
2. Use a busca: "nome do prospect 2026"
3. Acesse o perfil do jogador
4. Clique com botão direito na imagem → "Copiar endereço da imagem"

### **Método 2: Através do Commit**
1. Quando um prospect commita, procure no site da universidade
2. Seção de notícias/recruiting
3. Geralmente há fotos oficiais do commit

### **Método 3: Redes Sociais Oficiais**
- **Instagram oficial da universidade**: `@duke_mbb`, `@ukmbb`, etc.
- **Twitter oficial**: Anúncios de commits sempre têm fotos
- **YouTube**: Mixtapes oficiais têm thumbnails

## 📋 **Checklist de Qualidade**

### **✅ Imagem Ideal**
- [ ] **Resolução**: Mínimo 300x400px
- [ ] **Formato**: JPG ou PNG
- [ ] **Fonte**: Site oficial (universidade/247Sports/ESPN)
- [ ] **Atualidade**: Foto recente (último ano)
- [ ] **Qualidade**: Boa iluminação, foco nítido

### **❌ Evitar**
- [ ] Imagens de redes sociais pessoais
- [ ] Screenshots de vídeos
- [ ] Imagens com marca d'água não oficial
- [ ] Fotos de baixa resolução
- [ ] Imagens de fontes não verificadas

## 🎨 **Sistema de Fallback Visual**

### **Prioridade de Imagens**
1. **Imagem oficial da universidade** (se commitado)
2. **247Sports** (mais atualizada)
3. **ESPN** (padronizada)
4. **Rivals/On3** (alternativas)
5. **Avatar gerado** (sempre funciona)

### **Indicadores Visuais**
```jsx
// Mostrar fonte da imagem
{!allImagesFailed && (
  <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-tl">
    Real
  </div>
)}
```

## 🚀 **Prospects com Imagens Confirmadas (Janeiro 2025)**

### **Classe 2026**
- **AJ Dybantsa** - BYU: ✅ Oficial
- **Jasper Johnson** - Kentucky: ✅ Oficial  
- **Koa Peat** - Arizona: ✅ Oficial
- **Cayden Boozer** - Duke: ✅ Oficial
- **Cameron Boozer** - Duke: ✅ Oficial

### **Classe 2027**
- **Darryn Peterson** - Kansas: ✅ Oficial
- **Kiyan Anthony** - Syracuse: ✅ Oficial
- **Labaron Philon** - Alabama: ✅ Oficial

### **Classe 2028**
- **Cameron Boozer Jr.**: 🔍 Em busca
- **Braylon Mullins**: 🔍 Em busca

## ⚖️ **Considerações Legais**

### **✅ Uso Permitido**
- Imagens de sites oficiais de universidades
- Fotos de comunicados de imprensa públicos
- Conteúdo de sites de recruiting (247Sports, ESPN)
- Material promocional público

### **⚠️ Usar com Cuidado**
- Sempre dar crédito à fonte
- Não modificar as imagens
- Uso apenas para fins informativos/educacionais
- Verificar se é conteúdo público

### **❌ Evitar**
- Imagens pessoais do Instagram/TikTok
- Fotos protegidas por direitos autorais
- Conteúdo privado ou não público
- Imagens de agências de fotografia sem permissão

## 📚 **Recursos Adicionais**

### **Ferramentas Úteis**
- **Image Size Checker**: Para verificar resolução
- **EXIF Data Viewer**: Para verificar metadados
- **TinyPNG**: Para otimizar tamanho sem perder qualidade

### **Scripts de Automação**
```javascript
// Verificar se imagem existe
const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
```

## 🎯 **Próximos Passos**

1. **Expandir banco de dados** com mais prospects da classe 2025-2028
2. **Automatizar verificação** de novas imagens
3. **Implementar cache** para imagens verificadas  
4. **Criar API** para gerenciar imagens centralizadamente
5. **Adicionar watermark** com fonte da imagem

---

**💡 Dica**: Sempre mantenha múltiplas fontes para cada prospect. Sites universitários são os mais confiáveis para jogadores commitados, mas 247Sports é a melhor fonte geral para prospects ainda não commitados.
