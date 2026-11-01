import type { SceneOpts } from './lib/textures';

/**
 * All editable site content lives here.
 * To use real project photography, set `photo` to an image URL (e.g. '/photos/foyer.jpg')
 * on any item — it replaces the procedural demonstration render.
 */

export const CONTACT = {
  phone: '(000) 000-0000', // TODO: supply real number
  phoneHref: 'tel:+10000000000',
  email: 'hello@ironwoodrestoration.example', // TODO: supply real email
  serviceAreas: 'Service areas to be announced', // TODO
  instagram: '#',
  facebook: '#',
};

export interface Service { id: string; no: string; title: string; text: string; detail: string[]; scene: SceneOpts; photo?: string }

export const SERVICES: Service[] = [
  { id: 'tile', no: '01', title: 'Tile Restoration',
    text: 'Restore the original appearance of tile surfaces with professional cleaning and restoration techniques.',
    detail: ['Deep cleaning of porcelain and ceramic tile', 'Removal of surface film and buildup', 'Refreshed, uniform appearance'],
    scene: { kind: 'foyer', floor: 'statuario', wall: 'limestone', seed: 3, w: 900, h: 1100 } },
  { id: 'stone', no: '02', title: 'Natural Stone Restoration',
    text: 'Professional restoration and refinishing for natural stone surfaces, including marble, travertine, limestone, and granite where applicable.',
    detail: ['Marble, travertine, limestone and granite', 'Honing and refinishing where suitable', 'Material-specific care'],
    scene: { kind: 'hall', floor: 'calacatta', wall: 'travertine', seed: 8, w: 900, h: 1100 } },
  { id: 'grout', no: '03', title: 'Grout Cleaning & Restoration',
    text: 'Revitalize grout lines by removing embedded dirt, buildup, and discoloration.',
    detail: ['Removal of embedded soil and residue', 'Treatment of discoloration', 'Clean, defined grout lines'],
    scene: { kind: 'grout', floor: 'statuario', grout: '#e3ddd1', seed: 12, w: 900, h: 1100 } },
  { id: 'color-seal', no: '04', title: 'Grout Color Sealing',
    text: 'Enhance the appearance of grout and provide a protective finish with appropriate color sealing solutions.',
    detail: ['Uniform grout color', 'Protective finish', 'Range of color options'],
    scene: { kind: 'grout', floor: 'nero', grout: '#1a1a1a', seed: 14, w: 900, h: 1100 } },
  { id: 'polish', no: '05', title: 'Stone Polishing',
    text: 'Bring back the natural beauty and shine of suitable stone surfaces.',
    detail: ['Restored clarity and depth', 'Finish matched to the stone', 'Suitable for marble and other polishable stone'],
    scene: { kind: 'slab', floor: 'calacatta', seed: 21, w: 900, h: 1100 } },
  { id: 'seal', no: '06', title: 'Stone Sealing & Protection',
    text: 'Help protect eligible natural stone and grout surfaces against moisture and staining.',
    detail: ['Penetrating sealers for eligible stone', 'Helps resist moisture and staining', 'Aftercare guidance'],
    scene: { kind: 'counter', floor: 'emperador', wall: 'limestone', seed: 6, w: 900, h: 1100 } },
];

export interface Comparison { id: string; label: string; caption: string; before: SceneOpts; after: SceneOpts; beforePhoto?: string; afterPhoto?: string }

export const COMPARISONS: Comparison[] = [
  { id: 'marble', label: 'Marble', caption: 'Dull, etched marble → honed & polished',
    before: { kind: 'foyer', floor: 'calacatta', wall: 'travertine', seed: 31, worn: true }, after: { kind: 'foyer', floor: 'calacatta', wall: 'travertine', seed: 31 } },
  { id: 'grout', label: 'Grout', caption: 'Discolored grout → clean, defined joints',
    before: { kind: 'grout', floor: 'statuario', grout: '#d7d1c5', seed: 32, worn: true }, after: { kind: 'grout', floor: 'statuario', grout: '#d7d1c5', seed: 32 } },
  { id: 'tile', label: 'Tile', caption: 'Soiled tile → refreshed surface',
    before: { kind: 'bath', floor: 'statuario', wall: 'nero', seed: 33, worn: true }, after: { kind: 'bath', floor: 'statuario', wall: 'nero', seed: 33 } },
  { id: 'stone', label: 'Stone', caption: 'Worn travertine → restored stone',
    before: { kind: 'detail', floor: 'travertine', seed: 34, worn: true }, after: { kind: 'detail', floor: 'travertine', seed: 34 } },
];

export const FEATURES = [
  { title: 'Attention to Detail', text: 'Every joint, edge and transition receives deliberate care.' },
  { title: 'Professional Restoration Techniques', text: 'Methods selected for the specific material and its condition.' },
  { title: 'Premium Surface Care', text: 'Products and processes chosen to respect natural stone.' },
  { title: 'Personalized Service', text: 'Clear communication and recommendations tailored to your property.' },
  { title: 'Quality-Focused Workmanship', text: 'We measure success by the finish you see and feel.' },
  { title: 'Respect for Your Property', text: 'Protected surroundings, tidy work areas and considerate scheduling.' },
];

export const STEPS = [
  { no: '01', title: 'Consultation', text: 'Understand your surface, concerns, and restoration goals.' },
  { no: '02', title: 'Surface Assessment', text: 'Evaluate the tile, stone, grout, and condition of the surface.' },
  { no: '03', title: 'Restoration', text: 'Apply the appropriate restoration process based on the material and condition.' },
  { no: '04', title: 'Final Finish', text: 'Review the completed work and reveal the refreshed surface.' },
];

export interface GalleryItem { title: string; category: string; scene: SceneOpts; tall?: boolean; photo?: string }

export const GALLERY: GalleryItem[] = [
  { title: 'Calacatta Grand Foyer', category: 'Luxury Marble Floors', tall: true, scene: { kind: 'foyer', floor: 'calacatta', wall: 'travertine', seed: 41, w: 900, h: 1250 } },
  { title: 'Nero Primary Bath', category: 'Premium Bathrooms', scene: { kind: 'bath', floor: 'calacatta', wall: 'nero', seed: 42, w: 1200, h: 850 } },
  { title: 'Emperador Island', category: 'Natural Stone Countertops', scene: { kind: 'counter', floor: 'emperador', wall: 'limestone', seed: 43, w: 1200, h: 900 } },
  { title: 'Gallery Corridor', category: 'Residential Interiors', tall: true, scene: { kind: 'hall', floor: 'statuario', wall: 'limestone', seed: 44, w: 900, h: 1250 } },
  { title: 'Restored Grout Detail', category: 'Restored Grout Lines', scene: { kind: 'grout', floor: 'calacatta', grout: '#d3cab9', seed: 45, w: 1200, h: 900 } },
  { title: 'Granite Reception', category: 'Commercial Interiors', scene: { kind: 'lobby', floor: 'granite', wall: 'limestone', seed: 46, w: 1200, h: 850 } },
  { title: 'Statuario Tile Field', category: 'Elegant Tile Installations', tall: true, scene: { kind: 'foyer', floor: 'statuario', wall: 'nero', seed: 47, w: 900, h: 1250 } },
  { title: 'Travertine Study', category: 'Natural Stone', scene: { kind: 'detail', floor: 'travertine', seed: 48, w: 1200, h: 900 } },
  { title: 'Calacatta Vanity Suite', category: 'Premium Bathrooms', scene: { kind: 'bath', floor: 'statuario', wall: 'travertine', seed: 49, w: 1200, h: 850 } },
];

/** Replace with authentic customer reviews only. `placeholder: true` items render a visible dev notice. */
export const TESTIMONIALS = [
  { quote: 'Customer testimonial placeholder. Replace with an authentic review from a completed project.', name: 'Client Name', role: 'Residential Client · City', placeholder: true },
  { quote: 'Customer testimonial placeholder. Replace with an authentic review describing the restoration experience.', name: 'Client Name', role: 'Commercial Client · City', placeholder: true },
  { quote: 'Customer testimonial placeholder. Replace with an authentic review once supplied by the client.', name: 'Client Name', role: 'Homeowner · City', placeholder: true },
];

export const FAQS = [
  { q: 'What surfaces do you restore?', a: 'We work with tile, natural stone, and grout — including ceramic and porcelain tile, marble, travertine, limestone, and granite where applicable. If you are unsure what material you have, we can help identify it during your consultation.' },
  { q: 'Can damaged or dull marble be restored?', a: 'In many cases, yes. Dullness, etching, and light surface wear can often be improved through honing and polishing. The outcome depends on the stone and the type of damage, which we evaluate during the surface assessment.' },
  { q: 'How do you clean and restore grout?', a: 'We use professional cleaning methods to remove embedded dirt, buildup, and discoloration from grout lines, selecting an approach appropriate for the surrounding tile or stone.' },
  { q: 'Do you offer grout color sealing?', a: 'Yes. Grout color sealing can create a more uniform appearance and adds a protective finish. We will discuss suitable color options with you.' },
  { q: 'How long does restoration take?', a: 'Timing depends on the size of the area, the material, and its condition. After assessing your project, we will give you a clear expectation of the schedule.' },
  { q: 'Do you service residential and commercial properties?', a: 'Yes — we work with homeowners as well as businesses and commercial properties.' },
  { q: 'How can I request an estimate?', a: 'Use the free estimate form on this page. Share a few details and, if possible, photos of your surfaces. Our team will review your request and reach out to discuss next steps.' },
  { q: 'What areas do you serve?', a: 'Service area details are coming soon. Include your project location in the estimate form and we will let you know if we can help.' },
];

export const SERVICE_OPTIONS = SERVICES.map((s) => s.title).concat('Not sure — need guidance');
export const SURFACE_OPTIONS = ['Marble', 'Travertine', 'Limestone', 'Granite', 'Porcelain / Ceramic Tile', 'Grout', 'Other / Not sure'];
