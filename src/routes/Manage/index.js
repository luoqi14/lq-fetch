/* eslint-disable import/no-dynamic-require */
import { injectReducer } from '../../store/reducers';
import CoreLayout from '../../layouts/CoreLayout';
import Home from '../Home';
import SearchList from './SearchList';
import { common } from '../../store/common';

const createRoutes = (store) => ({
  path        : '/Manage',
  component   : CoreLayout,
  indexRoute  : Home,
  onEnter: (opts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    SearchList(store),
  ],
});

export function createChildRoutes(moduleName, id) {
  let path = moduleName;
  if (id) {
    path += `/:${id}`;
  }
  return (store) => ({
    path,
    onEnter: (opts, replace, next) => {
      store.dispatch(common.initMenu());
      next();
    },
    onLeave: () => {
    },
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const container = require(`./${moduleName}/containers/index`).default;
        const reducer = require(`./${moduleName}/modules/index`).default;
        injectReducer(store, { key: moduleName, reducer });
        cb(null, container);
      });
    },
  });
}

export default createRoutes;
