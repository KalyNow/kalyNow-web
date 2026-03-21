import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import { APP_NAME } from '../../app/constants';
import { BRAND } from '../../core/theme/brandTokens';

interface LayoutProps {
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const Layout: React.FC<LayoutProps> = ({ children, maxWidth = 'lg' }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: BRAND.bg, color: BRAND.textStrong }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={maxWidth}>
                    {children}
                </Container>
            </Box>
            <Box
                component="footer"
                sx={{
                    py: 2,
                    px: 3,
                    mt: 'auto',
                    backgroundColor: BRAND.surfaceSoft,
                    borderTop: `1px solid ${BRAND.glassBorder}`,
                    textAlign: 'center',
                    color: BRAND.textMuted,
                    fontSize: '0.875rem',
                }}
            >
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </Box>
        </Box>
    );
};

export default Layout;
