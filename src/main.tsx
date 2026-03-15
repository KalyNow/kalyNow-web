import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './core/store'
import App from './app/App'
import { initializeApp } from './core/init'
import './core/index.scss'

// Initialise Axios interceptors + dispatche checkAuthProvider
initializeApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
