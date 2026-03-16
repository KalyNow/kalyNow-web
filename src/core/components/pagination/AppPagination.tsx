import React from 'react';
import { Box, IconButton, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { BRAND } from '../../theme/brandTokens';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AppPaginationProps {
    /** Page courante (1-indexée) */
    page: number;
    /** Nombre total de pages */
    totalPages: number;
    /** Nombre total d'éléments (optionnel, pour affichage) */
    totalItems?: number;
    /** Nombre d'éléments par page */
    limit?: number;
    /** Valeurs proposées pour le sélecteur "éléments par page" */
    limitOptions?: number[];
    /** Callback appelé quand l'utilisateur change de page */
    onPageChange: (page: number) => void;
    /** Callback appelé quand l'utilisateur change la limite (optionnel) */
    onLimitChange?: (limit: number) => void;
}

// ─── Styles communs ───────────────────────────────────────────────────────────
const btnSx = {
    color: BRAND.textMuted,
    border: `1px solid ${BRAND.glassBorder}`,
    borderRadius: 2,
    width: 34,
    height: 34,
    '&:hover:not(:disabled)': {
        borderColor: BRAND.primary,
        color: BRAND.primary,
        background: `${BRAND.primary}18`,
    },
    '&:disabled': {
        opacity: 0.3,
        cursor: 'not-allowed',
    },
} as const;

const pageNumSx = (active: boolean) => ({
    minWidth: 34,
    height: 34,
    borderRadius: 2,
    border: `1px solid ${active ? BRAND.primary : BRAND.glassBorder}`,
    background: active ? `${BRAND.primary}22` : 'transparent',
    color: active ? BRAND.secondary : BRAND.textMuted,
    fontWeight: active ? 700 : 400,
    fontSize: '0.85rem',
    cursor: active ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    '&:hover': active ? {} : {
        borderColor: BRAND.primary,
        color: BRAND.primary,
        background: `${BRAND.primary}12`,
    },
}) as const;

// ─── Calcul des pages à afficher ─────────────────────────────────────────────
function getPageWindow(current: number, total: number, delta = 2): (number | '…')[] {
    if (total <= 1) return [];
    const range: number[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    const pages: (number | '…')[] = [1];
    if (range[0] > 2) pages.push('…');
    pages.push(...range);
    if (range[range.length - 1] < total - 1) pages.push('…');
    if (total > 1) pages.push(total);
    return pages;
}

// ─── Composant ────────────────────────────────────────────────────────────────
const AppPagination: React.FC<AppPaginationProps> = ({
    page,
    totalPages,
    totalItems,
    limit,
    limitOptions = [10, 20, 50],
    onPageChange,
    onLimitChange,
}) => {
    if (totalPages <= 1 && !onLimitChange) return null;

    const pages = getPageWindow(page, totalPages);

    const handleLimitChange = (e: SelectChangeEvent<number>) => {
        onLimitChange?.(Number(e.target.value));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mt: 4,
            }}
        >
            {/* Infos gauche */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {totalItems !== undefined && (
                    <Typography variant="body2" sx={{ color: BRAND.textMuted }}>
                        {totalItems} résultat{totalItems > 1 ? 's' : ''}
                    </Typography>
                )}
                {onLimitChange && limit !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: BRAND.textFaint, whiteSpace: 'nowrap' }}>
                            Par page :
                        </Typography>
                        <Select
                            value={limit}
                            onChange={handleLimitChange}
                            size="small"
                            variant="outlined"
                            sx={{
                                color: '#fff',
                                fontSize: '0.82rem',
                                height: 32,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.glassBorder },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.primary },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.primary },
                                '& .MuiSvgIcon-root': { color: BRAND.textMuted },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        background: 'rgba(24,14,8,0.97)',
                                        border: `1px solid ${BRAND.glassBorder}`,
                                        color: '#fff',
                                    },
                                },
                            }}
                        >
                            {limitOptions.map((opt) => (
                                <MenuItem key={opt} value={opt} sx={{ fontSize: '0.82rem' }}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                )}
            </Box>

            {/* Navigation */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/* Première page */}
                    <IconButton
                        size="small"
                        onClick={() => onPageChange(1)}
                        disabled={page === 1}
                        sx={btnSx}
                    >
                        <FirstPageIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    {/* Page précédente */}
                    <IconButton
                        size="small"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        sx={btnSx}
                    >
                        <ChevronLeftIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    {/* Numéros de pages */}
                    {pages.map((p, i) =>
                        p === '…' ? (
                            <Typography
                                key={`ellipsis-${i}`}
                                sx={{ color: BRAND.textFaint, px: 0.5, fontSize: '0.85rem', lineHeight: '34px' }}
                            >
                                …
                            </Typography>
                        ) : (
                            <Box
                                key={p}
                                onClick={() => p !== page && onPageChange(p)}
                                sx={pageNumSx(p === page)}
                            >
                                {p}
                            </Box>
                        )
                    )}

                    {/* Page suivante */}
                    <IconButton
                        size="small"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        sx={btnSx}
                    >
                        <ChevronRightIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    {/* Dernière page */}
                    <IconButton
                        size="small"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages}
                        sx={btnSx}
                    >
                        <LastPageIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default AppPagination;
