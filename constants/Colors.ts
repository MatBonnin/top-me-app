// src/constants/Colors.ts

const Colors = {
  light: {
    // Couleurs “marque”
    primary:      '#3B82F6',   // Boutons principaux, liens, éléments actifs
    secondary:    '#EF4444',   // CTA secondaires, icônes de notification
    accent:       '#4ECDC4',   // Badges, indicateurs de succès

    // Neutres
    neutralLight:  '#F5F5F5',  // Fonds d’écrans, cartes, surfaces
    neutralMedium: '#E5E7EB',  // Bordures, séparateurs, arrière‐plan de champs
    neutralDark:   '#374151',  // Texte principal, titres

    // Typo & UI
    textPrimary:    '#374151',  // Texte principal
    textSecondary:  '#9CA3AF',  // Texte d’aide, placeholders, légendes
    border:         '#E5E7EB',  // Bordures, séparateurs
    card:           '#FFFFFF',  // Cartes, surfaces sur fond
    background:     '#F5F5F5',  // Arrière‐plan global
    notification:   '#EF4444',  // Badges de notification
    tint:           '#3B82F6',  // Accent global (onglets, liens)
  },
  dark: {
    primary:       '#3B82F6',
    secondary:     '#EF4444',
    accent:        '#4ECDC4',

    neutralLight:  '#1F2937',  // Cartes / surfaces (remplace #FFFFFF)
    neutralMedium: '#4B5563',  // Bordures / séparateurs
    neutralDark:   '#F5F5F5',  // Texte principal

    textPrimary:    '#F5F5F5',
    textSecondary:  '#9CA3AF',
    border:         '#4B5563',
    card:           '#1F2937',
    background:     '#15181c',
    notification:   '#EF4444',
    tint:           '#3B82F6',
  },
} as const

export default Colors
