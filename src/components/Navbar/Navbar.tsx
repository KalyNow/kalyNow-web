import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../app/constants';
import { BRAND } from '../../core/theme/brandTokens';

interface NavLink {
    label: string;
    path: string;
}

const navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Offers', path: '/offers' },
];

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'rgba(13,10,8,0.40)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${BRAND.glassBorder}`,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 800, color: BRAND.textStrong }}
                        onClick={() => handleNavigate('/')}
                    >
                        {APP_NAME}
                    </Typography>

                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="menu"
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.path}
                                    onClick={() => handleNavigate(link.path)}
                                    sx={{
                                        color: location.pathname === link.path ? BRAND.textStrong : BRAND.textMuted,
                                        fontWeight: location.pathname === link.path ? 700 : 400,
                                        textDecoration: location.pathname === link.path ? 'underline' : 'none',
                                        textUnderlineOffset: '6px',
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={() => handleNavigate('/login')}
                                sx={{ ml: 2, color: BRAND.secondary, borderColor: BRAND.glassBorder, '&:hover': { borderColor: BRAND.secondary, background: 'rgba(255,176,103,0.08)' } }}
                            >
                                Login
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 250,
                        background: BRAND.surfaceStrong,
                        color: BRAND.textStrong,
                        borderLeft: `1px solid ${BRAND.glassBorder}`,
                    },
                }}
            >
                <Box role="presentation">
                    <List>
                        {navLinks.map((link) => (
                            <ListItem key={link.path} disablePadding>
                                <ListItemButton onClick={() => handleNavigate(link.path)}>
                                    <ListItemText primary={link.label} primaryTypographyProps={{ sx: { color: BRAND.textStrong } }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate('/login')}>
                                <ListItemText primary="Login" primaryTypographyProps={{ sx: { color: BRAND.secondary } }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
