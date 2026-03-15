import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Divider,
    Stack,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../core/store';
import { loginProvider } from '../../redux/authFeatureProvider';
import { clearError, clearSuccess } from '../../redux/authFeatureSlice';
import { checkAuthProvider } from '../../../../../core/redux/authSlice';
import { USER_ROLES } from '../../../../../core/constants/roles';
import { BRAND } from '../../../../../core/theme/brandTokens';
import { Blob } from '../../../../../core/components/brand/BrandUI';
import logoWithText from '../../../../../core/assets/LOGos/logo-with-text.svg';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector(
        (state: RootState) => state.authFeature
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (success) {
            // Peupler state.auth.user pour obtenir le rôle, puis rediriger
            dispatch(checkAuthProvider()).then((action) => {
                const user = (action.payload as { role?: string } | null);
                if (user?.role === USER_ROLES.SELLER) {
                    navigate('/dashboard/seller', { replace: true });
                } else if (user?.role === USER_ROLES.BUYER) {
                    navigate('/maintenance', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            });
        }
    }, [success, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSuccess());
        };
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginProvider({ email, password }));
    };

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            color: '#fff',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            '& fieldset': { borderColor: 'rgba(255,176,103,0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(255,176,103,0.5)' },
            '&.Mui-focused fieldset': { borderColor: BRAND.secondary },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
        '& .MuiInputLabel-root.Mui-focused': { color: BRAND.secondary },
        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,176,103,0.6)' },
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: BRAND.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                '@keyframes floatY': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
            }}
        >
            {/* Blobs décoratifs */}
            <Blob sx={{ width: 400, height: 400, background: 'rgba(199,91,18,0.22)', top: -100, right: -80 }} />
            <Blob sx={{ width: 300, height: 300, background: 'rgba(255,176,103,0.12)', bottom: -80, left: -60, animationDelay: '2s' }} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,176,103,0.18)',
                    borderRadius: 4,
                    p: { xs: 3.5, md: 5 },
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
            >
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                        component="img"
                        src={logoWithText}
                        alt="KalyNow"
                        sx={{ height: 38, animation: 'floatY 5s ease-in-out infinite', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </Box>

                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>
                    Bon retour
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                    Connectez-vous pour accéder à vos offres
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2.5, background: 'rgba(211,47,47,0.15)', color: '#ff8a80', border: '1px solid rgba(211,47,47,0.3)', '& .MuiAlert-icon': { color: '#ff8a80' } }}>
                        {error}
                    </Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="Adresse email"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                        sx={fieldSx}
                    />
                    <TextField
                        label="Mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(v => !v)} edge="end" sx={{ color: 'rgba(255,176,103,0.6)' }}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={fieldSx}
                    />
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !email || !password}
                    sx={{
                        mt: 3.5, mb: 1.5,
                        py: 1.5,
                        fontSize: 16,
                        fontWeight: 700,
                        borderRadius: 3,
                        background: BRAND.gradientBtn,
                        boxShadow: '0 8px 24px rgba(199,91,18,0.4)',
                        transition: 'transform .25s ease, box-shadow .25s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(199,91,18,0.55)' },
                        '&:disabled': { background: 'rgba(199,91,18,0.3)', color: 'rgba(255,255,255,0.4)' },
                    }}
                >
                    {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Se connecter'}
                </Button>

                <Divider sx={{ my: 2.5, borderColor: 'rgba(255,176,103,0.15)', '&::before, &::after': { borderColor: 'rgba(255,176,103,0.15)' } }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', px: 1 }}>ou</Typography>
                </Divider>

                <Typography variant="body2" textAlign="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Pas encore de compte ?{' '}
                    <Box
                        component="span"
                        onClick={() => navigate('/register')}
                        sx={{ color: BRAND.secondary, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Créer un compte
                    </Box>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;
