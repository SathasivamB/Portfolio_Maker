import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Canonical 12 Figma Portfolio Archetypes definition
export const FIGMA_ARCHETYPES = [
  { id: 'monolith', name: 'Monolith Dark', category: 'Developer', tier: 'Free', paletteId: 'monolith-dark', accent: '#FFD84D', topColor: '#0A0A12', bottomColor: '#1F202E' },
  { id: 'prism', name: 'Prism Electric', category: 'Generalist', tier: 'Free', paletteId: 'prism-electric', accent: '#2340FF', topColor: '#2340FF', bottomColor: '#FFD84D' },
  { id: 'swiss', name: 'Mono Swiss', category: 'Technical', tier: 'Free', paletteId: 'monolith-dark', accent: '#0A0A12', topColor: '#0A0A12', bottomColor: '#2B2D42' },
  { id: 'editorial', name: 'Editorial Luxury', category: 'Executive', tier: 'Premium', paletteId: 'editorial-warm', accent: '#8C4320', topColor: '#8C4320', bottomColor: '#F5F1E8' },
  { id: 'terminal', name: 'Cyber Terminal', category: 'Security', tier: 'Premium', paletteId: 'monolith-dark', accent: '#7CFFB2', topColor: '#0A0A12', bottomColor: '#002B1B' },
  { id: 'canvas', name: 'Canvas Studio', category: 'Designer', tier: 'Premium', paletteId: 'soft-lavender', accent: '#2340FF', topColor: '#2340FF', bottomColor: '#E8ECFF' },
  { id: 'neural', name: 'Neural AI Architect', category: 'AI/ML', tier: 'Premium', paletteId: 'cyber-mint', accent: '#7CFFB2', topColor: '#0A0A12', bottomColor: '#7CFFB2' },
  { id: 'fintech', name: 'FinTech High-Frequency', category: 'Professional', tier: 'Premium', paletteId: 'monolith-dark', accent: '#FFD84D', topColor: '#0A0A12', bottomColor: '#171822' },
  { id: 'mobile', name: 'Native iOS Craft', category: 'Mobile', tier: 'Premium', paletteId: 'prism-electric', accent: '#2340FF', topColor: '#2340FF', bottomColor: '#E8ECFF' },
  { id: 'founder', name: 'Founder Mode MVP', category: 'Founder', tier: 'Premium', paletteId: 'prism-electric', accent: '#FFD84D', topColor: '#FFD84D', bottomColor: '#0A0A12' },
  { id: 'devops', name: 'Cloud SRE Kubernetes', category: 'Infrastructure', tier: 'Premium', paletteId: 'monolith-dark', accent: '#2340FF', topColor: '#0A0A12', bottomColor: '#1E293B' },
  { id: 'spatial', name: '3D Spatial Vision', category: 'Hardware/3D', tier: 'Premium', paletteId: 'soft-lavender', accent: '#2340FF', topColor: '#2340FF', bottomColor: '#1A103C' }
];

export const SUB_COMPONENT_KEYS = [
  'navbar_brand_logo',
  'navbar_nav_links',
  'navbar_status_badge',
  'hero_terminal_window',
  'hero_clone_snippet',
  'hero_verified_badge',
  'platform_github',
  'platform_linkedin',
  'platform_youtube'
];

describe('Figma Portfolio Archetypes & UI Tokens', () => {
  it('should have exactly 12 Figma archetypes configured', () => {
    assert.equal(FIGMA_ARCHETYPES.length, 12, 'Must contain all 12 Figma community templates');
  });

  it('should have unique IDs for all 12 archetypes', () => {
    const ids = FIGMA_ARCHETYPES.map(a => a.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, 'All archetype IDs must be unique');
  });

  it('should ensure each archetype has valid hex color codes and palette IDs', () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    FIGMA_ARCHETYPES.forEach(arch => {
      assert.ok(arch.name, `Archetype ${arch.id} must have a name`);
      assert.ok(arch.category, `Archetype ${arch.id} must have a category`);
      assert.ok(arch.paletteId, `Archetype ${arch.id} must have a paletteId`);
      assert.match(arch.accent, hexRegex, `Archetype ${arch.id} accent must be valid hex`);
      assert.match(arch.topColor, hexRegex, `Archetype ${arch.id} topColor must be valid hex`);
      assert.match(arch.bottomColor, hexRegex, `Archetype ${arch.id} bottomColor must be valid hex`);
    });
  });

  it('should maintain the 9 granular sub-component switches', () => {
    assert.equal(SUB_COMPONENT_KEYS.length, 9, 'Must support 9 granular sub-component switches');
    assert.ok(SUB_COMPONENT_KEYS.includes('navbar_brand_logo'));
    assert.ok(SUB_COMPONENT_KEYS.includes('hero_terminal_window'));
    assert.ok(SUB_COMPONENT_KEYS.includes('hero_verified_badge'));
    assert.ok(SUB_COMPONENT_KEYS.includes('platform_github'));
  });

  it('should verify contrast compliance for primary Folio AI v2 tokens', () => {
    // Relative luminance calculation helper for WCAG verification
    function getLuminance(hex) {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrast(hex1, hex2) {
      const l1 = getLuminance(hex1);
      const l2 = getLuminance(hex2);
      const brightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    const contrastBlackOnWhite = getContrast('#0A0A12', '#FFFFFF');
    assert.ok(contrastBlackOnWhite > 7, `Contrast ${contrastBlackOnWhite} must be AAA (> 7:1)`);

    const contrastBlueOnWhite = getContrast('#2340FF', '#FFFFFF');
    assert.ok(contrastBlueOnWhite > 4.5, `Contrast ${contrastBlueOnWhite} must be AA (> 4.5:1)`);

    const contrastYellowOnBlack = getContrast('#FFD84D', '#0A0A12');
    assert.ok(contrastYellowOnBlack > 7, `Contrast ${contrastYellowOnBlack} must be AAA (> 7:1)`);
  });
});
