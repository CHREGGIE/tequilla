import type { TequilaType, PriceRange, RecipeDifficulty } from "../src/types/database";

export interface SeedProducer {
  name: string;
  region: string;
  description: string;
  website?: string;
  noma: string;
  tequilas: Array<{
    name: string;
    type: TequilaType;
    additive_free: boolean;
    organic: boolean;
    agave_region: string;
    abv: number;
    production_volume: string;
    price_range: PriceRange;
    price_min: number;
    price_max: number;
    tasting_notes: string;
    description: string;
    featured?: boolean;
    editions?: Array<{
      name: string;
      description: string;
      limited_edition: boolean;
    }>;
  }>;
}

export const seedProducers: SeedProducer[] = [
  {
    name: "Fortaleza",
    region: "Lowlands",
    noma: "1146",
    description: "Traditional stone oven, tahona, and copper pot still tequila from La Fortaleza distillery in Tequila, Jalisco.",
    website: "https://tequilafortaleza.com",
    tequilas: [
      { name: "Fortaleza Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, featured: true, tasting_notes: "Cooked agave, citrus, black pepper, earthy mineral finish.", description: "Unaged expression showcasing pure agave character from stone oven cooking." },
      { name: "Fortaleza Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 65, price_max: 75, tasting_notes: "Vanilla, caramel, agave, light oak spice.", description: "Rested in American oak barrels for depth without masking agave." },
      { name: "Fortaleza Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 90, price_max: 110, tasting_notes: "Butterscotch, dried fruit, cinnamon, long agave finish.", description: "Aged in oak with remarkable balance of wood and terroir." },
      { name: "Fortaleza Still Strength Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 46, production_volume: "Limited", price_range: "$$$$", price_min: 85, price_max: 95, tasting_notes: "Intense agave, lime zest, white pepper, oily mouthfeel.", description: "Bottled at still strength for a bolder profile.", editions: [{ name: "Winter Blend 2024", description: "Seasonal release with extended fermentation.", limited_edition: true }] },
    ],
  },
  {
    name: "Tequila Ocho",
    region: "Highlands",
    noma: "1474",
    description: "Single-estate, vintage tequilas from the Camarena family, with each expression tied to a specific harvest.",
    website: "https://tequilaocho.com",
    tequilas: [
      { name: "Tequila Ocho Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Estate batch", price_range: "$$$", price_min: 45, price_max: 55, featured: true, tasting_notes: "Floral agave, grapefruit, white pepper, clean finish.", description: "Vintage blanco highlighting highland agave sweetness." },
      { name: "Tequila Ocho Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Estate batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Honey, vanilla, cooked agave, gentle oak.", description: "Single-estate reposado with transparent vintage labeling." },
      { name: "Tequila Ocho Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Estate batch", price_range: "$$$$", price_min: 75, price_max: 90, tasting_notes: "Toffee, baking spice, ripe agave, silky finish.", description: "Extended aging in used American whiskey barrels." },
      { name: "Tequila Ocho Extra Añejo", type: "extra_anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 120, price_max: 150, tasting_notes: "Dark chocolate, dried fig, oak, warm spice.", description: "Ultra-aged single-estate expression for collectors." },
    ],
  },
  {
    name: "Siete Leguas",
    region: "Highlands",
    noma: "1120",
    description: "Heritage highland distillery using traditional methods including tahona milling for select expressions.",
    website: "https://sieteleguas.com.mx",
    tequilas: [
      { name: "Siete Leguas Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 50, price_max: 60, featured: true, tasting_notes: "Herbal agave, mint, citrus peel, peppery finish.", description: "Classic highland blanco with bright aromatics." },
      { name: "Siete Leguas Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 60, price_max: 70, tasting_notes: "Caramel, vanilla bean, roasted agave.", description: "Rested in white oak for rounded texture." },
      { name: "Siete Leguas Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 85, price_max: 100, tasting_notes: "Oak, nutmeg, cooked agave, long finish.", description: "Añejo with structure suited for sipping." },
      { name: "Siete Leguas Decanter Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 150, price_max: 200, tasting_notes: "Rich oak, dark fruit, leather, agave sweetness.", description: "Premium decanter release for enthusiasts.", editions: [{ name: "2023 Decanter", description: "Hand-numbered ceramic decanter.", limited_edition: true }] },
    ],
  },
  {
    name: "G4 Tequila",
    region: "Highlands",
    noma: "1579",
    description: "Felipe Camarena's highland distillery at El Pandillo, known for innovative fermentation and distillation.",
    website: "https://g4tequila.com",
    tequilas: [
      { name: "G4 Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, featured: true, tasting_notes: "Sweet agave, lime, mineral, black pepper.", description: "Flagship blanco from El Pandillo." },
      { name: "G4 Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Vanilla, oak, citrus, pepper.", description: "Reposado with clean highland profile." },
      { name: "G4 Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 80, price_max: 95, tasting_notes: "Caramel, baking spice, agave, oak.", description: "Well-balanced añejo for sipping." },
      { name: "G4 108 Proof Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 54, production_volume: "Limited", price_range: "$$$$", price_min: 90, price_max: 110, tasting_notes: "Explosive agave, pepper, citrus oil.", description: "High-proof blanco for bold cocktails." },
    ],
  },
  {
    name: "Tapatio",
    region: "Highlands",
    noma: "1137",
    description: "Long-running highland brand from La Alteña, prized for value and traditional production.",
    tequilas: [
      { name: "Tapatio Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 30, price_max: 38, tasting_notes: "Agave, grass, pepper, clean finish.", description: "Benchmark additive-free blanco at accessible price." },
      { name: "Tapatio Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 35, price_max: 42, tasting_notes: "Light oak, vanilla, pepper, agave.", description: "Everyday reposado with honest profile." },
      { name: "Tapatio Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Oak, caramel, spice, dried herbs.", description: "Classic añejo value pick." },
      { name: "Tapatio 110 Proof Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 55, production_volume: "Limited", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Intense pepper, agave syrup, lime.", description: "Export-strength blanco for cocktails." },
    ],
  },
  {
    name: "Pasote",
    region: "Highlands",
    noma: "1579",
    description: "Additive-free line from El Pandillo with minimalist branding and highland agave focus.",
    tequilas: [
      { name: "Pasote Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$", price_min: 35, price_max: 42, tasting_notes: "Fresh agave, citrus, white pepper.", description: "Clean blanco ideal for margaritas." },
      { name: "Pasote Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$", price_min: 40, price_max: 48, tasting_notes: "Vanilla, light oak, sweet agave.", description: "Soft reposado for sipping or mixing." },
      { name: "Pasote Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Oak, toffee, baking spice.", description: "Approachable añejo with purity of agave." },
    ],
  },
  {
    name: "Cascahuin",
    region: "Lowlands",
    noma: "1123",
    description: "Family-owned lowland distillery emphasizing traditional production and additive-free expressions.",
    website: "https://tequilascascahuin.com",
    tequilas: [
      { name: "Cascahuin Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Earthy agave, citrus, mineral, pepper.", description: "Lowland terroir with stone oven character." },
      { name: "Cascahuin Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Vanilla, caramel, cooked agave.", description: "Barrel rest adds roundness without sweetness overload." },
      { name: "Cascahuin Tahona Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Rich agave, olive, black pepper, texture.", description: "Tahona-milled expression with fuller body." },
      { name: "Cascahuin 48 Still Proof", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 48, production_volume: "Limited", price_range: "$$$$", price_min: 75, price_max: 90, tasting_notes: "Bold agave, pepper, herbal notes.", description: "Higher proof for enthusiasts." },
    ],
  },
  {
    name: "Lalo",
    region: "Highlands",
    noma: "1146",
    description: "Modern additive-free brand focused on transparency and highland blanco excellence.",
    website: "https://lalotequila.com",
    tequilas: [
      { name: "Lalo Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 38, price_max: 45, featured: true, tasting_notes: "Sweet agave, citrus, pepper, crisp finish.", description: "Highly mixable additive-free blanco." },
      { name: "Lalo High Proof", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 50, production_volume: "Limited", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Concentrated agave, lime, white pepper.", description: "Elevated proof for cocktails." },
    ],
  },
  {
    name: "ArteNOM",
    region: "Various",
    noma: "Various",
    description: "Curated single-distillery selections showcasing distinct NOM profiles across Jalisco.",
    website: "https://tequilaartenom.com",
    tequilas: [
      { name: "ArteNOM 1579 Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Highland sweetness, pepper, citrus.", description: "Selection from NOM 1579 (El Pandillo)." },
      { name: "ArteNOM 1146 Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 60, price_max: 70, tasting_notes: "Oak, vanilla, earthy agave.", description: "Selection from NOM 1146 (Fortaleza)." },
      { name: "ArteNOM 1414 Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Floral, honey, light spice.", description: "Selection from NOM 1414." },
      { name: "ArteNOM 1610 Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Mineral, citrus, herbal agave.", description: "Selection from NOM 1610." },
    ],
  },
  {
    name: "Don Fulano",
    region: "Highlands",
    noma: "1146",
    description: "Highland tequila with French oak influence on select aged expressions.",
    tequilas: [
      { name: "Don Fulano Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Tropical fruit, agave, white pepper.", description: "Bright blanco with highland character." },
      { name: "Don Fulano Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 60, price_max: 70, tasting_notes: "Vanilla, oak, cooked agave.", description: "Reposado aged in used barrels." },
      { name: "Don Fulano Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 85, price_max: 100, tasting_notes: "French oak spice, caramel, agave.", description: "Añejo with French oak finishing notes." },
      { name: "Don Fulano Fuerte", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 50, production_volume: "Limited", price_range: "$$$$", price_min: 80, price_max: 95, tasting_notes: "Bold agave, pepper, citrus oil.", description: "High-proof blanco for connoisseurs." },
    ],
  },
  {
    name: "Terrafame",
    region: "Highlands",
    noma: "1579",
    description: "Small-batch additive-free tequila from El Pandillo with cult following.",
    tequilas: [
      { name: "Terrafame Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Agave, lime, mineral, pepper.", description: "Clean highland blanco." },
      { name: "Terrafame Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 58, price_max: 68, tasting_notes: "Oak, vanilla, sweet agave.", description: "Balanced reposado." },
    ],
  },
  {
    name: "Suerte",
    region: "Highlands",
    noma: "1533",
    description: "Additive-free brand using brick ovens and copper pot stills in the highlands.",
    website: "https://suertetequila.com",
    tequilas: [
      { name: "Suerte Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 32, price_max: 40, tasting_notes: "Fresh agave, citrus, pepper.", description: "Accessible additive-free blanco." },
      { name: "Suerte Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 38, price_max: 45, tasting_notes: "Vanilla, light oak, agave.", description: "Smooth everyday reposado." },
      { name: "Suerte Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Caramel, oak, spice.", description: "Entry añejo with clean profile." },
      { name: "Suerte Extra Añejo", type: "extra_anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 90, price_max: 110, tasting_notes: "Dark chocolate, oak, dried fruit.", description: "Extended aging for sipping." },
    ],
  },
  {
    name: "Siembra Valles",
    region: "Lowlands",
    noma: "1123",
    description: "Lowland-focused additive-free tequila celebrating valley terroir.",
    tequilas: [
      { name: "Siembra Valles Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Earthy, mineral, pepper, citrus.", description: "Valley blanco with terroir emphasis." },
      { name: "Siembra Valles Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Oak, vanilla, earthy agave.", description: "Reposado highlighting lowland character." },
      { name: "Siembra Valles Ancestral", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Rustic agave, smoke, pepper, herbs.", description: "Heritage-style production expression." },
    ],
  },
  {
    name: "Siembra Azul",
    region: "Highlands",
    noma: "1414",
    description: "Highland counterpart to Siembra Valles from NOM 1414.",
    tequilas: [
      { name: "Siembra Azul Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Floral, sweet agave, pepper.", description: "Highland blanco with brightness." },
      { name: "Siembra Azul Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Honey, oak, citrus.", description: "Elegant reposado." },
    ],
  },
  {
    name: "El Tesoro",
    region: "Highlands",
    noma: "1139",
    description: "Historic highland distillery La Alteña, known for traditional methods and Paradiso extra añejo.",
    website: "https://eltesorotequila.com",
    tequilas: [
      { name: "El Tesoro Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Agave, mint, citrus, pepper.", description: "Classic highland blanco." },
      { name: "El Tesoro Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Vanilla, oak, herbal notes.", description: "Reposado with traditional profile." },
      { name: "El Tesoro Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 75, price_max: 90, tasting_notes: "Oak, caramel, spice, long finish.", description: "Benchmark highland añejo." },
      { name: "El Tesoro Paradiso Extra Añejo", type: "extra_anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 150, price_max: 200, tasting_notes: "Cognac cask influence, dark fruit, oak.", description: "Extra añejo finished in cognac barrels.", editions: [{ name: "Paradiso 2022", description: "Limited cognac barrel finish.", limited_edition: true }] },
    ],
  },
  {
    name: "Tequila Chamucos",
    region: "Lowlands",
    noma: "1595",
    description: "Small-batch tequila with artistic branding and additive-free production.",
    tequilas: [
      { name: "Chamucos Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 42, price_max: 52, tasting_notes: "Agave, citrus, pepper, mineral.", description: "Clean blanco with personality." },
      { name: "Chamucos Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Vanilla, oak, sweet agave.", description: "Smooth reposado." },
      { name: "Chamucos Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 65, price_max: 80, tasting_notes: "Oak, toffee, spice.", description: "Rich añejo sipper." },
      { name: "Chamucos Diablos Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Bold oak, agave, spice.", description: "Limited reposado release." },
    ],
  },
  {
    name: "Arette",
    region: "Lowlands",
    noma: "1109",
    description: "Value-oriented additive-free tequila from Orendain family in Tequila town.",
    tequilas: [
      { name: "Arette Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$", price_min: 22, price_max: 28, tasting_notes: "Agave, pepper, citrus.", description: "Budget-friendly additive-free blanco." },
      { name: "Arette Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$", price_min: 25, price_max: 32, tasting_notes: "Light oak, vanilla, pepper.", description: "Great value reposado." },
      { name: "Arette Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$", price_min: 32, price_max: 40, tasting_notes: "Oak, caramel, agave.", description: "Affordable añejo." },
      { name: "Arette Fuerte 101", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 50.5, production_volume: "Limited", price_range: "$$", price_min: 35, price_max: 42, tasting_notes: "Intense pepper, agave.", description: "High-proof value blanco." },
    ],
  },
  {
    name: "Cimarron",
    region: "Highlands",
    noma: "1146",
    description: "Additive-free mixable tequila designed for cocktails at accessible price.",
    tequilas: [
      { name: "Cimarron Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$", price_min: 22, price_max: 28, tasting_notes: "Agave, citrus, pepper.", description: "Bartender-favorite well blanco." },
      { name: "Cimarron Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Medium batch", price_range: "$", price_min: 25, price_max: 30, tasting_notes: "Light oak, vanilla.", description: "Value reposado for cocktails." },
    ],
  },
  {
    name: "Volcan de Mi Tierra",
    region: "Lowlands",
    noma: "1472",
    description: "Premium brand blending lowland and highland agave for balanced profile.",
    website: "https://volcandetierra.com",
    tequilas: [
      { name: "Volcan Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Jalisco", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Floral, tropical, pepper.", description: "Dual-terroir blanco blend." },
      { name: "Volcan Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Jalisco", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Vanilla, oak, fruit.", description: "Reposado with blended agave." },
      { name: "Volcan X.A Extra Añejo", type: "extra_anejo", additive_free: true, organic: false, agave_region: "Jalisco", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 120, price_max: 150, tasting_notes: "Dark fruit, oak, chocolate.", description: "Ultra-premium extra añejo." },
    ],
  },
  {
    name: "Patrón",
    region: "Highlands",
    noma: "1492",
    description: "Global premium brand from Hacienda Patrón; select expressions additive-free.",
    website: "https://patronspirits.com",
    tequilas: [
      { name: "Patrón Silver", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Clean agave, citrus, light pepper.", description: "Widely available premium blanco." },
      { name: "Patrón Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$", price_min: 55, price_max: 65, tasting_notes: "Oak, vanilla, light smoke.", description: "Popular reposado." },
      { name: "Patrón Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Oak, honey, dried fruit.", description: "Mainstream añejo option." },
      { name: "Patrón Burdeos Extra Añejo", type: "extra_anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 250, price_max: 300, tasting_notes: "Wine cask, dark fruit, oak.", description: "Luxury extra añejo in crystal decanter.", editions: [{ name: "Burdeos 2023", description: "Aged in Bordeaux wine barrels.", limited_edition: true }] },
    ],
  },
  {
    name: "Casamigos",
    region: "Highlands",
    noma: "1459",
    description: "Celebrity-founded brand now widely distributed; blanco and reposado popular in bars.",
    tequilas: [
      { name: "Casamigos Blanco", type: "blanco", additive_free: false, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Sweet agave, vanilla, mint.", description: "Smooth blanco with wide availability." },
      { name: "Casamigos Reposado", type: "reposado", additive_free: false, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Caramel, oak, vanilla.", description: "Soft reposado profile." },
      { name: "Casamigos Añejo", type: "anejo", additive_free: false, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$$", price_min: 65, price_max: 80, tasting_notes: "Oak, chocolate, vanilla.", description: "Mainstream añejo." },
      { name: "Casamigos Cristalino", type: "cristalino", additive_free: false, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Large batch", price_range: "$$$$", price_min: 60, price_max: 75, tasting_notes: "Vanilla, caramel, filtered oak.", description: "Filtered añejo-style cristalino." },
    ],
  },
  {
    name: "Partida",
    region: "Lowlands",
    noma: "1502",
    description: "Lowland tequila aged in bourbon barrels with organic agave options.",
    website: "https://partidatequila.com",
    tequilas: [
      { name: "Partida Blanco", type: "blanco", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 42, price_max: 50, featured: true, tasting_notes: "Clean agave, citrus, mineral.", description: "Organic-certified blanco." },
      { name: "Partida Reposado", type: "reposado", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Vanilla, bourbon barrel, agave.", description: "Organic reposado in bourbon barrels." },
      { name: "Partida Añejo", type: "anejo", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 65, price_max: 80, tasting_notes: "Oak, caramel, spice.", description: "Organic añejo." },
      { name: "Partida Elegante Extra Añejo", type: "extra_anejo", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 130, price_max: 160, tasting_notes: "Dark chocolate, oak, dried fruit.", description: "Ultra-aged organic expression." },
    ],
  },
  {
    name: "Tequila Tromba",
    region: "Highlands",
    noma: "1469",
    description: "Highland additive-free tequila with focus on craft production.",
    tequilas: [
      { name: "Tromba Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 40, price_max: 48, tasting_notes: "Agave, citrus, pepper.", description: "Crisp highland blanco." },
      { name: "Tromba Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, tasting_notes: "Vanilla, oak, agave.", description: "Balanced reposado." },
      { name: "Tromba Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 60, price_max: 75, tasting_notes: "Oak, caramel, spice.", description: "Sipping añejo." },
    ],
  },
  {
    name: "123 Organic Tequila",
    region: "Lowlands",
    noma: "1502",
    description: "Certified organic tequila line with numbered expressions.",
    website: "https://123tequila.com",
    tequilas: [
      { name: "123 Organic Blanco (Uno)", type: "blanco", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 45, price_max: 55, featured: true, tasting_notes: "Fresh agave, herbs, citrus.", description: "Organic blanco (Uno)." },
      { name: "123 Organic Reposado (Dos)", type: "reposado", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Vanilla, light oak, agave.", description: "Organic reposado (Dos)." },
      { name: "123 Organic Añejo (Tres)", type: "anejo", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Oak, caramel, baking spice.", description: "Organic añejo (Tres)." },
      { name: "123 Organic Extra Añejo (Cuatro)", type: "extra_anejo", additive_free: true, organic: true, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 100, price_max: 130, tasting_notes: "Dark fruit, oak, chocolate.", description: "Organic extra añejo (Cuatro)." },
    ],
  },
  {
    name: "Wild Common",
    region: "Lowlands",
    noma: "1123",
    description: "Terroir-focused additive-free tequila with wild fermentation emphasis.",
    tequilas: [
      { name: "Wild Common Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Funky agave, citrus, mineral, texture.", description: "Wild fermentation blanco." },
      { name: "Wild Common Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 80, price_max: 95, tasting_notes: "Oak, earthy agave, spice.", description: "Complex reposado." },
    ],
  },
  {
    name: "Mijenta",
    region: "Highlands",
    noma: "1450",
    description: "Sustainable additive-free tequila with organic agave sourcing.",
    website: "https://mijenta.com",
    tequilas: [
      { name: "Mijenta Blanco", type: "blanco", additive_free: true, organic: true, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 50, price_max: 60, tasting_notes: "Floral agave, citrus, pepper.", description: "Sustainable organic blanco." },
      { name: "Mijenta Reposado", type: "reposado", additive_free: true, organic: true, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$", price_min: 58, price_max: 68, tasting_notes: "Vanilla, oak, sweet agave.", description: "Organic reposado." },
      { name: "Mijenta Añejo", type: "anejo", additive_free: true, organic: true, agave_region: "Los Altos", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 75, price_max: 90, tasting_notes: "Oak, caramel, dried fruit.", description: "Organic añejo." },
    ],
  },
  {
    name: "Código 1530",
    region: "Lowlands",
    noma: "1596",
    description: "Private-label heritage brand with wine-barrel finished expressions.",
    website: "https://codigo1530.com",
    tequilas: [
      { name: "Código 1530 Blanco", type: "blanco", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 70, price_max: 85, tasting_notes: "Clean agave, citrus, mineral.", description: "Premium blanco." },
      { name: "Código 1530 Reposado", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 80, price_max: 95, tasting_notes: "Vanilla, oak, agave.", description: "Napa barrel reposado." },
      { name: "Código 1530 Añejo", type: "anejo", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Small batch", price_range: "$$$$", price_min: 100, price_max: 120, tasting_notes: "Wine barrel, dark fruit, oak.", description: "Wine-influenced añejo." },
      { name: "Código 1530 Rosa", type: "reposado", additive_free: true, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 85, price_max: 100, tasting_notes: "Wine cask, berry, agave.", description: "Reposado rested in rosé wine barrels.", editions: [{ name: "Rosa 2024", description: "Limited rosé cask release.", limited_edition: true }] },
    ],
  },
  {
    name: "Herradura",
    region: "Lowlands",
    noma: "1119",
    description: "Historic lowland distillery with widely available expressions.",
    website: "https://herradura.com",
    tequilas: [
      { name: "Herradura Silver", type: "blanco", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$$", price_min: 35, price_max: 42, tasting_notes: "Agave, citrus, light oak.", description: "Mainstream blanco." },
      { name: "Herradura Reposado", type: "reposado", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$$", price_min: 38, price_max: 45, tasting_notes: "Vanilla, oak, caramel.", description: "Popular reposado." },
      { name: "Herradura Añejo", type: "anejo", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$$$", price_min: 48, price_max: 58, tasting_notes: "Oak, spice, dried fruit.", description: "Classic añejo." },
      { name: "Herradura Ultra Cristalino", type: "cristalino", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 55, price_max: 65, tasting_notes: "Vanilla, caramel, smooth.", description: "Cristalino expression." },
    ],
  },
  {
    name: "Espolòn",
    region: "Lowlands",
    noma: "1440",
    description: "Accessible tequila with distinctive label art; widely available.",
    tequilas: [
      { name: "Espolòn Blanco", type: "blanco", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$", price_min: 22, price_max: 28, tasting_notes: "Agave, pepper, citrus.", description: "Budget-friendly blanco." },
      { name: "Espolòn Reposado", type: "reposado", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$", price_min: 25, price_max: 30, tasting_notes: "Vanilla, oak, spice.", description: "Value reposado." },
      { name: "Espolòn Añejo", type: "anejo", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Large batch", price_range: "$$", price_min: 32, price_max: 38, tasting_notes: "Oak, caramel, vanilla.", description: "Entry añejo." },
    ],
  },
  {
    name: "Clase Azul",
    region: "Lowlands",
    noma: "1595",
    description: "Ultra-premium collectible brand known for ceramic decanters.",
    website: "https://claseazul.com",
    tequilas: [
      { name: "Clase Azul Plata", type: "blanco", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 100, price_max: 130, tasting_notes: "Sweet agave, vanilla, cream.", description: "Premium blanco in ceramic decanter." },
      { name: "Clase Azul Reposado", type: "reposado", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Medium batch", price_range: "$$$$", price_min: 130, price_max: 160, tasting_notes: "Vanilla, caramel, oak.", description: "Iconic reposado decanter." },
      { name: "Clase Azul Añejo", type: "anejo", additive_free: false, organic: false, agave_region: "Tequila Valley", abv: 40, production_volume: "Limited", price_range: "$$$$", price_min: 400, price_max: 500, tasting_notes: "Rich oak, toffee, dark fruit.", description: "Luxury añejo collectible.", editions: [{ name: "Añejo Gold Edition", description: "Gold ceramic decanter release.", limited_edition: true }] },
    ],
  },
];

export interface SeedRecipe {
  name: string;
  slug: string;
  description: string;
  difficulty: RecipeDifficulty;
  ingredients: Array<{ item: string; amount: string; unit: string }>;
  instructions: string;
  tequilaMatch: string;
  note?: string;
}

export const seedRecipes: SeedRecipe[] = [
  {
    name: "Classic Margarita",
    slug: "classic-margarita",
    description: "The quintessential tequila cocktail — balanced, bright, and additive-free friendly.",
    difficulty: "easy",
    tequilaMatch: "Lalo Blanco",
    note: "Use an additive-free blanco for the cleanest agave expression.",
    ingredients: [
      { item: "Additive-free blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "1", unit: "oz" },
      { item: "Orange liqueur", amount: "0.75", unit: "oz" },
      { item: "Agave syrup", amount: "0.25", unit: "oz" },
    ],
    instructions: "Shake all ingredients with ice. Strain into a salt-rimmed rocks glass over fresh ice. Garnish with a lime wheel.",
  },
  {
    name: "Paloma",
    slug: "paloma",
    description: "Mexico's favorite highball — refreshing grapefruit and tequila.",
    difficulty: "easy",
    tequilaMatch: "Pasote Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh grapefruit juice", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "0.5", unit: "oz" },
      { item: "Grapefruit soda", amount: "2", unit: "oz" },
    ],
    instructions: "Build in a highball glass over ice. Stir gently. Garnish with a grapefruit wedge.",
  },
  {
    name: "Tommy's Margarita",
    slug: "tommys-margarita",
    description: "San Francisco classic using agave nectar instead of orange liqueur.",
    difficulty: "easy",
    tequilaMatch: "Fortaleza Blanco",
    note: "Best with a rich, additive-free blanco.",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "1", unit: "oz" },
      { item: "Agave nectar", amount: "0.5", unit: "oz" },
    ],
    instructions: "Shake with ice and strain into a rocks glass over ice. No salt rim needed.",
  },
  {
    name: "Oaxaca Old Fashioned",
    slug: "oaxaca-old-fashioned",
    description: "Smoky mezcal-tequila split base with agave sweetness.",
    difficulty: "medium",
    tequilaMatch: "Tequila Ocho Reposado",
    ingredients: [
      { item: "Reposado tequila", amount: "1.5", unit: "oz" },
      { item: "Mezcal", amount: "0.5", unit: "oz" },
      { item: "Agave syrup", amount: "0.25", unit: "oz" },
      { item: "Angostura bitters", amount: "2", unit: "dashes" },
    ],
    instructions: "Stir with ice and strain into a rocks glass over a large cube. Flame an orange peel over the glass.",
  },
  {
    name: "Ranch Water",
    slug: "ranch-water",
    description: "West Texas highball — tequila, lime, and sparkling mineral water.",
    difficulty: "easy",
    tequilaMatch: "Cimarron Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "0.75", unit: "oz" },
      { item: "Sparkling mineral water", amount: "4", unit: "oz" },
    ],
    instructions: "Build over ice in a highball glass. Top with sparkling water. Garnish with lime.",
  },
  {
    name: "Tequila Sunrise",
    slug: "tequila-sunrise",
    description: "Layered citrus cocktail with a sunrise gradient.",
    difficulty: "easy",
    tequilaMatch: "Espolòn Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh orange juice", amount: "4", unit: "oz" },
      { item: "Grenadine", amount: "0.5", unit: "oz" },
    ],
    instructions: "Build tequila and orange juice over ice. Float grenadine for the sunrise effect.",
  },
  {
    name: "Matador",
    slug: "matador",
    description: "Simple three-ingredient pineapple tequila sour.",
    difficulty: "easy",
    tequilaMatch: "Suerte Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Pineapple juice", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "0.5", unit: "oz" },
    ],
    instructions: "Shake with ice and strain into a chilled coupe.",
  },
  {
    name: "Siesta",
    slug: "siesta",
    description: "Grapefruit and Campari tequila cocktail with a bitter edge.",
    difficulty: "medium",
    tequilaMatch: "G4 Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "1.5", unit: "oz" },
      { item: "Fresh grapefruit juice", amount: "0.75", unit: "oz" },
      { item: "Fresh lime juice", amount: "0.5", unit: "oz" },
      { item: "Campari", amount: "0.5", unit: "oz" },
      { item: "Simple syrup", amount: "0.5", unit: "oz" },
    ],
    instructions: "Shake with ice and strain into a coupe. Garnish with grapefruit peel.",
  },
  {
    name: "Batanga",
    slug: "batanga",
    description: "Cola and tequila highball from Jalisco — surprisingly perfect.",
    difficulty: "easy",
    tequilaMatch: "Tapatio Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Mexican cola", amount: "4", unit: "oz" },
      { item: "Fresh lime juice", amount: "0.5", unit: "oz" },
    ],
    instructions: "Build in a salt-rimmed glass over ice. Stir with a knife (traditionally).",
  },
  {
    name: "Cantarito",
    slug: "cantarito",
    description: "Fruity clay-pot cocktail from Jalisco with citrus and soda.",
    difficulty: "medium",
    tequilaMatch: "Arette Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh orange juice", amount: "2", unit: "oz" },
      { item: "Fresh grapefruit juice", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "1", unit: "oz" },
      { item: "Grapefruit soda", amount: "2", unit: "oz" },
    ],
    instructions: "Mix citrus and tequila in a jar or highball. Add ice and top with soda. Rim with salt.",
  },
  {
    name: "Tequila Old Fashioned",
    slug: "tequila-old-fashioned",
    description: "Aged tequila stirred down with agave and bitters.",
    difficulty: "medium",
    tequilaMatch: "Fortaleza Añejo",
    note: "Use an additive-free añejo for best results.",
    ingredients: [
      { item: "Añejo tequila", amount: "2", unit: "oz" },
      { item: "Agave syrup", amount: "0.25", unit: "oz" },
      { item: "Mole bitters", amount: "2", unit: "dashes" },
    ],
    instructions: "Stir with ice and strain over a large cube. Express orange peel over the glass.",
  },
  {
    name: "Frozen Margarita",
    slug: "frozen-margarita",
    description: "Blended classic for warm days.",
    difficulty: "easy",
    tequilaMatch: "Lalo Blanco",
    ingredients: [
      { item: "Blanco tequila", amount: "2", unit: "oz" },
      { item: "Fresh lime juice", amount: "1", unit: "oz" },
      { item: "Orange liqueur", amount: "0.75", unit: "oz" },
      { item: "Ice", amount: "1.5", unit: "cup" },
    ],
    instructions: "Blend until smooth. Serve in a salt-rimmed glass.",
  },
];

export function countSeedTequilas(): number {
  return seedProducers.reduce((sum, producer) => sum + producer.tequilas.length, 0);
}
