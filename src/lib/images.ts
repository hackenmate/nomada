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

export default IMAGES;
