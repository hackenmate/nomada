import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Layers,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Eye,
  CheckCircle2,
  PlusCircle,
  Trash2,
  Ruler,
  Mountain,
  Share2,
  ExternalLink,
  Info,
  Navigation
} from 'lucide-react';

export interface LotItem {
  id: string;
  code: string;
  name: string;
  territory: 'izcuchaca' | 'huayopata';
  sector: string;
  areaSqm: number;
  status: 'preventa' | 'disponible' | 'proyecto' | 'reserva';
  priceEstimate?: string;
  topography: string;
  waterAccess: string;
  accessRoad: string;
  elevationMsl: number;
  lat: number;
  lng: number;
  // SVG coordinates on the 1000x600 canvas
  svgX: number;
  svgY: number;
  polygonPoints?: string;
  description: string;
  features: string[];
}

export interface UserPinnedLot {
  id: string;
  code: string;
  name: string;
  territory: 'izcuchaca' | 'huayopata';
  areaSqm: number;
  usage: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  notes: string;
  createdAt: string;
}

const INITIAL_LOTS: LotItem[] = [
  // ==========================================
  // IZCUCHACA (Valle de Anta - ~3,340 msnm)
  // ==========================================
  {
    id: 'izc_lot_1',
    code: 'IZC-01',
    name: 'Quinta Campestre Pampa de Anta',
    territory: 'izcuchaca',
    sector: 'Pampa Central · Izcuchaca',
    areaSqm: 1500,
    status: 'preventa',
    priceEstimate: '$ 98,000 USD',
    topography: 'Plano 100% · Suelo aluvial fértil',
    waterAccess: 'Canal de regadío tecnificado + manantial',
    accessRoad: 'A 250m de Carretera Cusco-Abancay',
    elevationMsl: 3342,
    lat: -13.4985,
    lng: -72.1432,
    svgX: 420,
    svgY: 310,
    polygonPoints: '390,290 450,295 460,335 395,330',
    description: 'Terreno campestre privilegiado en la planicie de Anta con vistas abiertas de 360° al nevado Salcantay. Ideal para casa de campo, huerto orgánico o retiro ecuestre a solo 35 minutos de Cusco.',
    features: ['Vistas despejadas al Salcantay', 'Factibilidad eléctrica trifásica', 'Inscrito en SUNARP (Título de Propiedad)']
  },
  {
    id: 'izc_lot_2',
    code: 'IZC-02',
    name: 'Mirador Los Molinos · Cachimayo Alto',
    territory: 'izcuchaca',
    sector: 'Colinas Norte · Cachimayo',
    areaSqm: 2800,
    status: 'disponible',
    priceEstimate: '$ 165,000 USD',
    topography: 'Suave pendiente panorámica (8%)',
    waterAccess: 'Ojo de agua de vertiente andina',
    accessRoad: 'Camino afirmado carrozable de 6m',
    elevationMsl: 3390,
    lat: -13.4880,
    lng: -72.1380,
    svgX: 580,
    svgY: 190,
    polygonPoints: '550,170 620,180 610,225 540,210',
    description: 'Elevado sobre la cota del valle, este lote domina toda la extensión de la pampa de Izcuchaca. Rodeado de árboles nativos de queñual y colle.',
    features: ['Microclima abrigado', 'Bosquete de queñuales nativos', 'Excelente asoleamiento matutino']
  },
  {
    id: 'izc_lot_3',
    code: 'IZC-03',
    name: 'Finca Andina Río Anta',
    territory: 'izcuchaca',
    sector: 'Ribera Fluvial · Sector Molino',
    areaSqm: 4200,
    status: 'proyecto',
    priceEstimate: '$ 245,000 USD',
    topography: 'Terrazas andinas de doble nivel',
    waterAccess: 'Colindancia con brazo de agua cristalina',
    accessRoad: 'Trocha carrozable privada',
    elevationMsl: 3328,
    lat: -13.5060,
    lng: -72.1520,
    svgX: 290,
    svgY: 410,
    polygonPoints: '260,380 330,395 320,445 250,430',
    description: 'Parcela de gran formato perfecta para un desarrollo familiar privado o lodge campestre de descanso con huerto de manzanos y flores andinas.',
    features: ['Colindancia fluvial', 'Tierra negra orgánica de primera calidad', 'Privacidad total']
  },
  {
    id: 'izc_lot_4',
    code: 'IZC-04',
    name: 'Reserva Chinchaypujio Junction',
    territory: 'izcuchaca',
    sector: 'Bifurcación Sur · Acceso Vía Expresa',
    areaSqm: 950,
    status: 'preventa',
    priceEstimate: '$ 74,000 USD',
    topography: 'Plano nivelado',
    waterAccess: 'Red de agua potable rural',
    accessRoad: 'Frente directo a vía asfaltada secundaria',
    elevationMsl: 3350,
    lat: -13.5140,
    lng: -72.1410,
    svgX: 470,
    svgY: 480,
    polygonPoints: '445,460 500,465 490,505 435,500',
    description: 'Lote compacto y de fácil mantenimiento con accesibilidad inmediata. La mejor opción de inversión a medio plazo ante la expansión campestre del Cusco.',
    features: ['Acceso directo asfaltado', 'Cercado perimetral con pirca de piedra', 'Documentación saneada']
  },
  {
    id: 'izc_lot_5',
    code: 'IZC-05',
    name: 'Altos de Compone · Reserva Futura',
    territory: 'izcuchaca',
    sector: 'Sector Agrícola Ancestral',
    areaSqm: 3500,
    status: 'reserva',
    priceEstimate: 'Fase 2 (Próxima Apertura)',
    topography: 'Lomada suave con andenería rústica',
    waterAccess: 'Punto de captación subterránea proyectado',
    accessRoad: 'Trocha afirmada en ensanchamiento',
    elevationMsl: 3375,
    lat: -13.4920,
    lng: -72.1610,
    svgX: 210,
    svgY: 220,
    polygonPoints: '180,200 245,210 240,260 175,245',
    description: 'Sector planificado para futura habilitación campestre de baja densidad. Registro previo de interesados en curso.',
    features: ['Andenes prehispánicos consolidados', 'Amplia proyección de plusvalía', 'Orientación norte']
  },

  // ==========================================
  // HUAYOPATA / HUYRO (La Convención - ~1,524 msnm)
  // ==========================================
  {
    id: 'hyr_lot_1',
    code: 'HYR-01',
    name: 'Finca Geisha Huyro Central',
    territory: 'huayopata',
    sector: 'Valle de Huyro · Cuenca Central',
    areaSqm: 5000,
    status: 'preventa',
    priceEstimate: '$ 145,000 USD',
    topography: 'Ondulada suave con sombra de árboles frutales',
    waterAccess: 'Manantial de vertiente propio (aforo 2.5 L/s)',
    accessRoad: 'Vía carrozable afirmada a 400m del centro',
    elevationMsl: 1530,
    lat: -13.0072,
    lng: -72.5542,
    svgX: 480,
    svgY: 290,
    polygonPoints: '440,260 530,270 520,335 430,320',
    description: 'Media hectárea de tierra fértil subtropical en la capital cafetalera y del té de La Convención. Cuenta con más de 700 cafetos de variedad Geisha y Typica en plena producción, cítricos y árboles de palta.',
    features: ['Cafetos Geisha en producción', 'Manantial permanente de agua pura', 'Clima cálido templado todo el año (22°C)']
  },
  {
    id: 'hyr_lot_2',
    code: 'HYR-02',
    name: 'Santuario Fluvial Río Lucumayo',
    territory: 'huayopata',
    sector: 'Ribera Lucumayo · Sector Amaybamba',
    areaSqm: 3400,
    status: 'disponible',
    priceEstimate: '$ 115,000 USD',
    topography: 'Terrazas aluviales con playa fluvial privada',
    waterAccess: 'Río Lucumayo cristalino + manantial de quebrada',
    accessRoad: 'Puente carrozable y camino vecinal',
    elevationMsl: 1485,
    lat: -13.0180,
    lng: -72.5650,
    svgX: 330,
    svgY: 390,
    polygonPoints: '290,360 370,375 360,430 280,415',
    description: 'Propiedad única con 60 metros lineales de orilla sobre el río Lucumayo. Pozas naturales de agua cristalina procedente de los glaciares del Abra Málaga.',
    features: ['Orilla de río privada', 'Microclima de ceja de selva fresca', 'Apto para cabañas ecológicas o glamping']
  },
  {
    id: 'hyr_lot_3',
    code: 'HYR-03',
    name: 'Balcón del Té Histórico',
    territory: 'huayopata',
    sector: 'Alturas de Huyro · Plantaciones Centenarias',
    areaSqm: 10000,
    status: 'preventa',
    priceEstimate: '$ 220,000 USD',
    topography: 'Meseta suspendida sobre el cañón',
    waterAccess: 'Naciente de montaña protegida',
    accessRoad: 'Carretera afirmada afirmada en excelente estado',
    elevationMsl: 1680,
    lat: -12.9960,
    lng: -72.5410,
    svgX: 620,
    svgY: 180,
    polygonPoints: '580,150 670,165 660,230 570,210',
    description: '1 hectárea completa con vistas cinematográficas al cañón que desciende hacia Quillabamba. Tierras históricas donde se cultivó el primer té del Perú, rodeado de orquídeas salvajes.',
    features: ['10,000 m² (1 Hectárea)', 'Vistas panorámicas de 360°', 'Zonificación para proyecto agroturístico']
  },
  {
    id: 'hyr_lot_4',
    code: 'HYR-04',
    name: 'Eco-Lodge Mirador San Luis',
    territory: 'huayopata',
    sector: 'Sector San Luis · Descenso Abra Málaga',
    areaSqm: 6200,
    status: 'proyecto',
    priceEstimate: '$ 175,000 USD',
    topography: 'Laderas boscosas con explanadas naturales',
    waterAccess: 'Cascada natural a 40 metros del límite',
    accessRoad: 'Trocha carrozable conectada a ruta nacional',
    elevationMsl: 1850,
    lat: -12.9840,
    lng: -72.5290,
    svgX: 740,
    svgY: 120,
    polygonPoints: '700,90 780,110 770,165 690,145',
    description: 'En el límite donde el bosque de niebla se encuentra con la ceja de selva. Excelente para avistamiento de aves (gallito de las rocas, tucanes andinos) y ecoturismo de alta gama.',
    features: ['Cascada natural colindante', 'Santuario de colibríes y aves endémicas', 'Factibilidad solar fotovoltaica']
  },
  {
    id: 'hyr_lot_5',
    code: 'HYR-05',
    name: 'Finca Cafetalera Sicre · Reserva Futura',
    territory: 'huayopata',
    sector: 'Quebrada de Sicre',
    areaSqm: 12500,
    status: 'reserva',
    priceEstimate: 'Fase 2 (Próxima Apertura)',
    topography: 'Cañón abrigado con terrazas de cultivo',
    waterAccess: 'Arroyo constante de alta pureza',
    accessRoad: 'Camino de herradura con proyecto de trocha',
    elevationMsl: 1610,
    lat: -13.0290,
    lng: -72.5780,
    svgX: 200,
    svgY: 480,
    polygonPoints: '160,450 250,470 235,530 150,510',
    description: 'Extensión virgen en la cuenca de Sicre reservada para el desarrollo de una comunidad ecológica autosostenible basada en caficultura de especialidad y permacultura.',
    features: ['Bosque nativo primario protegido', '12,500 m² de biodiversidad', 'Suelo virgen de alta fertilidad']
  }
];

interface TerritoryMapsSectionProps {
  onCursorChange?: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const TerritoryMapsSection: React.FC<TerritoryMapsSectionProps> = ({ onCursorChange }) => {
  const [activeTerritory, setActiveTerritory] = useState<'izcuchaca' | 'huayopata'>('izcuchaca');
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(INITIAL_LOTS[0]);
  const [userLots, setUserLots] = useState<UserPinnedLot[]>([]);
  const [isPlottingMode, setIsPlottingMode] = useState<boolean>(false);
  const [tempPin, setTempPin] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const [tempLotData, setTempLotData] = useState<{
    name: string;
    areaSqm: number;
    usage: string;
    notes: string;
  }>({
    name: 'Nuevo Lote en Prospección',
    areaSqm: 1200,
    usage: 'Residencial Campestre',
    notes: 'Terreno con excelente asoleamiento y factibilidad de servicios.'
  });

  // Layer toggles
  const [showContours, setShowContours] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter lots by active territory
  const currentLots = INITIAL_LOTS.filter((l) => l.territory === activeTerritory);
  const currentUserLots = userLots.filter((l) => l.territory === activeTerritory);

  // Handle map click for plotting a future lot
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPlottingMode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel coordinates to SVG viewBox units (1000 x 600)
    const scaleX = 1000 / rect.width;
    const scaleY = 600 / rect.height;
    const svgX = Math.round(clickX * scaleX);
    const svgY = Math.round(clickY * scaleY);

    // Compute realistic Lat/Lng coordinates depending on territory
    let lat: number;
    let lng: number;

    if (activeTerritory === 'izcuchaca') {
      // Base center: -13.4972, -72.1444
      lat = -13.4800 - (svgY / 600) * 0.040;
      lng = -72.1700 + (svgX / 1000) * 0.050;
    } else {
      // Base center: -13.0061, -72.5550
      lat = -12.9750 - (svgY / 600) * 0.060;
      lng = -72.5900 + (svgX / 1000) * 0.070;
    }

    setTempPin({
      x: svgX,
      y: svgY,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5))
    });
  };

  const handleSavePinnedLot = () => {
    if (!tempPin) return;

    const nextId = `user_lot_${Date.now()}`;
    const nextCode = `${activeTerritory === 'izcuchaca' ? 'IZC' : 'HYR'}-PROY-${userLots.length + 1}`;

    const newPinned: UserPinnedLot = {
      id: nextId,
      code: nextCode,
      name: tempLotData.name || 'Lote Personalizado',
      territory: activeTerritory,
      areaSqm: Number(tempLotData.areaSqm) || 1000,
      usage: tempLotData.usage,
      lat: tempPin.lat,
      lng: tempPin.lng,
      svgX: tempPin.x,
      svgY: tempPin.y,
      notes: tempLotData.notes,
      createdAt: new Date().toLocaleDateString('es-PE')
    };

    setUserLots([...userLots, newPinned]);
    setTempPin(null);
    setIsPlottingMode(false);
  };

  const handleDeleteUserLot = (id: string) => {
    setUserLots(userLots.filter((l) => l.id !== id));
  };

  // Build WhatsApp inquiry link for a specific lot
  const getWhatsAppLotLink = (lot: LotItem) => {
    const text = encodeURIComponent(
      `Hola Mariano Otazu Marín, le escribo desde el visualizador cartográfico de NOMADA GROUP. Estoy muy interesado en el Lote ${lot.code} ("${lot.name}") ubicado en ${lot.sector} (${lot.territory === 'izcuchaca' ? 'Valle de Izcuchaca, Anta' : 'Huayopata / Huyro, La Convención'}). Deseo recibir información detallada sobre precio de preventa, delimitación topográfica y coordinar una visita técnica al terreno.`
    );
    return `https://wa.me/51950155945?text=${text}`;
  };

  // Build WhatsApp inquiry link for a custom pinned future lot
  const getWhatsAppCustomLotLink = (pinned: UserPinnedLot | { lat: number; lng: number; areaSqm: number; usage: string; name: string }) => {
    const territoryLabel = activeTerritory === 'izcuchaca' ? 'Izcuchaca (Valle de Anta, Cusco)' : 'Huayopata / Huyro (La Convención, Cusco)';
    const text = encodeURIComponent(
      `Hola Mariano Otazu Marín, he señalado un nuevo lote proyectado en el mapa de ${territoryLabel}:\n` +
      `• Nombre de referencia: ${pinned.name}\n` +
      `• Coordenadas GPS: ${pinned.lat}, ${pinned.lng}\n` +
      `• Superficie estimada: ${pinned.areaSqm} m²\n` +
      `• Uso proyectado: ${pinned.usage}\n` +
      `¿Podríamos evaluar la viabilidad de demarcación y disponibilidad de lotización con su equipo?`
    );
    return `https://wa.me/51950155945?text=${text}`;
  };

  return (
    <section id="mapas-lotes" className="py-24 px-4 sm:px-6 lg:px-12 bg-[#F7F4EE] border-t border-[#2F3A2B]/15 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[#2F3A2B]/15 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-[#C2623F] mb-2 font-mono">
              <Compass className="w-4 h-4 text-[#C2623F]" />
              <span>Cartografía Territorial & Zonificación de Lotes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#14110F] tracking-tight">
              Mapas de Izcuchaca & Huayopata
            </h2>
            <p className="text-sm sm:text-base text-[#14110F]/70 font-light mt-3 max-w-2xl">
              Explore los planos topográficos interactivos de los dos valles estratégicos de Cusco: la meseta campestre de <strong className="text-[#14110F] font-medium">Izcuchaca (Anta)</strong> a 3.340 msnm y la ceja de selva de <strong className="text-[#14110F] font-medium">Huayopata / Huyro</strong> a 1.524 msnm. Señale lotes en preventa o proyecte nuevas delimitaciones a futuro con georreferenciación directa.
            </p>
          </div>

          {/* Territory Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#2F3A2B]/15 shadow-sm">
            <button
              onClick={() => {
                setActiveTerritory('izcuchaca');
                setSelectedLot(INITIAL_LOTS.find(l => l.territory === 'izcuchaca') || null);
                setTempPin(null);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTerritory === 'izcuchaca'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-md font-medium'
                  : 'text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#2F3A2B]/5'
              }`}
            >
              <Mountain className="w-4 h-4 text-[#C2623F]" />
              <span>Valle de Izcuchaca (Anta)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">3.340 m</span>
            </button>

            <button
              onClick={() => {
                setActiveTerritory('huayopata');
                setSelectedLot(INITIAL_LOTS.find(l => l.territory === 'huayopata') || null);
                setTempPin(null);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTerritory === 'huayopata'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-md font-medium'
                  : 'text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#2F3A2B]/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C2623F]" />
              <span>Huayopata / Huyro (La Convención)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">1.524 m</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Interactive Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#FAF7F2] p-4 rounded-2xl border border-[#2F3A2B]/10 shadow-sm">
          
          {/* Territory Quick Metadata */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#C2623F] animate-pulse" />
            <div className="text-xs">
              <span className="font-medium text-[#14110F] font-serif text-sm">
                {activeTerritory === 'izcuchaca' ? 'Sector Valle de Anta · Cusco' : 'Sector Cañón del Lucumayo · La Convención'}
              </span>
              <span className="text-[#14110F]/50 ml-2 font-mono hidden md:inline">
                {activeTerritory === 'izcuchaca' ? '13°29\'50"S · 72°08\'40"W' : '13°00\'22"S · 72°33\'18"W'}
              </span>
            </div>
          </div>

          {/* Interactive Plotting Tool Activation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlottingMode(!isPlottingMode);
                if (isPlottingMode) setTempPin(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                isPlottingMode
                  ? 'bg-[#C2623F] text-[#FAF7F2] border-[#C2623F] shadow-lg animate-pulse'
                  : 'bg-[#FAF7F2] text-[#14110F] border-[#2F3A2B]/20 hover:border-[#C2623F] hover:text-[#C2623F]'
              }`}
              title="Active para hacer clic en el mapa y señalar un nuevo lote a futuro"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isPlottingMode ? 'Modo Señalador Activo (Haga clic en el mapa)' : 'Señalar Nuevo Lote a Futuro'}</span>
            </button>

            {/* Layer Toggles Dropdown / Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-[#2F3A2B]/15 pl-3">
              <button
                onClick={() => setShowContours(!showContours)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  showContours ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                }`}
                title="Curvas de Nivel"
              >
                Topografía
              </button>
              <button
                onClick={() => setShowRivers(!showRivers)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  showRivers ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                }`}
                title="Ríos y Manantiales"
              >
                Ríos
              </button>
              <button
                onClick={() => setShowRoads(!showRoads)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  showRoads ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                }`}
                title="Carreteras y Caminos"
              >
                Vías
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-l border-[#2F3A2B]/15 pl-3">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.25, 2.0))}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Acercar mapa"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.25, 0.75))}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Alejar mapa"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Restablecer escala"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Container + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Map Canvas Column (8 cols) */}
          <div className="lg:col-span-8 bg-[#EFE9DF] rounded-3xl border border-[#2F3A2B]/20 overflow-hidden shadow-xl relative">
            
            {/* Top Bar inside Map with Compass and Scale */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-[#FAF7F2]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#2F3A2B]/10 shadow-sm pointer-events-none">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#2F3A2B]">
                <Navigation className="w-3.5 h-3.5 text-[#C2623F] -rotate-45" />
                <span>NORTE 0°</span>
              </div>
              <span className="text-[#2F3A2B]/30">|</span>
              <div className="text-[11px] font-mono text-[#14110F]/70">
                Escala: {activeTerritory === 'izcuchaca' ? '1:10.000 (Valle)' : '1:15.000 (Quebrada)'}
              </div>
            </div>

            {/* Mode Banner if Plotting */}
            {isPlottingMode && (
              <div className="absolute top-4 right-4 z-20 bg-[#C2623F] text-[#FAF7F2] px-4 py-1.5 rounded-full text-xs font-mono shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Haga clic sobre el terreno para ubicar el lote</span>
              </div>
            )}

            {/* Interactive SVG Viewport */}
            <div className="w-full aspect-[16/10] sm:aspect-[16/9.5] overflow-hidden relative cursor-crosshair">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 600"
                onClick={handleMapClick}
                className="w-full h-full select-none transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="bgValleyIzcuchaca" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DFD8C9" />
                    <stop offset="50%" stopColor="#ECE5D8" />
                    <stop offset="100%" stopColor="#D9D0BE" />
                  </linearGradient>

                  <linearGradient id="bgCanyonHuayopata" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C9D6BE" />
                    <stop offset="50%" stopColor="#DDE6D3" />
                    <stop offset="100%" stopColor="#C3D2B6" />
                  </linearGradient>

                  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7E9E94" />
                    <stop offset="100%" stopColor="#557B70" />
                  </linearGradient>

                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2F3A2B" strokeWidth="0.3" strokeOpacity="0.12" />
                  </pattern>

                  <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#14110F" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Background Map Base */}
                <rect
                  x="0"
                  y="0"
                  width="1000"
                  height="600"
                  fill={activeTerritory === 'izcuchaca' ? 'url(#bgValleyIzcuchaca)' : 'url(#bgCanyonHuayopata)'}
                />

                {/* Subtle Cartographic Grid */}
                <rect x="0" y="0" width="1000" height="600" fill="url(#gridPattern)" />

                {/* ---------------------------------------------------- */}
                {/* TERRITORY 1: IZCUCHACA (Valle de Anta) Cartography */}
                {/* ---------------------------------------------------- */}
                {activeTerritory === 'izcuchaca' && (
                  <g id="izcuchaca-layers">
                    
                    {/* Topographic elevation contours */}
                    {showContours && (
                      <g stroke="#8B7E66" strokeWidth="1" fill="none" opacity="0.35">
                        {/* Mountain contours around Anta Valley */}
                        <path d="M 0,120 Q 250,80 500,100 T 1000,60" />
                        <path d="M 0,160 Q 300,140 600,150 T 1000,110" />
                        <path d="M 0,220 Q 280,200 550,210 T 1000,180" />
                        <path d="M 0,480 Q 250,520 600,490 T 1000,530" />
                        <path d="M 0,540 Q 350,570 700,550 T 1000,580" />
                        
                        {/* High Andes peaks background */}
                        <polygon points="120,40 180,10 240,40" fill="#EAE5DC" stroke="#8B7E66" strokeWidth="1" opacity="0.6" />
                        <text x="180" y="8" textAnchor="middle" fontSize="9" fill="#2F3A2B" fontFamily="sans-serif" opacity="0.7">
                          ▲ C° Mollepata (4.150m)
                        </text>

                        <polygon points="760,45 830,15 900,45" fill="#EAE5DC" stroke="#8B7E66" strokeWidth="1" opacity="0.6" />
                        <text x="830" y="12" textAnchor="middle" fontSize="9" fill="#2F3A2B" fontFamily="sans-serif" opacity="0.7">
                          ▲ Nevado Salcantay / Vilcanota
                        </text>
                      </g>
                    )}

                    {/* Green Agricultural Zones (Pampa de Anta) */}
                    <g opacity="0.25">
                      <rect x="220" y="240" width="380" height="230" rx="40" fill="#4E6E45" />
                      <rect x="630" y="200" width="280" height="200" rx="30" fill="#6A8557" />
                    </g>

                    {/* Rivers and waterways */}
                    {showRivers && (
                      <g id="izcuchaca-hydro">
                        {/* Río Anta Main Flow */}
                        <path
                          d="M 10,340 C 180,330 260,370 360,350 C 470,330 560,380 700,340 C 820,300 910,330 990,320"
                          fill="none"
                          stroke="url(#riverGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                        {/* Secondary stream from Cachimayo */}
                        <path
                          d="M 640,60 Q 610,180 540,260 T 480,340"
                          fill="none"
                          stroke="#7E9E94"
                          strokeWidth="4"
                          strokeDasharray="6,4"
                          opacity="0.7"
                        />
                        <text x="740" y="325" fontSize="10" fill="#3D5A50" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">
                          ~ Río Anta (Curso fluvial permanente) ~
                        </text>
                      </g>
                    )}

                    {/* Road Network */}
                    {showRoads && (
                      <g id="izcuchaca-roads">
                        {/* Carretera Principal Cusco - Abancay */}
                        <path
                          d="M 5,260 C 200,270 380,260 550,285 C 720,310 880,290 995,300"
                          fill="none"
                          stroke="#A85437"
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <path
                          d="M 5,260 C 200,270 380,260 550,285 C 720,310 880,290 995,300"
                          fill="none"
                          stroke="#FAF7F2"
                          strokeWidth="1.5"
                          strokeDasharray="8,6"
                          opacity="0.9"
                        />

                        {/* Desvío a Chinchaypujio */}
                        <path
                          d="M 450,278 Q 460,400 480,590"
                          fill="none"
                          stroke="#5A4E3D"
                          strokeWidth="4"
                          opacity="0.7"
                        />

                        {/* Desvío a Huarocondo */}
                        <path
                          d="M 320,265 Q 280,180 240,30"
                          fill="none"
                          stroke="#5A4E3D"
                          strokeWidth="3.5"
                          opacity="0.7"
                        />

                        <text x="820" y="275" fontSize="10" fill="#A85437" fontWeight="bold" fontFamily="sans-serif">
                          Carretera Cusco - Abancay ➜
                        </text>
                        <text x="35" y="248" fontSize="10" fill="#A85437" fontWeight="bold" fontFamily="sans-serif">
                          ⬅ Hacia Abancay / Lima
                        </text>
                      </g>
                    )}

                    {/* Points of Interest */}
                    {showPointsOfInterest && (
                      <g id="izcuchaca-poi">
                        {/* Plaza de Armas de Izcuchaca */}
                        <g transform="translate(480, 260)">
                          <circle r="7" fill="#C2623F" stroke="#FAF7F2" strokeWidth="2" />
                          <circle r="14" fill="none" stroke="#C2623F" strokeWidth="1" strokeDasharray="3,3" />
                          <text x="18" y="4" fontSize="11" fontWeight="bold" fill="#14110F" fontFamily="serif">
                            Plaza Principal de Izcuchaca
                          </text>
                        </g>

                        {/* Estación Cachimayo */}
                        <g transform="translate(680, 240)">
                          <circle r="5" fill="#2F3A2B" stroke="#FAF7F2" strokeWidth="2" />
                          <text x="12" y="3" fontSize="10" fill="#2F3A2B" fontFamily="sans-serif">
                            Sector Cachimayo
                          </text>
                        </g>

                        {/* Huarocondo */}
                        <g transform="translate(260, 90)">
                          <circle r="5" fill="#2F3A2B" stroke="#FAF7F2" strokeWidth="2" />
                          <text x="12" y="3" fontSize="10" fill="#2F3A2B" fontFamily="sans-serif">
                            Hacia Huarocondo
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                )}

                {/* ---------------------------------------------------- */}
                {/* TERRITORY 2: HUAYOPATA / HUYRO Cartography */}
                {/* ---------------------------------------------------- */}
                {activeTerritory === 'huayopata' && (
                  <g id="huayopata-layers">
                    
                    {/* Steep Valley slopes of Ceja de Selva */}
                    {showContours && (
                      <g stroke="#567258" strokeWidth="1.2" fill="none" opacity="0.4">
                        {/* Canyon wall descent from Abra Málaga */}
                        <path d="M 990,20 Q 750,90 500,240 T 20,440" />
                        <path d="M 990,70 Q 780,140 540,280 T 40,490" />
                        <path d="M 990,130 Q 810,190 580,330 T 60,540" />
                        <path d="M 900,590 Q 650,490 400,320 T 10,180" />
                        <path d="M 950,590 Q 700,520 440,360 T 30,220" />
                        
                        <text x="880" y="40" fontSize="10" fill="#2F3A2B" fontWeight="bold">
                          ▲ Descenso Abra Málaga (4.316m)
                        </text>
                        <text x="40" y="570" fontSize="10" fill="#2F3A2B" fontWeight="bold">
                          ➜ Hacia Quillabamba (1.050m)
                        </text>
                      </g>
                    )}

                    {/* Exuberant Tea & Coffee Estates (Green Zones) */}
                    <g opacity="0.3">
                      <polygon points="400,200 650,140 700,320 460,370" fill="#2E6B3A" />
                      <polygon points="220,320 380,260 410,440 250,480" fill="#3D7D4A" />
                      <polygon points="620,100 850,70 880,220 670,250" fill="#4B8C58" />
                    </g>

                    {/* Rio Lucumayo River */}
                    {showRivers && (
                      <g id="huayopata-hydro">
                        <path
                          d="M 990,120 Q 720,240 510,320 T 20,530"
                          fill="none"
                          stroke="url(#riverGradient)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        {/* Waterfall tributary */}
                        <path
                          d="M 680,40 Q 640,160 550,260 T 510,320"
                          fill="none"
                          stroke="#7E9E94"
                          strokeWidth="5"
                          opacity="0.8"
                        />
                        <text x="360" y="420" fontSize="10" fill="#2F5C50" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">
                          ~ Río Lucumayo (Torrente de agua de glaciar) ~
                        </text>
                      </g>
                    )}

                    {/* Road Network (Carretera Cusco - Quillabamba) */}
                    {showRoads && (
                      <g id="huayopata-roads">
                        <path
                          d="M 990,80 Q 760,190 530,290 T 10,480"
                          fill="none"
                          stroke="#A85437"
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <path
                          d="M 990,80 Q 760,190 530,290 T 10,480"
                          fill="none"
                          stroke="#FAF7F2"
                          strokeWidth="1.5"
                          strokeDasharray="8,6"
                          opacity="0.9"
                        />

                        {/* Camino a Sicre */}
                        <path
                          d="M 420,340 Q 300,420 180,560"
                          fill="none"
                          stroke="#5A4E3D"
                          strokeWidth="3.5"
                          opacity="0.75"
                        />

                        <text x="760" y="165" fontSize="10" fill="#A85437" fontWeight="bold" fontFamily="sans-serif">
                          Ruta Nacional Cusco - Quillabamba ➜
                        </text>
                      </g>
                    )}

                    {/* Points of Interest */}
                    {showPointsOfInterest && (
                      <g id="huayopata-poi">
                        {/* Capital Huyro */}
                        <g transform="translate(520, 275)">
                          <circle r="7" fill="#C2623F" stroke="#FAF7F2" strokeWidth="2" />
                          <circle r="14" fill="none" stroke="#C2623F" strokeWidth="1" strokeDasharray="3,3" />
                          <text x="18" y="4" fontSize="11" fontWeight="bold" fill="#14110F" fontFamily="serif">
                            Huyro Centro (Capital Distrital)
                          </text>
                        </g>

                        {/* Fábrica de Té Huyro */}
                        <g transform="translate(590, 230)">
                          <circle r="5" fill="#2F3A2B" stroke="#FAF7F2" strokeWidth="2" />
                          <text x="12" y="3" fontSize="10" fill="#2F3A2B" fontFamily="sans-serif">
                            Histórica Planta de Té Huyro
                          </text>
                        </g>

                        {/* Amaybamba */}
                        <g transform="translate(360, 360)">
                          <circle r="5" fill="#2F3A2B" stroke="#FAF7F2" strokeWidth="2" />
                          <text x="12" y="3" fontSize="10" fill="#2F3A2B" fontFamily="sans-serif">
                            Sector Amaybamba
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                )}

                {/* ---------------------------------------------------- */}
                {/* LOTS LAYER: Polygons and Interactive Clickable Pins  */}
                {/* ---------------------------------------------------- */}
                <g id="projected-lots-layer">
                  {currentLots.map((lot) => {
                    const isSelected = selectedLot?.id === lot.id;
                    return (
                      <g
                        key={lot.id}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLot(lot);
                          setTempPin(null);
                        }}
                      >
                        {/* Lot Boundary Polygon */}
                        {lot.polygonPoints && (
                          <polygon
                            points={lot.polygonPoints}
                            fill={isSelected ? '#C2623F' : '#2F3A2B'}
                            fillOpacity={isSelected ? '0.45' : '0.22'}
                            stroke={isSelected ? '#C2623F' : '#2F3A2B'}
                            strokeWidth={isSelected ? '2.5' : '1.5'}
                            strokeDasharray={lot.status === 'reserva' ? '4,4' : 'none'}
                            className="transition-all duration-300 group-hover:fill-opacity-50"
                          />
                        )}

                        {/* Lot Center Pin */}
                        <g transform={`translate(${lot.svgX}, ${lot.svgY})`} filter="url(#shadowFilter)">
                          {/* Animated radar wave if selected */}
                          {isSelected && (
                            <circle r="22" fill="#C2623F" fillOpacity="0.2" className="animate-ping" />
                          )}

                          {/* Outer Badge */}
                          <rect
                            x="-28"
                            y="-14"
                            width="56"
                            height="24"
                            rx="12"
                            fill={isSelected ? '#C2623F' : '#FAF7F2'}
                            stroke={isSelected ? '#FAF7F2' : '#2F3A2B'}
                            strokeWidth="1.8"
                            className="transition-transform group-hover:scale-110"
                          />

                          {/* Pin Code Text */}
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                            fill={isSelected ? '#FAF7F2' : '#14110F'}
                          >
                            {lot.code}
                          </text>

                          {/* Mini Status Dot */}
                          <circle
                            cx="18"
                            cy="-6"
                            r="4"
                            fill={
                              lot.status === 'disponible'
                                ? '#2E7D32'
                                : lot.status === 'preventa'
                                ? '#C2623F'
                                : '#6B7280'
                            }
                            stroke="#FAF7F2"
                            strokeWidth="1"
                          />
                        </g>
                      </g>
                    );
                  })}
                </g>

                {/* ---------------------------------------------------- */}
                {/* USER PINNED FUTURE LOTS LAYER                        */}
                {/* ---------------------------------------------------- */}
                <g id="user-pinned-lots">
                  {currentUserLots.map((uLot) => (
                    <g
                      key={uLot.id}
                      transform={`translate(${uLot.svgX}, ${uLot.svgY})`}
                      className="cursor-pointer"
                      filter="url(#shadowFilter)"
                    >
                      <circle r="18" fill="#C2623F" fillOpacity="0.3" className="animate-pulse" />
                      <rect
                        x="-36"
                        y="-14"
                        width="72"
                        height="24"
                        rx="12"
                        fill="#14110F"
                        stroke="#C2623F"
                        strokeWidth="2"
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#FAF7F2"
                      >
                        {uLot.code}
                      </text>
                      <circle cx="26" cy="-6" r="4" fill="#C2623F" stroke="#FAF7F2" strokeWidth="1" />
                    </g>
                  ))}
                </g>

                {/* ---------------------------------------------------- */}
                {/* TEMPORARY PLOTTING PIN (When user clicks)           */}
                {/* ---------------------------------------------------- */}
                {tempPin && (
                  <g transform={`translate(${tempPin.x}, ${tempPin.y})`} filter="url(#shadowFilter)">
                    <circle r="26" fill="#C2623F" fillOpacity="0.4" className="animate-ping" />
                    <rect
                      x="-42"
                      y="-18"
                      width="84"
                      height="28"
                      rx="14"
                      fill="#C2623F"
                      stroke="#FAF7F2"
                      strokeWidth="2.5"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#FAF7F2"
                    >
                      NUEVO LOTE
                    </text>
                  </g>
                )}
              </svg>

              {/* Bottom Quick Legend inside Map */}
              <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F2]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#2F3A2B]/10 text-[11px] font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[#14110F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2623F]" />
                    Preventa
                  </span>
                  <span className="flex items-center gap-1.5 text-[#14110F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                    Disponible
                  </span>
                  <span className="flex items-center gap-1.5 text-[#14110F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]" />
                    Reserva Futura
                  </span>
                </div>
                <div className="text-[#14110F]/60 hidden sm:block">
                  Coordinación técnica: Mariano Otazu (+51 950 155 945)
                </div>
              </div>
            </div>

            {/* Quick Territory Description Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#2F3A2B]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-[#2F3A2B]">
                <Info className="w-4 h-4 text-[#C2623F] shrink-0" />
                <span>
                  {activeTerritory === 'izcuchaca'
                    ? 'Izcuchaca es el nodo campestre con mayor plusvalía a 35 min de Cusco. Vía asfaltada y vistas directas a nevados.'
                    : 'Huayopata / Huyro es el corazón cafetalero de La Convención. Fincas de café Geisha a 1.500 msnm con microclima subtropical abrigado.'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Lot Detail or User Plotting Form (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Case A: User is configuring a freshly clicked temporary pin */}
            {tempPin && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#C2623F] shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#2F3A2B]/10 mb-4">
                  <div className="flex items-center gap-2 text-[#C2623F] font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Lote Señalado por Usted</span>
                  </div>
                  <button
                    onClick={() => setTempPin(null)}
                    className="text-[#14110F]/40 hover:text-[#14110F] text-xs font-mono cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#14110F]/60 font-mono mb-1">
                      Nombre o Referencia del Lote
                    </label>
                    <input
                      type="text"
                      value={tempLotData.name}
                      onChange={(e) => setTempLotData({ ...tempLotData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#2F3A2B]/20 text-sm font-serif text-[#14110F] focus:outline-none focus:border-[#C2623F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#14110F]/60 font-mono mb-1">
                        Área Proyectada (m²)
                      </label>
                      <input
                        type="number"
                        value={tempLotData.areaSqm}
                        onChange={(e) => setTempLotData({ ...tempLotData, areaSqm: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#2F3A2B]/20 text-sm font-mono text-[#14110F] focus:outline-none focus:border-[#C2623F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#14110F]/60 font-mono mb-1">
                        Uso Sugerido
                      </label>
                      <select
                        value={tempLotData.usage}
                        onChange={(e) => setTempLotData({ ...tempLotData, usage: e.target.value })}
                        className="w-full px-2 py-2 bg-white rounded-xl border border-[#2F3A2B]/20 text-xs font-serif text-[#14110F] focus:outline-none focus:border-[#C2623F]"
                      >
                        <option value="Residencial Campestre">Residencial Campestre</option>
                        <option value="Finca Cafetalera">Finca Cafetalera</option>
                        <option value="Eco-Lodge / Glamping">Eco-Lodge / Glamping</option>
                        <option value="Retiro de Montaña">Retiro de Montaña</option>
                      </select>
                    </div>
                  </div>

                  {/* GPS Readout */}
                  <div className="p-3 bg-[#EFE9DF] rounded-xl text-xs font-mono text-[#2F3A2B] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Latitud:</span>
                      <span className="font-semibold">{tempPin.lat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Longitud:</span>
                      <span className="font-semibold">{tempPin.lng}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Territorio:</span>
                      <span className="font-semibold capitalize">{activeTerritory}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#14110F]/60 font-mono mb-1">
                      Observaciones / Deseo del comprador
                    </label>
                    <textarea
                      rows={2}
                      value={tempLotData.notes}
                      onChange={(e) => setTempLotData({ ...tempLotData, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#2F3A2B]/20 text-xs text-[#14110F] focus:outline-none focus:border-[#C2623F]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={getWhatsAppCustomLotLink({
                        ...tempPin,
                        name: tempLotData.name,
                        areaSqm: tempLotData.areaSqm,
                        usage: tempLotData.usage
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-[#2E7D32] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold shadow-md hover:bg-[#256828] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Consultar este Lote por WhatsApp</span>
                    </a>

                    <button
                      onClick={handleSavePinnedLot}
                      className="w-full py-2.5 px-4 bg-[#2F3A2B] text-[#FAF7F2] rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-[#14110F] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C2623F]" />
                      <span>Fijar en el Mapa para Seguimiento</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Case B: Standard Selected Lot Detail Card */}
            {selectedLot && !tempPin && (
              <motion.div
                key={selectedLot.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#2F3A2B]/15 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#2F3A2B]/10">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-[#C2623F] px-2 py-0.5 rounded bg-[#C2623F]/10">
                          {selectedLot.code}
                        </span>
                        <span className="capitalize text-[#14110F]/60">
                          {selectedLot.status === 'preventa' ? 'Preventa Exclusiva' : selectedLot.status}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif text-[#14110F] mt-1 leading-tight">
                        {selectedLot.name}
                      </h3>
                      <p className="text-xs text-[#2F3A2B] font-mono mt-0.5">
                        {selectedLot.sector}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-serif font-bold text-[#14110F]">
                        {selectedLot.priceEstimate || 'Consultar'}
                      </div>
                      <div className="text-[11px] font-mono text-[#14110F]/60">
                        {selectedLot.areaSqm.toLocaleString()} m²
                      </div>
                    </div>
                  </div>

                  {/* Lot Narrative */}
                  <p className="text-xs text-[#14110F]/80 font-light leading-relaxed my-4">
                    {selectedLot.description}
                  </p>

                  {/* Technical Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#EFE9DF] rounded-2xl text-xs font-mono mb-4">
                    <div>
                      <span className="text-[#14110F]/50 block text-[10px] uppercase">Topografía:</span>
                      <span className="text-[#14110F] font-medium leading-tight block mt-0.5">{selectedLot.topography}</span>
                    </div>
                    <div>
                      <span className="text-[#14110F]/50 block text-[10px] uppercase">Acceso Hídrico:</span>
                      <span className="text-[#14110F] font-medium leading-tight block mt-0.5">{selectedLot.waterAccess}</span>
                    </div>
                    <div>
                      <span className="text-[#14110F]/50 block text-[10px] uppercase">Acceso Vial:</span>
                      <span className="text-[#14110F] font-medium leading-tight block mt-0.5">{selectedLot.accessRoad}</span>
                    </div>
                    <div>
                      <span className="text-[#14110F]/50 block text-[10px] uppercase">Altitud:</span>
                      <span className="text-[#14110F] font-medium leading-tight block mt-0.5">{selectedLot.elevationMsl} m.s.n.m.</span>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[11px] uppercase tracking-wider text-[#14110F]/60 font-mono font-medium block">
                      Atributos destacados:
                    </span>
                    {selectedLot.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#2F3A2B]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C2623F] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action with Agent Mariano Otazu */}
                <div className="pt-4 border-t border-[#2F3A2B]/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#14110F]/70 mb-1">
                    <span>Curador a cargo:</span>
                    <span className="font-semibold text-[#14110F]">Mariano Otazu Marín</span>
                  </div>
                  <a
                    href={getWhatsAppLotLink(selectedLot)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-[#2E7D32] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:bg-[#256828] transition-all flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Solicitar Información de este Lote (+51 950 155 945)</span>
                  </a>
                  <p className="text-[10px] text-center text-[#14110F]/50 font-mono">
                    Mensaje predeterminado con código {selectedLot.code} y sector
                  </p>
                </div>
              </motion.div>
            )}

            {/* User Custom Saved Pinned Lots List (if any) */}
            {currentUserLots.length > 0 && (
              <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#2F3A2B]/15 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#2F3A2B]/10 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#2F3A2B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C2623F]" />
                    <span>Lotes que usted ha señalado ({currentUserLots.length})</span>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {currentUserLots.map((pLot) => (
                    <div
                      key={pLot.id}
                      className="p-3 bg-[#EFE9DF] rounded-xl flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="font-bold text-[#14110F]">{pLot.code} · {pLot.name}</div>
                        <div className="text-[11px] text-[#14110F]/60">
                          {pLot.areaSqm} m² · {pLot.usage}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppCustomLotLink(pLot)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#2E7D32] text-white rounded-lg hover:bg-[#256828]"
                          title="Enviar a WhatsApp de Mariano Otazu"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteUserLot(pLot.id)}
                          className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Eliminar marcador"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
