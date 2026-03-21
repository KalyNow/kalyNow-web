import React, { useEffect, useRef } from 'react';
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import {
    DownloadForOffline,
    NotificationsActive,
    SearchRounded,
    QrCode2,
    RestaurantMenu,
    MoneyOff,
    PeopleAlt,
    SpeedRounded,
    BarChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoWithText from '../../../../core/assets/LOGos/logo-with-text.svg';
import { BRAND } from '../../../../core/theme/brandTokens';
import { RevealCard, GlassCard, StepBadge, AppStoreBadge } from '../../../../core/components/brand/BrandUI';

// ─── Données ──────────────────────────────────────────────────────────────────
const STATS = [
    { valeur: '2 400+', label: 'Repas sauvés' },
    { valeur: '180+', label: 'Restaurants partenaires' },
    { valeur: '98%', label: 'Clients satisfaits' },
    { valeur: '-60%', label: 'Gaspillage alimentaire' },
];

const STEPS_CLIENT = [
    { icon: <DownloadForOffline />, num: '01', titre: 'Téléchargez KalyNow', texte: "Installez l'application KalyNow sur votre mobile — disponible sur iOS et Android. C'est gratuit." },
    { icon: <NotificationsActive />, num: '02', titre: 'Recevez les notifs du soir', texte: "Chaque soir, KalyNow vous notifie des meilleures offres autour de vous avant qu'elles ne disparaissent." },
    { icon: <SearchRounded />, num: '03', titre: 'Parcourez & choisissez', texte: "Filtrez par distance, cuisine ou prix. Toutes les offres sont à -30 % à -70 % du prix normal." },
    { icon: <QrCode2 />, num: '04', titre: 'Réservez en un tap', texte: "Confirmez votre panier en un tap. Vous recevez un QR code sur votre téléphone — rien de plus." },
    { icon: <RestaurantMenu />, num: '05', titre: 'Récupérez et savourez', texte: "Passez au restaurant, présentez votre QR code et repartez avec votre repas. C'est aussi simple que ça." },
];

const AVANTAGES_RESTO = [
    { icon: <MoneyOff />, titre: 'Zéro perte sèche', texte: "Vos invendus de fin de journée génèrent encore du chiffre d'affaires au lieu de finir à la poubelle." },
    { icon: <PeopleAlt />, titre: 'Nouvelle clientèle', texte: "KalyNow vous expose à des centaines d'utilisateurs locaux qui ne vous connaissaient pas encore." },
    { icon: <SpeedRounded />, titre: 'Tableau de bord simple', texte: "Publiez une offre en 30 secondes depuis votre espace restaurateur. Pas de formation, pas de technicité." },
    { icon: <BarChart />, titre: 'Statistiques en temps réel', texte: "Suivez vos ventes, vos réservations et vos avis clients directement depuis votre dashboard." },
];

const TEMOIGNAGES = [
    { nom: 'Sophie M.', role: 'Cliente fidèle', texte: '« Grâce à KalyNow, je mange bien tous les soirs pour presque rien. Les offres de fin de journée sont incroyables ! »' },
    { nom: 'Chef Karim', role: 'Restaurateur', texte: "« Avant, je jetais 30 % de ma production. Aujourd'hui, je récupère de la valeur sur mes invendus et ma clientèle a doublé. »" },
    { nom: 'Léa & Tom', role: "Couple d'étudiants", texte: "« L'app est ultra intuitive. On trouve toujours quelque chose de bon près de chez nous en moins de 2 minutes. »" },
];

// ─── Page principale ──────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 80);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: BRAND.bg,
                color: BRAND.textStrong,
                overflowX: 'hidden',
                '@keyframes shimmer': { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
            }}
        >
            {/* ══ HERO ══ */}
            <Box sx={{ position: 'relative', pb: { xs: 8, md: 12 }, pt: { xs: 4, md: 8 } }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Nav */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 6, md: 10 } }}>
                        <Box component="img" src={logoWithText} alt="KalyNow" sx={{ height: 40 }} />
                        <Stack direction="row" spacing={1.5}>
                            <Button size="small" onClick={() => navigate('/restaurants')} sx={{ color: BRAND.textMuted, '&:hover': { color: BRAND.primary } }}>Restaurants</Button>
                            <Button size="small" onClick={() => navigate('/offers')} sx={{ color: BRAND.textMuted, '&:hover': { color: BRAND.primary } }}>Offres</Button>
                            <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                                sx={{ borderColor: BRAND.glassBorder, color: BRAND.secondary, borderRadius: 8, bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: 'rgba(255,176,103,0.08)', borderColor: BRAND.secondary } }}>
                                Connexion
                            </Button>
                        </Stack>
                    </Stack>
                    {/* Copy */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: { xs: 4, md: 6 },
                            border: `1px solid ${BRAND.glassBorder}`,
                            backgroundColor: BRAND.surfaceStrong,
                            boxShadow: '0 24px 80px rgba(0,0,0,0.38)',
                            px: { xs: 3, md: 8 },
                            py: { xs: 5, md: 8 },
                        }}
                    >
                        <Box ref={heroRef} sx={{ textAlign: 'center', opacity: 0, transform: 'translateY(24px)', transition: 'opacity .75s ease, transform .75s ease' }}>
                            <Chip label="Zéro gaspillage · 100 % bon plan"
                                sx={{ mb: 3, bgcolor: 'rgba(255,176,103,0.08)', color: BRAND.secondary, fontWeight: 700, fontSize: 13, border: `1px solid ${BRAND.glassBorder}` }} />
                            <Typography component="h1" sx={{
                                fontSize: { xs: '2.4rem', md: '4rem' }, fontWeight: 900, lineHeight: 1.1, mb: 3,
                                background: BRAND.shimmer,
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer 6s linear infinite',
                                letterSpacing: '-0.03em',
                            }}>
                                Sauvez un repas.<br />Faites une bonne affaire.
                            </Typography>
                            <Typography variant="h6" sx={{ color: BRAND.textMuted, maxWidth: 640, mx: 'auto', mb: 5, lineHeight: 1.75, fontWeight: 400 }}>
                                KalyNow connecte les restaurants qui ont des invendus en fin de journée avec des utilisateurs qui cherchent de bonnes offres près de chez eux — en temps réel.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button variant="contained" size="large" onClick={() => navigate('/offers')}
                                    sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 700, borderRadius: 10, background: BRAND.gradientBtn, boxShadow: '0 8px 24px rgba(199,91,18,0.42)', transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 32px rgba(199,91,18,0.55)' } }}>
                                    Voir les offres du soir
                                </Button>
                                <Button variant="outlined" size="large" onClick={() => navigate('/register')}
                                    sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 600, borderRadius: 10, borderColor: BRAND.glassBorder, color: BRAND.secondary, backgroundColor: 'rgba(255,255,255,0.03)', transition: 'transform .25s ease, border-color .25s ease', '&:hover': { transform: 'translateY(-4px)', borderColor: BRAND.secondary, bgcolor: 'rgba(255,176,103,0.08)' } }}>
                                    Créer un compte gratuitement
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* ══ STATS ══ */}
            <Box sx={{ background: 'rgba(255,255,255,0.02)', borderTop: `1px solid ${BRAND.glassBorder}`, borderBottom: `1px solid ${BRAND.glassBorder}`, py: 5 }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-around" alignItems="center" spacing={4}
                        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: BRAND.glassBorder }} />}>
                        {STATS.map(({ valeur, label }) => (
                            <Box key={label} textAlign="center">
                                <Typography sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, fontWeight: 900, color: BRAND.secondary, lineHeight: 1 }}>{valeur}</Typography>
                                <Typography variant="body2" sx={{ color: BRAND.textMuted, mt: 0.5 }}>{label}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* ══ COMMENT ÇA MARCHE — CLIENTS ══ */}
            <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 }, position: 'relative' }}>
                <RevealCard>
                    <Box sx={{ textAlign: 'center', mb: 8, position: 'relative', zIndex: 1 }}>
                        <Typography variant="overline" sx={{ color: BRAND.secondary, letterSpacing: 3, fontWeight: 700 }}>Pour les clients</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ mt: 1, mb: 2 }}>Comment ça marche ?</Typography>
                        <Typography variant="body1" sx={{ color: BRAND.textMuted, maxWidth: 480, mx: 'auto' }}>
                            Cinq étapes, deux minutes. C'est tout ce qu'il faut pour manger bien ce soir.
                        </Typography>
                    </Box>
                </RevealCard>
                <Stack spacing={0} sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ position: 'absolute', left: 31, top: 12, bottom: 12, width: 2, background: 'linear-gradient(to bottom, rgba(199,91,18,0.35), rgba(199,91,18,0.08))', zIndex: 0 }} />
                    {STEPS_CLIENT.map(({ icon, num, titre, texte }, i) => (
                        <RevealCard key={num} delay={i * 90}>
                            <Stack direction="row" spacing={{ xs: 2.5, md: 4 }} alignItems="flex-start" sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
                                <StepBadge icon={icon} num={num} size={64} />
                                <Box sx={{ pt: 0.5 }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: '1rem', md: '1.15rem' } }}>{titre}</Typography>
                                    <Typography variant="body2" sx={{ color: BRAND.textMuted, lineHeight: 1.8 }}>{texte}</Typography>
                                </Box>
                            </Stack>
                        </RevealCard>
                    ))}
                </Stack>
                {/* Badge téléchargement */}
                <RevealCard delay={450}>
                    <Paper elevation={0} sx={{ mt: 2, p: { xs: 3, md: 4 }, borderRadius: 4, textAlign: 'center', background: BRAND.surfaceStrong, border: `1px solid ${BRAND.glassBorder}`, boxShadow: '0 18px 40px rgba(0,0,0,0.24)' }}>
                        <Box sx={{ color: BRAND.secondary, mb: 1 }}><DownloadForOffline sx={{ fontSize: 44 }} /></Box>
                        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Téléchargez l'application KalyNow</Typography>
                        <Typography variant="body2" sx={{ color: BRAND.textMuted, mb: 3, maxWidth: 400, mx: 'auto' }}>
                            Toutes les offres, vos notifications en temps réel et votre QR code — directement dans votre poche.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <AppStoreBadge store="apple" />
                            <AppStoreBadge store="google" />
                        </Stack>
                    </Paper>
                </RevealCard>
            </Container>

            {/* ══ SECTION RESTAURANTS ══ */}
            <Box sx={{ background: 'rgba(255,255,255,0.015)', borderTop: `1px solid ${BRAND.glassBorder}`, borderBottom: `1px solid ${BRAND.glassBorder}`, py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden' }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <RevealCard>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Chip label="Vous êtes restaurateur ?" sx={{ mb: 2, bgcolor: 'rgba(255,176,103,0.08)', color: BRAND.secondary, fontWeight: 700, border: `1px solid ${BRAND.glassBorder}` }} />
                            <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>Transformez vos invendus en revenus</Typography>
                            <Typography variant="body1" sx={{ color: BRAND.textMuted, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}>
                                Chaque soir, des repas préparés finissent à la poubelle. KalyNow vous donne les outils pour vendre vos invendus rapidement, attirer de nouveaux clients et améliorer votre image.
                            </Typography>
                        </Box>
                    </RevealCard>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
                        {AVANTAGES_RESTO.map(({ icon, titre, texte }, i) => (
                            <GlassCard key={titre} icon={icon} titre={titre} texte={texte} delay={i * 100} />
                        ))}
                    </Box>
                    <RevealCard delay={200}>
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, background: BRAND.surfaceStrong, border: `1px solid ${BRAND.glassBorder}`, boxShadow: '0 18px 40px rgba(0,0,0,0.24)' }}>
                            <Typography variant="overline" sx={{ color: BRAND.secondary, letterSpacing: 3, fontWeight: 700, display: 'block', mb: 3 }}>3 étapes pour commencer</Typography>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: BRAND.glassBorder }} />}>
                                {[
                                    { num: '01', titre: 'Inscrivez votre établissement', texte: "Créez votre profil restaurateur en 5 minutes. Renseignez vos infos, ajoutez vos photos — c'est tout." },
                                    { num: '02', titre: 'Publiez vos offres du soir', texte: "Chaque soir en 30 secondes : décrivez votre plat du jour, fixez le prix réduit, définissez la quantité disponible." },
                                    { num: '03', titre: 'Accueillez vos nouveaux clients', texte: "Les clients arrivent avec leur QR code. Scannez, servez, encaissez. KalyNow s'occupe du reste." },
                                ].map(({ num, titre, texte }) => (
                                    <Box key={num} sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '2.4rem', fontWeight: 900, color: 'rgba(255,255,255,0.14)', lineHeight: 1, mb: 1 }}>{num}</Typography>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.75 }}>{titre}</Typography>
                                        <Typography variant="body2" sx={{ color: BRAND.textMuted, lineHeight: 1.8 }}>{texte}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </RevealCard>
                    <RevealCard delay={300}>
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button variant="contained" size="large" onClick={() => navigate('/register?type=restaurant')}
                                sx={{ px: 5, py: 1.8, fontSize: 17, fontWeight: 800, borderRadius: 12, background: BRAND.gradientBtnCta, boxShadow: '0 10px 32px rgba(199,91,18,0.5)', transition: 'transform .3s ease, box-shadow .3s ease', '&:hover': { transform: 'scale(1.04)', boxShadow: '0 16px 40px rgba(199,91,18,0.65)' } }}>
                                Inscrire mon restaurant — Gratuit
                            </Button>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: BRAND.textFaint }}>
                                Sans engagement · Votre première offre publiée en 5 minutes
                            </Typography>
                        </Box>
                    </RevealCard>
                </Container>
            </Box>

            {/* ══ TÉMOIGNAGES ══ */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <RevealCard>
                    <Box sx={{ textAlign: 'center', mb: 7 }}>
                        <Typography variant="overline" sx={{ color: BRAND.secondary, letterSpacing: 3, fontWeight: 700 }}>Témoignages</Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>Ils nous font confiance</Typography>
                    </Box>
                </RevealCard>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {TEMOIGNAGES.map(({ nom, role, texte }, i) => (
                        <RevealCard key={nom} delay={i * 120} sx={{ flex: 1 }}>
                            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, background: BRAND.surfaceStrong, border: `1px solid ${BRAND.glassBorder}`, boxShadow: '0 18px 40px rgba(0,0,0,0.24)', transition: 'transform .3s ease, border-color .3s ease', '&:hover': { transform: 'translateY(-4px)', borderColor: BRAND.glassBorderHover } }}>
                                <Typography variant="body1" sx={{ color: BRAND.textStrong, lineHeight: 1.8, fontStyle: 'italic', mb: 3 }}>{texte}</Typography>
                                <Divider sx={{ borderColor: BRAND.glassBorder, mb: 2 }} />
                                <Typography fontWeight={700} sx={{ color: BRAND.secondary }}>{nom}</Typography>
                                <Typography variant="caption" sx={{ color: BRAND.textFaint }}>{role}</Typography>
                            </Paper>
                        </RevealCard>
                    ))}
                </Stack>
            </Container>

            {/* ══ CTA FINAL ══ */}
            <Box sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <RevealCard>
                        <Paper elevation={0} sx={{ borderRadius: 5, background: BRAND.surfaceStrong, border: `1px solid ${BRAND.glassBorder}`, boxShadow: '0 18px 40px rgba(0,0,0,0.24)', p: { xs: 4, md: 6 } }}>
                            <Typography variant="h4" fontWeight={900} sx={{ mb: 2, lineHeight: 1.2 }}>Prêt à sauver votre premier repas ?</Typography>
                            <Typography variant="body1" sx={{ color: BRAND.textMuted, mb: 5 }}>
                                Rejoignez des milliers d'utilisateurs qui mangent bien pour moins cher tout en aidant la planète.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button variant="contained" size="large" onClick={() => navigate('/register')}
                                    sx={{ px: 5, py: 1.8, fontSize: 17, fontWeight: 800, borderRadius: 12, background: BRAND.gradientBtnCta, boxShadow: '0 10px 32px rgba(199,91,18,0.5)', transition: 'transform .3s ease, box-shadow .3s ease', '&:hover': { transform: 'scale(1.04)', boxShadow: '0 16px 40px rgba(199,91,18,0.65)' } }}>
                                    Je crée mon compte
                                </Button>
                                <Button variant="outlined" size="large" onClick={() => navigate('/register?type=restaurant')}
                                    sx={{ px: 4, py: 1.8, fontSize: 16, fontWeight: 700, borderRadius: 12, borderColor: BRAND.glassBorder, color: BRAND.secondary, backgroundColor: 'rgba(255,255,255,0.03)', transition: 'transform .3s ease', '&:hover': { borderColor: BRAND.secondary, bgcolor: 'rgba(255,176,103,0.08)', transform: 'scale(1.02)' } }}>
                                    Inscrire mon restaurant
                                </Button>
                            </Stack>
                        </Paper>
                    </RevealCard>
                </Container>
            </Box>

            {/* ══ FOOTER ══ */}
            <Box sx={{ borderTop: `1px solid ${BRAND.glassBorder}`, py: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: BRAND.textFaint }}>
                    © {new Date().getFullYear()} KalyNow — Tous droits réservés · Réduire le gaspillage, une offre à la fois.
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
