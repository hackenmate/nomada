import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  PlusCircle,
  Trash2,
  Mountain,
  ExternalLink,
  Info,
  Navigation,
  Globe2,
  Sun,
  Eye,
  Sliders,
  Crosshair
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
  // Real-world polygon coordinates [lat, lng][]
  polygonCoords: [number, number][];
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
  notes: string;
  createdAt: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: 'plaza' | 'cultura' | 'rio' | 'mirador';
  territory: 'izcuchaca' | 'huayopata';
  lat: number;
  lng: number;
  elevationMsl: number;
  description: string;
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
    polygonCoords: [
      [-13.4975, -72.1445],
      [-13.4972, -72.1418],
      [-13.4998, -72.1415],
      [-13.4999, -72.1442]
    ],
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
    polygonCoords: [
      [-13.4870, -72.1395],
      [-13.4865, -72.1365],
      [-13.4892, -72.1368],
      [-13.4895, -72.1398]
    ],
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
    polygonCoords: [
      [-13.5048, -72.1538],
      [-13.5045, -72.1502],
      [-13.5075, -72.1505],
      [-13.5078, -72.1540]
    ],
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
    polygonCoords: [
      [-13.5130, -72.1425],
      [-13.5128, -72.1395],
      [-13.5152, -72.1396],
      [-13.5154, -72.1426]
    ],
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
    polygonCoords: [
      [-13.4905, -72.1630],
      [-13.4900, -72.1590],
      [-13.4935, -72.1592],
      [-13.4940, -72.1632]
    ],
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
    polygonCoords: [
      [-13.0058, -72.5560],
      [-13.0052, -72.5525],
      [-13.0088, -72.5522],
      [-13.0092, -72.5558]
    ],
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
    polygonCoords: [
      [-13.0168, -72.5670],
      [-13.0162, -72.5632],
      [-13.0195, -72.5630],
      [-13.0200, -72.5668]
    ],
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
    accessRoad: 'Carretera afirmada en excelente estado',
    elevationMsl: 1680,
    lat: -12.9960,
    lng: -72.5410,
    polygonCoords: [
      [-12.9945, -72.5435],
      [-12.9938, -72.5385],
      [-12.9978, -72.5382],
      [-12.9985, -72.5432]
    ],
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
    polygonCoords: [
      [-12.9825, -72.5315],
      [-12.9818, -72.5265],
      [-12.9858, -72.5262],
      [-12.9865, -72.5312]
    ],
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
    polygonCoords: [
      [-13.0275, -72.5805],
      [-13.0268, -72.5755],
      [-13.0308, -72.5752],
      [-13.0315, -72.5802]
    ],
    description: 'Extensión virgen en la cuenca de Sicre reservada para el desarrollo de una comunidad ecológica autosostenible basada en caficultura de especialidad y permacultura.',
    features: ['Bosque nativo primario protegido', '12,500 m² de biodiversidad', 'Suelo virgen de alta fertilidad']
  }
];

const POINTS_OF_INTEREST: PointOfInterest[] = [
  // Izcuchaca
  {
    id: 'poi_izc_1',
    name: 'Plaza de Armas de Izcuchaca',
    category: 'plaza',
    territory: 'izcuchaca',
    lat: -13.4975,
    lng: -72.1444,
    elevationMsl: 3340,
    description: 'Centro neurálgico del Valle de Anta con servicios, mercado dominical y conexión vial a Cusco.'
  },
  {
    id: 'poi_izc_2',
    name: 'Mirador Panorámico Cachimayo',
    category: 'mirador',
    territory: 'izcuchaca',
    lat: -13.4830,
    lng: -72.1320,
    elevationMsl: 3410,
    description: 'Punto de observación del nevado Salcantay y de toda la planicie agrícola de Anta.'
  },
  {
    id: 'poi_izc_3',
    name: 'Río Anta (Tramo Fluvial Principal)',
    category: 'rio',
    territory: 'izcuchaca',
    lat: -13.5040,
    lng: -72.1480,
    elevationMsl: 3325,
    description: 'Corriente hídrica natural que irriga los predios y campos florales del valle.'
  },
  // Huayopata / Huyro
  {
    id: 'poi_hyr_1',
    name: 'Plaza Principal de Huyro',
    category: 'plaza',
    territory: 'huayopata',
    lat: -13.0065,
    lng: -72.5538,
    elevationMsl: 1524,
    description: 'Plaza histórica de la capital del té en el Perú, con arquitectura tradicional andino-amazónica.'
  },
  {
    id: 'poi_hyr_2',
    name: 'Histórica Planta de Té Huyro',
    category: 'cultura',
    territory: 'huayopata',
    lat: -13.0048,
    lng: -72.5512,
    elevationMsl: 1535,
    description: 'Pabellón patrimonial donde nació la industria del té peruano en la cuenca de La Convención.'
  },
  {
    id: 'poi_hyr_3',
    name: 'Pozas y Cataratas del Lucumayo',
    category: 'rio',
    territory: 'huayopata',
    lat: -13.0160,
    lng: -72.5630,
    elevationMsl: 1470,
    description: 'Aguas cristalinas procedentes de los glaciares de Vilcabamba, ideales para baños revitalizantes.'
  }
];

type BaseMapStyle = 'satellite' | 'topo' | 'editorial';

interface TerritoryMapsSectionProps {
  onCursorChange?: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const TerritoryMapsSection: React.FC<TerritoryMapsSectionProps> = () => {
  const [activeTerritory, setActiveTerritory] = useState<'izcuchaca' | 'huayopata'>('izcuchaca');
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(INITIAL_LOTS[0]);
  const [userLots, setUserLots] = useState<UserPinnedLot[]>([]);
  const [isPlottingMode, setIsPlottingMode] = useState<boolean>(false);
  const [tempPin, setTempPin] = useState<{ lat: number; lng: number; elevationEst: number } | null>(null);
  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>('satellite');
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showPoiLayer, setShowPoiLayer] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [tempLotData, setTempLotData] = useState<{
    name: string;
    areaSqm: number;
    usage: string;
    notes: string;
  }>({
    name: 'Lote Señalado en Prospección',
    areaSqm: 1500,
    usage: 'Residencial Campestre',
    notes: 'Terreno con excelente asoleamiento, vistas panorámicas y factibilidad de servicios.'
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelTileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayersRef = useRef<L.LayerGroup | null>(null);
  const markerLayersRef = useRef<L.LayerGroup | null>(null);
  const poiLayersRef = useRef<L.LayerGroup | null>(null);
  const userPinLayersRef = useRef<L.LayerGroup | null>(null);
  const tempPinMarkerRef = useRef<L.Marker | null>(null);
  const tempPinCircleRef = useRef<L.Circle | null>(null);

  // Territory Centers & Default Zooms
  const territoryCenters = {
    izcuchaca: {
      center: [-13.4985, -72.1432] as [number, number],
      zoom: 15,
      bounds: [
        [-13.525, -72.175],
        [-13.475, -72.115]
      ] as L.LatLngBoundsLiteral
    },
    huayopata: {
      center: [-13.0072, -72.5542] as [number, number],
      zoom: 15,
      bounds: [
        [-13.045, -72.595],
        [-12.970, -72.515]
      ] as L.LatLngBoundsLiteral
    }
  };

  // Map Tile Providers
  const TILE_PROVIDERS: Record<BaseMapStyle, { url: string; attribution: string; maxZoom: number }> = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; High-Resolution Satellite & Aerial Photography (Maxar, Earthstar Geographics)',
      maxZoom: 19
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap (CC-BY-SA) &mdash; Curvas de Nivel & Relieve Andino',
      maxZoom: 17
    },
    editorial: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &mdash; Cartografía Editorial',
      maxZoom: 19
    }
  };

  const HYBRID_LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

  // Filter lots by active territory
  const currentLots = INITIAL_LOTS.filter((l) => l.territory === activeTerritory);
  const currentUserLots = userLots.filter((l) => l.territory === activeTerritory);
  const currentPois = POINTS_OF_INTEREST.filter((p) => p.territory === activeTerritory);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: territoryCenters[activeTerritory].center,
        zoom: territoryCenters[activeTerritory].zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add Base Tile Layer
      const baseCfg = TILE_PROVIDERS[baseMapStyle];
      const baseLayer = L.tileLayer(baseCfg.url, {
        attribution: baseCfg.attribution,
        maxZoom: baseCfg.maxZoom
      }).addTo(map);
      baseTileLayerRef.current = baseLayer;

      // Add Labels Tile Layer (active by default for satellite)
      if (showLabels && baseMapStyle === 'satellite') {
        const labelsLayer = L.tileLayer(HYBRID_LABELS_URL, {
          maxZoom: 19,
          opacity: 0.9
        }).addTo(map);
        labelTileLayerRef.current = labelsLayer;
      }

      // Create Layer Groups
      polygonLayersRef.current = L.layerGroup().addTo(map);
      markerLayersRef.current = L.layerGroup().addTo(map);
      poiLayersRef.current = L.layerGroup().addTo(map);
      userPinLayersRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Base Map Tile Switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const baseCfg = TILE_PROVIDERS[baseMapStyle];
    const newBaseLayer = L.tileLayer(baseCfg.url, {
      attribution: baseCfg.attribution,
      maxZoom: baseCfg.maxZoom
    }).addTo(map);
    baseTileLayerRef.current = newBaseLayer;

    // Handle hybrid labels overlay
    if (labelTileLayerRef.current) {
      map.removeLayer(labelTileLayerRef.current);
      labelTileLayerRef.current = null;
    }

    if (showLabels && baseMapStyle === 'satellite') {
      const labelsLayer = L.tileLayer(HYBRID_LABELS_URL, {
        maxZoom: 19,
        opacity: 0.95
      }).addTo(map);
      labelTileLayerRef.current = labelsLayer;
    }
  }, [baseMapStyle, showLabels]);

  // Handle Territory Change with FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = territoryCenters[activeTerritory];
    map.flyTo(target.center, target.zoom, {
      duration: 1.8,
      easeLinearity: 0.25
    });

    // Reset temporary pin if territory changed
    setTempPin(null);
    if (tempPinMarkerRef.current && map) {
      map.removeLayer(tempPinMarkerRef.current);
      tempPinMarkerRef.current = null;
    }
    if (tempPinCircleRef.current && map) {
      map.removeLayer(tempPinCircleRef.current);
      tempPinCircleRef.current = null;
    }
  }, [activeTerritory]);

  // Handle Map Clicks for Plotting Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!isPlottingMode) return;

      const { lat, lng } = e.latlng;
      const roundedLat = Number(lat.toFixed(5));
      const roundedLng = Number(lng.toFixed(5));

      // Calculate approximate altitude based on territory
      const elevationEst =
        activeTerritory === 'izcuchaca'
          ? Math.round(3340 + Math.abs(roundedLat - -13.4985) * 1200)
          : Math.round(1524 + Math.abs(roundedLat - -13.0072) * 2400);

      setTempPin({
        lat: roundedLat,
        lng: roundedLng,
        elevationEst
      });

      // Update or create temp pin marker
      if (tempPinMarkerRef.current) {
        tempPinMarkerRef.current.setLatLng([roundedLat, roundedLng]);
      } else {
        const tempIcon = L.divIcon({
          className: 'custom-temp-pin-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
              <div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background-color: rgba(194, 98, 63, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; z-index: 10; padding: 6px 10px; background-color: #C2623F; color: #FAF7F2; border: 2px solid #FAF7F2; border-radius: 9999px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); font-family: monospace; font-size: 10px; font-weight: bold; white-space: nowrap;">
                NUEVO LOTE
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        tempPinMarkerRef.current = L.marker([roundedLat, roundedLng], { icon: tempIcon }).addTo(map);
      }

      // Add radius circle around clicked spot (estimated ~1,500 m²)
      const approxRadiusMeters = Math.sqrt(1500 / Math.PI);
      if (tempPinCircleRef.current) {
        tempPinCircleRef.current.setLatLng([roundedLat, roundedLng]);
        tempPinCircleRef.current.setRadius(approxRadiusMeters);
      } else {
        tempPinCircleRef.current = L.circle([roundedLat, roundedLng], {
          radius: approxRadiusMeters,
          color: '#C2623F',
          fillColor: '#C2623F',
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map);
      }
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [isPlottingMode, activeTerritory]);

  // Clean up temp pin if user cancels or saves
  useEffect(() => {
    if (!tempPin && mapInstanceRef.current) {
      if (tempPinMarkerRef.current) {
        mapInstanceRef.current.removeLayer(tempPinMarkerRef.current);
        tempPinMarkerRef.current = null;
      }
      if (tempPinCircleRef.current) {
        mapInstanceRef.current.removeLayer(tempPinCircleRef.current);
        tempPinCircleRef.current = null;
      }
    }
  }, [tempPin]);

  // Render Lots Polygons & Luxury Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !polygonLayersRef.current || !markerLayersRef.current) return;

    polygonLayersRef.current.clearLayers();
    markerLayersRef.current.clearLayers();

    currentLots.forEach((lot) => {
      const isSelected = selectedLot?.id === lot.id;

      // Lot Polygon
      if (showPolygons && lot.polygonCoords && lot.polygonCoords.length > 0) {
        const polygonColor =
          lot.status === 'preventa'
            ? '#C2623F'
            : lot.status === 'disponible'
            ? '#2E7D32'
            : '#8C7A60';

        const polygon = L.polygon(lot.polygonCoords, {
          color: isSelected ? '#FAF7F2' : polygonColor,
          weight: isSelected ? 3 : 2,
          opacity: 0.95,
          fillColor: polygonColor,
          fillOpacity: isSelected ? 0.5 : 0.28,
          dashArray: lot.status === 'reserva' ? '6, 6' : undefined
        });

        polygon.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedLot(lot);
          setTempPin(null);
          map.flyTo([lot.lat, lot.lng], 16, { duration: 1 });
        });

        polygonLayersRef.current?.addLayer(polygon);
      }

      // Lot Center Luxury Marker (Custom DivIcon)
      const isSelectedLot = selectedLot?.id === lot.id;
      const markerBg = isSelectedLot ? '#C2623F' : '#FAF7F2';
      const markerText = isSelectedLot ? '#FAF7F2' : '#14110F';
      const borderStroke = isSelectedLot ? '#FAF7F2' : '#2F3A2B';
      const statusDotColor =
        lot.status === 'disponible'
          ? '#2E7D32'
          : lot.status === 'preventa'
          ? '#C2623F'
          : '#6B7280';

      const customIcon = L.divIcon({
        className: 'nomada-lot-marker-div',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            ${
              isSelectedLot
                ? `<div style="position: absolute; top: -6px; left: -6px; width: calc(100% + 12px); height: calc(100% + 12px); border-radius: 9999px; background-color: rgba(194,98,63,0.35); animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>`
                : ''
            }
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 4px 10px;
              background-color: ${markerBg};
              color: ${markerText};
              border: 1.5px solid ${borderStroke};
              border-radius: 9999px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              transition: all 0.2s ease;
              transform: ${isSelectedLot ? 'scale(1.1)' : 'scale(1)'};
            ">
              <span style="width: 7px; height: 7px; border-radius: 9999px; background-color: ${statusDotColor}; display: inline-block;"></span>
              <span>${lot.code}</span>
              <span style="opacity: 0.6; font-size: 9px; font-weight: normal;">${lot.elevationMsl}m</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${isSelectedLot ? '#C2623F' : '#FAF7F2'};
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
            "></div>
          </div>
        `,
        iconSize: [80, 36],
        iconAnchor: [40, 36]
      });

      const marker = L.marker([lot.lat, lot.lng], { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedLot(lot);
        setTempPin(null);
        map.flyTo([lot.lat, lot.lng], 16, { duration: 1.1 });
      });

      markerLayersRef.current?.addLayer(marker);
    });
  }, [currentLots, selectedLot, showPolygons]);

  // Render Points of Interest (POIs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !poiLayersRef.current) return;

    poiLayersRef.current.clearLayers();
    if (!showPoiLayer) return;

    currentPois.forEach((poi) => {
      const poiIcon = L.divIcon({
        className: 'nomada-poi-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 3px 8px;
            background-color: rgba(47, 58, 43, 0.9);
            backdrop-filter: blur(4px);
            color: #FAF7F2;
            border: 1px solid rgba(250, 247, 242, 0.4);
            border-radius: 6px;
            font-size: 10px;
            font-family: sans-serif;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <span style="color: #C2623F; font-size: 10px;">★</span>
            <span style="font-weight: 500;">${poi.name}</span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; font-size: 12px; color: #14110F;">
          <strong style="color: #2F3A2B; font-size: 13px;">${poi.name}</strong><br/>
          <span style="color: #666; font-size: 11px;">Altitud: ${poi.elevationMsl} msnm</span>
          <p style="margin-top: 6px; line-height: 1.4; color: #333;">${poi.description}</p>
        </div>
      `);

      poiLayersRef.current?.addLayer(marker);
    });
  }, [currentPois, showPoiLayer]);

  // Render User Pinned Lots
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userPinLayersRef.current) return;

    userPinLayersRef.current.clearLayers();

    currentUserLots.forEach((uLot) => {
      const uIcon = L.divIcon({
        className: 'nomada-user-lot-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              background-color: #14110F;
              color: #FAF7F2;
              border: 1.5px solid #C2623F;
              border-radius: 9999px;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            ">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #C2623F;"></span>
              <span>${uLot.code}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #14110F;"></div>
          </div>
        `,
        iconSize: [70, 30],
        iconAnchor: [35, 30]
      });

      const marker = L.marker([uLot.lat, uLot.lng], { icon: uIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; font-size: 12px; color: #14110F;">
          <strong style="color: #C2623F; font-size: 13px;">${uLot.code} · ${uLot.name}</strong><br/>
          <span style="color: #666; font-size: 11px;">${uLot.areaSqm} m² · ${uLot.usage}</span>
          <p style="margin-top: 6px; font-size: 11px; color: #444;">${uLot.notes}</p>
        </div>
      `);

      userPinLayersRef.current?.addLayer(marker);
    });
  }, [currentUserLots]);

  // Handle Save Pinned Lot
  const handleSavePinnedLot = () => {
    if (!tempPin) return;

    const nextId = `user_lot_${Date.now()}`;
    const nextCode = `${activeTerritory === 'izcuchaca' ? 'IZC' : 'HYR'}-PROY-${userLots.length + 1}`;

    const newPinned: UserPinnedLot = {
      id: nextId,
      code: nextCode,
      name: tempLotData.name || 'Lote Personalizado',
      territory: activeTerritory,
      areaSqm: Number(tempLotData.areaSqm) || 1500,
      usage: tempLotData.usage,
      lat: tempPin.lat,
      lng: tempPin.lng,
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

  // WhatsApp Inquiry for a Lot
  const getWhatsAppLotLink = (lot: LotItem) => {
    const text = encodeURIComponent(
      `Hola Mariano Otazu Marín, le escribo desde el visualizador satelital HD de NOMADA GROUP.\n\nEstoy muy interesado en el Lote ${lot.code} ("${lot.name}") ubicado en ${lot.sector} (${lot.territory === 'izcuchaca' ? 'Valle de Izcuchaca, Anta' : 'Huayopata / Huyro, La Convención'}).\n\n• Coordenadas GPS: ${lot.lat}, ${lot.lng}\n• Superficie: ${lot.areaSqm} m²\n• Altitud: ${lot.elevationMsl} msnm\n\nDeseo recibir información detallada sobre precio de preventa, delimitación topográfica y coordinar una visita técnica al terreno.`
    );
    return `https://wa.me/51950155945?text=${text}`;
  };

  // WhatsApp Inquiry for a Custom Pinned Lot
  const getWhatsAppCustomLotLink = (pinned: { lat: number; lng: number; areaSqm: number; usage: string; name: string }) => {
    const territoryLabel = activeTerritory === 'izcuchaca' ? 'Izcuchaca (Valle de Anta, Cusco)' : 'Huayopata / Huyro (La Convención, Cusco)';
    const text = encodeURIComponent(
      `Hola Mariano Otazu Marín, he señalado un nuevo lote proyectado sobre el mapa satelital de ${territoryLabel}:\n\n` +
      `• Nombre de referencia: ${pinned.name}\n` +
      `• Coordenadas GPS exactas: ${pinned.lat}, ${pinned.lng}\n` +
      `• Ver en Google Maps: https://www.google.com/maps?q=${pinned.lat},${pinned.lng}\n` +
      `• Superficie estimada: ${pinned.areaSqm} m²\n` +
      `• Uso proyectado: ${pinned.usage}\n\n` +
      `¿Podríamos evaluar la viabilidad de demarcación y disponibilidad de lotización con su equipo?`
    );
    return `https://wa.me/51950155945?text=${text}`;
  };

  // External Maps Links
  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const getGoogleEarthLink = (lat: number, lng: number) => {
    return `https://earth.google.com/web/search/${lat},${lng}`;
  };

  // Zoom control helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    const target = territoryCenters[activeTerritory];
    mapInstanceRef.current?.flyTo(target.center, target.zoom);
  };

  return (
    <section id="mapas-lotes" className="py-24 px-4 sm:px-6 lg:px-12 bg-[#F7F4EE] border-t border-[#2F3A2B]/15 relative">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[#2F3A2B]/15 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-[#C2623F] mb-2 font-mono">
              <Compass className="w-4 h-4 text-[#C2623F]" />
              <span>Cartografía Satelital HD & Zonificación de Lotes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#14110F] tracking-tight">
              Mapas de Izcuchaca & Huayopata
            </h2>
            <p className="text-sm sm:text-base text-[#14110F]/70 font-light mt-3 max-w-2xl">
              Visualice con calidad fotográfica satelital de alta resolución y curvas de nivel topográficas los dos valles estratégicos de Cusco: la meseta campestre de <strong className="text-[#14110F] font-medium">Izcuchaca (Anta)</strong> a 3.340 msnm y la ceja de selva de <strong className="text-[#14110F] font-medium">Huayopata / Huyro</strong> a 1.524 msnm. Examine polígonos de lote en preventa, verifique cotas de altitud y señale nuevas áreas a futuro con georreferenciación GPS real.
            </p>
          </div>

          {/* Territory Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#2F3A2B]/15 shadow-sm">
            <button
              onClick={() => {
                setActiveTerritory('izcuchaca');
                setSelectedLot(INITIAL_LOTS.find((l) => l.territory === 'izcuchaca') || null);
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
                setSelectedLot(INITIAL_LOTS.find((l) => l.territory === 'huayopata') || null);
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

        {/* Toolbar & Interactive Map Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#FAF7F2] p-4 rounded-2xl border border-[#2F3A2B]/10 shadow-sm">
          
          {/* Base Map Style Selector (Satellite HD / Topo / Editorial) */}
          <div className="flex items-center gap-1.5 bg-[#EFE9DF] p-1 rounded-xl">
            <button
              onClick={() => setBaseMapStyle('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                baseMapStyle === 'satellite'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-sm font-semibold'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
              title="Fotografía satelital de alta resolución (Esri / Maxar)"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#C2623F]" />
              <span>Satélite HD</span>
            </button>

            <button
              onClick={() => setBaseMapStyle('topo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                baseMapStyle === 'topo'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-sm font-semibold'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
              title="Curvas de nivel y relieve andino sombreado"
            >
              <Mountain className="w-3.5 h-3.5 text-[#C2623F]" />
              <span>Topográfico 3D</span>
            </button>

            <button
              onClick={() => setBaseMapStyle('editorial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                baseMapStyle === 'editorial'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-sm font-semibold'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
              title="Cartografía limpia editorial"
            >
              <Layers className="w-3.5 h-3.5 text-[#C2623F]" />
              <span>Plano Limpio</span>
            </button>
          </div>

          {/* Territory Quick Metadata */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C2623F] animate-pulse" />
            <div className="text-xs">
              <span className="font-medium text-[#14110F] font-serif text-sm">
                {activeTerritory === 'izcuchaca' ? 'Sector Pampa de Anta · Cusco' : 'Sector Cañón de Huyro / Lucumayo · La Convención'}
              </span>
              <span className="text-[#14110F]/50 ml-2 font-mono">
                {activeTerritory === 'izcuchaca' ? '13°29\'54"S · 72°08\'35"W' : '13°00\'26"S · 72°33\'15"W'}
              </span>
            </div>
          </div>

          {/* Interactive Plotting Tool Activation & Layer Toggles */}
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
              title="Active para hacer clic en el mapa satelital y señalar un nuevo lote a futuro"
            >
              <Crosshair className="w-4 h-4" />
              <span>{isPlottingMode ? 'Modo Señalador Activo (Haga clic en el terreno)' : 'Señalar Nuevo Lote a Futuro'}</span>
            </button>

            {/* Layer Toggles */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-[#2F3A2B]/15 pl-3">
              <button
                onClick={() => setShowPolygons(!showPolygons)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  showPolygons ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                }`}
                title="Mostrar u ocultar los polígonos de lote"
              >
                Polígonos
              </button>
              <button
                onClick={() => setShowPoiLayer(!showPoiLayer)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  showPoiLayer ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                }`}
                title="Mostrar u ocultar puntos de interés (plazas, ríos, fábricas)"
              >
                Puntos de Interés
              </button>
              {baseMapStyle === 'satellite' && (
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    showLabels ? 'bg-[#2F3A2B]/10 text-[#2F3A2B] font-medium' : 'text-[#14110F]/40'
                  }`}
                  title="Etiquetas de lugares y carreteras sobre satélite"
                >
                  Vías / Nombres
                </button>
              )}
            </div>

            {/* Zoom & Fullscreen Controls */}
            <div className="flex items-center gap-1 border-l border-[#2F3A2B]/15 pl-3">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Acercar mapa"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Alejar mapa"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title="Centrar en el valle actual"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg hover:bg-[#2F3A2B]/10 text-[#14110F]/70 hover:text-[#14110F] cursor-pointer"
                title={isFullscreen ? 'Salir de pantalla completa' : 'Ver mapa en pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Map Container + Sidebar Layout */}
        <div className={`grid grid-cols-1 ${isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#14110F]/90 backdrop-blur-md grid-cols-12' : 'lg:grid-cols-12'} gap-6 items-start transition-all`}>
          
          {/* Main Map Canvas Column (8 cols or 8/9 cols in fullscreen) */}
          <div className={`${isFullscreen ? 'col-span-12 lg:col-span-8 h-[92vh]' : 'lg:col-span-8'} bg-[#1E261B] rounded-3xl border border-[#2F3A2B]/30 overflow-hidden shadow-2xl relative flex flex-col`}>
            
            {/* Top Bar inside Map with Compass, Scale, and Provider Watermark */}
            <div className="absolute top-4 left-4 z-[400] flex items-center gap-3 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#2F3A2B]/15 shadow-md pointer-events-none">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2F3A2B]">
                <Navigation className="w-3.5 h-3.5 text-[#C2623F] -rotate-45" />
                <span>NORTE 0°</span>
              </div>
              <span className="text-[#2F3A2B]/30">|</span>
              <div className="text-[11px] font-mono text-[#14110F]/80">
                {activeTerritory === 'izcuchaca' ? 'Valle de Anta (3.340m)' : 'Huayopata / Huyro (1.524m)'}
              </div>
              <span className="text-[#2F3A2B]/30 hidden sm:inline">|</span>
              <div className="text-[10px] font-mono text-[#C2623F] font-semibold hidden sm:inline">
                {baseMapStyle === 'satellite' ? 'Esri Satellite HD' : baseMapStyle === 'topo' ? 'OpenTopoMap 3D' : 'CartoDB Voyager'}
              </div>
            </div>

            {/* Mode Banner if Plotting Active */}
            {isPlottingMode && (
              <div className="absolute top-4 right-4 z-[400] bg-[#C2623F] text-[#FAF7F2] px-4 py-2 rounded-full text-xs font-mono shadow-xl flex items-center gap-2 border border-white/20 animate-pulse">
                <Crosshair className="w-3.5 h-3.5 animate-spin" />
                <span>Haga clic sobre el terreno para georreferenciar el lote</span>
              </div>
            )}

            {/* Interactive Leaflet Map Viewport */}
            <div
              ref={mapContainerRef}
              className={`w-full ${isFullscreen ? 'flex-1 h-full min-h-[500px]' : 'aspect-[16/10] sm:aspect-[16/9.5] min-h-[460px]'} relative z-0`}
              style={{ background: '#1B2319' }}
            />

            {/* Bottom Quick Legend inside Map */}
            <div className="absolute bottom-3 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#2F3A2B]/10 text-[11px] font-mono shadow-md">
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
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C7A60]" />
                  Reserva Futura
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-[#14110F]/70">
                  <span className="text-[#C2623F]">★</span>
                  Puntos de Interés
                </span>
              </div>

              {/* Direct Open in Google Maps */}
              <div className="flex items-center gap-2">
                {selectedLot && (
                  <a
                    href={getGoogleMapsLink(selectedLot.lat, selectedLot.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#2F3A2B] hover:text-[#C2623F] font-bold flex items-center gap-1 transition-colors"
                    title="Ver este lote en la aplicación oficial de Google Maps"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="text-[#2F3A2B]/30 hidden md:inline">|</span>
                <span className="text-[#14110F]/60 hidden md:inline">
                  Asesoría: Mariano Otazu (+51 950 155 945)
                </span>
              </div>
            </div>

            {/* Quick Territory Description Footer */}
            <div className="p-3.5 bg-[#FAF7F2] border-t border-[#2F3A2B]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#2F3A2B]">
                <Info className="w-4 h-4 text-[#C2623F] shrink-0" />
                <span>
                  {activeTerritory === 'izcuchaca'
                    ? 'Izcuchaca (Valle de Anta): meseta andina soleada a 35 min de Cusco. Acceso directo por vía asfaltada Cusco-Abancay y títulos en SUNARP.'
                    : 'Huayopata / Huyro (La Convención): microclima subtropical abrigado de ceja de selva (22°C constante). Tierras fértiles para café Geisha y retiros ecológicos.'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Lot Detail or User Plotting Form (4 cols) */}
          <div className={`${isFullscreen ? 'col-span-12 lg:col-span-4 max-h-[92vh] overflow-y-auto' : 'lg:col-span-4'} flex flex-col gap-6`}>
            
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

                  {/* GPS Readout with Real Coordinates */}
                  <div className="p-3 bg-[#EFE9DF] rounded-xl text-xs font-mono text-[#2F3A2B] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Latitud GPS:</span>
                      <span className="font-semibold">{tempPin.lat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Longitud GPS:</span>
                      <span className="font-semibold">{tempPin.lng}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#14110F]/50">Altitud estimada:</span>
                      <span className="font-semibold">{tempPin.elevationEst} msnm</span>
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSavePinnedLot}
                        className="flex-1 py-2.5 px-3 bg-[#2F3A2B] text-[#FAF7F2] rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-[#14110F] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C2623F]" />
                        <span>Fijar en el Mapa</span>
                      </button>

                      <a
                        href={getGoogleMapsLink(tempPin.lat, tempPin.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-[#FAF7F2] border border-[#2F3A2B]/20 rounded-xl hover:bg-[#EFE9DF] text-[#14110F]"
                        title="Ver ubicación en Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
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

                  {/* Technical Specifications Grid with Real Altitude & GPS */}
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
                      <span className="text-[#14110F]/50 block text-[10px] uppercase">Altitud & GPS:</span>
                      <span className="text-[#14110F] font-medium leading-tight block mt-0.5">{selectedLot.elevationMsl} msnm · {selectedLot.lat}, {selectedLot.lng}</span>
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

                  {/* External Tools Bar: Google Maps & Earth */}
                  <div className="flex items-center gap-2 p-2.5 bg-[#FAF7F2] border border-[#2F3A2B]/15 rounded-xl mb-4 text-xs font-mono">
                    <span className="text-[#14110F]/60 text-[11px]">Explorar en:</span>
                    <a
                      href={getGoogleMapsLink(selectedLot.lat, selectedLot.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-[#EFE9DF] rounded-lg border border-[#2F3A2B]/20 text-[#14110F] font-medium flex items-center gap-1 transition-colors"
                      title="Abrir en Google Maps satelital con Street View"
                    >
                      <Globe2 className="w-3 h-3 text-[#2E7D32]" />
                      <span>Google Maps</span>
                    </a>
                    <a
                      href={getGoogleEarthLink(selectedLot.lat, selectedLot.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-[#EFE9DF] rounded-lg border border-[#2F3A2B]/20 text-[#14110F] font-medium flex items-center gap-1 transition-colors"
                      title="Vuelo 3D sobre la orografía en Google Earth"
                    >
                      <Mountain className="w-3 h-3 text-[#C2623F]" />
                      <span>Google Earth 3D</span>
                    </a>
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
                    Mensaje predeterminado con código {selectedLot.code}, altitud y coordenadas GPS
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
                          {pLot.areaSqm} m² · {pLot.usage} ({pLot.lat}, {pLot.lng})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppCustomLotLink(pLot)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#2E7D32] text-white rounded-lg hover:bg-[#256828]"
                          title="Enviar a WhatsApp de Mariano Otazu con coordenadas GPS"
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
