import { Agent, Property, PropertyImage } from '../types/database';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_mariano_otazu',
    slug: 'mariano-otazu-marin',
    name: 'Mariano Otazu Marín',
    role: 'Curador Director Internacional · Arquitectura Bioclimática & Fincas de Café',
    territory: 'Quillabamba & Valle del Urubamba, La Convención',
    phone: '+51 950 155 945',
    whatsapp: 'https://wa.me/51950155945?text=Hola%20Mariano%20Otazu,%20estoy%20interesado%20en%20las%20propiedades%20de%20NOMADA%20GROUP%20en%20La%20Convenci%C3%B3n,%20Cusco.',
    philosophy: 'Donde los Andes se funden con la selva alta, la arquitectura debe respirar con el dosel vegetal.',
    manifesto_snippet: 'Con más de 22 años de trayectoria en Cusco y el cañón de La Convención, custodio residencias bioclimáticas y fincas de café Geisha a 1.200 m.s.n.m. Asesoría directa y confidencial para compradores e inversionistas internacionales.',
    avatar_url: '/src/assets/images/agent_mariano_otazu_portrait_1793481670409.jpg',
    experience_years: 22,
    active_properties_count: 2,
    accent_color: '#2F3A2B',
    quote: 'La Convención posee una energía telúrica única: el calor del trópico abrazado por los glaciares andinos.',
    architectural_focus: ['Arquitectura Bioclimática', 'Piedra Andina Tallada', 'Madera de Cedro & Bambú', 'Paisajismo Regenerativo']
  },
  {
    id: 'agent_mateo_silva',
    slug: 'mateo-silva',
    name: 'Mateo Silva',
    role: 'Explorador Internacional · Santuarios de Montaña & Vilcabamba',
    territory: 'Vilcabamba & Santa Teresa, La Convención',
    philosophy: 'Construir en el último refugio incaico exige veneración absoluta por el silencio y la niebla.',
    manifesto_snippet: 'Recorro los senderos ancestrales y cañones de Vilcabamba y Santa Teresa para descubrir retiros privados imposibles de encontrar en el mercado convencional. Terrenos vírgenes con nacientes de agua pura de glaciar y vistas infinitas al cañón.',
    avatar_url: '/src/assets/images/agent_mateo_portrait_1793475509012.jpg',
    experience_years: 14,
    active_properties_count: 2,
    accent_color: '#C2623F',
    quote: 'Quien despierta con el río Urubamba bajo sus pies y la niebla rozando los helechos gigantes, no vuelve a concebir el mundo igual.',
    architectural_focus: ['Granito de Quebrada', 'Estructuras Sismo-resistentes Vivas', 'Energía Hídrica & Solar Off-Grid', 'Orquidearios Integrados']
  },
  {
    id: 'agent_elena_ruiz',
    slug: 'elena-ruiz',
    name: 'Elena Ruiz',
    role: 'Especialista Internacional · Haciendas Patrimoniales & Retiros Ecológicos',
    territory: 'Valle de La Convención & Conexión Cusco Histórico',
    philosophy: 'Rehabilitar una hacienda cusqueña es tejer la herencia prehispánica con el confort contemporáneo.',
    manifesto_snippet: 'Especializada en la recuperación de antiguas haciendas cafetaleras y cacaoteras en la provincia de La Convención, integrando patios claustrales de piedra con diseño escandinavo y pabellones de cristal abiertos a la selva alta.',
    avatar_url: '/src/assets/images/agent_elena_portrait_1793475508502.jpg',
    experience_years: 20,
    active_properties_count: 2,
    accent_color: '#14110F',
    quote: 'La historia de Cusco no termina en Sacsayhuamán; florece con intensidad desbordante en las quebradas de La Convención.',
    architectural_focus: ['Haciendas Históricas', 'Mampostería de Mortero de Cal', 'Techos de Teja Artesanal', 'Patios Botánicos']
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_villa_quillabamba',
    agent_id: 'agent_mariano_otazu',
    title: 'Villa Quillabamba',
    tagline: 'Residencia bioclimática de piedra andina y cedro sobre cafetales de altura',
    architectural_style: 'Bioclimático Tropical Andino',
    location: 'Quillabamba, La Convención, Cusco, Perú',
    region: 'La Convención · Ceja de Selva',
    price_formatted: '$ 1.850.000 USD',
    price_value: 1850000,
    area_sqm: 620,
    bedrooms: 4,
    bathrooms: 5,
    year_built: 2024,
    materials: ['Piedra andina tallada a mano', 'Madera de cedro tropical recuperada', 'Cubiertas voladas de teja andina', 'Vidrio templado termoacústico'],
    cover_image: '/src/assets/images/property_villa_quillabamba_1793477326390.jpg',
    gallery: [
      '/src/assets/images/property_villa_quillabamba_1793477326390.jpg',
      '/src/assets/images/hero_la_convencion_cusco_1793477326244.jpg',
      '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg'
    ],
    description: 'Enclavada en una colina privada con vistas panorámicas al valle de Quillabamba y al curso serpenteante del río, Villa Quillabamba combina la solidez de la mampostería incaica con la calidez del cedro amazónico. Su piscina de borde infinito refleja los picos nubosos de la cordillera de Vilcabamba, rodeada de 3 hectáreas de cafetales de variedad Geisha en producción orgánica certificada.',
    architect_name: 'Atelier Nómada Perú & Clara Moreau',
    orientation: 'Noreste con captación de brisas del cañón',
    features: ['3 hectáreas de cafetal Geisha orgánico', 'Piscina infinita con agua de manantial', 'Planta solar fotovoltaica con baterías de litio', 'Pabellón de cata y secado artesanal'],
    is_featured: true
  },
  {
    id: 'prop_santuario_vilcabamba',
    agent_id: 'agent_mateo_silva',
    title: 'Santuario de Vilcabamba',
    tagline: 'Refugio contemporáneo de piedra rústica y orquídeas en el valle sagrado rebelde',
    architectural_style: 'Minimalismo Orgánico de Montaña',
    location: 'Valle de Vilcabamba, La Convención, Cusco, Perú',
    region: 'Vilcabamba · Cordillera Oriental',
    price_formatted: '$ 2.400.000 USD',
    price_value: 2400000,
    area_sqm: 480,
    bedrooms: 3,
    bathrooms: 4,
    year_built: 2025,
    materials: ['Granito de río Urubamba', 'Estructura en madera dura Shihuahuaco', 'Vidrio continuo low-E', 'Pisos de loseta de piedra rústica'],
    cover_image: '/src/assets/images/property_santuario_vilcabamba_1793477328117.jpg',
    gallery: [
      '/src/assets/images/property_santuario_vilcabamba_1793477328117.jpg',
      '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg'
    ],
    description: 'Situado en el corazón de la histórica provincia rebelde de Vilcabamba, este santuario arquitectónico se diseñó como un observatorio inmersivo del bosque nublado. Amplias cristaleras correderas conectan el gran salón con una terraza volada sobre el cañón, donde orquídeas autóctonas y helechos arbóreos bordean un espejo de agua mineral natural.',
    architect_name: 'Mateo Silva & Conservación Andina',
    orientation: 'Oeste hacia las puestas de sol sobre la cordillera',
    features: ['Reserva privada de 8 hectáreas de bosque nuboso', 'Acceso exclusivo a cascada y pozas termales', 'Hogar central de granito volcánico', 'Helisuperficie autorizada para vuelos Cusco-Vilcabamba'],
    is_featured: true
  },
  {
    id: 'prop_mirador_urubamba',
    agent_id: 'agent_mateo_silva',
    title: 'Finca Mirador del Cañón',
    tagline: 'Terraza monumental sobre el meandro del río Urubamba y los pasos andinos',
    architectural_style: 'Arquitectura de Paisaje',
    location: 'Santa Teresa, La Convención, Cusco, Perú',
    region: 'La Convención · Santa Teresa',
    price_formatted: '$ 1.650.000 USD',
    price_value: 1650000,
    area_sqm: 510,
    bedrooms: 4,
    bathrooms: 4,
    year_built: 2023,
    materials: ['Piedra de cantera local', 'Tejas de arcilla cocida', 'Vigas de eucalipto seleccionado', 'Cobre natural'],
    cover_image: '/src/assets/images/hero_la_convencion_cusco_1793477326244.jpg',
    gallery: [
      '/src/assets/images/hero_la_convencion_cusco_1793477326244.jpg',
      '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg'
    ],
    description: 'En lo alto del cañón que conduce a los baños termales de Cocalmayo, la Finca Mirador del Cañón domina un meandro de 360 grados del río. Concebida con terrazas escalonadas inspiradas en los andenes agrícolas incas, cada espacio habitable cuenta con ventilación natural generada por el gradiente térmico del cañón.',
    architect_name: 'Estudio Andino Territorial',
    orientation: 'Este-Oeste con doble frente panorámico',
    features: ['Andenes prehispánicos restaurados', 'Vistas de 360° al cañón del Urubamba', 'Pozo de aguas termominerales', 'Cosecha propia de cacao blanco de La Convención'],
    is_featured: true
  },
  {
    id: 'prop_hacienda_patrimonial',
    agent_id: 'agent_elena_ruiz',
    title: 'Hacienda San Gabriel',
    tagline: 'Histórica hacienda colonial restaurada con patio claustral y huerto botánico',
    architectural_style: 'Patrimonio Virreinal Restaurado',
    location: 'Valle de La Convención, Cusco, Perú',
    region: 'La Convención Centro',
    price_formatted: '$ 3.200.000 USD',
    price_value: 3200000,
    area_sqm: 890,
    bedrooms: 6,
    bathrooms: 7,
    year_built: 1840,
    materials: ['Muros de adobe reforzado con piedra de sillería', 'Vigas de cedro de 180 años', 'Pisos de baldosas de barro artesanal'],
    cover_image: '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg',
    gallery: [
      '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg',
      '/src/assets/images/property_villa_quillabamba_1793477326390.jpg'
    ],
    description: 'Una joya patrimonial de la época dorada de las haciendas cusqueñas de exportación de café y caña. Restaurada meticulosamente bajo supervisión histórica, la propiedad conserva su capilla privada, arcadas perimetrales y un atrio con árboles frutales subtropicales (mango, chirimoya, cacao chuncho) bajo la bruma del valle.',
    architect_name: 'Elena Ruiz & Patrimonio Monumental Cusco',
    orientation: 'Sur con vistas al valle fluvial',
    features: ['Capilla original consagrada', 'Molino histórico de agua operativo', 'Caballerizas y senderos de herradura', 'Huerto de frutales exóticos de 12 hectáreas'],
    is_featured: true
  }
];

export const INITIAL_PROPERTY_IMAGES: PropertyImage[] = [
  {
    id: 'img_villa_quillabamba_1',
    property_id: 'prop_villa_quillabamba',
    image_url: '/src/assets/images/property_villa_quillabamba_1793477326390.jpg',
    caption: 'Terraza de piedra andina y piscina infinita sobre los cafetales de Quillabamba',
    aspect_ratio: '16:9',
    is_cover: true
  },
  {
    id: 'img_santuario_vilcabamba_1',
    property_id: 'prop_santuario_vilcabamba',
    image_url: '/src/assets/images/property_santuario_vilcabamba_1793477328117.jpg',
    caption: 'Retiro contemporáneo rodeado de orquídeas y niebla en el cañón de Vilcabamba',
    aspect_ratio: '16:9',
    is_cover: true
  },
  {
    id: 'img_mirador_urubamba_1',
    property_id: 'prop_mirador_urubamba',
    image_url: '/src/assets/images/hero_la_convencion_cusco_1793477326244.jpg',
    caption: 'Amanecer sobre el meandro del río Urubamba en La Convención, Cusco',
    aspect_ratio: '16:9',
    is_cover: true
  },
  {
    id: 'img_hacienda_patrimonial_1',
    property_id: 'prop_hacienda_patrimonial',
    image_url: '/src/assets/images/landscape_la_convencion_mist_1793477329367.jpg',
    caption: 'Vista aérea de las terrazas y quebradas del valle de La Convención',
    aspect_ratio: '16:9',
    is_cover: true
  }
];
