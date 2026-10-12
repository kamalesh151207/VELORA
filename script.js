/**
 * VELORA — Multi-Page E-Commerce Web Application
 * Brand: VELORA — Everything You Need. One Better Experience.
 * File: script.js
 * 
 * Complete Client-Side Multi-Page Router & E-Commerce Application Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIG & CONSTANTS
  // ==========================================================================
  const CONFIG = {
    currencyCode: 'INR',
    currencyLocale: 'en-IN',
    freeShippingThreshold: 999, // INR
    defaultShippingFee: 79,     // INR
    gstRate: 0.18,              // 18% Demonstrative GST
    storageKeys: {
      cart: 'velora_cart_v1',
      saved: 'velora_saved_v1',
      wishlist: 'velora_wishlist_v1',
      orders: 'velora_orders_v1',
      recent: 'velora_recent_v1',
      addressPref: 'velora_address_v1'
    },
    coupons: {
      'WELCOME10': {
        code: 'WELCOME10',
        description: '10% instant discount up to ₹500 (Min order ₹1,000)',
        type: 'percentage',
        rate: 0.10,
        maxDiscount: 500,
        minSubtotal: 1000
      },
      'SAVE100': {
        code: 'SAVE100',
        description: 'Flat ₹100 discount (Min order ₹799)',
        type: 'flat',
        amount: 100,
        minSubtotal: 799
      },
      'FREESHIP': {
        code: 'FREESHIP',
        description: 'Free standard delivery across all items',
        type: 'shipping',
        minSubtotal: 0
      }
    }
  };

  const FALLBACK_IMAGE_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#F1F4F9"/>
      <circle cx="200" cy="180" r="60" fill="#E3E8EF"/>
      <path d="M175 180 L225 180 M200 155 L200 205" stroke="#8E9BAE" stroke-width="4" stroke-linecap="round"/>
      <text x="200" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#14243A" text-anchor="middle">VELORA</text>
      <text x="200" y="294" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#687487" text-anchor="middle">Demonstration Product</text>
    </svg>
  `);

  // ==========================================================================
  // 2. CENTRALIZED PRODUCT CATALOG (40 Distinct Items)
  // ==========================================================================
  const CATALOG = [
    // --- 1. Electronics ---
    {
      id: 'prod-elec-01',
      name: 'SoundWave ANC Studio Pro Headphones',
      brand: 'AcoustiQ',
      category: 'Electronics',
      subcategory: 'Audio',
      description: 'Engineered with 40mm hybrid drivers and 35dB active noise cancellation. Features memory foam earcups and 40-hour playback.',
      price: 4999,
      originalPrice: 7999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 342,
      stock: 14,
      featured: true,
      popularity: 98,
      tags: ['audio', 'wireless', 'anc', 'headphones'],
      specs: ['Bluetooth 5.3 Low Latency', '40-Hour Battery Life', 'Multi-point Device Pairing', 'USB-C Fast Charging']
    },
    {
      id: 'prod-elec-02',
      name: 'PulseFlow True Wireless Earbuds',
      brand: 'AcoustiQ',
      category: 'Electronics',
      subcategory: 'Audio',
      description: 'Ergonomic in-ear buds with 11mm beryllium drivers, IPX5 sweat resistance, and compact pocket charging case.',
      price: 1899,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
      rating: 4.4,
      reviewCount: 189,
      stock: 22,
      featured: false,
      popularity: 84,
      tags: ['audio', 'earbuds', 'wireless', 'tws'],
      specs: ['IPX5 Water Resistant', '28h Combined Playtime', 'Touch Control Surface', 'Environmental Noise Cancellation']
    },
    {
      id: 'prod-elec-03',
      name: 'TitanFit Active Smartwatch with AMOLED',
      brand: 'VeloTech',
      category: 'Electronics',
      subcategory: 'Wearables',
      description: '1.43-inch Always-On AMOLED display, 100+ workout trackers, continuous SpO2 and heart-rate monitoring with 7-day battery.',
      price: 3299,
      originalPrice: 5499,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 412,
      stock: 9,
      featured: true,
      popularity: 92,
      tags: ['smartwatch', 'fitness', 'wearables', 'amoled'],
      specs: ['1.43" AMOLED 466x466', 'Continuous Health Sensors', '5 ATM Water Resistant', 'Custom Watch Faces']
    },
    {
      id: 'prod-elec-04',
      name: 'Zenith 65W GaN Multi-Port Charger',
      brand: 'VeloTech',
      category: 'Electronics',
      subcategory: 'Accessories',
      description: 'Next-generation Gallium Nitride fast charger with 2 USB-C and 1 USB-A port. Powers laptops, tablets, and phones simultaneously.',
      price: 1499,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 128,
      stock: 18,
      featured: false,
      popularity: 76,
      tags: ['charger', 'gan', 'fast-charging', 'usb-c'],
      specs: ['65W Total Power Delivery', 'Foldable Wall Prongs', 'Intelligent Power Split', 'Over-heat Protection']
    },
    {
      id: 'prod-elec-05',
      name: 'Lumina 4K Ultra HD Streaming Webcam',
      brand: 'NexVision',
      category: 'Electronics',
      subcategory: 'Computing',
      description: 'Crystal-clear 4K Sony CMOS sensor with dual omnidirectional stereo mics and privacy shutter for conferences and streaming.',
      price: 3799,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 94,
      stock: 0, // Tested zero-stock item
      featured: false,
      popularity: 68,
      tags: ['webcam', '4k', 'streaming', 'work-from-home'],
      specs: ['Sony 4K Sensor', 'Dual Noise-canceling Mics', 'Physical Privacy Shutter', 'Plug & Play USB']
    },

    // --- 2. Fashion ---
    {
      id: 'prod-fash-01',
      name: 'Organic Slub Cotton Classic Crewneck',
      brand: 'NordicThread',
      category: 'Fashion',
      subcategory: 'Men',
      description: 'Crafted from 100% GOTS-certified combed organic cotton. Pre-shrunk, breathable, with tailored seam retention.',
      price: 799,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 215,
      stock: 35,
      featured: true,
      popularity: 88,
      tags: ['clothing', 'organic', 't-shirt', 'cotton'],
      specs: ['100% Organic Combed Cotton', '180 GSM Fabric Weight', 'Bio-washed Finish', 'Reinforced Collar Rib']
    },
    {
      id: 'prod-fash-02',
      name: 'Heritage Selvedge Slim-Fit Denim',
      brand: 'IronWeave',
      category: 'Fashion',
      subcategory: 'Men',
      description: '12.5oz Japanese shuttle-loom woven denim with subtle stretch for everyday ease. Classic indigo wash with brass hardware.',
      price: 2499,
      originalPrice: 3999,
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 167,
      stock: 12,
      featured: false,
      popularity: 82,
      tags: ['jeans', 'denim', 'selvedge', 'pants'],
      specs: ['12.5oz Shuttle-loom Denim', 'Subtle 2% Elastane Flex', 'Genuine Brass Rivets', 'Chain-stitched Hem']
    },
    {
      id: 'prod-fash-03',
      name: 'Breeze Linen Relaxed Resort Shirt',
      brand: 'NordicThread',
      category: 'Fashion',
      subcategory: 'Unisex',
      description: 'Breathable pure European flax linen with a camp collar silhouette. Designed for effortless warm-weather layering.',
      price: 1699,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 98,
      stock: 16,
      featured: false,
      popularity: 79,
      tags: ['linen', 'shirt', 'resort', 'summer'],
      specs: ['100% European Flax Linen', 'Casual Camp Collar', 'Mother-of-pearl Look Buttons', 'Garment Dyed']
    },
    {
      id: 'prod-fash-04',
      name: 'All-Weather Urban Commuter Bomber Jacket',
      brand: 'AeroShield',
      category: 'Fashion',
      subcategory: 'Outerwear',
      description: 'Lightweight water-resistant shell with quilted insulated lining, internal passport pocket, and ribbed storm cuffs.',
      price: 3499,
      originalPrice: 5999,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 142,
      stock: 8,
      featured: true,
      popularity: 91,
      tags: ['jacket', 'bomber', 'outerwear', 'water-resistant'],
      specs: ['DWR Water-resistant Coating', 'YKK Zippers Throughout', 'Hidden Security Pocket', 'Thermal Polyfill']
    },
    {
      id: 'prod-fash-05',
      name: 'Merino Wool Minimalist Beanie',
      brand: 'NordicThread',
      category: 'Fashion',
      subcategory: 'Accessories',
      description: 'Ultra-fine 19.5 micron merino wool that provides warm temperature regulation without itchiness.',
      price: 699,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=700&q=80',
      rating: 4.3,
      reviewCount: 64,
      stock: 20,
      featured: false,
      popularity: 62,
      tags: ['beanie', 'wool', 'merino', 'winter'],
      specs: ['100% Merino Wool', 'Rib-knit Construction', 'Foldable Cuff', 'Non-scratchy Handfeel']
    },

    // --- 3. Home and Living ---
    {
      id: 'prod-home-01',
      name: 'AromaPure Ceramic Ultrasonic Diffuser',
      brand: 'Komorebi',
      category: 'Home and Living',
      subcategory: 'Decor',
      description: 'Handcrafted stoneware ceramic cover with whisper-quiet ultrasonic atomization, warm ambient LED, and auto-shutoff.',
      price: 1899,
      originalPrice: 2899,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 284,
      stock: 19,
      featured: true,
      popularity: 95,
      tags: ['diffuser', 'aromatherapy', 'ceramic', 'decor'],
      specs: ['Handmade Ceramic Shell', '180ml Water Tank (8h Mist)', 'Warm White Ambient Glow', 'BPA-Free Reservoir']
    },
    {
      id: 'prod-home-02',
      name: 'Solace Woven Textured Throw Blanket',
      brand: 'Loom & Craft',
      category: 'Home and Living',
      subcategory: 'Bedding',
      description: 'Generously sized 130x170cm waffle-weave blanket woven from breathable cotton-blend yarns with knotted fringe trim.',
      price: 1299,
      originalPrice: 1999,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 110,
      stock: 15,
      featured: false,
      popularity: 74,
      tags: ['blanket', 'throw', 'decor', 'cotton'],
      specs: ['130 x 170 cm Size', 'Breathable Waffle Weave', 'Machine Washable Cold', 'Anti-pilling Treatment']
    },
    {
      id: 'prod-home-03',
      name: 'Lumiere Dimmable Touch Bedside Lamp',
      brand: 'NordicHalo',
      category: 'Home and Living',
      subcategory: 'Lighting',
      description: 'Brushed metal pedestal with a frosted opal glass shade. 3-step capacitive touch dimming and integrated warm 2700K LED.',
      price: 2199,
      originalPrice: 3299,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 198,
      stock: 11,
      featured: true,
      popularity: 89,
      tags: ['lamp', 'lighting', 'bedside', 'minimalist'],
      specs: ['3-Stage Touch Brightness', '2700K Warm Eye-care Glow', 'Heavy Non-slip Brass Base', 'Opal Frosted Glass']
    },
    {
      id: 'prod-home-04',
      name: 'Terrazzo Hand-Poured Soy Wax Candle',
      brand: 'Botanica',
      category: 'Home and Living',
      subcategory: 'Fragrance',
      description: '300g scented candle in a reusable terrazzo vessel. Scent profile: Bergamot, Amberwood, and Crushed Cedar.',
      price: 849,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 88,
      stock: 24,
      featured: false,
      popularity: 72,
      tags: ['candle', 'scented', 'soy-wax', 'terrazzo'],
      specs: ['100% Natural Soy Wax', '55+ Hours Clean Burn', 'Lead-free Cotton Wick', 'Reusable Terrazzo Jar']
    },
    {
      id: 'prod-home-05',
      name: 'Sylvan Solid Acacia Wood Coaster Set',
      brand: 'Komorebi',
      category: 'Home and Living',
      subcategory: 'Dining',
      description: 'Set of 6 hexagonal coasters cut from harvested acacia hardwood with cork bottom pads and brass-wire display cradle.',
      price: 599,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80',
      rating: 4.4,
      reviewCount: 76,
      stock: 30,
      featured: false,
      popularity: 66,
      tags: ['coasters', 'wood', 'acacia', 'tableware'],
      specs: ['6 Coasters + Storage Stand', 'Natural Grain Variations', 'Water-resistant Food Oil Coat', 'Protective Cork Base']
    },

    // --- 4. Beauty and Personal Care ---
    {
      id: 'prod-beau-01',
      name: 'HydroGlow Hyaluronic Vitamin C Serum',
      brand: 'DermaZen',
      category: 'Beauty and Personal Care',
      subcategory: 'Skincare',
      description: 'Triple-molecular weight hyaluronic acid formula blended with 10% ethyl ascorbic acid and soothing Centella Asiatica.',
      price: 999,
      originalPrice: 1499,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 520,
      stock: 45,
      featured: true,
      popularity: 97,
      tags: ['skincare', 'serum', 'vitamin-c', 'hyaluronic'],
      specs: ['Fragrance & Paraben Free', 'Dermatologist Tested', 'Non-comedogenic', '30ml UV-protected Dropper']
    },
    {
      id: 'prod-beau-02',
      name: 'Ceramide Barrier Restorative Moisturizer',
      brand: 'DermaZen',
      category: 'Beauty and Personal Care',
      subcategory: 'Skincare',
      description: '5 essential bio-identical ceramides with phytosphingosine and squalane to replenish damaged skin lipid barriers.',
      price: 849,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 310,
      stock: 28,
      featured: false,
      popularity: 85,
      tags: ['moisturizer', 'ceramides', 'skincare', 'barrier'],
      specs: ['5 Essential Ceramides', 'Lightweight Gel-Cream', 'Suitable for Sensitive Skin', '100ml Airless Pump']
    },
    {
      id: 'prod-beau-03',
      name: 'Botanical Cold-Pressed Hair Elixir Oil',
      brand: 'AuraHerbs',
      category: 'Beauty and Personal Care',
      subcategory: 'Haircare',
      description: 'Infusion of rosemary oil, bhringraj, moringa, and golden jojoba for root nourishment and glossy strand protection.',
      price: 649,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1608248597359-561338df378b?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 142,
      stock: 20,
      featured: false,
      popularity: 73,
      tags: ['hair-oil', 'rosemary', 'herbal', 'natural'],
      specs: ['Cold-pressed Pure Botanical', 'Rosemary & Bhringraj Active', 'Zero Mineral Oils or Silicones', '100ml Glass Bottle']
    },
    {
      id: 'prod-beau-04',
      name: 'Mineral Zinc SPF 50+ Invisible Sunscreen',
      brand: 'DermaZen',
      category: 'Beauty and Personal Care',
      subcategory: 'Suncare',
      description: 'Broad-spectrum PA++++ physical mineral shield that blends seamlessly with no white cast or greasy residue.',
      price: 749,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 290,
      stock: 18,
      featured: false,
      popularity: 86,
      tags: ['sunscreen', 'spf50', 'mineral', 'matte'],
      specs: ['100% Non-nano Zinc Oxide', 'Zero White Cast Formula', 'Reef Safe & Cruelty Free', '50ml Matte Finish']
    },
    {
      id: 'prod-beau-05',
      name: 'AromaSpa Sandalwood & Amber Body Cleanser',
      brand: 'AuraHerbs',
      category: 'Beauty and Personal Care',
      subcategory: 'Bath & Body',
      description: 'Gentle sulfate-free foaming body wash enriched with aloe vera leaf juice and pure Mysore sandalwood notes.',
      price: 499,
      originalPrice: 699,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
      rating: 4.4,
      reviewCount: 95,
      stock: 35,
      featured: false,
      popularity: 64,
      tags: ['body-wash', 'sandalwood', 'bath', 'cleanser'],
      specs: ['Sulfate & Paraben Free', 'Enriched with Aloe Vera', 'pH Balanced 5.5', '250ml Pump Bottle']
    },

    // --- 5. Books and Stationery ---
    {
      id: 'prod-book-01',
      name: 'The Craft of Intentional Design (Hardcover)',
      brand: 'Atelier Press',
      category: 'Books and Stationery',
      subcategory: 'Design Books',
      description: 'A comprehensive, illustrated study into typography, layout architecture, and cognitive ergonomics for modern digital builders.',
      price: 1199,
      originalPrice: 1799,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviewCount: 310,
      stock: 16,
      featured: true,
      popularity: 90,
      tags: ['book', 'design', 'typography', 'hardcover'],
      specs: ['320 Illustrated Color Pages', 'Linen Hardcover Spine', 'FSC-Certified 120gsm Paper', 'Includes Digital Companion']
    },
    {
      id: 'prod-book-02',
      name: 'Artisan Dotted Grid Hardbound Journal',
      brand: 'PaperMill Co.',
      category: 'Books and Stationery',
      subcategory: 'Notebooks',
      description: '160gsm ultra-thick bamboo paper notebook that eliminates fountain pen bleed and ghosting. Features dual ribbon bookmarks and pocket.',
      price: 699,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 220,
      stock: 40,
      featured: false,
      popularity: 87,
      tags: ['journal', 'stationery', 'bullet-journal', 'notebook'],
      specs: ['160gsm No-bleed Bamboo Paper', '5mm Subtle Dot Grid', 'Lay-flat 180° Binding', 'Expandable Back Folder']
    },
    {
      id: 'prod-book-03',
      name: 'Matte Brass Precision Fountain Pen',
      brand: 'Kalligraph',
      category: 'Books and Stationery',
      subcategory: 'Writing',
      description: 'Solid brass barrel with weighted balance. Includes German fine stainless steel nib and refillable piston ink converter.',
      price: 1499,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 114,
      stock: 14,
      featured: false,
      popularity: 80,
      tags: ['pen', 'fountain-pen', 'brass', 'writing'],
      specs: ['Solid Heavy Machined Brass', 'German Stainless Steel F Nib', 'Includes Piston Converter', 'Gift Presentation Box']
    },
    {
      id: 'prod-book-04',
      name: 'System Thinking for Software Leaders',
      brand: 'TechHorizon',
      category: 'Books and Stationery',
      subcategory: 'Technology Books',
      description: 'Explores feedback loops, decoupled services, resilience patterns, and resilient mental models for scalable software engineering.',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 96,
      stock: 25,
      featured: false,
      popularity: 75,
      tags: ['book', 'tech', 'software', 'engineering'],
      specs: ['280 Pages Paperback', 'Practical Architecture Diagrams', 'Published 2025', 'Index & Glossary Included']
    },
    {
      id: 'prod-book-05',
      name: 'Minimalist Walnut Desk Document Tray',
      brand: 'Atelier Desk',
      category: 'Books and Stationery',
      subcategory: 'Desk Organization',
      description: 'Stackable A4 document organizer carved from American black walnut with smooth beveled corners.',
      price: 1399,
      originalPrice: 1999,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 58,
      stock: 8,
      featured: false,
      popularity: 69,
      tags: ['desk', 'organizer', 'walnut', 'office'],
      specs: ['Solid Walnut Hardwood', 'Holds 300+ A4 Sheets', 'Modular Interlocking Pins', 'Soft Felt Underpads']
    },

    // --- 6. Sports and Fitness ---
    {
      id: 'prod-spor-01',
      name: 'GripCore Natural Rubber Alignment Yoga Mat',
      brand: 'AsanaFlex',
      category: 'Sports and Fitness',
      subcategory: 'Yoga',
      description: 'Eco-friendly 4.5mm natural tree rubber base paired with a laser-etched guide surface for non-slip posture alignment.',
      price: 1999,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 380,
      stock: 18,
      featured: true,
      popularity: 93,
      tags: ['yoga', 'fitness', 'mat', 'exercise'],
      specs: ['4.5mm Cushion Density', 'Laser Etched Alignment Lines', 'Wet & Dry Non-slip Grip', 'Carrying Strap Included']
    },
    {
      id: 'prod-spor-02',
      name: 'HydroShield Insulated 1L Steel Flask',
      brand: 'SummitGear',
      category: 'Sports and Fitness',
      subcategory: 'Hydration',
      description: 'Double-wall vacuum-insulated 18/8 food-grade stainless steel bottle. Keeps cold drinks chilled for 24h and hot drinks warm for 12h.',
      price: 1199,
      originalPrice: 1699,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 410,
      stock: 32,
      featured: false,
      popularity: 89,
      tags: ['bottle', 'flask', 'hydration', 'sports'],
      specs: ['1000ml (1L) Volume', '24h Cold / 12h Hot Insulation', 'Leakproof Chug Cap', 'BPA & Toxin Free']
    },
    {
      id: 'prod-spor-03',
      name: 'Dynamic Hex Dumbbell Pair (5kg x 2)',
      brand: 'IronForge',
      category: 'Sports and Fitness',
      subcategory: 'Strength',
      description: 'Heavy-duty solid cast iron weights with protective rubberized hexagonal heads that prevent rolling on gym floors.',
      price: 1799,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 175,
      stock: 10,
      featured: false,
      popularity: 81,
      tags: ['dumbbell', 'weights', 'gym', 'strength'],
      specs: ['2x 5kg Hex Dumbbells', 'Anti-roll Hexagonal Heads', 'Knurled Ergonomic Chrome Grips', 'Floor-friendly Rubber Coat']
    },
    {
      id: 'prod-spor-04',
      name: 'FlexBand Set of 5 Resistance Exercise Loops',
      brand: 'AsanaFlex',
      category: 'Sports and Fitness',
      subcategory: 'Resistance',
      description: '100% natural Malaysian latex bands in five progressive resistance levels (X-Light to X-Heavy). Includes travel mesh pouch.',
      price: 499,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=700&q=80',
      rating: 4.5,
      reviewCount: 230,
      stock: 45,
      featured: false,
      popularity: 83,
      tags: ['resistance-bands', 'fitness', 'home-workout', 'latex'],
      specs: ['5 Color-coded Resistance Tiers', '100% Natural Snap-proof Latex', 'Workout Instruction Booklet', 'Breathable Mesh Bag']
    },
    {
      id: 'prod-spor-05',
      name: 'AeroSpeed High-RPM Speed Jump Rope',
      brand: 'SummitGear',
      category: 'Sports and Fitness',
      subcategory: 'Cardio',
      description: 'Dual 360° ball bearing aluminum handles with adjustable coated steel cable for smooth double-under workouts.',
      price: 599,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80',
      rating: 4.4,
      reviewCount: 88,
      stock: 26,
      featured: false,
      popularity: 70,
      tags: ['jump-rope', 'cardio', 'speed-rope', 'training'],
      specs: ['Dual 360° Ball Bearings', '3-Meter Adjustable Steel Cable', 'Anti-slip Textured Alloy Grips', 'Zero-kink Cable Coat']
    },

    // --- 7. Accessories ---
    {
      id: 'prod-acc-01',
      name: 'Full-Grain Tuscan Leather Bi-Fold Wallet',
      brand: 'Valenti & Co',
      category: 'Accessories',
      subcategory: 'Wallets',
      description: 'Hand-burnished vegetable tanned leather with 8 card slots, billfold divider, and RFID blocking signal mesh.',
      price: 1499,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 195,
      stock: 14,
      featured: true,
      popularity: 91,
      tags: ['wallet', 'leather', 'rfid', 'accessories'],
      specs: ['Vegetable-tanned Full Grain', 'Certified RFID Blocking Core', 'Holds 10+ Cards + Cash', 'Develops Rich Patina']
    },
    {
      id: 'prod-acc-02',
      name: 'Nomad 24L Weatherproof Daily Backpack',
      brand: 'PackCraft',
      category: 'Accessories',
      subcategory: 'Bags',
      description: 'Durable 900D recycled Cordura fabric with dedicated padded 16" laptop sleeve, luggage passthrough, and waterproof zippers.',
      price: 3299,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 260,
      stock: 11,
      featured: true,
      popularity: 94,
      tags: ['backpack', 'laptop-bag', 'travel', 'commuter'],
      specs: ['24-Liter Capacity', '16-Inch Suspended Laptop Cradle', 'Recycled Cordura Weatherproof', 'Luggage Trolley Pass-through']
    },
    {
      id: 'prod-acc-03',
      name: 'Aviator Titanium Polarized Sunglasses',
      brand: 'Solstice Optics',
      category: 'Accessories',
      subcategory: 'Eyewear',
      description: 'Ultra-lightweight Japanese titanium frame with Category 3 polarized TAC lenses delivering 100% UVA/UVB blockage.',
      price: 2199,
      originalPrice: 3499,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
      rating: 4.6,
      reviewCount: 134,
      stock: 15,
      featured: false,
      popularity: 82,
      tags: ['sunglasses', 'polarized', 'aviator', 'titanium'],
      specs: ['Japanese Titanium Alloy', 'Polarized Anti-glare TAC Lens', '100% UV400 Protection', 'Microfiber Case Included']
    },
    {
      id: 'prod-acc-04',
      name: 'Chronograph Minimalist Sapphire Watch',
      brand: 'Valenti & Co',
      category: 'Accessories',
      subcategory: 'Watches',
      description: 'Surgical-grade 316L stainless steel timepiece with scratch-resistant sapphire crystal glass and Japanese Miyota quartz movement.',
      price: 4499,
      originalPrice: 6999,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviewCount: 178,
      stock: 7,
      featured: true,
      popularity: 96,
      tags: ['watch', 'chronograph', 'sapphire', 'luxury'],
      specs: ['Scratch-proof Sapphire Glass', 'Miyota Japanese Quartz', '5 ATM Water Resistance', 'Italian Leather Strap']
    },
    {
      id: 'prod-acc-05',
      name: 'KeyMaster Compact Key Organizer with Clip',
      brand: 'PackCraft',
      category: 'Accessories',
      subcategory: 'Keychains',
      description: 'Aircraft aluminum chassis that silences jangling keys and holds up to 8 standard keys with an integrated pocket clip.',
      price: 699,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
      rating: 4.3,
      reviewCount: 65,
      stock: 28,
      featured: false,
      popularity: 65,
      tags: ['keychain', 'edc', 'organizer', 'aluminum'],
      specs: ['T6 Aircraft Aluminum', 'Eliminates Key Jingling', 'Accommodates 2 to 8 Keys', 'Removable Pocket Clip']
    },

    // --- 8. Kitchen Essentials ---
    {
      id: 'prod-kitch-01',
      name: 'Artisan Precision Gooseneck Pour-Over Kettle',
      brand: 'BaristaCraft',
      category: 'Kitchen Essentials',
      subcategory: 'Coffee',
      description: 'Ergonomic counterbalanced handle with elongated gooseneck spout for controlled drip extraction. Suitable for induction.',
      price: 1899,
      originalPrice: 2799,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 240,
      stock: 17,
      featured: true,
      popularity: 92,
      tags: ['coffee', 'kettle', 'pour-over', 'kitchen'],
      specs: ['1.0L Usable Capacity', 'Food Grade 304 Stainless Steel', 'Counterbalanced Oak Handle', 'Induction & Gas Compatible']
    },
    {
      id: 'prod-kitch-02',
      name: 'CastIron 10-Inch Pre-Seasoned Skillet',
      brand: 'Heirloom Cookware',
      category: 'Kitchen Essentials',
      subcategory: 'Cookware',
      description: 'Heavyweight virgin cast iron skillet pre-seasoned with 100% natural flaxseed oil. Superior heat retention for searing and baking.',
      price: 1599,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviewCount: 420,
      stock: 13,
      featured: true,
      popularity: 95,
      tags: ['skillet', 'cast-iron', 'cookware', 'pan'],
      specs: ['Pre-seasoned with Flax Oil', 'Oven Safe up to 260°C', 'Dual Pour Spouts', 'Heavy Iron Heat Retention']
    },
    {
      id: 'prod-kitch-03',
      name: 'ChefMaster 8-Inch Japanese VG-10 Chef Knife',
      brand: 'Heirloom Cookware',
      category: 'Kitchen Essentials',
      subcategory: 'Cutlery',
      description: '67 layers of Damascus steel clad around a VG-10 high carbon core (60±2 HRC) with ergonomic Pakkawood handle.',
      price: 2999,
      originalPrice: 4499,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviewCount: 188,
      stock: 6,
      featured: true,
      popularity: 97,
      tags: ['knife', 'damascus', 'chef-knife', 'cutlery'],
      specs: ['67-Layer Damascus VG-10 Core', '15° Razor Sharp Hand Bevel', 'Full Tang Pakkawood Grip', 'Sheath & Box Included']
    },
    {
      id: 'prod-kitch-04',
      name: 'Conical Burr Adjustable Manual Coffee Grinder',
      brand: 'BaristaCraft',
      category: 'Kitchen Essentials',
      subcategory: 'Coffee',
      description: 'CNC machined 38mm stainless steel pentagonal burr with 36 stepped grind settings from espresso to French press.',
      price: 2499,
      originalPrice: 3599,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviewCount: 154,
      stock: 12,
      featured: false,
      popularity: 84,
      tags: ['coffee-grinder', 'burr-grinder', 'manual', 'coffee'],
      specs: ['CNC 38mm Stainless Steel Burr', '36 Precision Click Settings', 'Double Ball Bearing Stability', '30g Bean Capacity']
    },
    {
      id: 'prod-kitch-05',
      name: 'End-Grain Organic Teak Cutting Board',
      brand: 'Heirloom Cookware',
      category: 'Kitchen Essentials',
      subcategory: 'Prep',
      description: 'Thick 3.5cm end-grain sustainable teak butcher block with deep perimeter juice groove and side hand grips.',
      price: 1899,
      originalPrice: 2699,
      image: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviewCount: 122,
      stock: 15,
      featured: false,
      popularity: 78,
      tags: ['cutting-board', 'teak', 'prep', 'wood'],
      specs: ['End-grain Teak Construction', 'Gentle on Knife Edges', 'Perimeter Juice Groove', 'Pre-treated with Beeswax']
    }
  ];

  const CATALOG_MAP = new Map();
  CATALOG.forEach(p => CATALOG_MAP.set(p.id, p));

  const ALL_CATEGORIES = [
    'Electronics', 'Fashion', 'Home and Living',
    'Beauty and Personal Care', 'Books and Stationery',
    'Sports and Fitness', 'Accessories', 'Kitchen Essentials'
  ];

  // ==========================================================================
  // 3. APPLICATION STATE & STORAGE
  // ==========================================================================
  const State = {
    cart: [],
    savedForLater: [],
    wishlist: [],
    orders: [],
    recentlyViewed: [],
    appliedCoupon: null,
    filters: {
      category: 'all',
      brand: 'all',
      searchQuery: '',
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      inStockOnly: false,
      discountOnly: false,
      sort: 'relevance'
    }
  };

  const Storage = {
    load(key, fallback) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        console.warn('Storage read warning:', e);
        return fallback;
      }
    },
    save(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage save warning:', e);
      }
    },
    init() {
      State.cart = this.load(CONFIG.storageKeys.cart, []);
      State.savedForLater = this.load(CONFIG.storageKeys.saved, []);
      State.wishlist = this.load(CONFIG.storageKeys.wishlist, []);
      State.orders = this.load(CONFIG.storageKeys.orders, []);
      State.recentlyViewed = this.load(CONFIG.storageKeys.recent, []);

      // Validate cart items against catalog
      State.cart = State.cart.filter(item => CATALOG_MAP.has(item.productId));
      State.savedForLater = State.savedForLater.filter(item => CATALOG_MAP.has(item.productId));
      State.wishlist = State.wishlist.filter(id => CATALOG_MAP.has(id));
      State.recentlyViewed = State.recentlyViewed.filter(id => CATALOG_MAP.has(id));
    },
    saveCart() { this.save(CONFIG.storageKeys.cart, State.cart); },
    saveSaved() { this.save(CONFIG.storageKeys.saved, State.savedForLater); },
    saveWishlist() { this.save(CONFIG.storageKeys.wishlist, State.wishlist); },
    saveOrders() { this.save(CONFIG.storageKeys.orders, State.orders); },
    saveRecentlyViewed() { this.save(CONFIG.storageKeys.recent, State.recentlyViewed); },
    getAddressPref() { return this.load(CONFIG.storageKeys.addressPref, null); },
    saveAddressPref(pref) { this.save(CONFIG.storageKeys.addressPref, pref); }
  };

  // ==========================================================================
  // 4. PRICING & PROMOTION ENGINE (Integer Paise Calculations)
  // ==========================================================================
  const currencyFormatter = new Intl.NumberFormat(CONFIG.currencyLocale, {
    style: 'currency',
    currency: CONFIG.currencyCode,
    maximumFractionDigits: 0
  });

  function formatCurrency(amount) {
    return currencyFormatter.format(amount || 0);
  }

  const PricingEngine = {
    calculateSubtotal(items) {
      if (!Array.isArray(items) || items.length === 0) return 0;
      let totalPaise = 0;
      for (const item of items) {
        const prod = CATALOG_MAP.get(item.productId);
        if (prod) {
          const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
          totalPaise += Math.round(prod.price * 100) * qty;
        }
      }
      return totalPaise / 100;
    },

    calculateProductSavings(items) {
      if (!Array.isArray(items) || items.length === 0) return 0;
      let totalPaise = 0;
      for (const item of items) {
        const prod = CATALOG_MAP.get(item.productId);
        if (prod && prod.originalPrice && prod.originalPrice > prod.price) {
          const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
          const diffPaise = Math.round((prod.originalPrice - prod.price) * 100);
          totalPaise += diffPaise * qty;
        }
      }
      return totalPaise / 100;
    },

    calculateCouponDiscount(subtotal, coupon) {
      if (!coupon || subtotal <= 0) return 0;
      if (subtotal < (coupon.minSubtotal || 0)) return 0;

      if (coupon.type === 'percentage') {
        const discPaise = Math.round(subtotal * 100 * coupon.rate);
        const maxPaise = Math.round((coupon.maxDiscount || 999999) * 100);
        return Math.min(discPaise, maxPaise) / 100;
      }
      if (coupon.type === 'flat') {
        const discPaise = Math.round((coupon.amount || 0) * 100);
        return Math.min(discPaise, Math.round(subtotal * 100)) / 100;
      }
      return 0;
    },

    calculateDeliveryFee(subtotal, coupon) {
      if (subtotal <= 0) return 0;
      if (coupon && coupon.code === 'FREESHIP') return 0;
      if (subtotal >= CONFIG.freeShippingThreshold) return 0;
      return CONFIG.defaultShippingFee;
    },

    computeFullBreakdown(items, coupon = State.appliedCoupon) {
      const subtotal = this.calculateSubtotal(items);
      const productSavings = this.calculateProductSavings(items);
      const couponDiscount = this.calculateCouponDiscount(subtotal, coupon);
      const taxableAmount = Math.max(0, subtotal - couponDiscount);
      const taxAmount = Math.round(taxableAmount * CONFIG.gstRate);
      const deliveryFee = this.calculateDeliveryFee(subtotal, coupon);
      const finalTotal = Math.max(0, taxableAmount + taxAmount + deliveryFee);
      const totalUnits = items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);

      return {
        itemCount: items.length,
        totalUnits,
        subtotal,
        productSavings,
        couponDiscount,
        taxableAmount,
        taxAmount,
        deliveryFee,
        finalTotal,
        hasFreeDelivery: deliveryFee === 0,
        amountNeededForFreeDelivery: Math.max(0, CONFIG.freeShippingThreshold - subtotal)
      };
    }
  };

  // ==========================================================================
  // 5. CATALOG QUERY (Filtering & Sorting)
  // ==========================================================================
  const CatalogQuery = {
    filterAndSort(filters = State.filters) {
      const { category, brand, searchQuery, minPrice, maxPrice, minRating, inStockOnly, discountOnly, sort } = filters;
      let results = [...CATALOG];

      if (category && category !== 'all') {
        results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (brand && brand !== 'all') {
        results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }

      if (searchQuery && searchQuery.trim().length > 0) {
        const terms = searchQuery.trim().toLowerCase().split(/\s+/);
        results = results.filter(p => {
          const text = `${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
          return terms.every(t => text.includes(t));
        });
      }

      if (typeof minPrice === 'number' && !isNaN(minPrice) && minPrice >= 0) {
        results = results.filter(p => p.price >= minPrice);
      }
      if (typeof maxPrice === 'number' && !isNaN(maxPrice) && maxPrice > 0) {
        results = results.filter(p => p.price <= maxPrice);
      }

      if (minRating > 0) {
        results = results.filter(p => p.rating >= minRating);
      }

      if (inStockOnly) {
        results = results.filter(p => p.stock > 0);
      }

      if (discountOnly) {
        results = results.filter(p => p.originalPrice && p.originalPrice > p.price);
      }

      results.sort((a, b) => {
        switch (sort) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'rating-desc': return b.rating - a.rating;
          case 'discount-desc': {
            const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
            const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
            return discB - discA;
          }
          case 'popularity-desc': return b.popularity - a.popularity;
          case 'relevance':
          default:
            return b.featured === a.featured ? b.popularity - a.popularity : b.featured ? 1 : -1;
        }
      });

      return results;
    }
  };

  // ==========================================================================
  // 6. TOAST NOTIFICATIONS
  // ==========================================================================
  const Toast = {
    show(message, type = 'teal', duration = 3200) {
      const container = document.getElementById('toast-wrap');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');

      let icon = '✓';
      if (type === 'error') icon = '✕';
      if (type === 'warning') icon = '⚠️';

      toast.innerHTML = `
        <span class="toast-msg"><strong>${icon}</strong> ${message}</span>
        <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
      `;

      toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
      container.appendChild(toast);

      setTimeout(() => {
        if (toast.isConnected) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
          toast.style.transition = 'all 0.25s ease';
          setTimeout(() => toast.remove(), 260);
        }
      }, duration);
    }
  };

  // ==========================================================================
  // 7. UI HELPERS & COMPONENTS
  // ==========================================================================
  const UI = {
    updateHeaderBadges() {
      const totalUnits = State.cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
      const wishlistCount = State.wishlist.length;
      const orderCount = State.orders ? State.orders.length : 0;
      const breakdown = PricingEngine.computeFullBreakdown(State.cart);

      const cartBadge = document.getElementById('cart-badge') || document.getElementById('cart-count-badge');
      if (cartBadge) {
        cartBadge.textContent = totalUnits;
        cartBadge.hidden = false;
      }

      const mobileCartBadge = document.getElementById('mobile-cart-count');
      if (mobileCartBadge) mobileCartBadge.textContent = totalUnits;

      const wishBadge = document.getElementById('wishlist-badge') || document.getElementById('wishlist-count-badge');
      if (wishBadge) wishBadge.textContent = wishlistCount;

      const mobileWishBadge = document.getElementById('mobile-wishlist-count');
      if (mobileWishBadge) mobileWishBadge.textContent = wishlistCount;

      const ordersBadge = document.getElementById('orders-badge');
      if (ordersBadge) {
        ordersBadge.textContent = orderCount;
        ordersBadge.hidden = orderCount === 0;
      }

      const headerTotal = document.getElementById('cart-header-total') || document.getElementById('header-cart-total');
      if (headerTotal) {
        headerTotal.textContent = totalUnits > 0 ? formatCurrency(breakdown.finalTotal) : '₹0';
      }
    },

    createProductCardHTML(p) {
      const isWish = State.wishlist.includes(p.id);
      const isOut = p.stock <= 0;
      const discount = p.originalPrice && p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

      return `
        <article class="product-card" data-product-id="${p.id}">
          <div class="pcard-media">
            <a href="/product?id=${encodeURIComponent(p.id)}" class="nav-link" aria-label="${p.name}">
              <img 
                src="${p.image}" 
                alt="${p.name}" 
                class="pcard-img" 
                loading="lazy"
                onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';"
              >
            </a>
            <div class="pcard-badges">
              ${discount > 0 ? `<span class="badge badge-sale">-${discount}%</span>` : ''}
              ${p.featured ? `<span class="badge badge-teal">Staff Pick</span>` : ''}
              ${isOut ? `<span class="badge badge-stock-out">Sold Out</span>` : ''}
            </div>
            <button 
              type="button" 
              class="pcard-wish-btn ${isWish ? 'active' : ''}" 
              data-action="toggle-wishlist" 
              data-product-id="${p.id}"
              aria-label="${isWish ? 'Remove from wishlist' : 'Save to wishlist'}"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div class="pcard-body">
            <div class="pcard-meta">
              <span class="pcard-cat">${p.category}</span>
              <span class="pcard-brand">${p.brand}</span>
            </div>

            <a href="/product?id=${encodeURIComponent(p.id)}" class="pcard-name nav-link" title="${p.name}">
              ${p.name}
            </a>

            <div class="pcard-stars">
              <span class="stars-icon">★</span>
              <strong>${p.rating.toFixed(1)}</strong>
              <span>(${p.reviewCount})</span>
            </div>

            <div class="pcard-pricing">
              <span class="pcard-price">${formatCurrency(p.price)}</span>
              ${p.originalPrice && p.originalPrice > p.price ? `<span class="pcard-orig">${formatCurrency(p.originalPrice)}</span>` : ''}
            </div>

            <div class="pcard-actions">
              <a href="/product?id=${encodeURIComponent(p.id)}" class="btn btn-quickview nav-link">Details</a>
              <button 
                type="button" 
                class="btn btn-teal btn-add" 
                data-action="add-to-cart" 
                data-product-id="${p.id}"
                ${isOut ? 'disabled aria-disabled="true"' : ''}
              >
                ${isOut ? 'Sold Out' : '+ Add to Cart'}
              </button>
            </div>
          </div>
        </article>
      `;
    },

    renderBreadcrumbs(items) {
      return `
        <nav class="breadcrumbs-bar" aria-label="Breadcrumb">
          ${items.map((it, idx) => {
            const isLast = idx === items.length - 1;
            return isLast 
              ? `<span class="breadcrumb-current" aria-current="page">${it.label}</span>`
              : `<a href="${it.href}" class="breadcrumb-item nav-link">${it.label}</a><span class="breadcrumb-sep">/</span>`;
          }).join('')}
        </nav>
      `;
    },

    renderEmptyState(icon, title, desc, ctaText = 'Browse Products', ctaHref = '/products') {
      return `
        <div class="empty-state">
          <div class="empty-icon">${icon}</div>
          <h2 class="empty-title">${title}</h2>
          <p class="empty-desc">${desc}</p>
          <a href="${ctaHref}" class="btn btn-teal btn-lg nav-link">${ctaText}</a>
        </div>
      `;
    }
  };

  // ==========================================================================
  // 8. PAGE RENDERERS
  // ==========================================================================
  const Pages = {

    // ------------------------------------------------------------------------
    // 1. HOME (/)
    // ------------------------------------------------------------------------
    renderHome() {
      document.title = 'VELORA | Everything You Need. One Better Experience.';

      const spotlight = CATALOG.find(p => p.id === 'prod-elec-01') || CATALOG[0];
      const featured = [...CATALOG].filter(p => p.featured).slice(0, 4);
      const deals = [...CATALOG]
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice))
        .slice(0, 4);

      const trending = [...CATALOG]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

      const catIcons = {
        'Electronics': '⚡',
        'Fashion': '👔',
        'Home and Living': '🛋️',
        'Beauty and Personal Care': '✨',
        'Books and Stationery': '📚',
        'Sports and Fitness': '🏃',
        'Accessories': '🎒',
        'Kitchen Essentials': '🍳'
      };

      const recentItems = State.recentlyViewed
        .map(id => CATALOG_MAP.get(id))
        .filter(Boolean)
        .slice(0, 4);

      const app = document.getElementById('app');
      app.innerHTML = `
        <!-- 1. HERO SECTION -->
        <section class="hero-section">
          <div class="container hero-grid">
            <div class="hero-content">
              <span class="hero-badge"><span class="pulse"></span> One Better Experience</span>
              <h1 class="hero-title">
                Discover Better Deals, <br>
                <span class="hero-highlight">Every Single Day.</span>
              </h1>
              <p class="hero-sub">
                Explore an intentionally crafted front-end shopping experience with 40 curated products, instant client-side cart calculations, and zero external tracking.
              </p>
              <div class="hero-btns">
                <a href="/products" class="btn btn-teal btn-lg nav-link">Shop All Products →</a>
                <a href="/deals" class="btn btn-outline nav-link" style="color:#fff; border-color:rgba(255,255,255,.3);">🔥 Explore Deals</a>
              </div>
              <div class="hero-stats">
                <div>
                  <div class="hero-stat-num">40</div>
                  <div class="hero-stat-lbl">Curated Products</div>
                </div>
                <div class="hero-stat-div"></div>
                <div>
                  <div class="hero-stat-num">8</div>
                  <div class="hero-stat-lbl">Store Departments</div>
                </div>
                <div class="hero-stat-div"></div>
                <div>
                  <div class="hero-stat-num">₹999+</div>
                  <div class="hero-stat-lbl">Free Delivery</div>
                </div>
              </div>
            </div>

            <!-- Spotlight Card -->
            <div class="hero-card-col">
              <div class="hero-card">
                <span class="hero-card-badge">Featured Pick</span>
                <img 
                  src="${spotlight.image}" 
                  alt="${spotlight.name}" 
                  class="hero-card-img" 
                  onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';"
                >
                <div class="hero-card-cat">${spotlight.category}</div>
                <h3 class="hero-card-name">${spotlight.name}</h3>
                <div class="hero-card-price-row">
                  <span class="hero-card-price">${formatCurrency(spotlight.price)}</span>
                  <span class="hero-card-orig">${formatCurrency(spotlight.originalPrice)}</span>
                </div>
                <div style="display:flex; gap:8px;">
                  <a href="/product?id=${spotlight.id}" class="btn btn-teal btn-block nav-link">View Details</a>
                  <button type="button" class="btn btn-navy" data-action="add-to-cart" data-product-id="${spotlight.id}">+ Cart</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. SHOP BY CATEGORY -->
        <section class="page-section">
          <div class="container">
            <div class="section-head">
              <div>
                <h2 class="section-title">Shop by Category</h2>
                <p class="section-sub">Find verified essentials across 8 dedicated store departments</p>
              </div>
              <a href="/products" class="btn btn-outline btn-sm nav-link">All Departments →</a>
            </div>

            <div class="home-cat-grid">
              ${ALL_CATEGORIES.map(cat => {
                const count = CATALOG.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                return `
                  <a href="/category?name=${encodeURIComponent(cat)}" class="home-cat-card nav-link">
                    <div class="cat-icon">${catIcons[cat] || '🛍️'}</div>
                    <div>
                      <div class="cat-card-name">${cat}</div>
                      <div class="cat-card-count">${count} Items</div>
                    </div>
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- 3. FEATURED PRODUCTS -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="section-head">
              <div>
                <h2 class="section-title">Featured Products</h2>
                <p class="section-sub">Handpicked essentials recommended by our editorial team</p>
              </div>
              <a href="/products" class="btn btn-outline btn-sm nav-link">View All Products →</a>
            </div>

            <div class="product-grid">
              ${featured.map(p => UI.createProductCardHTML(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 4. PROMOTIONAL BANNERS -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="promo-grid">
              <div class="promo-card promo-teal">
                <span class="promo-label">Welcome Code</span>
                <h3 class="promo-title">10% Off First Demo</h3>
                <p class="promo-desc">Use code <strong>WELCOME10</strong> on orders ≥ ₹1,000 for up to ₹500 instant savings.</p>
                <a href="/cart" class="promo-btn nav-link">Apply in Cart</a>
              </div>
              <div class="promo-card promo-navy">
                <span class="promo-label">Flat Coupon</span>
                <h3 class="promo-title">Flat ₹100 Discount</h3>
                <p class="promo-desc">Use code <strong>SAVE100</strong> on orders ≥ ₹799 across all departments.</p>
                <a href="/products" class="promo-btn nav-link">Shop Essentials</a>
              </div>
              <div class="promo-card promo-gold">
                <span class="promo-label">Free Delivery</span>
                <h3 class="promo-title">Zero Shipping Fee</h3>
                <p class="promo-desc">All orders over ₹999 qualify for automatic zero-fee express dispatch.</p>
                <a href="/deals" class="promo-btn nav-link">See Best Deals</a>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. BEST DEALS SECTION -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="section-head">
              <div>
                <h2 class="section-title">🔥 Hand-Picked Deals</h2>
                <p class="section-sub">High discounts on electronics, fashion, and home lifestyle</p>
              </div>
              <a href="/deals" class="btn btn-outline btn-sm nav-link">See All Deals →</a>
            </div>

            <div class="product-grid">
              ${deals.map(p => UI.createProductCardHTML(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 6. CUSTOMER TOP-RATED -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="section-head">
              <div>
                <h2 class="section-title">⭐ Customer Top-Rated</h2>
                <p class="section-sub">Consistently reviewed items with 4.5+ star ratings</p>
              </div>
              <a href="/products" class="btn btn-outline btn-sm nav-link">Explore Catalog →</a>
            </div>

            <div class="product-grid">
              ${trending.map(p => UI.createProductCardHTML(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 7. RECENTLY VIEWED (IF ANY) -->
        ${recentItems.length > 0 ? `
          <section class="page-section" style="padding-top:0;">
            <div class="container">
              <div class="section-head">
                <div>
                  <h2 class="section-title">Recently Explored</h2>
                  <p class="section-sub">Items you checked out during this session</p>
                </div>
                <a href="/recently-viewed" class="btn btn-outline btn-sm nav-link">View History →</a>
              </div>

              <div class="product-grid">
                ${recentItems.map(p => UI.createProductCardHTML(p)).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- 8. SHOPPING BENEFITS (TRUST STRIP) -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="trust-grid">
              <div class="trust-card">
                <div class="trust-icon">🚚</div>
                <div>
                  <div class="trust-title">Free Express Delivery</div>
                  <div class="trust-desc">Automatic zero-fee delivery on all orders over ₹999 across all pin codes.</div>
                </div>
              </div>
              <div class="trust-card">
                <div class="trust-icon">🛡️</div>
                <div>
                  <div class="trust-title">100% Genuine Products</div>
                  <div class="trust-desc">Curated catalog from verified brands with authentic quality checks.</div>
                </div>
              </div>
              <div class="trust-card">
                <div class="trust-icon">🔄</div>
                <div>
                  <div class="trust-title">7-Day Easy Returns</div>
                  <div class="trust-desc">Hassle-free simulated exchanges and full item guarantees.</div>
                </div>
              </div>
              <div class="trust-card">
                <div class="trust-icon">💬</div>
                <div>
                  <div class="trust-title">24/7 Dedicated Support</div>
                  <div class="trust-desc">Instant customer assistance and transparent order tracking.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 9. NEWSLETTER SECTION -->
        <section class="page-section" style="padding-top:0;">
          <div class="container">
            <div class="newsletter-card">
              <div class="newsletter-info">
                <h3>Stay Ahead of Exclusive Offers</h3>
                <p>Subscribe to our demonstration newsletter for seasonal discount codes, new catalog drops, and special perks.</p>
              </div>
              <form class="newsletter-form" id="newsletter-form">
                <input type="email" id="newsletter-email" class="newsletter-input" placeholder="Enter your email address" required>
                <button type="submit" class="btn btn-teal">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      `;

      // Bind newsletter form
      const newsForm = document.getElementById('newsletter-form');
      if (newsForm) {
        newsForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const emailInput = document.getElementById('newsletter-email');
          const email = (emailInput ? emailInput.value : '').trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Toast.show('Please enter a valid email address', 'error');
            return;
          }
          Toast.show('Subscribed! Thank you for joining the VELORA newsletter.', 'success');
          if (emailInput) emailInput.value = '';
        });
      }
    },

    renderProducts(customFilters = {}) {
      document.title = 'VELORA | All Products';

      // Merge current filters
      const activeFilters = { ...State.filters, ...customFilters };
      State.filters = activeFilters;

      const filtered = CatalogQuery.filterAndSort(activeFilters);
      const allBrands = Array.from(new Set(CATALOG.map(p => p.brand))).sort();

      // Count active non-default filters
      const activeChips = [];
      if (activeFilters.category !== 'all') {
        activeChips.push({ key: 'category', label: `Dept: ${activeFilters.category}` });
      }
      if (activeFilters.brand && activeFilters.brand !== 'all') {
        activeChips.push({ key: 'brand', label: `Brand: ${activeFilters.brand}` });
      }
      if (activeFilters.minPrice !== null || activeFilters.maxPrice !== null) {
        activeChips.push({ key: 'price', label: `Price: ₹${activeFilters.minPrice || 0} - ₹${activeFilters.maxPrice || '∞'}` });
      }
      if (activeFilters.minRating > 0) {
        activeChips.push({ key: 'rating', label: `${activeFilters.minRating}★ & above` });
      }
      if (activeFilters.inStockOnly) {
        activeChips.push({ key: 'instock', label: 'In Stock' });
      }
      if (activeFilters.discountOnly) {
        activeChips.push({ key: 'discount', label: 'On Sale' });
      }

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'All Products', href: '/products' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">All Products</h1>
              <p class="page-sub">Discover products you'll love across every department.</p>
            </div>
          </div>

          <div class="catalog-layout">
            <!-- Filter Sidebar -->
            <aside class="filter-sidebar" id="filter-sidebar">
              <div class="filter-sidebar-head">
                <span class="filter-sidebar-title">Filter Products</span>
                <button type="button" class="btn btn-link btn-sm" id="btn-reset-filters" style="font-size:12px; color:var(--teal);">Reset All</button>
              </div>

              <!-- Categories -->
              <div class="filter-group">
                <div class="filter-group-title">Department</div>
                <div class="filter-option-list">
                  <label class="filter-radio">
                    <input type="radio" name="filter-cat" value="all" ${activeFilters.category === 'all' ? 'checked' : ''}>
                    <span>All Departments</span>
                  </label>
                  ${ALL_CATEGORIES.map(cat => {
                    const count = CATALOG.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                    return `
                      <label class="filter-radio">
                        <input type="radio" name="filter-cat" value="${cat}" ${activeFilters.category.toLowerCase() === cat.toLowerCase() ? 'checked' : ''}>
                        <span>${cat} (${count})</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Price Bounds -->
              <div class="filter-group">
                <div class="filter-group-title">Price Range (₹)</div>
                <div class="price-inputs">
                  <div class="price-input-box">
                    <label>Min</label>
                    <input type="number" id="filter-min-price" class="form-input" placeholder="0" value="${activeFilters.minPrice !== null ? activeFilters.minPrice : ''}">
                  </div>
                  <span class="price-sep">–</span>
                  <div class="price-input-box">
                    <label>Max</label>
                    <input type="number" id="filter-max-price" class="form-input" placeholder="10000" value="${activeFilters.maxPrice !== null ? activeFilters.maxPrice : ''}">
                  </div>
                </div>
                <button type="button" class="btn btn-outline btn-block btn-sm" id="btn-apply-price" style="margin-top:8px;">Apply Price</button>
              </div>

              <!-- Customer Rating -->
              <div class="filter-group">
                <div class="filter-group-title">Customer Rating</div>
                <div class="filter-option-list">
                  <label class="filter-radio">
                    <input type="radio" name="filter-rating" value="0" ${activeFilters.minRating === 0 ? 'checked' : ''}>
                    <span>Any Rating</span>
                  </label>
                  <label class="filter-radio">
                    <input type="radio" name="filter-rating" value="4.5" ${activeFilters.minRating === 4.5 ? 'checked' : ''}>
                    <span>4.5★ &amp; Above</span>
                  </label>
                  <label class="filter-radio">
                    <input type="radio" name="filter-rating" value="4.0" ${activeFilters.minRating === 4.0 ? 'checked' : ''}>
                    <span>4.0★ &amp; Above</span>
                  </label>
                </div>
              </div>

              <!-- Availability & Offers -->
              <div class="filter-group">
                <div class="filter-group-title">Availability &amp; Offers</div>
                <div class="filter-option-list">
                  <label class="filter-cb">
                    <input type="checkbox" id="filter-instock" ${activeFilters.inStockOnly ? 'checked' : ''}>
                    <span>In Stock Only</span>
                  </label>
                  <label class="filter-cb">
                    <input type="checkbox" id="filter-discount" ${activeFilters.discountOnly ? 'checked' : ''}>
                    <span>On Sale / Discounted</span>
                  </label>
                </div>
              </div>

              <!-- Brands -->
              <div class="filter-group">
                <div class="filter-group-title">Brand</div>
                <div class="filter-option-list">
                  <label class="filter-radio">
                    <input type="radio" name="filter-brand" value="all" ${(!activeFilters.brand || activeFilters.brand === 'all') ? 'checked' : ''}>
                    <span>All Brands</span>
                  </label>
                  ${allBrands.slice(0, 10).map(b => {
                    const bCount = CATALOG.filter(p => p.brand.toLowerCase() === b.toLowerCase()).length;
                    return `
                      <label class="filter-radio">
                        <input type="radio" name="filter-brand" value="${b}" ${activeFilters.brand && activeFilters.brand.toLowerCase() === b.toLowerCase() ? 'checked' : ''}>
                        <span>${b} (${bCount})</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>
            </aside>

            <!-- Catalog Content Area -->
            <div class="catalog-main">
              <!-- Toolbar -->
              <div class="catalog-toolbar">
                <div class="catalog-count">
                  Showing <strong>${filtered.length}</strong> of ${CATALOG.length} products
                </div>

                <div style="display:flex; align-items:center; gap:10px; margin-left:auto;">
                  <button type="button" class="btn btn-outline btn-sm mobile-filter-btn" id="mobile-filter-btn">
                    ⚙️ Filters ${activeChips.length > 0 ? `(${activeChips.length})` : ''}
                  </button>

                  <div class="sort-wrap">
                    <label for="catalog-sort-select">Sort by:</label>
                    <select id="catalog-sort-select" class="sort-select">
                      <option value="relevance" ${activeFilters.sort === 'relevance' ? 'selected' : ''}>Featured / Popularity</option>
                      <option value="price-asc" ${activeFilters.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                      <option value="price-desc" ${activeFilters.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                      <option value="rating-desc" ${activeFilters.sort === 'rating-desc' ? 'selected' : ''}>Customer Rating</option>
                      <option value="discount-desc" ${activeFilters.sort === 'discount-desc' ? 'selected' : ''}>Highest Discount</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Active Filter Chips -->
              ${activeChips.length > 0 ? `
                <div class="filter-chips-row">
                  ${activeChips.map(c => `
                    <span class="filter-chip">
                      ${c.label}
                      <span class="chip-x" data-clear-chip="${c.key}">×</span>
                    </span>
                  `).join('')}
                  <button type="button" class="btn-clear-chips" id="btn-clear-all-chips">Clear All</button>
                </div>
              ` : ''}

              <!-- Product Grid or Empty State -->
              ${filtered.length > 0
                ? `<div class="product-grid">${filtered.map(p => UI.createProductCardHTML(p)).join('')}</div>`
                : UI.renderEmptyState('🔍', 'No Products Found', 'Try adjusting your filter options or clearing price boundaries.', 'Reset All Filters', '#reset')
              }
            </div>
          </div>
        </div>
      `;

      // Bind filter controls
      this.bindCatalogFilters();
    },

    bindCatalogFilters() {
      const app = document.getElementById('app');

      // Category radio
      app.querySelectorAll('input[name="filter-cat"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          State.filters.category = e.target.value;
          Pages.renderProducts();
        });
      });

      // Brand radio
      app.querySelectorAll('input[name="filter-brand"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          State.filters.brand = e.target.value;
          Pages.renderProducts();
        });
      });

      // Rating radio
      app.querySelectorAll('input[name="filter-rating"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          State.filters.minRating = parseFloat(e.target.value) || 0;
          Pages.renderProducts();
        });
      });

      // In-stock checkbox
      const inStockCb = document.getElementById('filter-instock');
      if (inStockCb) {
        inStockCb.addEventListener('change', (e) => {
          State.filters.inStockOnly = e.target.checked;
          Pages.renderProducts();
        });
      }

      // Discount checkbox
      const discCb = document.getElementById('filter-discount');
      if (discCb) {
        discCb.addEventListener('change', (e) => {
          State.filters.discountOnly = e.target.checked;
          Pages.renderProducts();
        });
      }

      // Apply price button
      const priceBtn = document.getElementById('btn-apply-price');
      if (priceBtn) {
        priceBtn.addEventListener('click', () => {
          const minVal = document.getElementById('filter-min-price').value;
          const maxVal = document.getElementById('filter-max-price').value;
          State.filters.minPrice = minVal !== '' ? parseFloat(minVal) : null;
          State.filters.maxPrice = maxVal !== '' ? parseFloat(maxVal) : null;
          Pages.renderProducts();
        });
      }

      // Sort dropdown
      const sortSelect = document.getElementById('catalog-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          State.filters.sort = e.target.value;
          Pages.renderProducts();
        });
      }

      // Mobile filter toggle
      const mobFilterBtn = document.getElementById('mobile-filter-btn');
      const sidebarEl = document.getElementById('filter-sidebar');
      if (mobFilterBtn && sidebarEl) {
        mobFilterBtn.addEventListener('click', () => {
          sidebarEl.classList.toggle('mobile-open');
        });
      }

      // Clear individual chips
      app.querySelectorAll('[data-clear-chip]').forEach(chip => {
        chip.addEventListener('click', (e) => {
          const key = e.target.dataset.clearChip;
          if (key === 'category') State.filters.category = 'all';
          else if (key === 'brand') State.filters.brand = 'all';
          else if (key === 'price') { State.filters.minPrice = null; State.filters.maxPrice = null; }
          else if (key === 'rating') State.filters.minRating = 0;
          else if (key === 'instock') State.filters.inStockOnly = false;
          else if (key === 'discount') State.filters.discountOnly = false;
          Pages.renderProducts();
        });
      });

      // Clear all chips / reset filters button
      const clearAllChipsBtn = document.getElementById('btn-clear-all-chips');
      const resetBtn = document.getElementById('btn-reset-filters');
      const resetAction = () => {
        State.filters = {
          category: 'all',
          brand: 'all',
          searchQuery: '',
          minPrice: null,
          maxPrice: null,
          minRating: 0,
          inStockOnly: false,
          discountOnly: false,
          sort: 'relevance'
        };
        Pages.renderProducts();
      };

      if (clearAllChipsBtn) clearAllChipsBtn.addEventListener('click', resetAction);
      if (resetBtn) resetBtn.addEventListener('click', resetAction);
    },

    renderProductDetail(productId) {
      const p = CATALOG_MAP.get(productId);

      if (!p) {
        document.title = 'VELORA | Product Not Found';
        const app = document.getElementById('app');
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'All Products', href: '/products' },
              { label: 'Not Found', href: '#' }
            ])}
            <div class="not-found-wrap">
              <div class="not-found-code">404</div>
              <h1 class="not-found-title">Product Not Found</h1>
              <p class="not-found-desc">We could not find a demonstration product matching ID <code>${productId || 'unknown'}</code>.</p>
              <a href="/products" class="btn btn-teal btn-lg nav-link">Browse All Products</a>
            </div>
          </div>
        `;
        return;
      }

      // Record in Recently Viewed
      if (!State.recentlyViewed.includes(p.id)) {
        State.recentlyViewed.unshift(p.id);
        if (State.recentlyViewed.length > 12) State.recentlyViewed.pop();
        Storage.saveRecentlyViewed();
      }

      document.title = `VELORA | ${p.name}`;

      const isWish = State.wishlist.includes(p.id);
      const isOut = p.stock <= 0;
      const discount = p.originalPrice && p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

      const related = CATALOG
        .filter(item => item.category.toLowerCase() === p.category.toLowerCase() && item.id !== p.id)
        .slice(0, 4);

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: p.category, href: `/category?name=${encodeURIComponent(p.category)}` },
            { label: p.name, href: '#' }
          ])}

          <div class="product-detail-grid">
            <!-- Left: Image Gallery -->
            <div class="product-image-area">
              <div class="product-main-img-wrap">
                <img 
                  src="${p.image}" 
                  alt="${p.name}" 
                  class="product-main-img" 
                  onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';"
                >
              </div>
              <div class="product-img-caption">High-resolution demonstration catalog photography</div>
            </div>

            <!-- Right: Product Info & Purchase -->
            <div class="product-info">
              <div class="product-cat-brand">
                <a href="/category?name=${encodeURIComponent(p.category)}" class="product-cat nav-link">${p.category}</a>
                <span>·</span>
                <span class="product-brand">${p.brand}</span>
              </div>

              <h1 class="product-name-title">${p.name}</h1>

              <div class="product-ratings">
                <span class="product-ratings-stars">★</span>
                <strong>${p.rating.toFixed(1)}</strong>
                <span class="text-muted">(${p.reviewCount} customer reviews)</span>
                <span class="demo-label">Academic Demo</span>
              </div>

              <!-- Price Box -->
              <div class="product-pricing-block">
                <div class="product-price-row">
                  <span class="product-price-large">${formatCurrency(p.price)}</span>
                  ${p.originalPrice && p.originalPrice > p.price ? `<span class="product-orig-large">${formatCurrency(p.originalPrice)}</span>` : ''}
                  ${discount > 0 ? `<span class="product-saved">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-tax-note">Inclusive of demonstrative 18% GST · Free delivery on orders over ₹999</div>
              </div>

              <!-- Stock status -->
              <div class="product-stock-badge">
                ${isOut 
                  ? `<span class="badge badge-stock-out">Out of Stock</span>` 
                  : p.stock < 10 
                    ? `<span class="badge badge-stock-low">Only ${p.stock} left in stock</span>`
                    : `<span class="badge badge-stock-in">In Stock (${p.stock} available)</span>`
                }
              </div>

              <!-- Description -->
              <p class="product-desc">${p.description}</p>

              <!-- Specs -->
              ${p.specs && p.specs.length > 0 ? `
                <div class="product-specs">
                  <div class="product-specs-title">Key Specifications</div>
                  <ul class="product-specs-list">
                    ${p.specs.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <!-- Quantity & Actions -->
              <div class="product-action-row" style="display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap;">
                <div class="qty-stepper">
                  <button type="button" class="btn-qty" id="detail-qty-minus" aria-label="Decrease quantity">−</button>
                  <input type="number" id="detail-qty-val" class="qty-input" value="1" min="1" max="${p.stock}" readonly>
                  <button type="button" class="btn-qty" id="detail-qty-plus" aria-label="Increase quantity">+</button>
                </div>

                <button 
                  type="button" 
                  class="btn btn-teal btn-lg" 
                  id="btn-detail-add" 
                  data-product-id="${p.id}"
                  style="flex:1; min-width:180px;"
                  ${isOut ? 'disabled' : ''}
                >
                  ${isOut ? 'Out of Stock' : 'Add to Shopping Cart'}
                </button>

                <button 
                  type="button" 
                  class="btn btn-outline btn-lg ${isWish ? 'active' : ''}" 
                  data-action="toggle-wishlist" 
                  data-product-id="${p.id}"
                  id="btn-detail-wish"
                  aria-label="Wishlist"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="vertical-align:middle;">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  ${isWish ? 'Saved' : 'Wishlist'}
                </button>
              </div>

              <!-- Perks banner -->
              <div class="product-delivery-note">
                <div class="product-delivery-icon">🚚</div>
                <div>
                  <strong>Fast Demonstration Delivery</strong>
                  <div>Order today for simulated delivery within 3 days. Free on cart values ≥ ₹999.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products -->
          ${related.length > 0 ? `
            <div class="related-section">
              <h2 class="section-title" style="margin-bottom:16px;">Related in ${p.category}</h2>
              <div class="product-grid">
                ${related.map(r => UI.createProductCardHTML(r)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Bind quantity stepper & add button
      const minusBtn = document.getElementById('detail-qty-minus');
      const plusBtn = document.getElementById('detail-qty-plus');
      const qtyInput = document.getElementById('detail-qty-val');
      const addBtn = document.getElementById('btn-detail-add');

      if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
          const current = parseInt(qtyInput.value, 10) || 1;
          if (current > 1) qtyInput.value = current - 1;
        });
        plusBtn.addEventListener('click', () => {
          const current = parseInt(qtyInput.value, 10) || 1;
          if (current < p.stock) qtyInput.value = current + 1;
        });
      }

      if (addBtn) {
        addBtn.addEventListener('click', () => {
          const qty = parseInt(qtyInput.value, 10) || 1;
          Handlers.addToCart(p.id, qty);
        });
      }
    },

    // ------------------------------------------------------------------------
    // 4. CATEGORY VIEW (/category?name=...)
    // ------------------------------------------------------------------------
    renderCategory(catName) {
      const decoded = decodeURIComponent(catName || '').replace(/\+/g, ' ');
      document.title = `VELORA | ${decoded || 'Categories'}`;

      State.filters.category = decoded || 'all';
      const filtered = CatalogQuery.filterAndSort(State.filters);

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/products' },
            { label: decoded, href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">${decoded}</h1>
              <p class="page-sub">Showing ${filtered.length} items available in this category</p>
            </div>
          </div>

          <div class="catalog-layout">
            <!-- Sidebar -->
            <aside class="filter-sidebar">
              <div class="filter-sidebar-head">
                <span class="filter-sidebar-title">Categories</span>
              </div>
              <div class="filter-option-list">
                <a href="/products" class="filter-radio nav-link" style="text-decoration:none;">
                  <span>All Categories</span>
                </a>
                ${ALL_CATEGORIES.map(cat => `
                  <a href="/category?name=${encodeURIComponent(cat)}" class="filter-radio nav-link ${cat.toLowerCase() === decoded.toLowerCase() ? 'active' : ''}" style="text-decoration:none; font-weight:${cat.toLowerCase() === decoded.toLowerCase() ? '700' : '400'};">
                    <span>${cat} (${CATALOG.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length})</span>
                  </a>
                `).join('')}
              </div>
            </aside>

            <!-- Main grid -->
            <div class="catalog-main">
              ${filtered.length > 0 
                ? `<div class="product-grid">${filtered.map(p => UI.createProductCardHTML(p)).join('')}</div>`
                : UI.renderEmptyState('📂', 'No Products in this Category', 'Check back later or browse other collections.', 'View All Products', '/products')
              }
            </div>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 5. SEARCH RESULTS (/search?q=...)
    // ------------------------------------------------------------------------
    renderSearch(query) {
      const decoded = decodeURIComponent(query || '').trim();
      document.title = `VELORA | Search: "${decoded}"`;

      State.filters.searchQuery = decoded;
      State.filters.category = 'all';
      const results = CatalogQuery.filterAndSort(State.filters);

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Search Results', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Search Results</h1>
              <p class="page-sub">
                ${decoded ? `Showing ${results.length} matching product${results.length === 1 ? '' : 's'} for "<strong>${decoded}</strong>"` : 'Please enter a search query in the search bar above.'}
              </p>
            </div>
          </div>

          ${results.length > 0
            ? `<div class="product-grid">${results.map(p => UI.createProductCardHTML(p)).join('')}</div>`
            : UI.renderEmptyState('🔎', 'No Results Found', `We could not find any products matching "${decoded}". Try searching for "headphones", "shoes", "jacket", or "serum".`, 'Browse All Products', '/products')
          }
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 6. SHOPPING CART (/cart)
    // ------------------------------------------------------------------------
    renderCart() {
      document.title = 'VELORA | Shopping Cart';

      const breakdown = PricingEngine.computeFullBreakdown(State.cart);
      const app = document.getElementById('app');

      if (State.cart.length === 0) {
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Shopping Cart', href: '#' }
            ])}
            ${UI.renderEmptyState('🛒', 'Your Shopping Cart is Empty', 'Looks like you have not added any items to your cart yet. Explore our 40-item catalog today!', 'Explore All Products', '/products')}
            
            ${State.savedForLater.length > 0 ? this.renderSavedForLaterSection() : ''}
          </div>
        `;
        return;
      }

      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Shopping Cart</h1>
              <p class="page-sub">${breakdown.totalUnits} item${breakdown.totalUnits === 1 ? '' : 's'} in your order</p>
            </div>
          </div>

          <div class="cart-page-grid">
            <!-- Left: Items list -->
            <div class="cart-items-col">
              ${State.cart.map(item => {
                const p = CATALOG_MAP.get(item.productId);
                if (!p) return '';
                const itemTotal = p.price * item.quantity;
                return `
                  <article class="cart-item-card" data-product-id="${p.id}">
                    <a href="/product?id=${p.id}" class="nav-link">
                      <img 
                        src="${p.image}" 
                        alt="${p.name}" 
                        class="cart-item-img" 
                        onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';"
                      >
                    </a>

                    <div class="cart-item-info">
                      <a href="/product?id=${p.id}" class="cart-item-name nav-link">${p.name}</a>
                      <div class="cart-item-meta">${p.category} · ${p.brand}</div>
                      <div class="cart-item-price-row">
                        <span class="cart-item-price">${formatCurrency(itemTotal)}</span>
                        <span class="cart-item-unit">(${formatCurrency(p.price)} × ${item.quantity})</span>
                      </div>

                      <div class="cart-item-footer">
                        <div class="qty-stepper qty-stepper-sm">
                          <button type="button" class="btn-qty" data-action="cart-minus" data-product-id="${p.id}" aria-label="Decrease">−</button>
                          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${p.stock}" readonly>
                          <button type="button" class="btn-qty" data-action="cart-plus" data-product-id="${p.id}" aria-label="Increase">+</button>
                        </div>

                        <div class="cart-item-actions">
                          <button type="button" class="btn-cart-action" data-action="cart-save-later" data-product-id="${p.id}">Save for Later</button>
                          <span>·</span>
                          <button type="button" class="btn-cart-action btn-cart-remove" data-action="cart-remove" data-product-id="${p.id}">Remove</button>
                        </div>
                      </div>
                    </div>
                  </article>
                `;
              }).join('')}

              <!-- Saved for later if any -->
              ${State.savedForLater.length > 0 ? this.renderSavedForLaterSection() : ''}
            </div>

            <!-- Right: Order Summary Sticky Card -->
            <aside class="cart-summary">
              <h2 class="cart-summary-title">Order Summary</h2>

              <!-- Free delivery progress bar -->
              <div class="threshold-bar">
                <div class="threshold-text">
                  ${breakdown.hasFreeDelivery 
                    ? '🎉 You have unlocked Free Standard Delivery!' 
                    : `Add ${formatCurrency(breakdown.amountNeededForFreeDelivery)} more for Free Delivery`
                  }
                </div>
                <div class="threshold-track">
                  <div class="threshold-fill" style="width: ${Math.min(100, Math.round((breakdown.subtotal / CONFIG.freeShippingThreshold) * 100))}%;"></div>
                </div>
              </div>

              <!-- Coupon code input -->
              <div class="coupon-form">
                <div class="coupon-input-row">
                  <input type="text" id="cart-coupon-input" class="form-input" placeholder="Coupon Code (e.g. WELCOME10)" style="text-transform:uppercase;">
                  <button type="button" class="btn btn-navy btn-sm" id="btn-apply-coupon">Apply</button>
                </div>
                ${State.appliedCoupon ? `
                  <div class="coupon-applied">
                    <span>Code <strong>${State.appliedCoupon.code}</strong> applied (-${formatCurrency(breakdown.couponDiscount)})</span>
                    <button type="button" class="btn-close-x" id="btn-remove-coupon" style="font-size:16px;">×</button>
                  </div>
                ` : `
                  <div class="text-muted" style="font-size:11px; margin-top:6px;">
                    Demo codes: <code>WELCOME10</code>, <code>SAVE100</code>, <code>FREESHIP</code>
                  </div>
                `}
              </div>

              <!-- Pricing breakdown table -->
              <div class="price-table">
                <div class="price-row">
                  <span>Items Subtotal (${breakdown.totalUnits} units)</span>
                  <span>${formatCurrency(breakdown.subtotal)}</span>
                </div>
                ${breakdown.productSavings > 0 ? `
                  <div class="price-row discount">
                    <span>Catalog Product Savings</span>
                    <span>-${formatCurrency(breakdown.productSavings)}</span>
                  </div>
                ` : ''}
                ${breakdown.couponDiscount > 0 ? `
                  <div class="price-row discount">
                    <span>Coupon Discount (${State.appliedCoupon.code})</span>
                    <span>-${formatCurrency(breakdown.couponDiscount)}</span>
                  </div>
                ` : ''}
                <div class="price-row">
                  <span>Demonstrative GST (18%)</span>
                  <span>${formatCurrency(breakdown.taxAmount)}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>${breakdown.deliveryFee === 0 ? '<strong style="color:var(--success);">FREE</strong>' : formatCurrency(breakdown.deliveryFee)}</span>
                </div>
                <div class="price-row total">
                  <span>Total Payable</span>
                  <span class="price-total-amt">${formatCurrency(breakdown.finalTotal)}</span>
                </div>
              </div>

              <!-- Action buttons -->
              <a href="/checkout" class="btn btn-teal btn-block btn-lg nav-link" style="text-align:center;">Proceed to Checkout →</a>
              <a href="/products" class="btn btn-outline btn-block btn-sm nav-link" style="text-align:center; margin-top:8px;">Continue Shopping</a>
            </aside>
          </div>
        </div>
      `;

      // Coupon event listeners
      const applyBtn = document.getElementById('btn-apply-coupon');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          const input = document.getElementById('cart-coupon-input');
          const code = (input.value || '').trim().toUpperCase();
          Handlers.applyCoupon(code);
        });
      }

      const removeCouponBtn = document.getElementById('btn-remove-coupon');
      if (removeCouponBtn) {
        removeCouponBtn.addEventListener('click', () => {
          State.appliedCoupon = null;
          Toast.show('Coupon removed', 'teal');
          Pages.renderCart();
          UI.updateHeaderBadges();
        });
      }
    },

    renderSavedForLaterSection() {
      return `
        <div class="saved-section">
          <h2 class="saved-section-title">Saved for Later (${State.savedForLater.length} items)</h2>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${State.savedForLater.map(item => {
              const p = CATALOG_MAP.get(item.productId);
              if (!p) return '';
              return `
                <div class="saved-card" data-product-id="${p.id}">
                  <a href="/product?id=${p.id}" class="nav-link">
                    <img src="${p.image}" alt="${p.name}" style="width:64px; height:64px; object-fit:cover; border-radius:var(--r-xs);" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';">
                  </a>
                  <div style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                      <a href="/product?id=${p.id}" class="nav-link" style="font-weight:700; font-size:13px; color:var(--navy);">${p.name}</a>
                      <div style="font-size:12px; color:var(--teal); font-weight:700; margin-top:2px;">${formatCurrency(p.price)}</div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:6px; font-size:12px;">
                      <button type="button" class="btn-cart-action" data-action="saved-move-cart" data-product-id="${p.id}" style="color:var(--teal); font-weight:600;">Move to Cart</button>
                      <span>·</span>
                      <button type="button" class="btn-cart-action btn-cart-remove" data-action="saved-remove" data-product-id="${p.id}">Delete</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 7. WISHLIST (/wishlist)
    // ------------------------------------------------------------------------
    renderWishlist() {
      document.title = 'VELORA | My Wishlist';

      const items = State.wishlist.map(id => CATALOG_MAP.get(id)).filter(Boolean);
      const app = document.getElementById('app');

      if (items.length === 0) {
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Wishlist', href: '#' }
            ])}
            ${UI.renderEmptyState('❤️', 'Your Wishlist is Empty', 'Explore our collections and tap the heart icon on any product to save it here.', 'Browse All Products', '/products')}
          </div>
        `;
        return;
      }

      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Wishlist', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">My Wishlist</h1>
              <p class="page-sub">${items.length} saved item${items.length === 1 ? '' : 's'}</p>
            </div>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-teal btn-sm" id="btn-wishlist-move-all">Move All In-Stock to Cart</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-clear-wishlist">Clear Wishlist</button>
            </div>
          </div>

          <div class="product-grid">
            ${items.map(p => UI.createProductCardHTML(p)).join('')}
          </div>
        </div>
      `;

      const moveAllBtn = document.getElementById('btn-wishlist-move-all');
      if (moveAllBtn) {
        moveAllBtn.addEventListener('click', () => {
          let count = 0;
          items.forEach(p => {
            if (p.stock > 0) {
              const existing = State.cart.find(i => i.productId === p.id);
              if (existing) {
                existing.quantity = Math.min(p.stock, existing.quantity + 1);
              } else {
                State.cart.push({ productId: p.id, quantity: 1 });
              }
              count++;
            }
          });
          Storage.saveCart();
          UI.updateHeaderBadges();
          Toast.show(`Added ${count} items to cart!`, 'success');
        });
      }

      const clearBtn = document.getElementById('btn-clear-wishlist');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          State.wishlist = [];
          Storage.saveWishlist();
          UI.updateHeaderBadges();
          Pages.renderWishlist();
          Toast.show('Wishlist cleared', 'teal');
        });
      }
    },

    // ------------------------------------------------------------------------
    // 8. CHECKOUT (/checkout)
    // ------------------------------------------------------------------------
    renderCheckout() {
      document.title = 'VELORA | Checkout';

      if (State.cart.length === 0) {
        const app = document.getElementById('app');
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Checkout', href: '#' }
            ])}
            <div class="empty-state">
              <div class="empty-icon">⚠️</div>
              <h1 class="empty-title">Cannot Proceed to Checkout</h1>
              <p class="empty-desc">Your shopping cart is currently empty. Please add at least one product before proceeding.</p>
              <a href="/products" class="btn btn-teal btn-lg nav-link">Browse Catalog</a>
            </div>
          </div>
        `;
        return;
      }

      const breakdown = PricingEngine.computeFullBreakdown(State.cart);
      const savedPref = Storage.getAddressPref() || {};

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Demonstration Checkout</h1>
              <p class="page-sub">Review delivery details and place a simulated test order</p>
            </div>
          </div>

          <div class="checkout-grid">
            <!-- Left: Checkout Form -->
            <div class="checkout-form-col">
              <!-- Stepper -->
              <div class="stepper-bar">
                <div class="step-item active">
                  <span class="step-num">1</span>
                  <span>Delivery Address</span>
                </div>
                <div class="step-connector"></div>
                <div class="step-item active">
                  <span class="step-num">2</span>
                  <span>Payment Demo</span>
                </div>
                <div class="step-connector"></div>
                <div class="step-item">
                  <span class="step-num">3</span>
                  <span>Confirmation</span>
                </div>
              </div>

              <!-- Warning Alert -->
              <div class="checkout-demo-warn">
                <span>🛡️</span>
                <div>
                  <strong>College Academic Showcase Notice</strong><br>
                  This checkout is a front-end simulation. Do NOT enter real credit card, CVV, or confidential banking information.
                </div>
              </div>

              <form id="checkout-form" novalidate>
                <!-- Section 1: Customer & Address -->
                <div class="checkout-section">
                  <h2 class="checkout-section-title">1. Shipping &amp; Delivery Information</h2>
                  
                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label class="form-label" for="co-name">Full Name *</label>
                      <input type="text" id="co-name" class="form-input" placeholder="e.g. Rahul Sharma" value="${savedPref.name || ''}" required>
                      <div class="field-error" id="err-co-name" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please enter your full name (at least 2 letters)</div>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="co-email">Email Address *</label>
                      <input type="email" id="co-email" class="form-input" placeholder="e.g. rahul@example.com" value="${savedPref.email || ''}" required>
                      <div class="field-error" id="err-co-email" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please enter a valid email address</div>
                    </div>
                  </div>

                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label class="form-label" for="co-phone">Phone Number *</label>
                      <input type="tel" id="co-phone" class="form-input" placeholder="e.g. 9876543210" value="${savedPref.phone || ''}" required>
                      <div class="field-error" id="err-co-phone" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please enter a valid 10-digit phone number</div>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="co-pincode">PIN Code *</label>
                      <input type="text" id="co-pincode" class="form-input" placeholder="e.g. 560001" value="${savedPref.pincode || ''}" maxlength="6" required>
                      <div class="field-error" id="err-co-pincode" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please enter a valid 6-digit postal code</div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="co-address">Street Address / House No. *</label>
                    <input type="text" id="co-address" class="form-input" placeholder="e.g. Flat 402, Green Valley Apartments, MG Road" value="${savedPref.address || ''}" required>
                    <div class="field-error" id="err-co-address" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please enter your street address (at least 5 characters)</div>
                  </div>

                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label class="form-label" for="co-city">City *</label>
                      <input type="text" id="co-city" class="form-input" placeholder="e.g. Bengaluru" value="${savedPref.city || ''}" required>
                      <div class="field-error" id="err-co-city" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please specify your city</div>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="co-state">State *</label>
                      <select id="co-state" class="form-input" required>
                        <option value="">Select State</option>
                        ${['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Kerala', 'Gujarat', 'West Bengal', 'Rajasthan'].map(st => `
                          <option value="${st}" ${savedPref.state === st ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>
                      <div class="field-error" id="err-co-state" style="display:none; color:var(--error); font-size:11px; margin-top:3px;">Please select your state</div>
                    </div>
                  </div>

                  <div style="margin-top:12px;">
                    <label class="filter-cb" style="font-size:13px;">
                      <input type="checkbox" id="co-save-pref" checked>
                      <span>Save these delivery details for future test sessions</span>
                    </label>
                  </div>
                </div>

                <!-- Section 2: Demo Payment Method -->
                <div class="checkout-section">
                  <h2 class="checkout-section-title">2. Demonstration Payment Method</h2>
                  
                  <div class="payment-options">
                    <label class="payment-option active">
                      <input type="radio" name="payment-method" value="Cash on Delivery (Simulated)" checked>
                      <div class="payment-option-body">
                        <div class="payment-option-title">💵 Cash on Delivery (COD)</div>
                        <div class="payment-option-desc">Simulated pay-on-arrival method. No online transaction required.</div>
                      </div>
                    </label>

                    <label class="payment-option">
                      <input type="radio" name="payment-method" value="Demo UPI / QR (Simulated)">
                      <div class="payment-option-body">
                        <div class="payment-option-title">📱 Demo UPI (Instant Simulation)</div>
                        <div class="payment-option-desc">Simulate an instant UPI verification without real banking calls.</div>
                      </div>
                    </label>

                    <label class="payment-option">
                      <input type="radio" name="payment-method" value="Demo Net Banking / Card (Simulated)">
                      <div class="payment-option-body">
                        <div class="payment-option-title">💳 Demo Card / Net Banking (Simulated)</div>
                        <div class="payment-option-desc">Demonstration authorization. Zero card numbers or CVVs stored.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" class="btn btn-teal btn-block btn-lg" id="btn-place-order" style="padding:16px;">
                  Place Demo Order · ${formatCurrency(breakdown.finalTotal)}
                </button>
              </form>
            </div>

            <!-- Right: Order Review Column -->
            <aside class="cart-summary">
              <h2 class="cart-summary-title">Order Review (${breakdown.totalUnits} items)</h2>

              <div style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto; margin-bottom:16px;">
                ${State.cart.map(item => {
                  const p = CATALOG_MAP.get(item.productId);
                  if (!p) return '';
                  return `
                    <div class="checkout-item">
                      <img src="${p.image}" alt="${p.name}" class="checkout-item-img" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';">
                      <div class="checkout-item-name">
                        <div>${p.name}</div>
                        <div style="font-size:11px; color:var(--text-3); font-weight:400;">Qty: ${item.quantity} × ${formatCurrency(p.price)}</div>
                      </div>
                      <div class="checkout-item-price">${formatCurrency(p.price * item.quantity)}</div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Price table -->
              <div class="price-table">
                <div class="price-row">
                  <span>Subtotal</span>
                  <span>${formatCurrency(breakdown.subtotal)}</span>
                </div>
                ${breakdown.couponDiscount > 0 ? `
                  <div class="price-row discount">
                    <span>Coupon (${State.appliedCoupon.code})</span>
                    <span>-${formatCurrency(breakdown.couponDiscount)}</span>
                  </div>
                ` : ''}
                <div class="price-row">
                  <span>Demonstrative GST (18%)</span>
                  <span>${formatCurrency(breakdown.taxAmount)}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>${breakdown.deliveryFee === 0 ? 'FREE' : formatCurrency(breakdown.deliveryFee)}</span>
                </div>
                <div class="price-row total">
                  <span>Total Payable</span>
                  <span class="price-total-amt">${formatCurrency(breakdown.finalTotal)}</span>
                </div>
              </div>

              <a href="/cart" class="btn btn-outline btn-block btn-sm nav-link" style="text-align:center;">Edit Cart Items</a>
            </aside>
          </div>
        </div>
      `;

      // Payment option toggle highlight
      app.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
          app.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
          radio.closest('.payment-option').classList.add('active');
        });
      });

      // Bind form submission & validation
      const form = document.getElementById('checkout-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          Handlers.submitCheckout();
        });
      }
    },

    // ------------------------------------------------------------------------
    // 9. ORDER CONFIRMATION (/order-confirmation?id=...)
    // ------------------------------------------------------------------------
    renderOrderConfirmation(orderId) {
      document.title = 'VELORA | Order Confirmation';

      const order = State.orders.find(o => o.orderId === orderId);
      const app = document.getElementById('app');

      if (!order) {
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Orders', href: '/orders' },
              { label: 'Not Found', href: '#' }
            ])}
            <div class="not-found-wrap">
              <div class="not-found-code">⚠️</div>
              <h1 class="not-found-title">Order Not Found</h1>
              <p class="not-found-desc">We could not locate a demonstration order with ID <code>${orderId || 'unknown'}</code>.</p>
              <a href="/orders" class="btn btn-teal btn-lg nav-link">View Order History</a>
            </div>
          </div>
        `;
        return;
      }

      app.innerHTML = `
        <div class="container page-content">
          <div class="confirmation-wrap">
            <div class="confirm-icon-wrap">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <h1 class="confirm-title">Demo Order Confirmed!</h1>
            <p class="confirm-subtitle">
              Thank you, <strong>${order.customer.name}</strong>! Your demonstration order has been generated and stored locally in your browser.
            </p>

            <div class="confirm-card">
              <div class="confirm-row">
                <span class="text-muted">Order ID</span>
                <strong>${order.orderId}</strong>
              </div>
              <div class="confirm-row">
                <span class="text-muted">Date &amp; Time</span>
                <span>${order.formattedDate}</span>
              </div>
              <div class="confirm-row">
                <span class="text-muted">Payment Method</span>
                <span>${order.paymentMethod}</span>
              </div>
              <div class="confirm-row">
                <span class="text-muted">Delivery Address</span>
                <span>${order.customer.address}, ${order.customer.city}, ${order.customer.state} – ${order.customer.pincode}</span>
              </div>
              <div class="confirm-row">
                <span class="text-muted">Total Amount</span>
                <strong style="color:var(--teal); font-size:16px;">${formatCurrency(order.breakdown.finalTotal)}</strong>
              </div>

              <!-- Purchased items summary -->
              <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--border-2);">
                <div style="font-size:12px; font-weight:700; color:var(--navy); margin-bottom:8px;">Purchased Items (${order.items.length})</div>
                ${order.items.map(it => `
                  <div style="display:flex; justify-content:space-between; font-size:13px; padding:4px 0;">
                    <span>${it.name} × ${it.quantity}</span>
                    <span>${formatCurrency(it.unitPrice * it.quantity)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="confirm-actions">
              <a href="/order-details?id=${order.orderId}" class="btn btn-navy nav-link">View Full Receipt</a>
              <a href="/orders" class="btn btn-outline nav-link">My Order History</a>
              <a href="/products" class="btn btn-teal nav-link">Continue Shopping</a>
            </div>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 10. ORDER HISTORY (/orders)
    // ------------------------------------------------------------------------
    renderOrders() {
      document.title = 'VELORA | Order History';

      const app = document.getElementById('app');

      if (State.orders.length === 0) {
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Order History', href: '#' }
            ])}
            ${UI.renderEmptyState('📦', 'No Orders Placed Yet', 'You have not completed any demonstration orders in this browser session. Place a test order to see it tracked here!', 'Browse Catalog', '/products')}
          </div>
        `;
        return;
      }

      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Order History', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">My Order History</h1>
              <p class="page-sub">Found ${State.orders.length} demonstration order${State.orders.length === 1 ? '' : 's'} in this browser</p>
            </div>
            <a href="/products" class="btn btn-teal btn-sm nav-link">Shop More Items</a>
          </div>

          <div class="orders-list">
            ${State.orders.map(order => `
              <article class="order-card">
                <div class="order-card-head">
                  <div>
                    <span class="order-id">${order.orderId}</span>
                    <div class="order-date">${order.formattedDate} · ${order.items.length} distinct item${order.items.length === 1 ? '' : 's'}</div>
                  </div>
                  <span class="badge badge-stock-in">Demo Placed</span>
                </div>

                <div class="order-items-summary">
                  ${order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                </div>

                <div class="order-card-foot">
                  <div>
                    <span class="order-total-label">Total: </span>
                    <span class="order-total-val">${formatCurrency(order.breakdown.finalTotal)}</span>
                  </div>
                  <a href="/order-details?id=${order.orderId}" class="btn btn-outline btn-sm nav-link">View Order Details →</a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 11. INDIVIDUAL ORDER DETAILS (/order-details?id=...)
    // ------------------------------------------------------------------------
    renderOrderDetails(orderId) {
      const order = State.orders.find(o => o.orderId === orderId);
      const app = document.getElementById('app');

      if (!order) {
        document.title = 'VELORA | Order Details Not Found';
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Orders', href: '/orders' },
              { label: 'Not Found', href: '#' }
            ])}
            <div class="not-found-wrap">
              <div class="not-found-code">404</div>
              <h1 class="not-found-title">Order Not Found</h1>
              <p class="not-found-desc">We could not locate order ID <code>${orderId || 'unknown'}</code> in your browser storage.</p>
              <a href="/orders" class="btn btn-teal btn-lg nav-link">Back to Orders</a>
            </div>
          </div>
        `;
        return;
      }

      document.title = `VELORA | Order ${order.orderId}`;

      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Orders', href: '/orders' },
            { label: order.orderId, href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Order Details</h1>
              <p class="page-sub">Reference ID: <strong>${order.orderId}</strong> · Placed on ${order.formattedDate}</p>
            </div>
            <a href="/orders" class="btn btn-outline btn-sm nav-link">← All Orders</a>
          </div>

          <div class="cart-page-grid">
            <!-- Left: Items list -->
            <div class="cart-items-col">
              <div class="checkout-section">
                <h2 class="checkout-section-title">Items in this Order</h2>
                <div style="display:flex; flex-direction:column; gap:12px;">
                  ${order.items.map(it => `
                    <div style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid var(--border-2);">
                      <img src="${it.image}" alt="${it.name}" style="width:60px; height:60px; object-fit:cover; border-radius:var(--r-xs);" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE_DATA_URL}';">
                      <div style="flex:1;">
                        <a href="/product?id=${it.productId}" class="nav-link" style="font-weight:700; color:var(--navy); font-size:14px;">${it.name}</a>
                        <div style="font-size:12px; color:var(--text-3); margin-top:2px;">Qty: ${it.quantity} × ${formatCurrency(it.unitPrice)}</div>
                      </div>
                      <div style="font-weight:700; color:var(--navy);">${formatCurrency(it.unitPrice * it.quantity)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Shipping Info -->
              <div class="checkout-section">
                <h2 class="checkout-section-title">Shipping &amp; Delivery Destination</h2>
                <div style="font-size:13px; line-height:1.7; color:var(--text-2);">
                  <div><strong>Recipient:</strong> ${order.customer.name}</div>
                  <div><strong>Email:</strong> ${order.customer.email}</div>
                  <div><strong>Phone:</strong> ${order.customer.phone}</div>
                  <div><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} – ${order.customer.pincode}</div>
                  <div style="margin-top:8px;"><strong>Status:</strong> <span class="badge badge-stock-in">Demonstration Completed</span></div>
                </div>
              </div>
            </div>

            <!-- Right: Cost Breakdown -->
            <aside class="cart-summary">
              <h2 class="cart-summary-title">Payment Summary</h2>
              <div class="price-table">
                <div class="price-row">
                  <span>Subtotal</span>
                  <span>${formatCurrency(order.breakdown.subtotal)}</span>
                </div>
                ${order.breakdown.couponDiscount > 0 ? `
                  <div class="price-row discount">
                    <span>Coupon Discount</span>
                    <span>-${formatCurrency(order.breakdown.couponDiscount)}</span>
                  </div>
                ` : ''}
                <div class="price-row">
                  <span>Demonstrative GST (18%)</span>
                  <span>${formatCurrency(order.breakdown.taxAmount)}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>${order.breakdown.deliveryFee === 0 ? 'FREE' : formatCurrency(order.breakdown.deliveryFee)}</span>
                </div>
                <div class="price-row total">
                  <span>Total Paid</span>
                  <span class="price-total-amt">${formatCurrency(order.breakdown.finalTotal)}</span>
                </div>
              </div>

              <div style="font-size:12px; color:var(--text-3); margin-bottom:14px;">
                <strong>Payment Mode:</strong> ${order.paymentMethod}
              </div>

              <a href="/products" class="btn btn-teal btn-block nav-link" style="text-align:center;">Continue Shopping</a>
            </aside>
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 12. RECENTLY VIEWED (/recently-viewed)
    // ------------------------------------------------------------------------
    renderRecentlyViewed() {
      document.title = 'VELORA | Recently Viewed';

      const items = State.recentlyViewed.map(id => CATALOG_MAP.get(id)).filter(Boolean);
      const app = document.getElementById('app');

      if (items.length === 0) {
        app.innerHTML = `
          <div class="container page-content">
            ${UI.renderBreadcrumbs([
              { label: 'Home', href: '/' },
              { label: 'Recently Viewed', href: '#' }
            ])}
            ${UI.renderEmptyState('👁️', 'No Recently Viewed Products', 'Inspect any product page and your browsing history will be recorded automatically here.', 'Browse Catalog', '/products')}
          </div>
        `;
        return;
      }

      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Recently Viewed', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Recently Viewed Products</h1>
              <p class="page-sub">${items.length} items viewed during your browsing session</p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-clear-recent">Clear History</button>
          </div>

          <div class="product-grid">
            ${items.map(p => UI.createProductCardHTML(p)).join('')}
          </div>
        </div>
      `;

      const clearBtn = document.getElementById('btn-clear-recent');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          State.recentlyViewed = [];
          Storage.saveRecentlyViewed();
          Pages.renderRecentlyViewed();
          Toast.show('Viewing history cleared', 'teal');
        });
      }
    },

    // ------------------------------------------------------------------------
    // 13. BEST DEALS (/deals)
    // ------------------------------------------------------------------------
    renderDeals() {
      document.title = 'VELORA | Best Deals';

      const deals = [...CATALOG]
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice));

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Best Deals', href: '#' }
          ])}

          <div class="deals-hero" style="border-radius:var(--r-md); padding:28px 24px; margin-bottom:28px;">
            <span class="badge" style="background:#fff; color:#8C5909; font-weight:800; margin-bottom:8px;">Limited Demonstrative Offers</span>
            <h1 class="page-title" style="color:#fff; margin-bottom:6px;">🔥 Top Deals &amp; Price Cuts</h1>
            <p style="color:rgba(255,255,255,.9); font-size:14px; max-width:600px;">
              Save up to 45% across verified electronics, winter wear, home kitchen tools, and fitness gear with instant coupons.
            </p>
          </div>

          <div class="product-grid">
            ${deals.map(p => UI.createProductCardHTML(p)).join('')}
          </div>
        </div>
      `;
    },

    // ------------------------------------------------------------------------
    // 14. HELP & FAQ (/help)
    // ------------------------------------------------------------------------
    renderHelp() {
      document.title = 'VELORA | Customer Help & FAQ';

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Customer Help', href: '#' }
          ])}

          <div class="page-head">
            <div>
              <h1 class="page-title">Help &amp; Frequently Asked Questions</h1>
              <p class="page-sub">Learn how this college project demonstration operates, pricing formulas, and routing features</p>
            </div>
          </div>

          <div class="help-grid">
            <nav class="help-nav">
              <div style="font-weight:700; font-size:12px; text-transform:uppercase; color:var(--text-3); margin-bottom:10px;">Topics</div>
              <a href="#faq-arch" class="help-nav-item active">Application Architecture</a>
              <a href="#faq-pricing" class="help-nav-item">Pricing &amp; Calculations</a>
              <a href="#faq-coupons" class="help-nav-item">Coupons &amp; Offers</a>
              <a href="#faq-orders" class="help-nav-item">Demonstration Checkout</a>
            </nav>

            <div class="help-content">
              <div class="faq-block" id="faq-arch">
                <button type="button" class="faq-q">
                  <span>How does VELORA multi-page navigation work?</span>
                  <span>+</span>
                </button>
                <div class="faq-a open">
                  VELORA uses an intentional client-side SPA routing engine with the HTML5 History API. When you click any internal navigation link, the router intercepts the event, calls <code>history.pushState()</code>, updates the browser URL bar, scrolls to the top, and mounts the dedicated page view inside the <code>#app</code> outlet. Browser Back and Forward buttons work via the <code>popstate</code> event.
                </div>
              </div>

              <div class="faq-block" id="faq-pricing">
                <button type="button" class="faq-q">
                  <span>How are prices, GST, and totals calculated?</span>
                  <span>+</span>
                </button>
                <div class="faq-a">
                  All monetary calculations are performed in integer paise arithmetic internally to eliminate IEEE-754 floating-point rounding errors. Demonstrative 18% GST is calculated on the net taxable amount after coupon deductions. Delivery is automatically free for orders of ₹999 or more; otherwise, a flat ₹79 shipping fee applies.
                </div>
              </div>

              <div class="faq-block" id="faq-coupons">
                <button type="button" class="faq-q">
                  <span>What demonstration coupons can I test?</span>
                  <span>+</span>
                </button>
                <div class="faq-a">
                  You can test three demo coupons in your Cart:
                  <ul style="margin:8px 0 0 16px;">
                    <li><code>WELCOME10</code>: 10% instant discount up to ₹500 on orders of ₹1,000 or more.</li>
                    <li><code>SAVE100</code>: Flat ₹100 deduction on orders of ₹799 or more.</li>
                    <li><code>FREESHIP</code>: Waives the ₹79 shipping fee regardless of subtotal.</li>
                  </ul>
                </div>
              </div>

              <div class="faq-block" id="faq-orders">
                <button type="button" class="faq-q">
                  <span>Are any real payments or cards processed?</span>
                  <span>+</span>
                </button>
                <div class="faq-a">
                  No. VELORA is strictly an academic college front-end demonstration project. No actual financial transactions take place, and no real bank credentials or card security codes are requested. All order records and preferences are saved exclusively in your browser's local storage.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Accordion toggling
      app.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
          const answer = btn.nextElementSibling;
          const isOpen = answer.classList.contains('open');
          app.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
          app.querySelectorAll('.faq-q span:last-child').forEach(s => s.textContent = '+');
          if (!isOpen) {
            answer.classList.add('open');
            btn.querySelector('span:last-child').textContent = '−';
          }
        });
      });
    },

    // ------------------------------------------------------------------------
    // 15. NOT FOUND (404)
    // ------------------------------------------------------------------------
    renderNotFound(path) {
      document.title = 'VELORA | Page Not Found';

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container page-content">
          ${UI.renderBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: '404', href: '#' }
          ])}
          <div class="not-found-wrap">
            <div class="not-found-code">404</div>
            <h1 class="not-found-title">Page Not Found</h1>
            <p class="not-found-desc">The requested route <code>${path || ''}</code> does not exist on this application.</p>
            <div style="display:flex; gap:12px; justify-content:center;">
              <a href="/" class="btn btn-navy nav-link">Go to Homepage</a>
              <a href="/products" class="btn btn-teal nav-link">Browse All Products</a>
            </div>
          </div>
        </div>
      `;
    }
  };

  // ==========================================================================
  // 9. CLIENT-SIDE ROUTER ENGINE
  // ==========================================================================
  const Router = {
    routes: {
      '/': () => Pages.renderHome(),
      '/products': (params) => Pages.renderProducts(),
      '/product': (params) => Pages.renderProductDetail(params.get('id')),
      '/category': (params) => Pages.renderCategory(params.get('name')),
      '/search': (params) => Pages.renderSearch(params.get('q')),
      '/cart': () => Pages.renderCart(),
      '/wishlist': () => Pages.renderWishlist(),
      '/checkout': () => Pages.renderCheckout(),
      '/order-confirmation': (params) => Pages.renderOrderConfirmation(params.get('id')),
      '/orders': () => Pages.renderOrders(),
      '/order-details': (params) => Pages.renderOrderDetails(params.get('id')),
      '/recently-viewed': () => Pages.renderRecentlyViewed(),
      '/deals': () => Pages.renderDeals(),
      '/help': () => Pages.renderHelp()
    },

    resolve() {
      const url = new URL(window.location.href);
      let pathname = url.pathname;
      const params = url.searchParams;

      // Handle fallback param e.g. ?route=/cart or index.html
      if (params.has('route')) {
        pathname = params.get('route');
      } else if (pathname.endsWith('/index.html') || pathname === '') {
        pathname = '/';
      }

      // Scroll to top on every route change
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Update active nav link highlights
      this.highlightNavLinks(pathname, params);

      // Match route
      const handler = this.routes[pathname];
      if (typeof handler === 'function') {
        handler(params);
      } else {
        Pages.renderNotFound(pathname);
      }

      // Refresh badges
      UI.updateHeaderBadges();
    },

    navigate(urlStr, replace = false) {
      const target = new URL(urlStr, window.location.origin);
      const fullPath = target.pathname + target.search;

      if (replace) {
        window.history.replaceState(null, '', fullPath);
      } else {
        window.history.pushState(null, '', fullPath);
      }

      this.resolve();
    },

    highlightNavLinks(pathname, params) {
      // Update header category pills
      const pills = document.querySelectorAll('.cat-pill');
      pills.forEach(pill => {
        pill.classList.remove('active');
        const cat = pill.dataset.cat;
        if (pathname === '/deals' && cat === 'deals') {
          pill.classList.add('active');
        } else if (pathname === '/help' && cat === 'help') {
          pill.classList.add('active');
        } else if (pathname === '/category' && params.get('name') && cat && cat.toLowerCase() === params.get('name').toLowerCase()) {
          pill.classList.add('active');
        }
      });
    },

    init() {
      window.addEventListener('popstate', () => this.resolve());
      this.resolve();
    }
  };

  // ==========================================================================
  // 10. ACTION & FORM EVENT HANDLERS
  // ==========================================================================
  const Handlers = {
    addToCart(productId, quantity = 1) {
      const prod = CATALOG_MAP.get(productId);
      if (!prod || prod.stock <= 0) {
        Toast.show('Item is currently out of stock', 'error');
        return;
      }

      const existing = State.cart.find(i => i.productId === productId);
      if (existing) {
        existing.quantity = Math.min(prod.stock, existing.quantity + quantity);
      } else {
        State.cart.push({ productId, quantity: Math.min(prod.stock, quantity) });
      }

      Storage.saveCart();
      UI.updateHeaderBadges();
      Toast.show(`Added "${prod.name}" to your cart!`, 'success');
    },

    toggleWishlist(productId) {
      const prod = CATALOG_MAP.get(productId);
      if (!prod) return;

      const idx = State.wishlist.indexOf(productId);
      if (idx !== -1) {
        State.wishlist.splice(idx, 1);
        Toast.show(`Removed "${prod.name}" from Wishlist`, 'teal');
      } else {
        State.wishlist.push(productId);
        Toast.show(`Saved "${prod.name}" to Wishlist!`, 'success');
      }

      Storage.saveWishlist();
      UI.updateHeaderBadges();

      // Update icon in-place if present
      document.querySelectorAll(`[data-action="toggle-wishlist"][data-product-id="${productId}"]`).forEach(btn => {
        const isNow = State.wishlist.includes(productId);
        btn.classList.toggle('active', isNow);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isNow ? 'currentColor' : 'none');
      });

      // If currently on wishlist page, re-render
      if (window.location.pathname === '/wishlist') {
        Pages.renderWishlist();
      }
    },

    applyCoupon(code) {
      if (!code) {
        Toast.show('Please enter a coupon code', 'warning');
        return;
      }
      const coupon = CONFIG.coupons[code];
      if (!coupon) {
        Toast.show(`Coupon code "${code}" is invalid`, 'error');
        return;
      }
      const subtotal = PricingEngine.calculateSubtotal(State.cart);
      if (subtotal < (coupon.minSubtotal || 0)) {
        Toast.show(`Coupon "${code}" requires minimum order of ${formatCurrency(coupon.minSubtotal)}`, 'warning');
        return;
      }

      State.appliedCoupon = coupon;
      Toast.show(`Coupon "${code}" applied successfully!`, 'success');
      Pages.renderCart();
      UI.updateHeaderBadges();
    },

    submitCheckout() {
      const name = document.getElementById('co-name');
      const email = document.getElementById('co-email');
      const phone = document.getElementById('co-phone');
      const address = document.getElementById('co-address');
      const city = document.getElementById('co-city');
      const state = document.getElementById('co-state');
      const pincode = document.getElementById('co-pincode');
      const savePref = document.getElementById('co-save-pref');

      let isValid = true;

      // Validation
      const valText = (el, errId, minLen) => {
        const val = (el.value || '').trim();
        const err = document.getElementById(errId);
        if (val.length < minLen) {
          err.style.display = 'block';
          el.style.borderColor = 'var(--error)';
          isValid = false;
        } else {
          err.style.display = 'none';
          el.style.borderColor = 'var(--border)';
        }
        return val;
      };

      const vName = valText(name, 'err-co-name', 2);
      const vAddress = valText(address, 'err-co-address', 5);
      const vCity = valText(city, 'err-co-city', 2);

      // Email
      const emailVal = (email.value || '').trim();
      const emailErr = document.getElementById('err-co-email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        emailErr.style.display = 'block';
        email.style.borderColor = 'var(--error)';
        isValid = false;
      } else {
        emailErr.style.display = 'none';
        email.style.borderColor = 'var(--border)';
      }

      // Phone (10 digits)
      const phoneVal = (phone.value || '').trim().replace(/\D/g, '');
      const phoneErr = document.getElementById('err-co-phone');
      if (phoneVal.length < 10) {
        phoneErr.style.display = 'block';
        phone.style.borderColor = 'var(--error)';
        isValid = false;
      } else {
        phoneErr.style.display = 'none';
        phone.style.borderColor = 'var(--border)';
      }

      // PIN code (6 digits)
      const pinVal = (pincode.value || '').trim().replace(/\D/g, '');
      const pinErr = document.getElementById('err-co-pincode');
      if (pinVal.length !== 6) {
        pinErr.style.display = 'block';
        pincode.style.borderColor = 'var(--error)';
        isValid = false;
      } else {
        pinErr.style.display = 'none';
        pincode.style.borderColor = 'var(--border)';
      }

      // State
      const stateErr = document.getElementById('err-co-state');
      if (!state.value) {
        stateErr.style.display = 'block';
        state.style.borderColor = 'var(--error)';
        isValid = false;
      } else {
        stateErr.style.display = 'none';
        state.style.borderColor = 'var(--border)';
      }

      if (!isValid) {
        Toast.show('Please fill in all required delivery fields correctly', 'error');
        return;
      }

      // Save preference if checked
      if (savePref && savePref.checked) {
        Storage.saveAddressPref({
          name: vName,
          email: emailVal,
          phone: phoneVal,
          address: vAddress,
          city: vCity,
          state: state.value,
          pincode: pinVal
        });
      }

      // Build Order Object
      const breakdown = PricingEngine.computeFullBreakdown(State.cart);
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

      const orderItems = State.cart.map(item => {
        const prod = CATALOG_MAP.get(item.productId);
        return {
          productId: item.productId,
          name: prod ? prod.name : 'Item',
          image: prod ? prod.image : '',
          unitPrice: prod ? prod.price : 0,
          quantity: item.quantity
        };
      });

      const now = new Date();
      const order = {
        orderId,
        formattedDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        customer: {
          name: vName,
          email: emailVal,
          phone: phoneVal,
          address: vAddress,
          city: vCity,
          state: state.value,
          pincode: pinVal
        },
        paymentMethod: selectedPayment ? selectedPayment.value : 'Cash on Delivery (Simulated)',
        items: orderItems,
        breakdown
      };

      // Save order
      State.orders.unshift(order);
      Storage.saveOrders();

      // Clear cart
      State.cart = [];
      State.appliedCoupon = null;
      Storage.saveCart();
      UI.updateHeaderBadges();

      Toast.show('Demo order placed successfully!', 'success');
      Router.navigate(`/order-confirmation?id=${orderId}`);
    }
  };

  // ==========================================================================
  // 11. GLOBAL EVENT DELEGATION & APP INITIALIZATION
  // ==========================================================================
  function initGlobalListeners() {
    // 1. Intercept all internal navigation link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle normal page navigation
      if (href.startsWith('/') || href.startsWith('./') || link.classList.contains('nav-link')) {
        // Don't intercept anchor jump on same page
        if (href.startsWith('#')) return;

        e.preventDefault();
        Router.navigate(href);
        
        // Close mobile drawer if open
        const drawer = document.getElementById('mobile-drawer-overlay');
        if (drawer) drawer.classList.remove('open');
      }
    });

    // 2. Global Action Delegator
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn) return;

      const action = actionBtn.dataset.action;
      const productId = actionBtn.dataset.productId;

      switch (action) {
        case 'add-to-cart':
          Handlers.addToCart(productId, 1);
          break;

        case 'toggle-wishlist':
          Handlers.toggleWishlist(productId);
          break;

        case 'cart-plus': {
          const item = State.cart.find(i => i.productId === productId);
          const prod = CATALOG_MAP.get(productId);
          if (item && prod) {
            if (item.quantity < prod.stock) {
              item.quantity++;
              Storage.saveCart();
              UI.updateHeaderBadges();
              Pages.renderCart();
            } else {
              Toast.show(`Maximum available stock is ${prod.stock} units`, 'warning');
            }
          }
          break;
        }

        case 'cart-minus': {
          const item = State.cart.find(i => i.productId === productId);
          if (item) {
            if (item.quantity > 1) {
              item.quantity--;
            } else {
              State.cart = State.cart.filter(i => i.productId !== productId);
            }
            Storage.saveCart();
            UI.updateHeaderBadges();
            Pages.renderCart();
          }
          break;
        }

        case 'cart-remove': {
          State.cart = State.cart.filter(i => i.productId !== productId);
          Storage.saveCart();
          UI.updateHeaderBadges();
          Pages.renderCart();
          Toast.show('Item removed from cart', 'teal');
          break;
        }

        case 'cart-save-later': {
          const item = State.cart.find(i => i.productId === productId);
          if (item) {
            State.cart = State.cart.filter(i => i.productId !== productId);
            if (!State.savedForLater.some(i => i.productId === productId)) {
              State.savedForLater.push({ productId, quantity: item.quantity });
            }
            Storage.saveCart();
            Storage.saveSaved();
            UI.updateHeaderBadges();
            Pages.renderCart();
            Toast.show('Item moved to Saved for Later', 'teal');
          }
          break;
        }

        case 'saved-move-cart': {
          const item = State.savedForLater.find(i => i.productId === productId);
          if (item) {
            State.savedForLater = State.savedForLater.filter(i => i.productId !== productId);
            Handlers.addToCart(productId, item.quantity);
            Storage.saveSaved();
            Pages.renderCart();
          }
          break;
        }

        case 'saved-remove': {
          State.savedForLater = State.savedForLater.filter(i => i.productId !== productId);
          Storage.saveSaved();
          Pages.renderCart();
          Toast.show('Item deleted from Saved for Later', 'teal');
          break;
        }

        default:
          break;
      }
    });

    // 3. Header Desktop Search Form
    const headerSearch = document.getElementById('header-search-form');
    if (headerSearch) {
      headerSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = headerSearch.querySelector('input[name="q"]');
        const q = (input.value || '').trim();
        Router.navigate(`/search?q=${encodeURIComponent(q)}`);
      });
    }

    const headerSearchClear = document.getElementById('search-clear-btn') || document.getElementById('header-search-clear');
    if (headerSearchClear) {
      headerSearchClear.addEventListener('click', () => {
        const input = document.getElementById('header-search-input') || (headerSearch && headerSearch.querySelector('input[name="q"]'));
        if (input) {
          input.value = '';
          headerSearchClear.hidden = true;
          input.focus();
        }
      });
      const input = document.getElementById('header-search-input') || (headerSearch && headerSearch.querySelector('input[name="q"]'));
      if (input) {
        input.addEventListener('input', () => {
          headerSearchClear.hidden = input.value.trim().length === 0;
        });
      }
    }

    // 4. Mobile Search Form
    const mobileSearchForm = document.querySelector('.mobile-search-form');
    if (mobileSearchForm) {
      mobileSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = mobileSearchForm.querySelector('input[name="q"]');
        const q = (input ? input.value : '').trim();
        Router.navigate(`/search?q=${encodeURIComponent(q)}`);
      });
    }

    // 5. Mobile Drawer
    const mobileMenuBtn = document.getElementById('mobile-ham') || document.getElementById('mobile-menu-btn');
    const drawerOverlay = document.getElementById('mobile-drawer-overlay');
    const drawerClose = document.getElementById('mobile-drawer-close');

    if (mobileMenuBtn && drawerOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        drawerOverlay.classList.add('open');
      });
    }
    if (drawerClose && drawerOverlay) {
      drawerClose.addEventListener('click', () => {
        drawerOverlay.classList.remove('open');
      });
    }
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) drawerOverlay.classList.remove('open');
      });
    }

    // 6. Policy Modal Dialog
    const policyModal = document.getElementById('policy-modal');
    const openPolicyBtns = [
      document.getElementById('ann-policy-btn'),
      document.getElementById('footer-policy-btn')
    ];
    openPolicyBtns.forEach(btn => {
      if (btn && policyModal) {
        btn.addEventListener('click', () => {
          if (typeof policyModal.showModal === 'function') policyModal.showModal();
          else policyModal.setAttribute('open', 'true');
        });
      }
    });

    const closePolicyBtns = [
      document.getElementById('policy-modal-close'),
      document.getElementById('policy-modal-ok')
    ];
    closePolicyBtns.forEach(btn => {
      if (btn && policyModal) {
        btn.addEventListener('click', () => {
          if (typeof policyModal.close === 'function') policyModal.close();
          else policyModal.removeAttribute('open');
        });
      }
    });

    // 7. Reset Demo Data Button
    const resetDataBtn = document.getElementById('footer-reset-btn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Reset all demonstration data (cart, wishlist, orders, viewing history)?')) {
          localStorage.clear();
          State.cart = [];
          State.savedForLater = [];
          State.wishlist = [];
          State.orders = [];
          State.recentlyViewed = [];
          State.appliedCoupon = null;
          UI.updateHeaderBadges();
          Toast.show('All demo storage data has been reset', 'teal');
          Router.navigate('/');
        }
      });
    }
  }

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  function onReady() {
    Storage.init();
    initGlobalListeners();
    Router.init();
    UI.updateHeaderBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
