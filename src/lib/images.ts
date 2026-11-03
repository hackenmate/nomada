// Centralized asset imports for Vite bundler
// By importing images via ESM, Vite will hash them, copy them into dist/assets/,
// and resolve their public URLs correctly with any VITE_BASE_PATH (such as GitHub Pages /nomada/).

import agentMarianoOtazuPortrait from '../assets/images/agent_mariano_otazu_portrait_1793481670409.jpg';
import agentMateoPortrait from '../assets/images/agent_mateo_portrait_1793475509012.jpg';
import agentElenaPortrait from '../assets/images/agent_elena_portrait_1793475508502.jpg';
import agentClaraPortrait from '../assets/images/agent_clara_portrait_1793475507694.jpg';

import heroLaConvencionCusco from '../assets/images/hero_la_convencion_cusco_1793477326244.jpg';
import heroNomadaArchitecture from '../assets/images/hero_nomada_architecture_1793475507082.jpg';
import landscapeLaConvencionMist from '../assets/images/landscape_la_convencion_mist_1793477329367.jpg';

import propertyVillaQuillabamba from '../assets/images/property_villa_quillabamba_1793477326390.jpg';
import propertySantuarioVilcabamba from '../assets/images/property_santuario_vilcabamba_1793477328117.jpg';
import propertyCasaDuna from '../assets/images/property_casa_duna_1793475508406.jpg';
import propertyPalaceteBotanico from '../assets/images/property_palacete_botanico_1793475581714.jpg';
import propertyRefugioAlerce from '../assets/images/property_refugio_alerce_1793475581358.jpg';

export const IMAGES = {
  // Agents
  agentMarianoOtazu: agentMarianoOtazuPortrait,
  agentMateoSilva: agentMateoPortrait,
  agentElenaRuiz: agentElenaPortrait,
  agentClaraMoreau: agentClaraPortrait,

  // Heroes & Landscapes
  heroLaConvencion: heroLaConvencionCusco,
  heroArchitecture: heroNomadaArchitecture,
  landscapeMist: landscapeLaConvencionMist,

  // Properties
  villaQuillabamba: propertyVillaQuillabamba,
  santuarioVilcabamba: propertySantuarioVilcabamba,
  casaDuna: propertyCasaDuna,
  palaceteBotanico: propertyPalaceteBotanico,
  refugioAlerce: propertyRefugioAlerce,
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) => {
  const target = e.currentTarget;
  if (fallbackUrl && target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  } else if (!target.src.includes('data:image/svg+xml')) {
    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%232F3A2B"/><text x="400" y="280" font-family="serif" font-size="28" fill="%23FAF7F2" text-anchor="middle">NOMADA GROUP</text><text x="400" y="320" font-family="sans-serif" font-size="13" fill="%23C2623F" text-anchor="middle" letter-spacing="4">LA CONVENCIÓN · CUSCO, PERÚ</text><text x="400" y="350" font-family="monospace" font-size="11" fill="%23FAF7F2" fill-opacity="0.6" text-anchor="middle">MARIANO OTAZU · +51 950 155 945</text></svg>`;
  }
};

export default IMAGES;
