import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { PhoneIphone, QrCode2, Storefront } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../core/store';
import { logoutProvider } from '../../../../core/redux/authSlice';
import { BRAND } from '../../../../core/theme/brandTokens';
import { Blob, AppStoreBadge } from '../../../../core/components/brand/BrandUI';
import logoWithText from '../../../../core/assets/LOGos/logo-with-text.svg';

const MaintenancePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: BRAND.bg,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '@keyframes floatY': {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
            }}
        >
            {/* Blobs */}
            <Blob sx={{ width: 500, height: 500, background: 'rgba(199,91,18,0.2)', top: -140, right: -120 }} />
            <Blob sx={{ width: 380, height: 380, background: 'rgba(255,176,103,0.12)', bottom: -100, left: -80, animationDelay: '3s' }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 3 }}>
                {/* Logo */}
                <Box
                    component="img"
                    src={logoWithText}
                    alt="KalyNow"
                    sx={{ height: 44, mb: 6, animation: 'floatY 5s ease-in-out infinite' }}
                />

                {/* Icône mobile */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(199,91,18,0.55) 0%, rgba(255,176,103,0.25) 100%)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,176,103,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                    }}
                >
                    <PhoneIphone sx={{ fontSize: 52, color: BRAND.secondary }} />
                </Box>

                <Typography variant="h4" fontWeight={900} sx={{ mb: 1.5, lineHeight: 1.2 }}>
                    L'expérience client<br />est sur mobile
                </Typography>
                <Typography variant="body1" sx={{ color: BRAND.textMuted, mb: 5, lineHeight: 1.8, maxWidth: 400, mx: 'auto' }}>
                    L'application KalyNow est optimisée pour votre téléphone. Téléchargez-la pour trouver les meilleures offres de restauration près de chez vous en temps réel.
                </Typography>

                {/* Badges store */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
                    <AppStoreBadge store="apple" />
                    <AppStoreBadge store="google" />
                </Stack>

                {/* Features rapides */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 7 }}>
                    {[
                        { icon: <QrCode2 sx={{ fontSize: 20 }} />, label: 'Réservation par QR code' },
                        { icon: <Storefront sx={{ fontSize: 20 }} />, label: '+180 restaurants partenaires' },
                        { icon: <PhoneIphone sx={{ fontSize: 20 }} />, label: 'Notifications en temps réel' },
                    ].map(({ icon, label }) => (
                        <Box
                            key={label}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 8,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,176,103,0.15)',
                                color: BRAND.textMuted,
                                fontSize: 13,
                            }}
                        >
                            <Box sx={{ color: BRAND.secondary }}>{icon}</Box>
                            <Typography variant="caption" sx={{ color: BRAND.textMuted, fontWeight: 500 }}>
                                {label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                {/* Déconnexion */}
                <Button
                    variant="text"
                    size="small"
                    onClick={() => dispatch(logoutProvider())}
                    sx={{
                        color: BRAND.textFaint,
                        fontSize: 12,
                        '&:hover': { color: BRAND.secondary },
                    }}
                >
                    Se déconnecter
                </Button>
            </Container>
        </Box>
    );
};

export default MaintenancePage;
