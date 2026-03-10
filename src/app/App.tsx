import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../core/store';
import { checkAuthProvider } from '../core/redux/authSlice';
import AppRoutes from '../core/routes';

/**
 * Root App component.
 * Handles app-level initialization (auth check, global effects).
 */
const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuthProvider());
    }, [dispatch]);

    return <AppRoutes />;
};

export default App;
