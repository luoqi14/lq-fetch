import config from '../config.json';

/*
* get url prefix according to the env, default development
* */
export const getBaseUrl = () => {
  const address = config.apiAddress;
  let env = 'development';
  if (__MOCK__) {
    return location.origin;
  }

  if (__DEV__) {
    env = 'development';
  } else if (__PROD__) {
    env = 'production';
  } else if (__UAT__) {
    env = 'uat';
  } else if (__DEVREMOTE__) {
    env = 'devRemote';
  } else if (__RELEASE__) { // for QA
    env = 'release';
  }

  return address[env];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}
