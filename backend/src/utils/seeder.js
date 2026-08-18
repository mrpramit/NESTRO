import 'dotenv/config';
import mongoose from "mongoose";
import CategoryModel from "../models/category.models.js";
import RoomModel from "../models/room.models.js";
import ProductModel from "../models/product.models.js";

const categoriesData = [
  { name: "Sofas", slug: "sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Beds", slug: "beds", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Dining Tables", slug: "dining", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "TV Units", slug: "tv-units", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Coffee Tables", slug: "coffee-tables", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Cabinets", slug: "cabinets", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Mattresses", slug: "mattresses", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Wardrobes", slug: "wardrobes", image: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Sofa Cum Beds", slug: "sofa-cum-beds", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Bookshelves", slug: "bookshelves", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Study Tables", slug: "study-tables", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80", status: true },
  { name: "Kitchen Cabinets", slug: "kitchen-cabinets", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80", status: true }
];

const roomsData = [
  { name: "Living Room", slug: "living-room", status: true },
  { name: "Bedroom", slug: "bedroom", status: true },
  { name: "Dining Room", slug: "dining-room", status: true },
  { name: "Study Room", slug: "study-room", status: true },
  { name: "Outdoor", slug: "outdoor", status: true }
];

const rawProducts = [
  // Sofas (Living Room)
  {
    name: "Classic Velvet Chesterfield Sofa",
    slug: "classic-velvet-chesterfield-sofa",
    categorySlug: "sofas",
    roomSlug: "living-room",
    originalPrice: 1500,
    salePrice: 1200,
    shortDescription: "Timeless luxury button-tufted Chesterfield sofa in rich navy blue velvet.",
    description: "Bring ultimate luxury to your living room with this classic Chesterfield sofa. Features button-tufted upholstery, rolled arms, and elegant turned wooden legs. Crafted from solid pine wood and high-resilience foam.",
    material: "Velvet & Solid Wood",
    width: 220, height: 85, depth: 95, weight: 55,
    color: "Navy Blue",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    name: "Scandinavian 3-Seater Sofa",
    slug: "scandinavian-3-seater-sofa",
    categorySlug: "sofas",
    roomSlug: "living-room",
    originalPrice: 900,
    salePrice: 750,
    shortDescription: "Minimalist light grey linen sofa with tapered oak legs.",
    description: "Elegant Nordic design featuring clean lines, comfortable pocket-spring cushions, and a durable solid oak frame. Perfect for modern urban living rooms.",
    material: "Linen Fabric & Oak",
    width: 200, height: 80, depth: 90, weight: 42,
    color: "Light Grey",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Luxury Leather L-Shape Sectional",
    slug: "luxury-leather-l-shape-sectional",
    categorySlug: "sofas",
    roomSlug: "living-room",
    originalPrice: 3200,
    salePrice: 2700,
    shortDescription: "Premium Italian leather L-shape sectional sofa in tan color.",
    description: "Spacious, comfortable, and sophisticated. Made from top-grain Italian leather that ages beautifully. Sectional layout offers ample seating space for family gatherings.",
    material: "Italian Leather & Metal",
    width: 280, height: 82, depth: 160, weight: 98,
    color: "Tan Brown",
    featured: true, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Mid-Century Modern Loveseat",
    slug: "mid-century-modern-loveseat",
    categorySlug: "sofas",
    roomSlug: "living-room",
    originalPrice: 750,
    salePrice: 599,
    shortDescription: "Charming 2-seater loveseat in mustard yellow bouclé fabric.",
    description: "Compact size perfect for apartments, study rooms, or reading corners. Features flared arms and tapered walnut legs with durable bouclé fabric.",
    material: "Bouclé Fabric & Rattan",
    width: 150, height: 78, depth: 85, weight: 30,
    color: "Mustard Yellow",
    featured: false, bestSeller: true, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Beds (Bedroom)
  {
    name: "Platform King Bed with Headboard",
    slug: "platform-king-bed-with-headboard",
    categorySlug: "beds",
    roomSlug: "bedroom",
    originalPrice: 1100,
    salePrice: 899,
    shortDescription: "Durable walnut wood platform bed frame with integrated woven cane headboard.",
    description: "Sleep in natural style. Made of sustainably sourced solid walnut wood with detailed rattan/cane headboard support. No box spring required.",
    material: "Walnut Wood & Rattan",
    width: 210, height: 110, depth: 220, weight: 70,
    color: "Natural Walnut",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Tufted Velvet Storage Queen Bed",
    slug: "tufted-velvet-storage-queen-bed",
    categorySlug: "beds",
    roomSlug: "bedroom",
    originalPrice: 1350,
    salePrice: 1099,
    shortDescription: "Luxurious queen bed with gas-lift under-bed storage drawers.",
    description: "Maximize your space with style. Features a high button-tufted winged headboard in premium emerald green velvet and hydraulic storage lift drawers underneath.",
    material: "Velvet & Steel Frame",
    width: 170, height: 130, depth: 210, weight: 85,
    color: "Emerald Green",
    featured: false, bestSeller: true, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Rustic Reclaimed Wood Bed Frame",
    slug: "rustic-reclaimed-wood-bed-frame",
    categorySlug: "beds",
    roomSlug: "bedroom",
    originalPrice: 1200,
    salePrice: 950,
    shortDescription: "Handcrafted reclaimed pine wood double bed frame.",
    description: "Each piece has unique grains and textures. Solid timber construction offers a heavy-duty, long-lasting setup for rustic master bedrooms.",
    material: "Reclaimed Pine",
    width: 160, height: 95, depth: 205, weight: 65,
    color: "Weathered Pine",
    featured: false, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Dining Tables (Dining Room)
  {
    name: "Solid Oak 6-Seater Dining Table",
    slug: "solid-oak-6-seater-dining-table",
    categorySlug: "dining",
    roomSlug: "dining-room",
    originalPrice: 1600,
    salePrice: 1350,
    shortDescription: "Stunning solid white oak dining table with live edge details.",
    description: "A gorgeous focal point for family dinners. Sturdy structural oak legs and a spacious top protected by a heat-resistant matte finish.",
    material: "White Oak",
    width: 180, height: 76, depth: 90, weight: 50,
    color: "Light Oak",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Marble Round Dining Table",
    slug: "marble-round-dining-table",
    categorySlug: "dining",
    roomSlug: "dining-room",
    originalPrice: 2100,
    salePrice: 1799,
    shortDescription: "Elegant round dining table with Carrara marble top and brass pedestal base.",
    description: "Perfect for intimate dining areas or apartments. Marble top is sealed for stain protection, resting on a heavy metal base finished in brushed brass.",
    material: "Carrara Marble & Brass",
    width: 120, height: 75, depth: 120, weight: 80,
    color: "White & Gold",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Extendable Wooden Dining Table",
    slug: "extendable-wooden-dining-table",
    categorySlug: "dining",
    roomSlug: "dining-room",
    originalPrice: 1400,
    salePrice: 1150,
    shortDescription: "Flexible dining table that extends from 4 to 8 seats.",
    description: "Great for hosting parties. Smart internal leaf extension mechanism makes it easy to increase length in under a minute. Crafted from ash veneer.",
    material: "Ash Wood & Veneer",
    width: 150, height: 75, depth: 90, weight: 45,
    color: "Dark Ash",
    featured: true, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // TV Units (Living Room)
  {
    name: "Walnut Mid-Century TV Stand",
    slug: "walnut-mid-century-tv-stand",
    categorySlug: "tv-units",
    roomSlug: "living-room",
    originalPrice: 650,
    salePrice: 499,
    shortDescription: "Low-profile TV console with sliding slatted tambour doors.",
    description: "Houses all your media players, consoles, and cable routing slots. Beautiful walnut grain with tapered retro legs.",
    material: "Walnut Veneer & Solid Wood",
    width: 160, height: 50, depth: 40, weight: 32,
    color: "Warm Walnut",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Modern Floating Media Console",
    slug: "modern-floating-media-console",
    categorySlug: "tv-units",
    roomSlug: "living-room",
    originalPrice: 480,
    salePrice: 380,
    shortDescription: "Wall-mounted high-gloss white media cabinet.",
    description: "Saves floor space and creates a clean floating look. Features push-to-open cabinets with cable outlet holes on top.",
    material: "Engineered Wood & Gloss Laminate",
    width: 140, height: 30, depth: 35, weight: 18,
    color: "Gloss White",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Coffee Tables (Living Room)
  {
    name: "Industrial Wood & Metal Coffee Table",
    slug: "industrial-wood-&--metal-coffee-table",
    categorySlug: "coffee-tables",
    roomSlug: "living-room",
    originalPrice: 350,
    salePrice: 280,
    shortDescription: "Sturdy reclaimed timber coffee table with black iron frame.",
    description: "Rustic style table for books, plants, and coffee cups. Lower mesh shelf provides extra storage space.",
    material: "Pine Timber & Cast Iron",
    width: 100, height: 45, depth: 60, weight: 15,
    color: "Dark Wood",
    featured: false, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Travertine Stone Coffee Table",
    slug: "travertine-stone-coffee-table",
    categorySlug: "coffee-tables",
    roomSlug: "living-room",
    originalPrice: 950,
    salePrice: 799,
    shortDescription: "Stunning organic cream travertine stone block coffee table.",
    description: "Highly luxury statement piece. Made of solid honed cream travertine stone. Features beautiful natural variations and a sculptural architectural shape.",
    material: "Honed Travertine Stone",
    width: 90, height: 40, depth: 90, weight: 62,
    color: "Ivory Cream",
    featured: true, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Cabinets (Living Room / Dining Room)
  {
    name: "Retro Rattan Sideboard Buffet",
    slug: "retro-rattan-sideboard-buffet",
    categorySlug: "cabinets",
    roomSlug: "dining-room",
    originalPrice: 850,
    salePrice: 699,
    shortDescription: "Stylish solid wood cabinet featuring woven rattan door panels.",
    description: "Great storage option for plates, glassware, or linens. Natural woven cane panels offer airflow and warm bohemian texture.",
    material: "Oak Wood & Natural Cane",
    width: 150, height: 80, depth: 45, weight: 40,
    color: "Natural Oak",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Minimalist Black Metal Bar Cabinet",
    slug: "minimalist-black-metal-bar-cabinet",
    categorySlug: "cabinets",
    roomSlug: "dining-room",
    originalPrice: 700,
    salePrice: 550,
    shortDescription: "Tall industrial bar cabinet with ribbed glass doors.",
    description: "Stores wine bottles, cocktail shakers, and glasses. Inner glass shelves and dedicated hanging stemware racks. Textured black powder-coated finish.",
    material: "Powder-coated Iron & Fluted Glass",
    width: 80, height: 140, depth: 38, weight: 35,
    color: "Matte Black",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Mattresses (Bedroom)
  {
    name: "Orthopedic Cooling Gel Queen Mattress",
    slug: "orthopedic-cooling-gel-queen-mattress",
    categorySlug: "mattresses",
    roomSlug: "bedroom",
    originalPrice: 800,
    salePrice: 649,
    shortDescription: "10-inch memory foam pocket-spring hybrid cooling mattress.",
    description: "Combines contouring memory foam with responsive pocket coils for zero motion transfer. Gel-infused foam layer disperses body heat.",
    material: "Gel Memory Foam & Coil Springs",
    width: 152, height: 25, depth: 203, weight: 38,
    color: "White & Blue",
    featured: false, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Wardrobes (Bedroom)
  {
    name: "Modern 3-Door Wooden Wardrobe",
    slug: "modern-3-door-wooden-wardrobe",
    categorySlug: "wardrobes",
    roomSlug: "bedroom",
    originalPrice: 1200,
    salePrice: 999,
    shortDescription: "Spacious wardrobe with hanging rails, shelves, and integrated mirror.",
    description: "A complete closet solution. Crafted from high density fiberboard with oak veneers. Features sliding doors to save bedroom space.",
    material: "Engineered Wood & Oak Veneer",
    width: 180, height: 210, depth: 60, weight: 110,
    color: "Natural Ash",
    featured: false, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Sofa Cum Beds (Living Room)
  {
    name: "Futon Convertable Sofa Bed",
    slug: "futon-convertable-sofa-bed",
    categorySlug: "sofa-cum-beds",
    roomSlug: "living-room",
    originalPrice: 600,
    salePrice: 480,
    shortDescription: "Easy fold-down fabric sleeper sofa with wood support legs.",
    description: "Transitions smoothly from a chic lounger to a comfortable bed for overnight guests. Upholstered in durable woven heather linen.",
    material: "Linen & Pine Wood",
    width: 185, height: 80, depth: 85, weight: 34,
    color: "Charcoal Grey",
    featured: false, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Bookshelves (Study Room)
  {
    name: "Industrial Metal Frame Bookshelf",
    slug: "industrial-metal-frame-bookshelf",
    categorySlug: "bookshelves",
    roomSlug: "study-room",
    originalPrice: 400,
    salePrice: 320,
    shortDescription: "5-tier open wood shelf unit with black iron X-brace framework.",
    description: "Durable display bookshelf for books, decor plants, and photo frames. Supports up to 25kg per shelf layer.",
    material: "Pine Wood & Iron",
    width: 100, height: 180, depth: 32, weight: 24,
    color: "Natural Pine & Black",
    featured: false, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Study Tables (Study Room)
  {
    name: "Solid Oak Study Desk with Drawers",
    slug: "solid-oak-study-desk-with-drawers",
    categorySlug: "study-tables",
    roomSlug: "study-room",
    originalPrice: 800,
    salePrice: 650,
    shortDescription: "Scandinavian styling home office desk featuring 3 soft-close drawers.",
    description: "Maximize your study productivity. Crafted from solid white oak, featuring dynamic cable management routes and pencil storage slots.",
    material: "White Oak",
    width: 120, height: 75, depth: 60, weight: 28,
    color: "Honey Oak",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Minimalist Floating Study Desk",
    slug: "minimalist-floating-study-desk",
    categorySlug: "study-tables",
    roomSlug: "study-room",
    originalPrice: 320,
    salePrice: 249,
    shortDescription: "Wall-mounted space saving desk with overhead storage shelving.",
    description: "Perfect for kids' rooms or tight study setups. Features clean wall mounting supports and cord organizer notches.",
    material: "Plywood & Formica Laminate",
    width: 90, height: 45, depth: 50, weight: 12,
    color: "White & Birch",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Kitchen Cabinets (Living Room / Dining Room)
  {
    name: "Modern Kitchen Pantry Cabinet",
    slug: "modern-kitchen-pantry-cabinet",
    categorySlug: "kitchen-cabinets",
    roomSlug: "dining-room",
    originalPrice: 1100,
    salePrice: 899,
    shortDescription: "Large double-door cupboard cabinet with adjustable spice racks.",
    description: "Organize your cereal boxes, cans, and kitchen accessories. Sturdy storage organizer cabinet painted in smooth navy blue shaker finish.",
    material: "MDF & Pine Wood Frame",
    width: 90, height: 185, depth: 40, weight: 52,
    color: "Deep Navy Blue",
    featured: false, bestSeller: false, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    images: []
  },

  // Outdoor (Outdoor Room)
  {
    name: "Luxury Rattan 4-Piece Patio Set",
    slug: "luxury-rattan-4-piece-patio-set",
    categorySlug: "sofas",
    roomSlug: "outdoor",
    originalPrice: 1700,
    salePrice: 1399,
    shortDescription: "All-weather wicker patio set including a loveseat, 2 chairs, and a table.",
    description: "Relax in your garden. Features water-resistant performance cushions and a tempered glass top table. Highly durable hand-woven PE wicker construction.",
    material: "PE Rattan & Powder-coated Steel",
    width: 210, height: 75, depth: 80, weight: 48,
    color: "Charcoal Wicker & Off-white Cushions",
    featured: true, bestSeller: true, newArrival: false,
    thumbnail: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=600&q=80",
    images: []
  },
  {
    name: "Teak Wood Adirondack Lounge Chair",
    slug: "teak-wood-adirondack-lounge-chair",
    categorySlug: "coffee-tables", // Fits lounge styles
    roomSlug: "outdoor",
    originalPrice: 380,
    salePrice: 299,
    shortDescription: "Ergonomic outdoor wooden lounge chair in solid teak wood.",
    description: "Classic comfortable sloped seat and wide armrests. Made of grade-A harvested teak wood, naturally rich in oils that resist water, mold, and termites.",
    material: "Solid Teak Wood",
    width: 75, height: 95, depth: 90, weight: 14,
    color: "Golden Honey Teak",
    featured: false, bestSeller: false, newArrival: true,
    thumbnail: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=600&q=80",
    images: []
  }
];

// Let's multiply products to get up to 45 products total!
const productsToSeed = [];
for (let i = 0; i < 45; i++) {
  const baseProduct = rawProducts[i % rawProducts.length];
  // Make names and slugs unique to avoid MongoDB constraints
  const suffix = Math.floor(i / rawProducts.length) + 1;
  const uniqueName = suffix > 1 ? `${baseProduct.name} (V${suffix})` : baseProduct.name;
  const uniqueSlug = suffix > 1 ? `${baseProduct.slug}-v${suffix}` : baseProduct.slug;
  
  // Vary prices slightly for variety
  const priceVariation = 1 + ((i % 5) - 2) * 0.05; // -10%, -5%, 0%, +5%, +10%
  const originalPrice = Math.round(baseProduct.originalPrice * priceVariation * 80);
  const salePrice = Math.round(baseProduct.salePrice * priceVariation * 80);
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  productsToSeed.push({
    ...baseProduct,
    name: uniqueName,
    slug: uniqueSlug,
    originalPrice,
    salePrice,
    discount,
    stock: true,
    status: true,
    seoTitle: `Shop ${uniqueName} - Premium Furniture Store`,
    seoDescription: `Order the highest quality ${uniqueName}. ${baseProduct.shortDescription}`
  });
}

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully.");

    // Clear existing data
    console.log("Clearing existing collections...");
    await Promise.all([
      CategoryModel.deleteMany({}),
      RoomModel.deleteMany({}),
      ProductModel.deleteMany({})
    ]);
    console.log("Collections cleared successfully.");

    // Insert categories & rooms
    console.log("Seeding categories and room types...");
    const createdCategories = await CategoryModel.insertMany(categoriesData);
    const createdRooms = await RoomModel.insertMany(roomsData);
    console.log(`Successfully seeded ${createdCategories.length} categories.`);
    console.log(`Successfully seeded ${createdRooms.length} room types.`);

    // Map categories & rooms to lookup by slug
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    const roomMap = {};
    createdRooms.forEach(room => {
      roomMap[room.slug] = room._id;
    });

    // Populate Category & Room IDs on products
    const finalProducts = productsToSeed.map(prod => {
      const categoryId = categoryMap[prod.categorySlug] || createdCategories[0]._id;
      const roomId = roomMap[prod.roomSlug] || createdRooms[0]._id;

      // Clean category/room slug temporary fields
      const { categorySlug, roomSlug, ...cleanProduct } = prod;
      return {
        ...cleanProduct,
        categoryId,
        roomId
      };
    });

    // Seed products
    console.log("Seeding products...");
    const createdProducts = await ProductModel.insertMany(finalProducts);
    console.log(`Successfully seeded ${createdProducts.length} products with complete data!`);

    console.log("Database seeding completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed with error: ", error);
    process.exit(1);
  }
};

seedDatabase();
