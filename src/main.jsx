import fundebug from 'fundebug-javascript';
import React from 'react';
import ReactDOM from 'react-dom';
import './util/fix';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import createRoutes from './routes';
import fetch from './util/fetch';

fetch.init({
  hash: process.env.version,
  refreshToken: {
    invalidCode: '-5',
    url: '/refresh',
    value: '22222',
    key: 'refreshToken',
    accessTokenName: 'access_token',
  },
});

// ========================================================
// fundebug init
// ========================================================
fundebug.apikey = process.env.funDebugKey;
fundebug.appversion = process.env.version;
fundebug.user = {
  name: JSON.parse(localStorage.getItem('user') || '{}').username,
};
fundebug.releasestage = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const routes = createRoutes(store);
  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle

const RedBox = __DEV__ ? require('redbox-react').default : null;

if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

// ========================================================
// Go!
// ========================================================
render();
