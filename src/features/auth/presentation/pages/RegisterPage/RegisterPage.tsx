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
    Chip,
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../core/store';
import { registerProvider } from '../../redux/authFeatureProvider';
import { clearError, clearSuccess } from '../../redux/authFeatureSlice';
import { BRAND } from '../../../../../core/theme/brandTokens';
import { Blob } from '../../../../../core/components/brand/BrandUI';
import logoWithText from '../../../../../core/assets/LOGos/logo-with-text.svg';

const RegisterPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector(
        (state: RootState) => state.authFeature
    );

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (success) {
            setTimeout(() => navigate('/login'), 1800);
        }
    }, [success, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSuccess());
        };
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerProvider({ firstName, lastName, email, password }));
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

    const passwordStrength = password.length === 0 ? null : password.length < 6 ? 'faible' : password.length < 10 ? 'moyen' : 'fort';
    const strengthColor = passwordStrength === 'fort' ? '#69f0ae' : passwordStrength === 'moyen' ? BRAND.secondary : '#ff5252';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: BRAND.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                py: 4,
                position: 'relative',
                overflow: 'hidden',
                '@keyframes floatY': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
            }}
        >
            {/* Blobs décoratifs */}
            <Blob sx={{ width: 400, height: 400, background: 'rgba(199,91,18,0.22)', top: -80, left: -80 }} />
            <Blob sx={{ width: 320, height: 320, background: 'rgba(255,176,103,0.12)', bottom: -60, right: -60, animationDelay: '2.5s' }} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    width: '100%',
                    maxWidth: 460,
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
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                        component="img"
                        src={logoWithText}
                        alt="KalyNow"
                        sx={{ height: 38, animation: 'floatY 5s ease-in-out infinite', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>
                        Créer un compte
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Rejoignez KalyNow — c'est gratuit et sans engagement
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2.5, background: 'rgba(211,47,47,0.15)', color: '#ff8a80', border: '1px solid rgba(211,47,47,0.3)', '& .MuiAlert-icon': { color: '#ff8a80' } }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert
                        severity="success"
                        icon={<CheckCircle />}
                        sx={{ mb: 2.5, background: 'rgba(76,175,80,0.15)', color: '#69f0ae', border: '1px solid rgba(76,175,80,0.3)', '& .MuiAlert-icon': { color: '#69f0ae' } }}
                    >
                        Compte créé ! Redirection vers la connexion…
                    </Alert>
                )}

                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Prénom"
                            fullWidth
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            sx={fieldSx}
                        />
                        <TextField
                            label="Nom"
                            fullWidth
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            sx={fieldSx}
                        />
                    </Stack>
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
                    <Box>
                        <TextField
                            label="Mot de passe"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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
                        {passwordStrength && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                    <Box sx={{ height: '100%', width: passwordStrength === 'fort' ? '100%' : passwordStrength === 'moyen' ? '60%' : '25%', background: strengthColor, borderRadius: 99, transition: 'width .3s ease, background .3s ease' }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 600, minWidth: 36 }}>{passwordStrength}</Typography>
                            </Box>
                        )}
                    </Box>
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !firstName || !lastName || !email || !password}
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
                    {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Créer mon compte'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Chip label="Sans engagement · Zéro spam" size="small"
                        sx={{ bgcolor: 'rgba(255,176,103,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 11, height: 22 }} />
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,176,103,0.15)', '&::before, &::after': { borderColor: 'rgba(255,176,103,0.15)' } }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', px: 1 }}>ou</Typography>
                </Divider>

                <Typography variant="body2" textAlign="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Déjà un compte ?{' '}
                    <Box
                        component="span"
                        onClick={() => navigate('/login')}
                        sx={{ color: BRAND.secondary, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Se connecter
                    </Box>
                </Typography>
            </Box>
        </Box>
    );
};

export default RegisterPage;
