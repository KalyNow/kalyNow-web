import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../features/users/presentation/redux/usersSlice';
import { authReducer } from './redux/authSlice';
import { authFeatureReducer } from '../features/auth/presentation/redux/authFeatureSlice';
import { restaurantsReducer } from '../features/restaurants/presentation/redux/restaurantsSlice';
import { offersReducer } from '../features/offers/presentation/redux/offersSlice';

export const store = configureStore({
    reducer: {
        users: usersReducer,
        auth: authReducer,
        authFeature: authFeatureReducer,
        restaurants: restaurantsReducer,
        offers: offersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
