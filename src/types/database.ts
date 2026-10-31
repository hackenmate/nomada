export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  territory: string;
  philosophy: string;
  manifesto_snippet: string;
  avatar_url: string;
  experience_years: number;
  active_properties_count: number;
  accent_color: string;
  quote: string;
  architectural_focus: string[];
  phone?: string;
  whatsapp?: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  tagline: string;
  architectural_style: string;
  location: string;
  region: string;
  price_formatted: string;
  price_value: number;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  materials: string[];
  cover_image: string;
  gallery: string[];
  description: string;
  architect_name?: string;
  orientation?: string;
  features: string[];
  is_featured: boolean;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  caption: string;
  aspect_ratio: string;
  is_cover: boolean;
}

export interface ViewingInquiry {
  id: string;
  property_id?: string;
  agent_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  preferred_date: string;
  notes: string;
  created_at: string;
}
