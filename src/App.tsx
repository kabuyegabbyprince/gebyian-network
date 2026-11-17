/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Sparkles, Package, ShieldCheck, Truck, 
  ArrowRight, X, Plus, Minus, CheckCircle, ChevronRight, Store, 
  Globe, Star, SlidersHorizontal, MapPin, Phone, Mail, User
} from 'lucide-react';

type Language = 'en' | 'rw' | 'fr';

interface Product {
  id: string;
  name: Record<Language, string>;
  category: 'live-animals' | 'processed-meat' | 'animal-feeds';
  price: number;
  unit: Record<Language, string>;
  rating: number;
  reviewsCount: number;
  image: string;
  description: Record<Language, string>;
  specs: Record<Language, string[]>;
  artisan: string;
  stock: string;
}

interface CartItem extends Product {
  qty: number;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'live-animals' | 'processed-meat' | 'animal-feeds'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('All');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // AI Concierge State
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeInput, setConciergeInput] = useState('');
  const [conciergeMessages, setConciergeMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { 
      sender: 'ai', 
      text: lang === 'rw' 
        ? 'Murakaza neza kuri Gebyian Network. Ndi umujyanama wawe wa AI mu bijyanye n’amatungo n’ibiryo byayo. Ushaka kugura iki uyu munsi?'
        : lang === 'fr'
        ? 'Bienvenue sur Gebyian Network. Je suis votre assistant IA pour le bétail et l’agro-alimentaire. Que recherchez-vous ?'
        : 'Welcome to Gebyian Network Livestock & Agro Market. How can I assist you with livestock, processed meat, or animal feeds today?'
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Translations
  const t = {
    en: {
      navHome: 'Home',
      navLive: 'Live Animals',
      navMeat: 'Processed Meat',
      navFeeds: 'Animal Feeds',
      navLogistics: 'Agro Logistics',
      navSell: 'Sell on Gebyian',
      searchPlaceholder: 'Search livestock, cattle, broilers, feeds, pork...',
      allDepts: 'All Departments',
      cart: 'Cart',
      deliverTo: 'Deliver to Kigali',
      filterTitle: 'Agricultural Catalog Filters',
      all: 'All Products',
      liveAnimals: 'Live Animals (Cows, Goats, Pigs, Chickens)',
      processedMeat: 'Processed & Dressed Meat',
      animalFeeds: 'Animal Foods & Feeds',
      addToBag: 'Add to Bag',
      viewDetails: 'View Specifications',
      inStock: 'In Stock - Certified Farm Direct',
      subtotal: 'Subtotal',
      shipping: 'Estimated Delivery & Cold Chain',
      checkout: 'Proceed to Secure Checkout',
      aiAssistant: 'Agro AI Advisor',
      askAiPlaceholder: 'Ask about feeding, livestock health, or wholesale pricing...',
      orderComplete: 'Order confirmed successfully! Tracking ID:',
    },
    rw: {
      navHome: 'Ahabanza',
      navLive: 'Amatungo Nyayo',
      navMeat: 'Inyama Zatunganyijwe',
      navFeeds: 'Ibiryo by Amatungo',
      navLogistics: 'Ubutwererane bw Ubuhinzi',
      navSell: 'Gurisha kuri Gebyian',
      searchPlaceholder: 'Shakisha amatungo, inka, inkoko, ibiryo, ingurube...',
      allDepts: 'ibyiciro Byose',
      cart: 'Igaseke',
      deliverTo: 'Geza i Kigali',
      filterTitle: 'Akayunguruzo k’Ibicuruzwa',
      all: 'Byose',
      liveAnimals: 'Amatungo Muzima (Inka, Ihene, Ingurube, Inkoko)',
      processedMeat: 'Inyama Zatunganijwe na Firigo',
      animalFeeds: 'Ibiryo n’Intungamubiri z’Amatungo',
      addToBag: 'Ongeraho mu Gaseke',
      viewDetails: 'Reba Ibisobanuro',
      inStock: 'Biraboneka - Kuva ku Murima',
      subtotal: 'Iteranyirizo',
      shipping: 'Gutanga vuba mu buryo bukonje',
      checkout: 'Komeza kuri Wishyuha',
      aiAssistant: 'Umujyanama wa AI',
      askAiPlaceholder: 'Baza ku mirire y’amatungo cyangwa ibiciro...',
      orderComplete: 'Komeza! Nimero yo gukurikirana:',
    },
    fr: {
      navHome: 'Accueil',
      navLive: 'Animaux Vivants',
      navMeat: 'Viande Transformée',
      navFeeds: 'Aliments pour Animaux',
      navLogistics: 'Logistique Agro',
      navSell: 'Vendre sur Gebyian',
      searchPlaceholder: 'Rechercher bétail, bovins, volailles, aliments...',
      allDepts: 'Tous les Rayons',
      cart: 'Panier',
      deliverTo: 'Livrer à Kigali',
      filterTitle: 'Filtres du Catalogue Agricole',
      all: 'Tous les Produits',
      liveAnimals: 'Animaux Vivants (Bovins, Caprins, Porcins, Volailles)',
      processedMeat: 'Viande Fraîche & Emballée',
      animalFeeds: 'Aliments & Suppléments pour Bétail',
      addToBag: 'Ajouter au Panier',
      viewDetails: 'Voir les Détails',
      inStock: 'En Stock - Direct Ferme',
      subtotal: 'Sous-total',
      shipping: 'Chaîne du Froid & Livraison',
      checkout: 'Procéder au Paiement',
      aiAssistant: 'Conseiller IA Agro',
      askAiPlaceholder: 'Posez vos questions sur l’élevage ou les prix...',
      orderComplete: 'Commande confirmée ! ID de suivi :',
    }
  }[lang];

  const products: Product[] = [
    {
      id: 'p1',
      name: {
        en: 'Premium Ankole Dairy Cow (Live)',
        rw: 'Inka y’Ubworozi nziza (Muzima)',
        fr: 'Vache Laitière Ankole Premium (Vivante)'
      },
      category: 'live-animals',
      price: 1200,
      unit: { en: 'per head', rw: 'buri yose', fr: 'par tête' },
      rating: 4.9,
      reviewsCount: 38,
      image: '/src/assets/images/livestock_cattle_1794918370531.jpg',
      description: {
        en: 'Healthy certified Ankole-Friesian dairy cow, vaccinated, vet-inspected, high milk yield potential (18L/day).',
        rw: 'Inka y’ubworozi yizewe, yahaweinkingo zose, itanga amata menshi (litiro 18 ku munsi).',
        fr: 'Vache laitière saine certifiée, vaccinée, potentiel élevé de production laitière (18L/jour).'
      },
      specs: {
        en: ['Breed: Ankole-Friesian Cross', 'Age: 3.5 Years', 'Vaccination: Fully Updated', 'Daily Yield: 18L'],
        rw: ['Ubwoko: Ankole na Frisian', 'Imyaka: 3.5', 'Inkingo: Zahise zishyirwa mu mwanya', 'Umukamo: Litiro 18'],
        fr: ['Race: Croisée Ankole-Friesian', 'Âge: 3.5 Ans', 'Vaccination: À jour', 'Production: 18L/j']
      },
      artisan: 'Gatuna Agro Cooperative',
      stock: '12 Available'
    },
    {
      id: 'p2',
      name: {
        en: 'Dry-Aged Prime Beef Steaks',
        rw: 'Inyama y’Inka Zatunganyijwe (Beef Cuts)',
        fr: 'Steaks de Bœuf Affinés'
      },
      category: 'processed-meat',
      price: 12,
      unit: { en: 'per kg', rw: 'kuri kg', fr: 'par kg' },
      rating: 4.9,
      reviewsCount: 142,
      image: '/src/assets/images/livestock_cattle_1794918370531.jpg',
      description: {
        en: 'Tender dry-aged prime beef cuts vacuum sealed under strict cold-chain refrigeration.',
        rw: 'Inyama y’inka yoroshye kandi yateguwe neza mu buryo bukonje.',
        fr: 'Morceaux de bœuf tendre et affiné, emballés sous vide en chaîne du froid.'
      },
      specs: {
        en: ['Cut: Ribeye & Sirloin', 'Packaging: Vacuum Sealed', 'Storage: -18°C Cold Chain', 'Grade: USDA Choice Equivalent'],
        rw: ['Uduce: Ribeye na Sirloin', 'Gupfunyika: Vakumu', 'Ububiko: -18°C', 'Ubwiza: Kuri rwego rwohejuru'],
        fr: ['Coupe: Entrecôte & Faux-filet', 'Emballage: Sous vide', 'Conservation: -18°C', 'Qualité: Supérieure']
      },
      artisan: 'Kigali Cold-Chain Meats',
      stock: '450 kg Available'
    },
    {
      id: 'p3',
      name: {
        en: 'Live Free-Range Broiler Chickens (Flock of 10)',
        rw: 'Inkoko z’Ubworozi (Zizima - 10 zose)',
        fr: 'Poulets de Chair Vivants (Lot de 10)'
      },
      category: 'live-animals',
      price: 85,
      unit: { en: 'per flock', rw: 'ku matsinda y 10', fr: 'par lot de 10' },
      rating: 4.8,
      reviewsCount: 94,
      image: '/src/assets/images/livestock_poultry_1794918373518.jpg',
      description: {
        en: 'Active, disease-free broiler chickens ready for fattening or immediate processing. Average weight 2.2kg each.',
        rw: 'Inkoko zifite amagara meza ziteguye kororwa cyangwa gutunganywa. Uburemere 2.2kg buri yose.',
        fr: 'Poulets de chair sains et actifs, poids moyen 2,2 kg chacun.'
      },
      specs: {
        en: ['Quantity: 10 Birds', 'Average Weight: 2.2 kg', 'Feed: Organic Maize & Soy', 'Health: Newcastle Vaccinated'],
        rw: ['Umubare: Inkoko 10', 'Uburemere: 2.2 kg', 'Ibiryo: Ibigori na Soya', 'Ubuzima: Zakingiwe'],
        fr: ['Quantité: 10 Sujets', 'Poids moyen: 2,2 kg', 'Alimentation: Maïs & Soja', 'Santé: Vaccinés']
      },
      artisan: 'Rubavu Poultry Hub',
      stock: '85 Flocks Available'
    },
    {
      id: 'p4',
      name: {
        en: 'Dressed & Cleaned Whole Broiler Chicken',
        rw: 'Inkoko Zatunganijwe (Zijemo Isuku)',
        fr: 'Poulet Entier Nettoyé et Emballé'
      },
      category: 'processed-meat',
      price: 9.50,
      unit: { en: 'per bird', rw: 'kuri buri nkoko', fr: 'par poulet' },
      rating: 4.9,
      reviewsCount: 210,
      image: '/src/assets/images/livestock_poultry_1794918373518.jpg',
      description: {
        en: 'Hygienically slaughtered, plucked, eviscerated and blast-chilled fresh broiler chicken.',
        rw: 'Inkoko yabazwe kandi igatunganywa n’isuku nyinshi yiteguye gutekwa.',
        fr: 'Poulet abattu, plumé, evisCéré et réfrigéré selon les normes d’hygiène strictes.'
      },
      specs: {
        en: ['Weight: 1.8kg - 2.2kg', 'Processing: Halal Certified', 'Storage: Fresh Chilled 0-4°C', 'Origin: Local Farm Co-op'],
        rw: ['Uburemere: 1.8kg - 2.2kg', 'Uko yabazwe: Halal', 'Ububiko: Muri firigo 0-4°C', 'Inkomoko: Ibyaro by’u Rwanda'],
        fr: ['Poids: 1,8kg - 2,2kg', 'Abattage: Certifié Halal', 'Conservation: Frais 0-4°C', 'Origine: Co-op locale']
      },
      artisan: 'Kigali Fresh Processors',
      stock: '320 Units'
    },
    {
      id: 'p5',
      name: {
        en: 'Live Large White Breeding Pig (Swine)',
        rw: 'Ingurube y’Ubworozi Nini (Muzima)',
        fr: 'Porc Reproducteur Large White (Vivant)'
      },
      category: 'live-animals',
      price: 280,
      unit: { en: 'per head', rw: 'buri yose', fr: 'par tête' },
      rating: 4.7,
      reviewsCount: 29,
      image: '/src/assets/images/livestock_goats_1794918373594.jpg',
      description: {
        en: 'High-performance Large White breeding swine with excellent litter size genetics.',
        rw: 'Ingurube nini y’ubworozi ifite ubuzima bwiza n’ubushobozi bwo kororoka neza.',
        fr: 'Porc reproducteur Large White vigoureux avec d’excellentes génétiques de portée.'
      },
      specs: {
        en: ['Breed: Large White / Landrace', 'Weight: ~95 kg', 'Age: 8 Months', 'Health: Fully Dewormed & Vaccinated'],
        rw: ['Ubwoko: Large White', 'Uburemere: ~95 kg', 'Imyaka: Amezi 8', 'Ubuzima: Zahawe imiti y’inzoka'],
        fr: ['Race: Large White', 'Poids: ~95 kg', 'Âge: 8 Mois', 'Santé: Traité et vacciné']
      },
      artisan: 'Musanze Swine Breeders',
      stock: '18 Available'
    },
    {
      id: 'p6',
      name: {
        en: 'Fresh Pork Chops & Ribs',
        rw: 'Inyama y’Ingurube (Pork Chops)',
        fr: 'Côtelettes et Côtes de Porc Fraîches'
      },
      category: 'processed-meat',
      price: 10,
      unit: { en: 'per kg', rw: 'kuri kg', fr: 'par kg' },
      rating: 4.8,
      reviewsCount: 88,
      image: '/src/assets/images/livestock_goats_1794918373594.jpg',
      description: {
        en: 'Tender, grain-fed fresh pork chops and ribs, hygienically cut and packed.',
        rw: 'Inyama y’ingurube nziza yoroshye yagenewe isoko ryo ku rwego rwo hejuru.',
        fr: 'Côtelettes de porc tendres nourries aux grains, découpées et emballées proprement.'
      },
      specs: {
        en: ['Cuts: Chops & Ribs', 'Grade: Export Standard', 'Packaging: Vacuum Seal', 'Shelf Life: 7 Days Chilled'],
        rw: ['Uduce: Chops & Ribs', 'Ubwiza: Rwego rwo hejuru', 'Gupfunyika: Vakumu', 'Igihe imara: Iminsi 7'],
        fr: ['Coupes: Côtes & Côtelettes', 'Qualité: Standard export', 'Emballage: Sous vide', 'Conservation: 7 jours']
      },
      artisan: 'Muhanga Meats Corp',
      stock: '210 kg Available'
    },
    {
      id: 'p7',
      name: {
        en: 'Live Boer Dairy & Meat Goat',
        rw: 'Ihene y’Ubworozi ya Boer (Muzima)',
        fr: 'Chèvre Boer Vivante (Viande et Lait)'
      },
      category: 'live-animals',
      price: 150,
      unit: { en: 'per head', rw: 'buri yose', fr: 'par tête' },
      rating: 4.9,
      reviewsCount: 54,
      image: '/src/assets/images/livestock_goats_1794918373594.jpg',
      description: {
        en: 'Pure-bred Boer goat known for rapid growth, robust disease resistance, and high meat yield.',
        rw: 'Ihene y’ubworozi y’ubwoko bwa Boer izwiho gutubuka vuba no gutanga inyama nyinshi.',
        fr: 'Chèvre de race Boer connue pour sa croissance rapide et son rendement élevé en viande.'
      },
      specs: {
        en: ['Breed: Boer Cross', 'Weight: ~45 kg', 'Age: 14 Months', 'Vaccination: Complete Pox & PPR Shot'],
        rw: ['Ubwoko: Boer', 'Uburemere: ~45 kg', 'Imyaka: Amezi 14', 'Inkingo: Zose zarakozwe'],
        fr: ['Race: Boer', 'Poids: ~45 kg', 'Âge: 14 Mois', 'Vaccination: Complète']
      },
      artisan: 'Nyagatare Livestock Guild',
      stock: '30 Available'
    },
    {
      id: 'p8',
      name: {
        en: 'Premium Goat Meat Cuts (Chevon)',
        rw: 'Inyama y’Ihene Yatunganyijwe',
        fr: 'Viande de Chèvre Supérieure (Chevon)'
      },
      category: 'processed-meat',
      price: 14,
      unit: { en: 'per kg', rw: 'kuri kg', fr: 'par kg' },
      rating: 4.8,
      reviewsCount: 76,
      image: '/src/assets/images/livestock_goats_1794918373594.jpg',
      description: {
        en: 'Lean, tender, organically raised goat meat cuts, hygienically processed.',
        rw: 'Inyama y’ihene nziza yoroshye idafite ibinure byinshi, yatunganijwe neza.',
        fr: 'Viande de chèvre maigre et tendre, issue d’un élevage biologique.'
      },
      specs: {
        en: ['Cut: Bone-in & Boneless mix', 'Processing: Halal Certified', 'Packaging: Sealed Tray', 'Storage: Chilled'],
        rw: ['Uduce: Harimo n’amagufwa', 'Isuku: Halal', 'Gupfunyika: Isahane yashyizweho Platifiki', 'Ububiko: Muburyo bukonje'],
        fr: ['Coupe: Avec et sans os', 'Abattage: Halal', 'Emballage: Barquette scellée', 'Conservation: Réfrigéré']
      },
      artisan: 'Eastern Province Agro',
      stock: '140 kg Available'
    },
    {
      id: 'p9',
      name: {
        en: 'High-Grade Broiler Mash Feed (50 kg)',
        rw: 'Ibiryo by’Inkoko - Broiler Mash (Iro 50kg)',
        fr: 'Aliment Complet pour Poulets de Chair (50 kg)'
      },
      category: 'animal-feeds',
      price: 35,
      unit: { en: 'per 50kg bag', rw: 'kuri saki ya 50kg', fr: 'par sac de 50kg' },
      rating: 5.0,
      reviewsCount: 310,
      image: '/src/assets/images/animal_feeds_1794918372131.jpg',
      description: {
        en: 'Nutritionally balanced commercial feed formulated for rapid broiler growth and optimal feathering.',
        rw: 'Ibiryo by’inkoko bifite intungamubiri zose zikenewe kugira ngo inkoko zikuze vuba.',
        fr: 'Aliment équilibré formulé pour une croissance rapide des poulets de chair.'
      },
      specs: {
        en: ['Protein: 21% Min', 'Energy: 2900 kcal/kg', 'Weight: 50 kg Bag', 'Ingredients: Maize, Soybean Meal, Fish Meal, Vitamins'],
        rw: ['Poroteyine: 21%', 'Ingufu: 2900 kcal/kg', 'Uburemere: Saki 50 kg', 'Ibiyigize: Ibigori, Soya, Akantenje'],
        fr: ['Protéines: 21%', 'Énergie: 2900 kcal/kg', 'Poids: Sac de 50 kg', 'Ingrédients: Maïs, Soja, Farine de poisson']
      },
      artisan: 'Rwanda Grain & Feed Mills',
      stock: '600 Bags Available'
    },
    {
      id: 'p10',
      name: {
        en: 'Dairy Cattle Concentrate Feed (50 kg)',
        rw: 'Ibiryo by’Inka zitanga Amata (Saki 50kg)',
        fr: 'Aliment Concentré pour vaches laitières (50 kg)'
      },
      category: 'animal-feeds',
      price: 40,
      unit: { en: 'per 50kg bag', rw: 'kuri saki ya 50kg', fr: 'par sac de 50kg' },
      rating: 4.9,
      reviewsCount: 184,
      image: '/src/assets/images/animal_feeds_1794918372131.jpg',
      description: {
        en: 'High-protein dairy meal designed to boost milk production, butterfat content, and cow health.',
        rw: 'Ibiryo by’inka zitanga amata yongera umukamo n’ubuzima bw’inka.',
        fr: 'Aliment riche en protéines conçu pour stimuler la production laitière et la santé des vaches.'
      },
      specs: {
        en: ['Protein: 18% Min', 'Minerals: Calcium & Phosphorus Enriched', 'Weight: 50 kg Bag', 'Form: Pelleted'],
        rw: ['Poroteyine: 18%', 'Intungamubiri: Kalisiyumu na Fosifori', 'Uburemere: Saki 50 kg', 'Imiterere: Utuyiko (Pellets)'],
        fr: ['Protéines: 18%', 'Minéraux: Enrichi en calcium', 'Poids: Sac de 50 kg', 'Forme: Granulés']
      },
      artisan: 'AgroFeed Ltd Kigali',
      stock: '450 Bags Available'
    },
    {
      id: 'p11',
      name: {
        en: 'Organic Maize Bran (Ubunzenge - 50 kg)',
        rw: 'Ubunzenge bw’Ibigori (Saki 50kg)',
        fr: 'Son de Maïs Biologique (50 kg)'
      },
      category: 'animal-feeds',
      price: 22,
      unit: { en: 'per 50kg bag', rw: 'kuri saki ya 50kg', fr: 'par sac de 50kg' },
      rating: 4.7,
      reviewsCount: 95,
      image: '/src/assets/images/animal_feeds_1794918372131.jpg',
      description: {
        en: 'Pure, fresh maize bran milled locally from high-grade Rwandan corn. Excellent energy source for pigs and cattle.',
        rw: 'Ubunzenge bwiza bw’ibigori bwavuye mu migayo y’u Rwanda. Isoko nziza y’imbaraga ku matungo.',
        fr: 'Son de maïs pur et frais moulu localement. Excellente source d’énergie pour porcs et bovins.'
      },
      specs: {
        en: ['Purity: 100% Natural Corn Bran', 'Moisture: < 12%', 'Weight: 50 kg Bag', 'Application: Pigs, Cattle, Poultry'],
        rw: ['Isuku: 100% Ubunzenge bw’ibigori', 'Ubuhehere: < 12%', 'Uburemere: Saki 50kg', 'Uko bukoreshwa: Ku ngurube, inka, inkoko'],
        fr: ['Pureté: 100% Naturel', 'Humidité: < 12%', 'Poids: Sac de 50 kg', 'Utilisation: Porcs, bovins, volailles']
      },
      artisan: 'Eastern Maize Milling Co.',
      stock: '800 Bags Available'
    },
    {
      id: 'p12',
      name: {
        en: 'Livestock Mineral Salt Lick Block (5kg)',
        rw: 'Umunyu w’Intungamubiri w’Amatungo (5kg)',
        fr: 'Bloc de Sel Minéral pour Bétail (5 kg)'
      },
      category: 'animal-feeds',
      price: 15,
      unit: { en: 'per block', rw: 'buri kibumbiro', fr: 'par bloc' },
      rating: 4.9,
      reviewsCount: 112,
      image: '/src/assets/images/animal_feeds_1794918372131.jpg',
      description: {
        en: 'Essential mineral and trace element block for cattle, goats, and sheep to boost immunity and bone health.',
        rw: 'Umunyu urimo intungamubiri zose n’imyunyu ngugu y’ingenzi ku nka n’ihene.',
        fr: 'Bloc de sels minéraux essentiels pour bovins, caprins et ovins pour stimuler l’immunité.'
      },
      specs: {
        en: ['Weight: 5 kg Block', 'Minerals: Cobalt, Copper, Iodine, Zinc, Selenium', 'Weather-Resistant Formula', 'Duration: Lasts 3-4 Weeks per animal'],
        rw: ['Uburemere: 5 kg', 'Imyunyu: Cobalt, Copper, Iodine, Zinc, Selenium', 'Kurwanya amazi: Wihanganira imvura', 'Igihe umara: Iminsi 20-30'],
        fr: ['Poids: Bloc de 5 kg', 'Minéraux: Cobalt, Cuivre, Iode, Zinc', 'Résistance: Résistant aux intempéries', 'Durée: 3-4 semaines']
      },
      artisan: 'VetaCare Nutrition Kigali',
      stock: '300 Blocks Available'
    }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
    const matchesSearch = p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.name.rw.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.name.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal > 200 ? 0 : 10;
  const grandTotal = subtotal + (subtotal > 0 ? shippingFee : 0);

  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeInput.trim() || isAiLoading) return;

    const userMsg = conciergeInput.trim();
    setConciergeInput('');
    setConciergeMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, language: lang })
      });
      const data = await res.json();
      if (data.text) {
        setConciergeMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setConciergeMessages(prev => [...prev, { sender: 'ai', text: 'I am here to help you with livestock and animal feeds.' }]);
      }
    } catch (err) {
      setConciergeMessages(prev => [...prev, { sender: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white">
      
      {/* HEADER - Amazon Style Top Nav */}
      <header className="bg-[#131921] text-white sticky top-0 z-45 shadow-md">
        {/* Top Row: Logo, Deliver To, Search Bar, Language, Cart */}
        <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo Zone (Top Left) with gebyiallogo-.png */}
          <div className="flex items-center gap-4 shrink-0">
            <a href="#" onClick={() => { setActiveCategoryFilter('all'); setSearchQuery(''); }} className="flex items-center gap-2 group">
              <img 
                src="/src/assets/images/gebyiallogo-.png" 
                alt="Gebyian Network Logo" 
                className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  Gebyian <span className="text-[#febd69]">Network</span>
                </span>
                <span className="text-[10px] text-stone-300 font-mono tracking-wide uppercase">Agro & Livestock Platform</span>
              </div>
            </a>

            <div className="hidden xl:flex items-center gap-1 text-xs text-stone-300 pl-4 border-l border-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <p className="text-[10px] text-stone-400">{t.deliverTo}</p>
                <p className="font-bold text-white">Kigali, Rwanda</p>
              </div>
            </div>
          </div>

          {/* Search Bar Zone (Amazon Style) */}
          <div className="flex-1 max-w-3xl hidden md:flex items-center">
            <div className="flex w-full rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#febd69]">
              <select 
                className="bg-stone-200 text-stone-800 text-xs px-3 py-2 border-r border-stone-300 focus:outline-none cursor-pointer"
                onChange={(e) => setActiveCategoryFilter(e.target.value as any)}
                value={activeCategoryFilter}
              >
                <option value="all">{t.allDepts}</option>
                <option value="live-animals">{t.navLive}</option>
                <option value="processed-meat">{t.navMeat}</option>
                <option value="animal-feeds">{t.navFeeds}</option>
              </select>
              
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm text-stone-900 focus:outline-none"
              />
              
              <button 
                onClick={() => {}}
                className="bg-[#febd69] hover:bg-[#f3a847] text-stone-900 px-5 flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5 text-stone-900" />
              </button>
            </div>
          </div>

          {/* Right Zone: Language Selector, AI Advisor, Cart */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-stone-800 px-2.5 py-1.5 rounded-md border border-stone-700 text-xs font-medium">
              <Globe className="w-3.5 h-3.5 text-[#febd69]" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
              >
                <option value="en" className="bg-stone-900">EN</option>
                <option value="rw" className="bg-stone-900">RW</option>
                <option value="fr" className="bg-stone-900">FR</option>
              </select>
            </div>

            {/* AI Advisor Button removed */}

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 hover:border hover:border-white rounded-md transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-[#febd69]" />
                <span className="absolute -top-2 -right-2 bg-[#febd69] text-stone-900 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <span className="hidden md:inline font-bold text-xs">{t.cart}</span>
            </button>
          </div>
        </div>

        {/* Sub-Header / Navigation Bar */}
        <div className="bg-[#232f3e] px-4 py-2 border-t border-stone-800 text-xs font-medium">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-6">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <button onClick={() => setActiveCategoryFilter('all')} className={`hover:text-[#febd69] transition-colors flex items-center gap-1.5 ${activeCategoryFilter === 'all' ? 'text-[#febd69] font-bold underline underline-offset-4' : 'text-stone-200'}`}>
                {t.navHome}
              </button>
              <button onClick={() => setActiveCategoryFilter('live-animals')} className={`hover:text-[#febd69] transition-colors ${activeCategoryFilter === 'live-animals' ? 'text-[#febd69] font-bold underline underline-offset-4' : 'text-stone-200'}`}>
                {t.navLive}
              </button>
              <button onClick={() => setActiveCategoryFilter('processed-meat')} className={`hover:text-[#febd69] transition-colors ${activeCategoryFilter === 'processed-meat' ? 'text-[#febd69] font-bold underline underline-offset-4' : 'text-stone-200'}`}>
                {t.navMeat}
              </button>
              <button onClick={() => setActiveCategoryFilter('animal-feeds')} className={`hover:text-[#febd69] transition-colors ${activeCategoryFilter === 'animal-feeds' ? 'text-[#febd69] font-bold underline underline-offset-4' : 'text-stone-200'}`}>
                {t.navFeeds}
              </button>
            </div>

            <div className="flex items-center gap-4 text-stone-300 text-[11px] whitespace-nowrap">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> Vet Certified Livestock</span>
              <span className="hidden lg:inline">·</span>
              <span className="hidden lg:inline">Direct Farm Cold Chain</span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden bg-[#131921] p-3 border-t border-stone-800">
        <div className="flex w-full rounded-md overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-xs text-stone-900 focus:outline-none"
          />
          <button className="bg-[#febd69] px-4 py-2 text-stone-900">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-12 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {/* Hero badge removed */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-balance">
              {lang === 'rw' 
                ? 'Isoko rya Mbere ry’Amatungo n’Ibiryo byazo mu Rwanda.'
                : lang === 'fr'
                ? 'La Première Place de Marché du Bétail et de l’Agro-Alimentaire.'
                : 'Direct Farm-to-Market Livestock, Dressed Meat & Animal Feeds.'}
            </h1>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              {lang === 'rw'
                ? 'Gura amatungo mazima (Inka, Ihene, Ingurube, Inkoko), inyama zatunganyijwe na firigo, n’ibiryo by’amatungo byujuje ubuziranenge.'
                : lang === 'fr'
                ? 'Achetez du bétail vivant de qualité, de la viande fraîche transformée et des aliments pour animaux certifiés.'
                : 'Sourcing healthy livestock, vacuum-sealed prime cuts, and high-protein agricultural feeds directly from verified cooperatives.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setActiveCategoryFilter('live-animals')} 
                className="bg-[#febd69] hover:bg-[#f3a847] text-stone-900 font-bold px-6 py-2.5 rounded-lg text-xs md:text-sm shadow-md transition-colors"
              >
                {t.navLive}
              </button>
              <button 
                onClick={() => setActiveCategoryFilter('animal-feeds')} 
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs md:text-sm border border-stone-600 transition-colors"
              >
                {t.navFeeds}
              </button>
            </div>
          </div>

          <div className="relative aspect-[16:9] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
            <img 
              src="/src/assets/images/livestock_cattle_1794918370531.jpg" 
              alt="Gebyian Agro Marketplace" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="text-xs font-mono text-amber-400">Featured Showcase</p>
                <p className="text-lg font-bold">Certified Ankole & Cold-Chain Processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DASHBOARD SECTION WITH FILTER TABS */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Category & Filter Tabs Bar (Amazon Department Filter Style) */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              {t.filterTitle}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Showing {filteredProducts.length} agricultural items</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeCategoryFilter === 'all' 
                  ? 'bg-[#131921] text-white shadow' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('live-animals')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeCategoryFilter === 'live-animals' 
                  ? 'bg-[#131921] text-white shadow' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t.navLive}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('processed-meat')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeCategoryFilter === 'processed-meat' 
                  ? 'bg-[#131921] text-white shadow' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t.navMeat}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('animal-feeds')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeCategoryFilter === 'animal-feeds' 
                  ? 'bg-[#131921] text-white shadow' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t.navFeeds}
            </button>
          </div>
        </div>

        {/* PRODUCT GRID - Amazon Style Cards */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-800">No agricultural items found</h3>
            <p className="text-sm text-stone-500 mt-1">Try switching category tabs or searching for another livestock type.</p>
            <button 
              onClick={() => { setActiveCategoryFilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#131921] text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img 
                      src={product.image} 
                      alt={product.name[lang]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 bg-[#131921]/90 text-amber-400 text-[10px] font-bold px-2 py-1 rounded">
                      {product.stock}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-mono text-stone-500">{product.artisan}</p>
                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="text-sm font-bold text-stone-900 hover:text-amber-700 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {product.name[lang]}
                    </h3>

                    <div className="flex items-center gap-1 text-amber-600">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-700 ml-1">{product.rating}</span>
                      <span className="text-xs text-stone-400">({product.reviewsCount})</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {product.description[lang]}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold font-mono text-stone-900 tabular-nums">
                      ${product.price.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ {product.unit[lang]}</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToBag}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER - Amazon Style */}
      <footer className="bg-[#232f3e] text-stone-300 mt-20">
        <div className="bg-[#37475f] py-4 text-center text-xs font-medium text-stone-200">
          <a href="#" className="hover:underline">Back to top</a>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Gebyian Network</h4>
            <p className="text-stone-400 leading-relaxed">
              Leading livestock, agricultural meat, and animal feeds e-commerce network engineered with Amazon-grade reliability and cold-chain transparency.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Departments</h4>
            <p><a href="#" onClick={() => setActiveCategoryFilter('live-animals')} className="hover:underline">{t.navLive}</a></p>
            <p><a href="#" onClick={() => setActiveCategoryFilter('processed-meat')} className="hover:underline">{t.navMeat}</a></p>
            <p><a href="#" onClick={() => setActiveCategoryFilter('animal-feeds')} className="hover:underline">{t.navFeeds}</a></p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Let Us Help You</h4>
            <p><a href="#" className="hover:underline">Cold Chain Logistics</a></p>
            <p><a href="#" className="hover:underline">Vet Inspection & Certification</a></p>
            <p><a href="#" className="hover:underline">Wholesale & Cooperative Orders</a></p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Kigali Operations Hub</h4>
            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> KN 4 Ave, Kigali, Rwanda</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> +250 788 000 000</p>
            <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> support@gebyian.net</p>
          </div>
        </div>
        <div className="bg-[#131921] py-6 text-center text-[11px] text-stone-500 border-t border-stone-800">
          © {new Date().getFullYear()} Gebyian Network Agro-Commerce Platform. All rights reserved.
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL (PDP) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <div className="md:w-1/2 bg-stone-100 relative aspect-square md:aspect-auto">
              <img src={selectedProduct.image} alt={selectedProduct.name[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <span className="absolute top-4 left-4 bg-[#131921] text-amber-400 text-xs font-bold px-3 py-1 rounded">
                {selectedProduct.stock}
              </span>
            </div>

            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold uppercase">{selectedProduct.category}</span>
                  <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <p className="text-xs text-stone-500 font-mono">{selectedProduct.artisan}</p>
                  <h2 className="text-2xl font-bold text-stone-900 mt-1">{selectedProduct.name[lang]}</h2>
                  <p className="text-2xl font-extrabold font-mono text-stone-900 mt-2">
                    ${selectedProduct.price.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ {selectedProduct.unit[lang]}</span>
                  </p>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">{selectedProduct.description[lang]}</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">Specifications & Vet Guarantee</p>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {selectedProduct.specs[lang].map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center gap-4">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 py-3.5 bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 rounded-xl text-sm font-extrabold transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> {t.addToBag}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#131921] text-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#febd69]" />
                  <h2 className="text-lg font-bold">{t.cart} ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                    <p className="text-stone-700 font-medium">Your shopping bag is empty.</p>
                    <p className="text-xs text-stone-500">Add live animals, fresh meat, or feeds to begin.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 items-center">
                      <img src={item.image} alt={item.name[lang]} className="w-16 h-16 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 truncate">{item.name[lang]}</h4>
                        <p className="text-xs font-mono text-stone-500">${item.price.toLocaleString()} / {item.unit[lang]}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-stone-100 text-stone-600"><Minus className="w-3 h-3" /></button>
                            <span className="px-2.5 text-xs font-mono font-bold">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-stone-100 text-stone-600"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-xs font-extrabold font-mono text-stone-900">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-200 space-y-4 bg-stone-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>{t.subtotal}</span>
                      <span className="font-mono font-bold">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Cold Chain Transport</span>
                      <span className="font-mono font-bold">{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-extrabold pt-2 border-t border-stone-200 text-base">
                      <span>Total</span>
                      <span className="font-mono">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-3.5 bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 rounded-xl text-sm font-extrabold transition-colors shadow-md"
                  >
                    {t.checkout} (${grandTotal.toLocaleString()})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#131921] text-white">
              <h2 className="text-lg font-bold">Secure Agro Checkout</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Cold-Chain & Vet Dispatch Guarantee</p>
                <p>Your livestock and feeds will be dispatched with refrigerated transport and veterinary clearance certificate.</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Full Name / Cooperative Name</label>
                  <input type="text" defaultValue="Jean Bosco Mugisha" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Delivery Location in Rwanda</label>
                  <input type="text" defaultValue="Kimironko Market / Rubirizi Farm, Kigali" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Phone Number (MTN / Airtel)</label>
                  <input type="text" defaultValue="+250 788 123 456" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm" />
                </div>
              </div>

              <button 
                onClick={() => {
                  alert(t.orderComplete + ' GBY-' + Math.floor(100000 + Math.random() * 900000));
                  setCart([]);
                  setIsCheckoutOpen(false);
                }}
                className="w-full py-3.5 bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 rounded-xl text-sm font-extrabold transition-colors shadow-md"
              >
                Confirm Order (${grandTotal.toLocaleString()})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ADVISOR MODAL */}
      {isConciergeOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setIsConciergeOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#131921] text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-base font-bold">Gebyian Agro AI Advisor</h2>
                    <p className="text-[11px] text-stone-400">Powered by Gemini 4 Hydrogen</p>
                  </div>
                </div>
                <button onClick={() => setIsConciergeOpen(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50">
                {conciergeMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#131921] text-white rounded-br-none' 
                        : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-stone-500 text-xs animate-pulse">
                      Consulting veterinary & livestock network database...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiSend} className="p-4 bg-white border-t border-stone-200 flex gap-2">
                <input 
                  type="text" 
                  placeholder={t.askAiPlaceholder}
                  value={conciergeInput}
                  onChange={e => setConciergeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading}
                  className="px-4 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 rounded-xl text-xs font-extrabold transition-colors shadow-sm disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
