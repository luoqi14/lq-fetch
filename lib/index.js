'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable no-use-before-define,consistent-return,no-param-reassign */


require('whatwg-fetch');

var oldFetch = fetch;
var config = {};
var tokenInvalid = false;

var judgeTokenInvalid = function judgeTokenInvalid(_ref) {
  var invalidCode = _ref.invalidCode,
      responseCode = _ref.responseCode;

  if (typeof invalidCode === 'string') {
    // 若 invalidCode 为字符串
    return responseCode === invalidCode;
  } else if (typeof invalidCode === 'function') {
    // 若 invalidCode 为方法
    return invalidCode(responseCode);
  } else if ((typeof invalidCode === 'undefined' ? 'undefined' : _typeof(invalidCode)) === 'object' && invalidCode.constructor === Array) {
    // 若 invalidCode 为数组
    return invalidCode.findIndex(function (code) {
      return code === responseCode;
    }) > -1;
  }
  return false;
};

var newFetch = function newFetch(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var baseUrl = config.baseUrl,
      _config$headers = config.headers,
      headers = _config$headers === undefined ? {} : _config$headers,
      addAuth = config.addAuth,
      authName = config.authName,
      monitor = config.monitor,
      hash = config.hash,
      resProps = config.resProps,
      refreshToken = config.refreshToken;

  var shouldBaseUrl = url.indexOf('//') === -1 && url.indexOf('http://') === -1 && url.indexOf('https://') === -1;

  var createOpts = function createOpts(data, token) {
    var defaultOpts = {
      method: 'POST',
      mode: 'cors',
      headers: headers
    };

    var newOpts = _extends({}, defaultOpts);

    if (addAuth) {
      newOpts.headers[authName] = token || addAuth();
    }

    newOpts = _extends({}, defaultOpts, opts, {
      headers: _extends({}, defaultOpts.headers, opts.headers || {})
    });

    if (!newOpts.headers['Content-Type']) {
      newOpts.headers['Content-Type'] = 'application/json';
    }

    if (newOpts.method === 'POST') {
      if (newOpts.headers['Content-Type'] === 'x-www-form-urlencoded') {
        var formData = new FormData();
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          formData.append(key, data[key]);
        });
        newOpts.body = formData;
      } else if (newOpts.headers['Content-Type'] === 'multipart/form-data') {
        var _formData = new FormData();
        var _keys = Object.keys(data);
        _keys.forEach(function (key) {
          _formData.append(key, data[key]);
        });
        newOpts.body = _formData;
        delete newOpts.headers['Content-Type'];
      } else {
        newOpts.body = JSON.stringify(data, function (k, v) {
          if (v === undefined) {
            return null;
          }
          return v;
        });
      }
    }

    if (newOpts.method.toUpperCase() === 'GET' && hash) {
      url = '' + url + (url.indexOf('?') > -1 ? '&' : '?') + 'v=' + hash;
    }

    return newOpts;
  };

  var errorHandler = function errorHandler(errorRes) {
    var returnObj = {};
    var resultCode = resProps.resultCode,
        resultDesc = resProps.resultDesc;

    returnObj[resultCode] = '-1';
    returnObj[resultDesc] = errorRes.status + ' ' + errorRes.statusText;
    return returnObj;
  };

  monitor.start();

  return new Promise(function (resolve) {
    oldFetch(shouldBaseUrl ? baseUrl + url : url, createOpts(params)).then(function (res) {
      if (res.status < 200 || res.status >= 300) {
        monitor.error(res);
        resolve(errorHandler(res));
      }
      monitor.end(res);

      return res.headers.get('content-type').indexOf('application/json') > -1 ? res.json() : res.blob();
    }).then(function (json) {
      // token date out, request the refresh token
      if (judgeTokenInvalid({
        invalidCode: refreshToken.invalidCode,
        responseCode: json[resProps.resultCode]
      }) && refreshToken.getValue && !tokenInvalid) {
        tokenInvalid = true;
        var tokenParam = {};
        tokenParam[refreshToken.key] = refreshToken.getValue();
        refreshToken.beforeRefresh();
        oldFetch(refreshToken.url, createOpts(tokenParam)).then(function (refreshRes) {
          if (refreshRes.status < 200 || refreshRes.status >= 300) {
            tokenInvalid = false;
            monitor.error(refreshRes);
            resolve(errorHandler(refreshRes));
          }
          return refreshRes.json();
        }).then(function (tokenRes) {
          tokenInvalid = false;
          refreshToken.afterRefresh(tokenRes);
          // user center the result data is resultData
          var token = (tokenRes.resultData || {})[refreshToken.tokenName];
          if (token) {
            oldFetch(shouldBaseUrl ? baseUrl + url : url, createOpts(params, token)).then(function (newRes) {
              if (newRes.status < 200 || newRes.status >= 300) {
                monitor.error(newRes);
                resolve(errorHandler(newRes));
              }
              resolve(newRes.headers.get('content-type').indexOf('application/json') > -1 ? newRes.json() : newRes.blob());
            });
          } else {
            var returnObj = {};
            var resultCode = resProps.resultCode,
                resultDesc = resProps.resultDesc;

            returnObj[resultCode] = '-1000';
            returnObj[resultDesc] = '会话失效，请重新登录';
            resolve(returnObj);
          }
        });
      } else if (judgeTokenInvalid({
        invalidCode: refreshToken.invalidCode,
        responseCode: json[resProps.resultCode]
      }) && refreshToken.getValue && tokenInvalid) {
        var timer = setInterval(function () {
          if (!tokenInvalid) {
            clearInterval(timer);
            oldFetch(shouldBaseUrl ? baseUrl + url : url, createOpts(params)).then(function (res) {
              if (res.status < 200 || res.status >= 300) {
                monitor.error(res);
                resolve(errorHandler(res));
              }
              monitor.end(res);

              resolve(res.headers.get('content-type').indexOf('application/json') > -1 ? res.json() : res.blob());
            });
          }
        }, 500);
      } else {
        resolve(json);
      }
    }).catch(function (e) {
      monitor.error(e);
      var returnObj = {};
      var resultCode = resProps.resultCode,
          resultDesc = resProps.resultDesc;

      returnObj[resultCode] = '-1';
      returnObj[resultDesc] = '网络异常，请重试';
      resolve(returnObj);
    });
  });
};

newFetch.init = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var keys = Object.keys(opts);
  keys.forEach(function (key) {
    if (_typeof(opts[key]) === 'object') {
      var subKeys = Object.keys(opts[key]);
      subKeys.forEach(function (subKey) {
        if (!config[key]) {
          config[key] = {};
        }
        config[key][subKey] = opts[key][subKey];
      });
    } else {
      config[key] = opts[key];
    }
  });
};

newFetch.init({
  headers: {},
  baseUrl: '',
  addAuth: undefined,
  authName: 'Authorization',
  monitor: {
    start: function start() {},
    end: function end() {},
    error: function error() {}
  },
  hash: '',
  resProps: {
    resultCode: 'resultCode',
    resultDesc: 'resultDesc',
    resultData: 'resultData'
  },
  refreshToken: {
    invalidCode: '',
    url: '',
    getValue: undefined,
    tokenName: 'access_token',
    key: 'refreshToken',
    beforeRefresh: function beforeRefresh() {},
    afterRefresh: function afterRefresh() {}
  }
});

exports.default = newFetch;