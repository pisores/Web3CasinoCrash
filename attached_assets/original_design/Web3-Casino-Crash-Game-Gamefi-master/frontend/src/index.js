import "./polyfill";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/configStore";
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "assets/scss/style.scss";
import "assets/scss/dice.scss";
import "assets/scss/fonts.scss";
import "assets/scss/timer.scss";

const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={configureStore()}>
        <ToastContainer />
        <BrowserRouter>
            <ToastProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <App />
                </Web3ReactProvider>
            </ToastProvider>
        </BrowserRouter>
    </Provider>
);

serviceWorker.unregister();