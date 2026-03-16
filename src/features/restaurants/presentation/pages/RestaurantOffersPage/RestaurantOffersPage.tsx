import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import {
    Box,
    Typography,
    Button,
    Chip,
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
    Tabs,
    Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { RootState, AppDispatch } from '../../../../../core/store';
import { getOffersProvider, createOfferProvider, updateOfferProvider, deactivateOfferProvider, activateOfferProvider, uploadOfferImageProvider } from '../../../../offers/presentation/redux/offersProvider';
import { OfferEntity, OfferStatus } from '../../../../offers/domain/entities/OfferEntity';
import { clearError, clearSuccess } from '../../../../offers/presentation/redux/offersSlice';
import { getRestaurantsProvider } from '../../redux/restaurantsProvider';
import { BRAND } from '../../../../../core/theme/brandTokens';
import { Blob } from '../../../../../core/components/brand/BrandUI';
import logoWithText from '../../../../../core/assets/LOGos/logo-with-text.svg';
import { getAssetUrl } from '../../../../../core/utils/assetUrl';
import { logoutProvider } from '../../../../../core/redux/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import AppPagination from '../../../../../core/components/pagination/AppPagination';

// ─── DateTimePicker dark-theme styles ─────────────────────────────────────────
const datePickerSx = {
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': { borderColor: BRAND.glassBorder },
        '&:hover fieldset': { borderColor: BRAND.primary },
        '&.Mui-focused fieldset': { borderColor: BRAND.primary },
    },
    '& .MuiInputLabel-root': { color: BRAND.textMuted },
    '& .MuiInputLabel-root.Mui-focused': { color: BRAND.primary },
    '& .MuiSvgIcon-root': { color: BRAND.textMuted },
};

const popperSx = {
    '& .MuiPaper-root': {
        background: BRAND.glass,
        backdropFilter: 'blur(18px)',
        border: `1px solid ${BRAND.glassBorder}`,
        borderRadius: 3,
        color: '#fff',
    },
};

const pickerPaperSx = {
    background: 'rgba(18,18,28,0.95)',
    backdropFilter: 'blur(18px)',
    border: `1px solid ${BRAND.glassBorder}`,
    borderRadius: 3,
    color: '#fff',
    '& .MuiPickersDay-root': { color: '#fff' },
    '& .MuiPickersDay-root:hover': { background: BRAND.primary + '33' },
    '& .MuiPickersDay-root.Mui-selected': { background: BRAND.primary },
    '& .MuiPickersCalendarHeader-label': { color: '#fff' },
    '& .MuiDayCalendar-weekDayLabel': { color: BRAND.textMuted },
    '& .MuiPickersArrowSwitcher-button': { color: '#fff' },
    '& .MuiClock-clock': { background: 'rgba(255,255,255,0.05)' },
    '& .MuiClockPointer-root': { background: BRAND.primary },
    '& .MuiClockNumber-root': { color: '#fff' },
};

// ─── Glass card ───────────────────────────────────────────────────────────────
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

// ─── Types formulaire ─────────────────────────────────────────────────────────
interface CreateOfferForm {
    title: string;
    description: string;
    price: string;
    discountedPrice: string;
    quantity: string;
    availableFrom: Dayjs | null;
    availableTo: Dayjs | null;
}

const emptyForm: CreateOfferForm = {
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    quantity: '',
    availableFrom: null,
    availableTo: null,
};

// ─── Page principale ──────────────────────────────────────────────────────────
const RestaurantOffersPage: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const { restaurants } = useSelector((state: RootState) => state.restaurants);
    const { offers, loading, dialogLoading, error, success } = useSelector(
        (state: RootState) => state.offers
    );

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<CreateOfferForm>(emptyForm);
    const [formErrors, setFormErrors] = useState<Partial<CreateOfferForm>>({});
    const [toggleTarget, setToggleTarget] = useState<{ id: string; isActive: boolean } | null>(null);

    // ── Dialog modification ───────────────────────────────────────────────────
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTargetId, setEditTargetId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<CreateOfferForm>(emptyForm);
    const [editFormErrors, setEditFormErrors] = useState<Partial<CreateOfferForm>>({});

    const handleOpenEdit = (offer: OfferEntity & { status: OfferStatus }) => {
        setEditTargetId(offer.id);
        setEditForm({
            title: offer.title,
            description: offer.description ?? '',
            price: String(offer.price),
            discountedPrice: offer.discountedPrice != null ? String(offer.discountedPrice) : '',
            quantity: offer.quantity != null ? String(offer.quantity) : '',
            availableFrom: offer.availableFrom ? dayjs(offer.availableFrom) : null,
            availableTo: offer.availableTo ? dayjs(offer.availableTo) : null,
        });
        setEditFormErrors({});
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setEditTargetId(null);
        setEditForm(emptyForm);
        setEditFormErrors({});
    };

    const validateEdit = (): boolean => {
        const errors: Partial<CreateOfferForm> = {};
        if (!editForm.title.trim()) errors.title = 'Le titre est requis';
        if (!editForm.price || isNaN(parseFloat(editForm.price)) || parseFloat(editForm.price) < 0)
            errors.price = 'Prix invalide';
        setEditFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditSubmit = async () => {
        if (!validateEdit() || !editTargetId) return;
        await dispatch(
            updateOfferProvider({
                id: editTargetId,
                data: {
                    title: editForm.title.trim(),
                    description: editForm.description.trim() || undefined,
                    price: parseFloat(editForm.price),
                    discountedPrice: editForm.discountedPrice ? parseFloat(editForm.discountedPrice) : undefined,
                    quantity: editForm.quantity ? parseInt(editForm.quantity, 10) : undefined,
                    availableFrom: editForm.availableFrom?.toISOString() || undefined,
                    availableTo: editForm.availableTo?.toISOString() || undefined,
                },
            })
        );
        handleEditClose();
    };

    // Upload image
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

    const restaurant = restaurants?.data.find((r) => r.id === restaurantId);

    // tab 0 = actives (activeOnly: true), tab 1 = expirées/inactives (activeOnly: false)
    const [activeTab, setActiveTab] = useState<0 | 1>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const handleTabChange = (_: React.SyntheticEvent, v: 0 | 1) => {
        setActiveTab(v);
        setCurrentPage(1);
        dispatch(getOffersProvider({
            restaurantId,
            page: 1,
            limit,
            activeOnly: v === 0,
        }));
    };

    const handlePageChange = (p: number) => {
        setCurrentPage(p);
        dispatch(getOffersProvider({ restaurantId, page: p, limit, activeOnly: activeTab === 0 }));
    };

    const handleLimitChange = (l: number) => {
        setLimit(l);
        setCurrentPage(1);
        dispatch(getOffersProvider({ restaurantId, page: 1, limit: l, activeOnly: activeTab === 0 }));
    };

    // Chargement initial
    useEffect(() => {
        if (restaurantId) {
            dispatch(getOffersProvider({ restaurantId, page: 1, limit, activeOnly: true }));
        }
        if (!restaurants) {
            dispatch(getRestaurantsProvider({ page: 1 }));
        }
    }, [dispatch, restaurantId]);

    // Nettoyage messages + rechargement
    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(clearSuccess()), 4000);
            dispatch(getOffersProvider({ restaurantId, page: currentPage, limit, activeOnly: activeTab === 0 }));
            return () => clearTimeout(t);
        }
    }, [success, dispatch, restaurantId, activeTab]);

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => dispatch(clearError()), 5000);
            return () => clearTimeout(t);
        }
    }, [error, dispatch]);

    // ── Formulaire ────────────────────────────────────────────────────────────
    const handleChange = (field: keyof CreateOfferForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const errors: Partial<CreateOfferForm> = {};
        if (!form.title.trim()) errors.title = 'Le titre est requis';
        if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
            errors.price = 'Prix invalide';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || !restaurantId) return;
        await dispatch(
            createOfferProvider({
                restaurantId,
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                price: parseFloat(form.price),
                discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : undefined,
                quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
                availableFrom: form.availableFrom?.toISOString() || undefined,
                availableTo: form.availableTo?.toISOString() || undefined,
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

    const handleToggle = async () => {
        if (!toggleTarget) return;
        if (toggleTarget.isActive) {
            await dispatch(deactivateOfferProvider(toggleTarget.id));
        } else {
            await dispatch(activateOfferProvider(toggleTarget.id));
        }
        setToggleTarget(null);
    };

    const handleImageUpload = (offerId: string) => {
        setUploadTargetId(offerId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadTargetId) {
            dispatch(uploadOfferImageProvider({ id: uploadTargetId, file }));
        }
        e.target.value = '';
        setUploadTargetId(null);
    };

    const offerList = offers?.data ?? [];
    const totalOffers = offers?.totalItems ?? offerList.length;
    const totalPages = offers?.totalPages ?? 1;
    const displayedOffers = offerList;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Input file caché */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <Box sx={{ minHeight: '100vh', background: BRAND.bg, overflowX: 'hidden', position: 'relative' }}>
                <Blob sx={{ width: 520, height: 520, top: -160, left: -160, opacity: 0.18, background: BRAND.primary }} />
                <Blob sx={{ width: 400, height: 400, bottom: -100, right: -100, opacity: 0.13, background: BRAND.secondary }} />

                {/* ── Header ── */}
                <Box
                    sx={{
                        position: 'sticky', top: 0, zIndex: 100,
                        backdropFilter: 'blur(16px)',
                        background: 'rgba(18,10,6,0.75)',
                        borderBottom: `1px solid ${BRAND.glassBorder}`,
                        px: { xs: 2, md: 5 }, py: 1.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton onClick={() => navigate('/dashboard/seller')} size="small" sx={{ color: BRAND.textMuted }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box component="img" src={logoWithText} alt="KalyNow" sx={{ height: 36 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: BRAND.textMuted, display: { xs: 'none', sm: 'block' } }}>
                            {user?.email}
                        </Typography>
                        <Tooltip title="Se déconnecter">
                            <IconButton onClick={() => dispatch(logoutProvider())} size="small" sx={{ color: BRAND.textMuted }}>
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* ── Contenu ── */}
                <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>

                    {/* Titre */}
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h4" fontWeight={800} sx={{ background: BRAND.shimmer, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
                            {restaurant?.name ?? 'Gestion des offres'}
                        </Typography>
                        <Typography variant="body1" sx={{ color: BRAND.textMuted }}>
                            Gérez les offres anti-gaspillage de ce restaurant.
                        </Typography>
                    </Box>

                    {/* Alertes */}
                    {error && (
                        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 3 }}>{error}</Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => dispatch(clearSuccess())} sx={{ mb: 3 }}>{success}</Alert>
                    )}

                    {/* En-tête section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                            Mes offres{totalOffers > 0 ? ` (${totalOffers})` : ''}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                            sx={{
                                background: BRAND.gradientBtn, borderRadius: 99, px: 3, py: 1,
                                fontWeight: 700, textTransform: 'none',
                                boxShadow: `0 4px 24px ${BRAND.primary}44`,
                                '&:hover': { background: BRAND.gradientBtnCta },
                            }}
                        >
                            Nouvelle offre
                        </Button>
                    </Box>

                    {/* Onglets actives / expirées */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            mb: 3, mt: 2,
                            '& .MuiTabs-indicator': { background: BRAND.primary },
                            '& .MuiTab-root': { color: BRAND.textMuted, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
                            '& .MuiTab-root.Mui-selected': { color: '#fff' },
                            borderBottom: `1px solid ${BRAND.glassBorder}`,
                        }}
                    >
                        <Tab label="Actives" />
                        <Tab label="Expirées / Inactives" />
                    </Tabs>

                    {/* Loader */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: BRAND.primary }} />
                        </Box>
                    )}

                    {/* État vide */}
                    {!loading && displayedOffers.length === 0 && (
                        <GlassPaper sx={{ py: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <LocalOfferIcon sx={{ fontSize: 56, color: BRAND.textFaint }} />
                            <Typography variant="h6" sx={{ color: BRAND.textMuted }} fontWeight={600}>
                                {activeTab === 0 ? 'Aucune offre active' : 'Aucune offre expirée'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: BRAND.textFaint, maxWidth: 320 }}>
                                {activeTab === 0
                                    ? 'Créez votre première offre anti-gaspillage pour attirer des clients.'
                                    : 'Les offres passées ou désactivées apparaîtront ici.'}
                            </Typography>
                            {activeTab === 0 && (
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setDialogOpen(true)}
                                    sx={{
                                        mt: 1, borderColor: BRAND.primary, color: BRAND.primary,
                                        borderRadius: 99, textTransform: 'none', fontWeight: 700,
                                        '&:hover': { borderColor: BRAND.secondary, color: BRAND.secondary },
                                    }}
                                >
                                    Créer ma première offre
                                </Button>
                            )}
                        </GlassPaper>
                    )}

                    {/* Grille offres */}
                    {!loading && displayedOffers.length > 0 && (
                        <>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                                {displayedOffers.map((offer) => (
                                    <GlassPaper
                                        key={offer.id}
                                        sx={{
                                            display: 'flex', flexDirection: 'column', gap: 1.5,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${BRAND.primary}33` },
                                        }}
                                    >
                                        {/* Image */}
                                        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 120, background: 'rgba(255,255,255,0.04)' }}>
                                            {offer.imageUrls?.[0] ? (
                                                <Box
                                                    component="img"
                                                    src={getAssetUrl(offer.imageUrls[0]) ?? offer.imageUrls[0]}
                                                    alt={offer.title}
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                    <LocalOfferIcon sx={{ fontSize: 40, color: BRAND.textFaint }} />
                                                </Box>
                                            )}
                                            <Tooltip title="Ajouter une photo">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleImageUpload(offer.id)}
                                                    sx={{
                                                        position: 'absolute', bottom: 6, right: 6,
                                                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                                                        '&:hover': { background: BRAND.primary },
                                                    }}
                                                >
                                                    <CameraAltIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                        {/* Titre + statut */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.3 }}>
                                                {offer.title}
                                            </Typography>
                                            {offer.status === OfferStatus.ACTIVE && (
                                                <Chip
                                                    icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
                                                    label="Active"
                                                    size="small"
                                                    sx={{
                                                        flexShrink: 0,
                                                        background: 'rgba(139,226,160,0.15)',
                                                        color: '#8BE2A0',
                                                        fontWeight: 700, fontSize: '0.65rem',
                                                        border: '1px solid #8BE2A040',
                                                    }}
                                                />
                                            )}
                                            {offer.status === OfferStatus.EXPIRED && (
                                                <Chip
                                                    icon={<CancelIcon sx={{ fontSize: '13px !important' }} />}
                                                    label="Expirée"
                                                    size="small"
                                                    sx={{
                                                        flexShrink: 0,
                                                        background: 'rgba(255,160,50,0.15)',
                                                        color: '#FFA032',
                                                        fontWeight: 700, fontSize: '0.65rem',
                                                        border: '1px solid #FFA03240',
                                                    }}
                                                />
                                            )}
                                            {offer.status === OfferStatus.INACTIVE && (
                                                <Chip
                                                    icon={<CancelIcon sx={{ fontSize: '13px !important' }} />}
                                                    label="Inactive"
                                                    size="small"
                                                    sx={{
                                                        flexShrink: 0,
                                                        background: 'rgba(255,100,100,0.12)',
                                                        color: '#FF6464',
                                                        fontWeight: 700, fontSize: '0.65rem',
                                                        border: '1px solid #FF646440',
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Description */}
                                        {offer.description && (
                                            <Typography variant="body2" sx={{ color: BRAND.textMuted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {offer.description}
                                            </Typography>
                                        )}

                                        <Divider sx={{ borderColor: BRAND.glassBorder }} />

                                        {/* Prix */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {offer.discountedPrice != null ? (
                                                <>
                                                    <Typography variant="h6" fontWeight={800} sx={{ color: BRAND.secondary }}>
                                                        {offer.discountedPrice.toLocaleString()} Ar
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: BRAND.textFaint, textDecoration: 'line-through' }}>
                                                        {offer.price.toLocaleString()} Ar
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>
                                                    {offer.price.toLocaleString()} Ar
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Disponibilité */}
                                        {offer.availableFrom && offer.availableTo && (
                                            <Typography variant="caption" sx={{ color: BRAND.textFaint }}>
                                                {new Date(offer.availableFrom).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                {' \u2013 '}
                                                {new Date(offer.availableTo).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        )}

                                        {/* Quantité */}
                                        {offer.quantity != null && (
                                            <Typography variant="caption" sx={{ color: BRAND.textMuted }}>
                                                Quantité : <strong style={{ color: '#fff' }}>{offer.quantity}</strong>
                                            </Typography>
                                        )}

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                                onClick={() => handleOpenEdit(offer)}
                                                disabled={offer.status !== OfferStatus.ACTIVE}
                                                sx={{
                                                    borderColor: BRAND.glassBorder, color: BRAND.textMuted,
                                                    borderRadius: 99, textTransform: 'none', fontWeight: 600,
                                                    '&:hover': { borderColor: BRAND.primary, color: BRAND.primary },
                                                    '&.Mui-disabled': { opacity: 0.35, borderColor: BRAND.glassBorder, color: BRAND.textFaint },
                                                }}
                                            >
                                                {offer.status === OfferStatus.EXPIRED ? 'Expirée' : offer.status === OfferStatus.INACTIVE ? 'Inactive' : 'Modifier'}
                                            </Button>
                                            <Tooltip title={
                                                offer.status === OfferStatus.EXPIRED ? 'Offre expirée' :
                                                    offer.status === OfferStatus.ACTIVE ? 'Désactiver' : 'Réactiver'
                                            }>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={offer.status === OfferStatus.EXPIRED}
                                                        onClick={() => setToggleTarget({ id: offer.id, isActive: offer.isActive })}
                                                        sx={offer.status === OfferStatus.ACTIVE ? {
                                                            border: `1px solid rgba(255,100,100,0.3)`, color: '#FF6464',
                                                            borderRadius: 2,
                                                            '&:hover': { background: 'rgba(255,100,100,0.1)' },
                                                            '&.Mui-disabled': { opacity: 0.3, border: `1px solid ${BRAND.glassBorder}`, color: BRAND.textFaint },
                                                        } : {
                                                            border: `1px solid rgba(139,226,160,0.3)`, color: '#8BE2A0',
                                                            borderRadius: 2,
                                                            '&:hover': { background: 'rgba(139,226,160,0.1)' },
                                                            '&.Mui-disabled': { opacity: 0.3, border: `1px solid ${BRAND.glassBorder}`, color: BRAND.textFaint },
                                                        }}
                                                    >
                                                        {offer.status === OfferStatus.ACTIVE
                                                            ? <CancelIcon sx={{ fontSize: 16 }} />
                                                            : <CheckCircleIcon sx={{ fontSize: 16 }} />}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </GlassPaper>
                                ))}
                            </Box>
                            <AppPagination
                                page={currentPage}
                                totalPages={totalPages}
                                totalItems={totalOffers}
                                limit={limit}
                                limitOptions={[10, 20, 50]}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                            />
                        </>
                    )}
                </Box>

                {/* ── Dialog création offre ── */}
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
                    <DialogTitle sx={{ color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon sx={{ color: BRAND.primary }} />
                        Nouvelle offre
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                        <FormField label="Titre *" value={form.title} onChange={handleChange('title')} error={formErrors.title} placeholder="Menu déjeuner — 3 plats" />
                        <FormField label="Description" value={form.description} onChange={handleChange('description')} placeholder="Entrée + plat + dessert au choix" multiline rows={3} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormField label="Prix original (Ar) *" value={form.price} onChange={handleChange('price')} error={formErrors.price} placeholder="18000" />
                            <FormField label="Prix réduit (Ar)" value={form.discountedPrice} onChange={handleChange('discountedPrice')} placeholder="9000" />
                        </Box>
                        <FormField label="Quantité disponible" value={form.quantity} onChange={handleChange('quantity')} placeholder="Ex: 10 (vide = illimitée)" />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <DateTimePicker
                                    label="Disponible dès"
                                    value={form.availableFrom}
                                    onChange={(v) => setForm((p) => ({ ...p, availableFrom: v }))}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            sx: datePickerSx,
                                        },
                                        popper: { sx: popperSx },
                                        desktopPaper: { sx: pickerPaperSx },
                                    }}
                                />
                                <DateTimePicker
                                    label="Jusqu'à"
                                    value={form.availableTo}
                                    onChange={(v) => setForm((p) => ({ ...p, availableTo: v }))}
                                    minDateTime={form.availableFrom ?? undefined}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            sx: datePickerSx,
                                        },
                                        popper: { sx: popperSx },
                                        desktopPaper: { sx: pickerPaperSx },
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button onClick={handleDialogClose} sx={{ color: BRAND.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: 99 }}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={dialogLoading}
                            startIcon={dialogLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <AddIcon />}
                            sx={{
                                background: BRAND.gradientBtn, borderRadius: 99, px: 3,
                                fontWeight: 700, textTransform: 'none',
                                '&:hover': { background: BRAND.gradientBtnCta },
                                '&.Mui-disabled': { opacity: 0.5 },
                            }}
                        >
                            {dialogLoading ? 'Création…' : "Créer l'offre"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ── Dialog modification offre ── */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditClose}
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
                    <DialogTitle sx={{ color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon sx={{ color: BRAND.primary }} />
                        Modifier l'offre
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                        <FormField label="Titre *" value={editForm.title} onChange={(e) => { setEditForm(p => ({ ...p, title: e.target.value })); if (editFormErrors.title) setEditFormErrors(p => ({ ...p, title: undefined })); }} error={editFormErrors.title} placeholder="Menu déjeuner — 3 plats" />
                        <FormField label="Description" value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} placeholder="Entrée + plat + dessert au choix" multiline rows={3} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormField label="Prix original (Ar) *" value={editForm.price} onChange={(e) => { setEditForm(p => ({ ...p, price: e.target.value })); if (editFormErrors.price) setEditFormErrors(p => ({ ...p, price: undefined })); }} error={editFormErrors.price} placeholder="18000" />
                            <FormField label="Prix réduit (Ar)" value={editForm.discountedPrice} onChange={(e) => setEditForm(p => ({ ...p, discountedPrice: e.target.value }))} placeholder="9000" />
                        </Box>
                        <FormField label="Quantité disponible" value={editForm.quantity} onChange={(e) => setEditForm(p => ({ ...p, quantity: e.target.value }))} placeholder="Ex: 10 (vide = illimitée)" />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <DateTimePicker
                                    label="Disponible dès"
                                    value={editForm.availableFrom}
                                    onChange={(v) => setEditForm(p => ({ ...p, availableFrom: v }))}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: datePickerSx }, popper: { sx: popperSx }, desktopPaper: { sx: pickerPaperSx } }}
                                />
                                <DateTimePicker
                                    label="Jusqu'à"
                                    value={editForm.availableTo}
                                    onChange={(v) => setEditForm(p => ({ ...p, availableTo: v }))}
                                    minDateTime={editForm.availableFrom ?? undefined}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: datePickerSx }, popper: { sx: popperSx }, desktopPaper: { sx: pickerPaperSx } }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button onClick={handleEditClose} sx={{ color: BRAND.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: 99 }}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            variant="contained"
                            disabled={dialogLoading}
                            startIcon={dialogLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <EditIcon />}
                            sx={{
                                background: BRAND.gradientBtn, borderRadius: 99, px: 3,
                                fontWeight: 700, textTransform: 'none',
                                '&:hover': { background: BRAND.gradientBtnCta },
                                '&.Mui-disabled': { opacity: 0.5 },
                            }}
                        >
                            {dialogLoading ? 'Enregistrement…' : 'Enregistrer'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ── Dialog confirmation désactivation / réactivation ── */}
                <Dialog
                    open={!!toggleTarget}
                    onClose={() => setToggleTarget(null)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(24,14,8,0.97)',
                            border: `1px solid ${toggleTarget?.isActive ? 'rgba(255,100,100,0.3)' : 'rgba(139,226,160,0.3)'}`,
                            borderRadius: 4,
                        },
                    }}
                >
                    <DialogTitle sx={{ color: '#fff', fontWeight: 800 }}>
                        {toggleTarget?.isActive ? "Désactiver l'offre ?" : "Réactiver l'offre ?"}
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ color: BRAND.textMuted }}>
                            {toggleTarget?.isActive
                                ? "L'offre ne sera plus visible par les clients tant qu'elle reste inactive."
                                : "L'offre sera à nouveau visible par les clients."}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button onClick={() => setToggleTarget(null)} sx={{ color: BRAND.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: 99 }}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleToggle}
                            variant="contained"
                            disabled={dialogLoading}
                            sx={toggleTarget?.isActive ? {
                                background: '#C0392B', borderRadius: 99, px: 3,
                                fontWeight: 700, textTransform: 'none',
                                '&:hover': { background: '#E74C3C' },
                                '&.Mui-disabled': { opacity: 0.5 },
                            } : {
                                background: 'linear-gradient(135deg,#27AE60,#2ECC71)', borderRadius: 99, px: 3,
                                fontWeight: 700, textTransform: 'none',
                                '&:hover': { background: '#27AE60' },
                                '&.Mui-disabled': { opacity: 0.5 },
                            }}
                        >
                            {dialogLoading
                                ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                                : toggleTarget?.isActive ? 'Désactiver' : 'Réactiver'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

// ─── FormField local ──────────────────────────────────────────────────────────
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
        label={label} value={value} onChange={onChange}
        error={!!error} helperText={error} placeholder={placeholder}
        multiline={multiline} rows={rows} fullWidth size="small" variant="outlined"
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

export default RestaurantOffersPage;
