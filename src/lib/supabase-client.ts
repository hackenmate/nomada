import { Agent, Property, PropertyImage, ViewingInquiry } from '../types/database';
import { INITIAL_AGENTS, INITIAL_PROPERTIES, INITIAL_PROPERTY_IMAGES } from './data';

const STORAGE_KEYS = {
  AGENTS: 'nomada_cusco_db_agents_v2',
  PROPERTIES: 'nomada_cusco_db_properties_v2',
  PROPERTY_IMAGES: 'nomada_cusco_db_images_v2',
  INQUIRIES: 'nomada_cusco_db_inquiries_v2'
};

// SQL Schema for reference & inspection in UI
export const SUPABASE_SQL_SCHEMA = `
-- TABLA: agents
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    territory TEXT NOT NULL,
    philosophy TEXT NOT NULL,
    manifesto_snippet TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 5,
    active_properties_count INT NOT NULL DEFAULT 0,
    accent_color TEXT DEFAULT '#2F3A2B',
    quote TEXT NOT NULL,
    architectural_focus TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLA: properties
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    architectural_style TEXT NOT NULL,
    location TEXT NOT NULL,
    region TEXT NOT NULL,
    price_formatted TEXT NOT NULL,
    price_value NUMERIC(12, 2) NOT NULL,
    area_sqm INT NOT NULL,
    bedrooms INT NOT NULL DEFAULT 1,
    bathrooms INT NOT NULL DEFAULT 1,
    year_built INT,
    materials TEXT[] DEFAULT '{}',
    cover_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    architect_name TEXT,
    orientation TEXT,
    features TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLA: property_images
CREATE TABLE public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    aspect_ratio TEXT DEFAULT '16:9',
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLA: viewing_inquiries
CREATE TABLE public.viewing_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id),
    property_id UUID REFERENCES public.properties(id),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending_review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

class NomadaDataService {
  private getLocal<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return fallback;
  }

  private setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  public async getAgents(): Promise<Agent[]> {
    return this.getLocal<Agent[]>(STORAGE_KEYS.AGENTS, INITIAL_AGENTS);
  }

  public async getProperties(): Promise<Property[]> {
    return this.getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  }

  public async getPropertyImages(): Promise<PropertyImage[]> {
    return this.getLocal<PropertyImage[]>(STORAGE_KEYS.PROPERTY_IMAGES, INITIAL_PROPERTY_IMAGES);
  }

  public async getAgentBySlug(slug: string): Promise<Agent | null> {
    const agents = await this.getAgents();
    return agents.find(a => a.slug === slug) || null;
  }

  public async getPropertiesByAgentId(agentId: string): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter(p => p.agent_id === agentId);
  }

  public async getPropertyById(id: string): Promise<{ property: Property; agent: Agent | null; images: PropertyImage[] } | null> {
    const [properties, agents, images] = await Promise.all([
      this.getProperties(),
      this.getAgents(),
      this.getPropertyImages()
    ]);

    const property = properties.find(p => p.id === id);
    if (!property) return null;

    const agent = agents.find(a => a.id === property.agent_id) || null;
    const propImages = images.filter(img => img.property_id === id);

    return { property, agent, images: propImages };
  }

  public async submitInquiry(inquiry: Omit<ViewingInquiry, 'id' | 'created_at'>): Promise<ViewingInquiry> {
    const existing = this.getLocal<ViewingInquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    const newInquiry: ViewingInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString()
    };
    existing.unshift(newInquiry);
    this.setLocal(STORAGE_KEYS.INQUIRIES, existing);
    return newInquiry;
  }

  public async getInquiries(): Promise<ViewingInquiry[]> {
    return this.getLocal<ViewingInquiry[]>(STORAGE_KEYS.INQUIRIES, []);
  }

  public async resetToDefaults(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.PROPERTY_IMAGES);
  }
}

export const dataService = new NomadaDataService();
