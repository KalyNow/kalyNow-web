import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, SxProps, Theme } from '@mui/material';
import { BRAND } from '../../theme/brandTokens';

// ─── Blob animé ───────────────────────────────────────────────────────────────
/**
 * Cercle flou décoratif animé (background blur orb).
 * Utilisable sur n'importe quelle page en position absolute.
 */
export const Blob: React.FC<{ sx?: SxProps<Theme> }> = ({ sx = {} }) => (
    <Box
        sx={{
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(72px)',
            pointerEvents: 'none',
            zIndex: 0,
            '@keyframes blobPulse': {
                '0%,100%': { transform: 'scale(1)', opacity: 0.55 },
                '50%': { transform: 'scale(1.15)', opacity: 0.85 },
            },
            animation: 'blobPulse 8s ease-in-out infinite',
            ...sx,
        }}
    />
);

// ─── RevealCard ───────────────────────────────────────────────────────────────
/**
 * Wrapper générique qui anime ses enfants via IntersectionObserver
 * (fade-up au scroll). Réutilisable sur toutes les pages.
 */
export const RevealCard: React.FC<{
    children: React.ReactNode;
    delay?: number;
    sx?: SxProps<Theme>;
}> = ({ children, delay = 0, sx = {} }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            },
            { threshold: 0.12 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <Box
            ref={ref}
            sx={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: `opacity .55s ease ${delay}ms, transform .55s ease ${delay}ms`,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

// ─── GlassCard ────────────────────────────────────────────────────────────────
/**
 * Carte glassmorphism standard de la charte KalyNow.
 * Accepte un SvgIcon MUI, un titre et un texte.
 */
export const GlassCard: React.FC<{
    icon: React.ReactNode;
    titre: string;
    texte: string;
    delay?: number;
}> = ({ icon, titre, texte, delay = 0 }) => (
    <RevealCard delay={delay} sx={{ flex: 1, minWidth: 200 }}>
        <Paper
            elevation={0}
            sx={{
                p: 3.5,
                height: '100%',
                borderRadius: 4,
                background: BRAND.glass,
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: `1px solid ${BRAND.glassBorder}`,
                color: '#fff',
                transition: 'box-shadow .3s ease, transform .3s ease, border-color .3s ease',
                '&:hover': {
                    boxShadow: '0 20px 40px rgba(199,91,18,0.22)',
                    transform: 'translateY(-6px)',
                    borderColor: BRAND.glassBorderHover,
                },
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(199,91,18,0.55) 0%, rgba(255,176,103,0.25) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: BRAND.secondary,
                    '& svg': { fontSize: 26 },
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: BRAND.secondary }}>
                {titre}
            </Typography>
            <Typography variant="body2" sx={{ color: BRAND.textMuted, lineHeight: 1.75 }}>
                {texte}
            </Typography>
        </Paper>
    </RevealCard>
);

// ─── StepBadge ────────────────────────────────────────────────────────────────
/**
 * Badge circulaire numéroté pour les sections "étapes".
 * Accepte un SvgIcon MUI + un numéro string.
 */
export const StepBadge: React.FC<{
    icon: React.ReactNode;
    num: string;
    size?: number;
}> = ({ icon, num, size = 64 }) => (
    <Box
        sx={{
            minWidth: size,
            height: size,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(199,91,18,0.7) 0%, rgba(255,176,103,0.35) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,176,103,0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: BRAND.secondary,
            '& svg': { fontSize: size * 0.38 },
        }}
    >
        {icon}
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: BRAND.secondaryLight, letterSpacing: 1, mt: 0.25 }}>
            {num}
        </Typography>
    </Box>
);

// ─── AppStoreBadge ────────────────────────────────────────────────────────────
/**
 * Bouton de téléchargement App Store / Google Play.
 * Utilise des SVG inline fidèles aux logos officiels.
 */

const AppleLogoSvg: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 814 1000" fill="currentColor">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 191.4-49 30.8 0 134.2 2.6 198.3 99zM549.8 148.8c28.2-32.1 48.2-76.2 48.2-120.3 0-6.1-.5-12.2-1.6-17.2-45.5 1.6-100 30.2-133.5 67.1-25 27.7-49 71.9-49 116.6 0 6.7 1.1 13.4 1.6 15.5 2.7.5 7.1 1.1 11.6 1.1 41 0 92.3-27.2 122.7-62.8z" />
    </svg>
);

const GooglePlayLogoSvg: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
        <path d="M48 28.3 267.5 256 48 483.7A22 22 0 0 1 36 464V48a22 22 0 0 1 12-19.7z" fill="#00C1FF" />
        <path d="M340.7 182.3 97.5 37.8 267.5 256z" fill="#00EE76" />
        <path d="M340.7 329.7 267.5 256 97.5 474.2z" fill="#FF3A44" />
        <path d="M476 219.4 392.3 170 340.7 256l51.6 86 83.7-49.4a28 28 0 0 0 0-47.2z" fill="#FFD400" />
    </svg>
);

export const AppStoreBadge: React.FC<{ store: 'apple' | 'google'; onClick?: () => void }> = ({ store, onClick }) => (
    <Box
        component="button"
        onClick={onClick}
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 1.5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#fff',
            cursor: 'pointer',
            outline: 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, background .25s ease',
            '&:hover': {
                transform: 'translateY(-3px)',
                background: 'rgba(255,255,255,0.1)',
                boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
            },
        }}
    >
        <Box sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
            {store === 'apple' ? <AppleLogoSvg /> : <GooglePlayLogoSvg />}
        </Box>
        <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1, mb: 0.25 }}>
                {store === 'apple' ? 'Disponible sur' : 'Disponible sur'}
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1, color: '#fff' }}>
                {store === 'apple' ? 'App Store' : 'Google Play'}
            </Typography>
        </Box>
    </Box>
);
