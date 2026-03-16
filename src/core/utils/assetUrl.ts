/**
 * Construit l'URL complète d'un asset stocké dans RustFS.
 *
 * Le backend stocke le chemin sous la forme :
 *   /kalynow-assets/restaurants/logos/uuid.png
 *
 * En dev  (VITE_API_BASE_URL = '') : le proxy Vite /as/* forward vers kalynow.mg
 * En prod (VITE_API_BASE_URL = 'http://kalynow.mg') : URL directe
 *
 * Résultat : <base>/api/as/kalynow-assets/restaurants/logos/uuid.png
 */
export function getAssetUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    // path commence toujours par '/' (ex: /kalynow-assets/...)
    return `${base}/api/as${path}`;
}
