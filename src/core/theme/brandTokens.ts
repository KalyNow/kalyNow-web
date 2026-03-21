/**
 * KalyNow — tokens de design partagés
 * Utilisez ces valeurs dans toutes les pages / composants pour garantir la cohérence visuelle.
 */

export const BRAND = {
    primary: '#C75B12',
    primaryLight: '#E07830',
    primaryDark: '#9E470E',
    secondary: '#FFB067',
    secondaryLight: '#FFD2A6',
    bg: 'linear-gradient(180deg, #0D0A08 0%, #120E0B 45%, #18110D 100%)',
    bgDark: '#0D0A08',
    glass: 'rgba(255,255,255,0.04)',
    glassBorder: 'rgba(255,176,103,0.16)',
    glassBorderHover: 'rgba(255,176,103,0.30)',
    textMuted: 'rgba(255,255,255,0.66)',
    textFaint: 'rgba(255,255,255,0.38)',
    textStrong: '#FFF7F0',
    surfaceSoft: '#17110D',
    surfaceStrong: '#1D1511',
    gradientBtn: 'linear-gradient(135deg, #C75B12 0%, #E07830 100%)',
    gradientBtnCta: 'linear-gradient(135deg, #C75B12 0%, #E88940 100%)',
    shimmer: 'linear-gradient(90deg, #FFFFFF 0%, #FFB067 40%, #FFFFFF 100%)',
} as const;

export const KEYFRAMES = {
    floatY: {
        '@keyframes floatY': {
            '0%,100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
        },
    },
    shimmer: {
        '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% center' },
            '100%': { backgroundPosition: '200% center' },
        },
    },
    blobPulse: {
        '@keyframes blobPulse': {
            '0%,100%': { transform: 'scale(1)', opacity: 0.55 },
            '50%': { transform: 'scale(1.15)', opacity: 0.85 },
        },
    },
} as const;
