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
            <AppBar position="sticky" elevation={1}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
                        onClick={() => handleNavigate('/')}
                    >
                        KalyNow
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
                                    color="inherit"
                                    onClick={() => handleNavigate(link.path)}
                                    sx={{
                                        fontWeight: location.pathname === link.path ? 700 : 400,
                                        textDecoration: location.pathname === link.path ? 'underline' : 'none',
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => handleNavigate('/login')}
                                sx={{ ml: 2 }}
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
            >
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {navLinks.map((link) => (
                            <ListItem key={link.path} disablePadding>
                                <ListItemButton onClick={() => handleNavigate(link.path)}>
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate('/login')}>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
