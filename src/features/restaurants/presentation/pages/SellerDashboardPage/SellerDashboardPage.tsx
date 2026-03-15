import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Divider,
    IconButton,
    Tooltip,
    Paper,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { RootState, AppDispatch } from '../../../../../core/store';
import { getRestaurantsProvider, createRestaurantProvider, uploadRestaurantLogoProvider } from '../../redux/restaurantsProvider';
import { clearError, clearSuccess } from '../../redux/restaurantsSlice';
import { logoutProvider } from '../../../../../core/redux/authSlice';
import { getAssetUrl } from '../../../../../core/utils/assetUrl';
import { Blob } from '../../../../../core/components/brand/BrandUI';
import { BRAND } from '../../../../../core/theme/brandTokens';
import logoWithText from '../../../../../core/assets/LOGos/logo-with-text.svg';

// ─── Glass card réutilisable localement ──────────────────────────────────────
const GlassPaper: React.FC<{ children: React.ReactNode; sx?: object }> = ({ children, sx = {} }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 4,
            background: BRAND.glass,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${BRAND.glassBorder}`,
            color: '#fff',
            ...sx,
        }}
    >
        {children}
    </Paper>
);

// ─── Types formulaire ────────────────────────────────────────────────────────
interface CreateForm {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    latitude: string;
    longitude: string;
}

const emptyForm: CreateForm = {
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
};

// ─── Composant principal ─────────────────────────────────────────────────────
const SellerDashboardPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    const { restaurants, loading, createLoading, logoLoading, error, success } = useSelector(
        (state: RootState) => state.restaurants
    );

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<CreateForm>(emptyForm);
    const [formErrors, setFormErrors] = useState<Partial<CreateForm>>({});
    const [gpsLoading, setGpsLoading] = useState(false);

    // Référence sur l'input file caché pour l'upload logo
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

    const handleLogoUpload = (restaurantId: string) => {
        setUploadTargetId(restaurantId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadTargetId) {
            dispatch(uploadRestaurantLogoProvider({ restaurantId: uploadTargetId, file }));
        }
        // Reset input so same file can be re-selected
        e.target.value = '';
        setUploadTargetId(null);
    };

    // Chargement initial
    useEffect(() => {
        dispatch(getRestaurantsProvider({ page: 1 }));
    }, [dispatch]);

    // Nettoyage messages
    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(clearSuccess()), 4000);
            return () => clearTimeout(t);
        }
    }, [success, dispatch]);

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => dispatch(clearError()), 5000);
            return () => clearTimeout(t);
        }
    }, [error, dispatch]);

    // Recharge après création réussie
    useEffect(() => {
        if (success) {
            dispatch(getRestaurantsProvider({ page: 1 }));
        }
    }, [success, dispatch]);

    // ── Formulaire ──────────────────────────────────────────────────────────
    const handleChange = (field: keyof CreateForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const errors: Partial<CreateForm> = {};
        if (!form.name.trim()) errors.name = 'Le nom est requis';
        if (!form.description.trim()) errors.description = 'La description est requise';
        if (!form.address.trim()) errors.address = "L'adresse est requise";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleGeolocate = () => {
        if (!navigator.geolocation) return;
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }));
                setGpsLoading(false);
            },
            () => setGpsLoading(false),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        await dispatch(
            createRestaurantProvider({
                name: form.name.trim(),
                description: form.description.trim(),
                address: form.address.trim(),
                phone: form.phone.trim() || undefined,
                email: form.email.trim() || undefined,
                latitude: form.latitude ? parseFloat(form.latitude) : undefined,
                longitude: form.longitude ? parseFloat(form.longitude) : undefined,
            })
        );
        setDialogOpen(false);
        setForm(emptyForm);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setForm(emptyForm);
        setFormErrors({});
    };

    const handleLogout = () => dispatch(logoutProvider());

    const totalRestaurants = restaurants?.totalItems ?? 0;

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <>
            {/* Input file caché pour l'upload logo */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: BRAND.bg,
                    overflowX: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Blobs décoratifs */}
                <Blob
                    sx={{
                        width: 520,
                        height: 520,
                        top: -160,
                        left: -160,
                        opacity: 0.18,
                        background: BRAND.primary,
                    }}
                />
                <Blob
                    sx={{
                        width: 400,
                        height: 400,
                        bottom: -100,
                        right: -100,
                        opacity: 0.13,
                        background: BRAND.secondary,
                    }}
                />

                {/* ── Header ── */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        backdropFilter: 'blur(16px)',
                        background: 'rgba(18,10,6,0.75)',
                        borderBottom: `1px solid ${BRAND.glassBorder}`,
                        px: { xs: 2, md: 5 },
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            component="img"
                            src={logoWithText}
                            alt="KalyNow"
                            sx={{ height: 36 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{ color: BRAND.textMuted, display: { xs: 'none', sm: 'block' } }}
                        >
                            {user?.email}
                        </Typography>
                        <Tooltip title="Se déconnecter">
                            <IconButton onClick={handleLogout} size="small" sx={{ color: BRAND.textMuted }}>
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* ── Contenu principal ── */}
                <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>

                    {/* Titre page */}
                    <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box
                            component="img"
                            src={logoWithText}
                            alt="KalyNow"
                            sx={{ height: 52, alignSelf: 'flex-start' }}
                        />
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                background: BRAND.shimmer,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 0.5,
                            }}
                        >
                            Tableau de bord
                        </Typography>
                        <Typography variant="body1" sx={{ color: BRAND.textMuted }}>
                            Gérez vos restaurants et vos offres anti-gaspillage.
                        </Typography>
                    </Box>

                    {/* Alertes */}
                    {error && (
                        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => dispatch(clearSuccess())} sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    {/* ── Stats cards ── */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
                            gap: 2,
                            mb: 5,
                        }}
                    >
                        <StatCard
                            icon={<StorefrontIcon sx={{ fontSize: 28, color: BRAND.primary }} />}
                            value={loading ? '—' : String(totalRestaurants)}
                            label="Restaurants"
                        />
                        <StatCard
                            icon={<LocalOfferIcon sx={{ fontSize: 28, color: BRAND.secondary }} />}
                            value="—"
                            label="Offres actives"
                        />
                        <StatCard
                            icon={<RestaurantMenuIcon sx={{ fontSize: 28, color: '#8BE2A0' }} />}
                            value="—"
                            label="Repas sauvés"
                        />
                    </Box>

                    {/* ── En-tête section restaurants ── */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                            Mes restaurants
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddBusinessIcon />}
                            onClick={() => setDialogOpen(true)}
                            sx={{
                                background: BRAND.gradientBtn,
                                borderRadius: 99,
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                textTransform: 'none',
                                boxShadow: `0 4px 24px ${BRAND.primary}44`,
                                '&:hover': {
                                    background: BRAND.gradientBtnCta,
                                    boxShadow: `0 6px 28px ${BRAND.primary}66`,
                                },
                            }}
                        >
                            Ajouter un restaurant
                        </Button>
                    </Box>

                    {/* Loader */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: BRAND.primary }} />
                        </Box>
                    )}

                    {/* État vide */}
                    {!loading && (!restaurants || restaurants.data.length === 0) && (
                        <GlassPaper
                            sx={{
                                py: 8,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <StorefrontIcon sx={{ fontSize: 56, color: BRAND.textFaint }} />
                            <Typography variant="h6" sx={{ color: BRAND.textMuted }} fontWeight={600}>
                                Aucun restaurant pour le moment
                            </Typography>
                            <Typography variant="body2" sx={{ color: BRAND.textFaint, maxWidth: 320 }}>
                                Créez votre premier restaurant pour commencer à proposer des offres anti-gaspillage.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddBusinessIcon />}
                                onClick={() => setDialogOpen(true)}
                                sx={{
                                    mt: 1,
                                    borderColor: BRAND.primary,
                                    color: BRAND.primary,
                                    borderRadius: 99,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    '&:hover': { borderColor: BRAND.secondary, color: BRAND.secondary },
                                }}
                            >
                                Créer mon premier restaurant
                            </Button>
                        </GlassPaper>
                    )}

                    {/* Grille restaurants */}
                    {!loading && restaurants && restaurants.data.length > 0 && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
                                gap: 3,
                            }}
                        >
                            {restaurants.data.map((restaurant) => (
                                <GlassPaper
                                    key={restaurant.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 12px 40px ${BRAND.primary}33`,
                                        },
                                    }}
                                >
                                    {/* Avatar + nom */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                            <Avatar
                                                src={getAssetUrl(restaurant.logoUrl) ?? undefined}
                                                sx={{
                                                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                                                    width: 44,
                                                    height: 44,
                                                }}
                                            >
                                                <StorefrontIcon sx={{ fontSize: 22 }} />
                                            </Avatar>
                                            <Tooltip title="Changer le logo">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleLogoUpload(restaurant.id)}
                                                    disabled={logoLoading === restaurant.id}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: -4,
                                                        right: -4,
                                                        width: 20,
                                                        height: 20,
                                                        background: BRAND.primary,
                                                        '&:hover': { background: BRAND.secondary },
                                                        '&.Mui-disabled': { background: BRAND.glassBorder },
                                                    }}
                                                >
                                                    {logoLoading === restaurant.id
                                                        ? <CircularProgress size={10} sx={{ color: '#fff' }} />
                                                        : <CameraAltIcon sx={{ fontSize: 12, color: '#fff' }} />
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={700}
                                                noWrap
                                                sx={{ color: '#fff', lineHeight: 1.2 }}
                                            >
                                                {restaurant.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: BRAND.textMuted }}>
                                                {restaurant.address}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={
                                                restaurant.isOpen ? (
                                                    <CheckCircleIcon sx={{ fontSize: '14px !important' }} />
                                                ) : (
                                                    <CancelIcon sx={{ fontSize: '14px !important' }} />
                                                )
                                            }
                                            label={restaurant.isOpen ? 'Ouvert' : 'Fermé'}
                                            size="small"
                                            sx={{
                                                background: restaurant.isOpen
                                                    ? 'rgba(139,226,160,0.15)'
                                                    : 'rgba(255,100,100,0.12)',
                                                color: restaurant.isOpen ? '#8BE2A0' : '#FF6464',
                                                fontWeight: 700,
                                                fontSize: '0.68rem',
                                                border: `1px solid ${restaurant.isOpen ? '#8BE2A040' : '#FF646440'}`,
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ borderColor: BRAND.glassBorder }} />

                                    {/* Adresse */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <LocationOnIcon sx={{ fontSize: 16, color: BRAND.textFaint }} />
                                        <Typography variant="body2" noWrap sx={{ color: BRAND.textMuted }}>
                                            {restaurant.address}
                                        </Typography>
                                    </Box>

                                    {/* Offres */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            background: 'rgba(255,176,103,0.07)',
                                            borderRadius: 2,
                                            px: 1.5,
                                            py: 0.75,
                                        }}
                                    >
                                        <LocalOfferIcon sx={{ fontSize: 15, color: BRAND.secondary }} />
                                        <Typography variant="body2" sx={{ color: BRAND.secondary, fontWeight: 600 }}>
                                            — offres actives
                                        </Typography>
                                    </Box>

                                    {/* Bouton Gérer */}
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        endIcon={<ArrowForwardIcon />}
                                        size="small"
                                        sx={{
                                            mt: 'auto',
                                            borderColor: BRAND.glassBorder,
                                            color: BRAND.textMuted,
                                            borderRadius: 99,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                borderColor: BRAND.primary,
                                                color: BRAND.primary,
                                            },
                                        }}
                                    >
                                        Gérer
                                    </Button>
                                </GlassPaper>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* ── Dialog création restaurant ── */}
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(24,14,8,0.97)',
                            border: `1px solid ${BRAND.glassBorder}`,
                            borderRadius: 4,
                            backdropFilter: 'blur(24px)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            color: '#fff',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <AddBusinessIcon sx={{ color: BRAND.primary }} />
                        Nouveau restaurant
                    </DialogTitle>

                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                        <FormField
                            label="Nom du restaurant *"
                            value={form.name}
                            onChange={handleChange('name')}
                            error={formErrors.name}
                            placeholder="Le Comptoir du Goût"
                        />
                        <FormField
                            label="Description *"
                            value={form.description}
                            onChange={handleChange('description')}
                            error={formErrors.description}
                            placeholder="Une courte description de votre établissement"
                            multiline
                            rows={3}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormField
                                label="Adresse *"
                                value={form.address}
                                onChange={handleChange('address')}
                                error={formErrors.address}
                                placeholder="12 rue de la Paix, Antananarivo"
                            />
                            <FormField
                                label="Téléphone"
                                value={form.phone}
                                onChange={handleChange('phone')}
                                placeholder="+261 34 00 000 00"
                            />
                        </Box>
                        <FormField
                            label="Email"
                            value={form.email}
                            onChange={handleChange('email')}
                            placeholder="contact@restaurant.mg"
                        />

                        {/* GPS */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Localisation GPS
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={gpsLoading
                                        ? <CircularProgress size={14} sx={{ color: BRAND.primary }} />
                                        : <MyLocationIcon sx={{ fontSize: 16 }} />}
                                    onClick={handleGeolocate}
                                    disabled={gpsLoading}
                                    sx={{
                                        color: BRAND.primary,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 99,
                                        border: `1px solid ${BRAND.primary}44`,
                                        '&:hover': { background: `${BRAND.primary}15` },
                                    }}
                                >
                                    {gpsLoading ? 'Localisation…' : 'Ma position'}
                                </Button>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormField
                                    label="Latitude"
                                    value={form.latitude}
                                    onChange={handleChange('latitude')}
                                    placeholder="-21.454500"
                                />
                                <FormField
                                    label="Longitude"
                                    value={form.longitude}
                                    onChange={handleChange('longitude')}
                                    placeholder="47.083300"
                                />
                            </Box>
                            {form.latitude && form.longitude && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
                                    <MyLocationIcon sx={{ fontSize: 14, color: '#8BE2A0' }} />
                                    <Typography variant="caption" sx={{ color: '#8BE2A0' }}>
                                        {parseFloat(form.latitude).toFixed(4)}°, {parseFloat(form.longitude).toFixed(4)}°
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button
                            onClick={handleDialogClose}
                            sx={{
                                color: BRAND.textMuted,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 99,
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={createLoading}
                            startIcon={
                                createLoading ? (
                                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                                ) : (
                                    <AddBusinessIcon />
                                )
                            }
                            sx={{
                                background: BRAND.gradientBtn,
                                borderRadius: 99,
                                px: 3,
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { background: BRAND.gradientBtnCta },
                                '&.Mui-disabled': { opacity: 0.5 },
                            }}
                        >
                            {createLoading ? 'Création…' : 'Créer le restaurant'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

// ─── Sous-composants locaux ───────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <GlassPaper sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: BRAND.glass,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.1 }}>
                {value}
            </Typography>
            <Typography variant="caption" sx={{ color: BRAND.textMuted }}>
                {label}
            </Typography>
        </Box>
    </GlassPaper>
);

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, onChange, error, placeholder, multiline, rows }) => (
    <TextField
        label={label}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        fullWidth
        size="small"
        variant="outlined"
        sx={{
            '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: BRAND.glassBorder },
                '&:hover fieldset': { borderColor: BRAND.primary },
                '&.Mui-focused fieldset': { borderColor: BRAND.primary },
            },
            '& .MuiInputLabel-root': { color: BRAND.textMuted },
            '& .MuiInputLabel-root.Mui-focused': { color: BRAND.primary },
            '& .MuiFormHelperText-root': { color: '#FF8A65' },
            '& input::placeholder, & textarea::placeholder': { color: BRAND.textFaint, opacity: 1 },
        }}
    />
);

export default SellerDashboardPage;
