(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch'), require('xmldom')) :
  typeof define === 'function' && define.amd ? define(['node-fetch', 'xmldom'], factory) :
  (global = global || self, global.ia = factory(global.fetch, global.xmldom));
}(this, (function (fetch, xmldom) { 'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var fetchJsonp = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    {
      factory(exports, module);
    }
  })(commonjsGlobal, function (exports, module) {

    var defaultOptions = {
      timeout: 5000,
      jsonpCallback: 'callback',
      jsonpCallbackFunction: null
    };

    function generateCallbackFunction() {
      return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
    }

    function clearFunction(functionName) {
      // IE8 throws an exception when you try to delete a property on window
      // http://stackoverflow.com/a/1824228/751089
      try {
        delete window[functionName];
      } catch (e) {
        window[functionName] = undefined;
      }
    }

    function removeScript(scriptId) {
      var script = document.getElementById(scriptId);

      if (script) {
        document.getElementsByTagName('head')[0].removeChild(script);
      }
    }

    function fetchJsonp(_url) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1]; // to avoid param reassign

      var url = _url;
      var timeout = options.timeout || defaultOptions.timeout;
      var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;
      var timeoutId = undefined;
      return new Promise(function (resolve, reject) {
        var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
        var scriptId = jsonpCallback + '_' + callbackFunction;

        window[callbackFunction] = function (response) {
          resolve({
            ok: true,
            // keep consistent with fetch API
            json: function json() {
              return Promise.resolve(response);
            }
          });
          if (timeoutId) clearTimeout(timeoutId);
          removeScript(scriptId);
          clearFunction(callbackFunction);
        }; // Check if the user set their own params, and if not add a ? to start a list of params


        url += url.indexOf('?') === -1 ? '?' : '&';
        var jsonpScript = document.createElement('script');
        jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);

        if (options.charset) {
          jsonpScript.setAttribute('charset', options.charset);
        }

        jsonpScript.id = scriptId;
        document.getElementsByTagName('head')[0].appendChild(jsonpScript);
        timeoutId = setTimeout(function () {
          reject(new Error('JSONP request to ' + _url + ' timed out'));
          clearFunction(callbackFunction);
          removeScript(scriptId);

          window[callbackFunction] = function () {
            clearFunction(callbackFunction);
          };
        }, timeout); // Caught if got 404/500

        jsonpScript.onerror = function () {
          reject(new Error('JSONP request to ' + _url + ' failed'));
          clearFunction(callbackFunction);
          removeScript(scriptId);
          if (timeoutId) clearTimeout(timeoutId);
        };
      });
    } // export as global function

    /*
    let local;
    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }
    local.fetchJsonp = fetchJsonp;
    */


    module.exports = fetchJsonp;
  });
  });

  var CORS_PROXY = "https://iajs-cors.rchrd2.workers.dev";
  var enc = encodeURIComponent;

  var paramify = function paramify(obj) {
    return new URLSearchParams(obj).toString();
  };

  var str2arr = function str2arr(v) {
    return Array.isArray(v) ? v : [v];
  };

  var isInBrowser = function isInBrowser() {
    return !(typeof window === "undefined");
  };

  var corsWorkAround = function corsWorkAround(url) {
    if (isInBrowser()) {
      return "".concat(CORS_PROXY, "/").concat(url);
    } else {
      return url;
    }
  };

  var fetchJson = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, options) {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(url, options);

            case 2:
              res = _context.sent;
              _context.next = 5;
              return res.json();

            case 5:
              return _context.abrupt("return", _context.sent);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetchJson(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var authToHeaderS3 = function authToHeaderS3(auth) {
    return auth.values.s3.access && auth.values.s3.secret ? {
      Authorization: "LOW ".concat(auth.values.s3.access, ":").concat(auth.values.s3.secret)
    } : {};
  };

  var authToHeaderCookies = function authToHeaderCookies(auth) {
    if (auth.values.cookies["logged-in-sig"] && auth.values.cookies["logged-in-user"]) {
      var cookieStr = "logged-in-sig=".concat(auth.values.cookies["logged-in-sig"], ";");
      cookieStr += " logged-in-user=".concat(auth.values.cookies["logged-in-user"]);
      var headers = {
        Cookie: cookieStr
      };

      if (isInBrowser()) {
        headers["X-Cookie-Cors"] = cookieStr;
      }

      return headers;
    } else {
      return {};
    }
  };

  var newEmptyAuth = function newEmptyAuth() {
    return JSON.parse(JSON.stringify({
      success: false,
      values: {
        cookies: {
          "logged-in-sig": null,
          "logged-in-user": null
        },
        email: null,
        itemname: null,
        s3: {
          access: null,
          secret: null
        },
        screenname: null
      },
      version: 1
    }));
  };

  var Auth = /*#__PURE__*/function () {
    function Auth() {
      _classCallCheck(this, Auth);

      this.XAUTH_BASE = corsWorkAround("https://archive.org/services/xauthn/");
    }

    _createClass(Auth, [{
      key: "login",
      value: function () {
        var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email, password) {
          var fetchOptions, response, data;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  fetchOptions = {
                    method: "POST",
                    body: "email=".concat(enc(email), "&password=").concat(enc(password)),
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  };
                  _context2.next = 4;
                  return fetch("".concat(this.XAUTH_BASE, "?op=login"), fetchOptions);

                case 4:
                  response = _context2.sent;
                  _context2.next = 7;
                  return response.json();

                case 7:
                  data = _context2.sent;

                  if (!data.success) {
                    data.values = _objectSpread2(_objectSpread2({}, data.values), newEmptyAuth().values);
                  }

                  return _context2.abrupt("return", data);

                case 12:
                  _context2.prev = 12;
                  _context2.t0 = _context2["catch"](0);
                  return _context2.abrupt("return", newEmptyAuth());

                case 15:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[0, 12]]);
        }));

        function login(_x3, _x4) {
          return _login.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "fromS3",
      value: function () {
        var _fromS = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(access, secret) {
          var newAuth,
              info,
              _args3 = arguments;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  newAuth = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : newEmptyAuth();
                  newAuth.success = 1;
                  newAuth.values.s3.access = access;
                  newAuth.values.s3.secret = secret;
                  _context3.next = 6;
                  return fetchJson("https://s3.us.archive.org?check_auth=1", {
                    headers: authToHeaderS3(newAuth)
                  });

                case 6:
                  info = _context3.sent;
                  newAuth.values.email = info.username;
                  newAuth.values.itemname = info.itemname;
                  newAuth.values.screenname = info.screenname; // Note the auth object is missing cookie fields.
                  // It is still TBD if those are needed

                  return _context3.abrupt("return", newAuth);

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function fromS3(_x5, _x6) {
          return _fromS.apply(this, arguments);
        }

        return fromS3;
      }()
    }, {
      key: "fromCookies",
      value: function () {
        var _fromCookies = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(loggedInSig, loggedInUser) {
          var newAuth,
              s3response,
              s3,
              _args4 = arguments;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  newAuth = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : newEmptyAuth();
                  newAuth.values.cookies["logged-in-sig"] = loggedInSig;
                  newAuth.values.cookies["logged-in-user"] = loggedInUser;
                  _context4.next = 5;
                  return fetch(corsWorkAround("https://archive.org/account/s3.php?output_json=1"), {
                    headers: authToHeaderCookies(newAuth)
                  });

                case 5:
                  s3response = _context4.sent;
                  _context4.next = 8;
                  return s3response.json();

                case 8:
                  s3 = _context4.sent;

                  if (s3.success) {
                    _context4.next = 11;
                    break;
                  }

                  throw new Error();

                case 11:
                  _context4.next = 13;
                  return this.fromS3(s3.key.s3accesskey, s3.key.s3secretkey, newAuth);

                case 13:
                  return _context4.abrupt("return", _context4.sent);

                case 14:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function fromCookies(_x7, _x8) {
          return _fromCookies.apply(this, arguments);
        }

        return fromCookies;
      }()
    }]);

    return Auth;
  }();

  var BookReaderAPI = function BookReaderAPI() {
    _classCallCheck(this, BookReaderAPI);
  };

  var FavoritesAPI = /*#__PURE__*/function () {
    function FavoritesAPI() {
      _classCallCheck(this, FavoritesAPI);

      this.API_BASE = corsWorkAround("https://archive.org/bookmarks.php"); // TODO support this non-json explore endpoint

      this.EXPLORE_API_BASE = "https://archive.org/bookmarks-explore.php";
    }

    _createClass(FavoritesAPI, [{
      key: "get",
      value: function () {
        var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref2) {
          var _ref2$screenname, screenname, _ref2$auth, auth, params;

          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _ref2$screenname = _ref2.screenname, screenname = _ref2$screenname === void 0 ? null : _ref2$screenname, _ref2$auth = _ref2.auth, auth = _ref2$auth === void 0 ? newEmptyAuth() : _ref2$auth;

                  if (!screenname && auth.values.screenname) {
                    screenname = auth.values.screenname;
                  }

                  if (!screenname) {
                    _context5.next = 9;
                    break;
                  }

                  params = {
                    output: "json",
                    screenname: screenname
                  };
                  _context5.next = 6;
                  return fetchJson("".concat(this.API_BASE, "?").concat(paramify(params)));

                case 6:
                  return _context5.abrupt("return", _context5.sent);

                case 9:
                  throw new Error("Neither screenname or auth provided for bookmarks lookup");

                case 10:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function get(_x9) {
          return _get.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "add",
      value: function () {
        var _add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
          var _ref3,
              _ref3$identifier,
              identifier,
              _ref3$comments,
              _ref3$auth,
              auth,
              _args6 = arguments;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _ref3 = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {}, _ref3$identifier = _ref3.identifier, identifier = _ref3$identifier === void 0 ? null : _ref3$identifier, _ref3$comments = _ref3.comments, _ref3$auth = _ref3.auth, auth = _ref3$auth === void 0 ? newEmptyAuth() : _ref3$auth;
                  _context6.next = 3;
                  return this.modify({
                    identifier: identifier,
                    add_bookmark: 1
                  }, auth);

                case 3:
                  return _context6.abrupt("return", _context6.sent);

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function add() {
          return _add.apply(this, arguments);
        }

        return add;
      }()
    }, {
      key: "remove",
      value: function () {
        var _remove = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
          var _ref4,
              _ref4$identifier,
              identifier,
              _ref4$auth,
              auth,
              _args7 = arguments;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _ref4 = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {}, _ref4$identifier = _ref4.identifier, identifier = _ref4$identifier === void 0 ? null : _ref4$identifier, _ref4$auth = _ref4.auth, auth = _ref4$auth === void 0 ? null : _ref4$auth;
                  _context7.next = 3;
                  return this.modify({
                    identifier: identifier,
                    del_bookmark: identifier
                  }, auth);

                case 3:
                  return _context7.abrupt("return", _context7.sent);

                case 4:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function remove() {
          return _remove.apply(this, arguments);
        }

        return remove;
      }()
    }, {
      key: "modify",
      value: function () {
        var _modify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(params, auth) {
          var mdResponse, response;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.prev = 0;
                  _context8.next = 3;
                  return iajs.MetadataAPI.get({
                    identifier: params.identifier,
                    path: "/metadata"
                  });

                case 3:
                  mdResponse = _context8.sent;
                  params.title = str2arr(mdResponse.result.title).join(", ");
                  params.mediatype = mdResponse.result.mediatype;
                  _context8.next = 11;
                  break;

                case 8:
                  _context8.prev = 8;
                  _context8.t0 = _context8["catch"](0);
                  throw new Error("Metadata lookup failed for: ".concat(params.identifier));

                case 11:
                  params.output = "json";
                  _context8.next = 14;
                  return fetch("".concat(this.API_BASE, "?").concat(paramify(params)), {
                    method: "POST",
                    headers: authToHeaderCookies(auth)
                  });

                case 14:
                  response = _context8.sent;
                  _context8.next = 17;
                  return response.json()["catch"](function (e) {
                    return {
                      error: e
                    };
                  });

                case 17:
                  return _context8.abrupt("return", _context8.sent);

                case 18:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this, [[0, 8]]);
        }));

        function modify(_x10, _x11) {
          return _modify.apply(this, arguments);
        }

        return modify;
      }()
    }]);

    return FavoritesAPI;
  }();

  var GifcitiesAPI = /*#__PURE__*/function () {
    function GifcitiesAPI() {
      _classCallCheck(this, GifcitiesAPI);

      this.API_BASE = "https://gifcities.archive.org/api/v1/gifsearch";
    }

    _createClass(GifcitiesAPI, [{
      key: "get",
      value: function () {
        var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
          var _ref5,
              _ref5$q,
              q,
              _args9 = arguments;

          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _ref5 = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {}, _ref5$q = _ref5.q, q = _ref5$q === void 0 ? null : _ref5$q;

                  if (!(q === null)) {
                    _context9.next = 3;
                    break;
                  }

                  return _context9.abrupt("return", []);

                case 3:
                  return _context9.abrupt("return", fetchJson("".concat(this.API_BASE, "?q=").concat(enc(q))));

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function get() {
          return _get2.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "search",
      value: function () {
        var _search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(q) {
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  return _context10.abrupt("return", this.get({
                    q: q
                  }));

                case 1:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function search(_x12) {
          return _search.apply(this, arguments);
        }

        return search;
      }()
    }]);

    return GifcitiesAPI;
  }();

  var MetadataAPI = /*#__PURE__*/function () {
    function MetadataAPI() {
      _classCallCheck(this, MetadataAPI);

      this.READ_API_BASE = "https://archive.org/metadata";
      this.WRITE_API_BASE = corsWorkAround("https://archive.org/metadata");
    }

    _createClass(MetadataAPI, [{
      key: "get",
      value: function () {
        var _get3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
          var _ref6,
              _ref6$identifier,
              identifier,
              _ref6$path,
              path,
              _ref6$auth,
              auth,
              options,
              _args11 = arguments;

          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _ref6 = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {}, _ref6$identifier = _ref6.identifier, identifier = _ref6$identifier === void 0 ? null : _ref6$identifier, _ref6$path = _ref6.path, path = _ref6$path === void 0 ? "" : _ref6$path, _ref6$auth = _ref6.auth, auth = _ref6$auth === void 0 ? newEmptyAuth() : _ref6$auth;
                  options = {};
                  options.headers = authToHeaderS3(auth);
                  return _context11.abrupt("return", fetchJson("".concat(this.READ_API_BASE, "/").concat(identifier, "/").concat(path), options));

                case 4:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function get() {
          return _get3.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "patch",
      value: function () {
        var _patch2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
          var _ref7,
              _ref7$identifier,
              identifier,
              _ref7$target,
              target,
              _ref7$priority,
              priority,
              _ref7$patch,
              _patch,
              _ref7$auth,
              auth,
              reqParams,
              url,
              body,
              response,
              _args12 = arguments;

          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _ref7 = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : {}, _ref7$identifier = _ref7.identifier, identifier = _ref7$identifier === void 0 ? null : _ref7$identifier, _ref7$target = _ref7.target, target = _ref7$target === void 0 ? "metadata" : _ref7$target, _ref7$priority = _ref7.priority, priority = _ref7$priority === void 0 ? -5 : _ref7$priority, _ref7$patch = _ref7.patch, _patch = _ref7$patch === void 0 ? {} : _ref7$patch, _ref7$auth = _ref7.auth, auth = _ref7$auth === void 0 ? newEmptyAuth() : _ref7$auth;
                  // https://archive.org/services/docs/api/metadata.html#targets
                  reqParams = {
                    "-target": target,
                    "-patch": JSON.stringify(_patch),
                    priority: priority,
                    secret: auth.values.s3.secret,
                    access: auth.values.s3.access
                  };
                  url = "".concat(this.WRITE_API_BASE, "/").concat(identifier);
                  body = paramify(reqParams);
                  _context12.next = 6;
                  return fetch(url, {
                    method: "POST",
                    body: body,
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  });

                case 6:
                  response = _context12.sent;
                  _context12.next = 9;
                  return response.json();

                case 9:
                  return _context12.abrupt("return", _context12.sent);

                case 10:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function patch() {
          return _patch2.apply(this, arguments);
        }

        return patch;
      }()
    }]);

    return MetadataAPI;
  }();

  var RelatedAPI = /*#__PURE__*/function () {
    function RelatedAPI() {
      _classCallCheck(this, RelatedAPI);

      this.API_BASE = "https://be-api.us.archive.org/mds/v1";
    }

    _createClass(RelatedAPI, [{
      key: "get",
      value: function () {
        var _get4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
          var _ref8,
              _ref8$identifier,
              identifier,
              _args13 = arguments;

          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _ref8 = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : {}, _ref8$identifier = _ref8.identifier, identifier = _ref8$identifier === void 0 ? null : _ref8$identifier;
                  return _context13.abrupt("return", fetchJson("".concat(this.API_BASE, "/get_related/all/").concat(identifier)));

                case 2:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function get() {
          return _get4.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return RelatedAPI;
  }();

  var ReviewsAPI = /*#__PURE__*/function () {
    function ReviewsAPI() {
      _classCallCheck(this, ReviewsAPI);

      this.WRITE_API_BASE = corsWorkAround("https://archive.org/services/reviews.php?identifier=");
      this.READ_API_BASE = "https://archive.org/metadata";
    }

    _createClass(ReviewsAPI, [{
      key: "get",
      value: function () {
        var _get5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
          var _ref9,
              _ref9$identifier,
              identifier,
              _args14 = arguments;

          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  _ref9 = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {}, _ref9$identifier = _ref9.identifier, identifier = _ref9$identifier === void 0 ? null : _ref9$identifier;
                  return _context14.abrupt("return", fetchJson("".concat(this.READ_API_BASE, "/").concat(identifier, "/reviews")));

                case 2:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function get() {
          return _get5.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "add",
      value: function () {
        var _add2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
          var _ref10,
              _ref10$identifier,
              identifier,
              _ref10$title,
              title,
              _ref10$body,
              body,
              _ref10$stars,
              stars,
              _ref10$auth,
              auth,
              url,
              response,
              _args15 = arguments;

          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _ref10 = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : {}, _ref10$identifier = _ref10.identifier, identifier = _ref10$identifier === void 0 ? null : _ref10$identifier, _ref10$title = _ref10.title, title = _ref10$title === void 0 ? null : _ref10$title, _ref10$body = _ref10.body, body = _ref10$body === void 0 ? null : _ref10$body, _ref10$stars = _ref10.stars, stars = _ref10$stars === void 0 ? null : _ref10$stars, _ref10$auth = _ref10.auth, auth = _ref10$auth === void 0 ? newEmptyAuth() : _ref10$auth;
                  url = "".concat(this.WRITE_API_BASE).concat(identifier);
                  _context15.next = 4;
                  return fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                      title: title,
                      body: body,
                      stars: stars
                    }),
                    headers: _objectSpread2({
                      "Content-Type": "application/json"
                    }, authToHeaderS3(auth))
                  });

                case 4:
                  response = _context15.sent;
                  _context15.next = 7;
                  return response.json();

                case 7:
                  return _context15.abrupt("return", _context15.sent);

                case 8:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function add() {
          return _add2.apply(this, arguments);
        }

        return add;
      }()
    }]);

    return ReviewsAPI;
  }();

  var S3API = /*#__PURE__*/function () {
    function S3API() {
      _classCallCheck(this, S3API);

      this.API_BASE = "https://s3.us.archive.org";
    }

    _createClass(S3API, [{
      key: "ls",
      value: function () {
        var _ls = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
          var _ref11,
              _ref11$identifier,
              identifier,
              _ref11$auth,
              auth,
              _args16 = arguments;

          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  _ref11 = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : {}, _ref11$identifier = _ref11.identifier, identifier = _ref11$identifier === void 0 ? null : _ref11$identifier, _ref11$auth = _ref11.auth, auth = _ref11$auth === void 0 ? newEmptyAuth() : _ref11$auth;

                  if (identifier) {
                    _context16.next = 3;
                    break;
                  }

                  throw new Error("Missing required args");

                case 3:
                  _context16.next = 5;
                  return fetch("".concat(this.API_BASE, "/").concat(identifier));

                case 5:
                  _context16.next = 7;
                  return _context16.sent.text();

                case 7:
                  return _context16.abrupt("return", _context16.sent);

                case 8:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function ls() {
          return _ls.apply(this, arguments);
        }

        return ls;
      }()
    }, {
      key: "createEmptyItem",
      value: function () {
        var _createEmptyItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
          var _ref12,
              _ref12$identifier,
              identifier,
              _ref12$testItem,
              testItem,
              _ref12$metadata,
              metadata,
              _ref12$headers,
              headers,
              _ref12$wait,
              wait,
              _ref12$auth,
              auth,
              _args17 = arguments;

          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _ref12 = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : {}, _ref12$identifier = _ref12.identifier, identifier = _ref12$identifier === void 0 ? null : _ref12$identifier, _ref12$testItem = _ref12.testItem, testItem = _ref12$testItem === void 0 ? false : _ref12$testItem, _ref12$metadata = _ref12.metadata, metadata = _ref12$metadata === void 0 ? {} : _ref12$metadata, _ref12$headers = _ref12.headers, headers = _ref12$headers === void 0 ? {} : _ref12$headers, _ref12$wait = _ref12.wait, wait = _ref12$wait === void 0 ? true : _ref12$wait, _ref12$auth = _ref12.auth, auth = _ref12$auth === void 0 ? newEmptyAuth() : _ref12$auth;
                  _context17.next = 3;
                  return this.upload({
                    identifier: identifier,
                    testItem: testItem,
                    metadata: metadata,
                    headers: headers,
                    wait: wait,
                    auth: auth,
                    autocreate: true
                  });

                case 3:
                  return _context17.abrupt("return", _context17.sent);

                case 4:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        }));

        function createEmptyItem() {
          return _createEmptyItem.apply(this, arguments);
        }

        return createEmptyItem;
      }()
    }, {
      key: "upload",
      value: function () {
        var _upload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(_ref13) {
          var _ref13$identifier, identifier, _ref13$key, key, _ref13$body, body, _ref13$autocreate, autocreate, _ref13$skipDerive, skipDerive, _ref13$testItem, testItem, _ref13$keepOldVersion, keepOldVersions, _ref13$metadata, metadata, _ref13$headers, headers, _ref13$wait, wait, _ref13$auth, auth, requestHeaders, requestUrl, response;

          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _ref13$identifier = _ref13.identifier, identifier = _ref13$identifier === void 0 ? null : _ref13$identifier, _ref13$key = _ref13.key, key = _ref13$key === void 0 ? null : _ref13$key, _ref13$body = _ref13.body, body = _ref13$body === void 0 ? "" : _ref13$body, _ref13$autocreate = _ref13.autocreate, autocreate = _ref13$autocreate === void 0 ? false : _ref13$autocreate, _ref13$skipDerive = _ref13.skipDerive, skipDerive = _ref13$skipDerive === void 0 ? false : _ref13$skipDerive, _ref13$testItem = _ref13.testItem, testItem = _ref13$testItem === void 0 ? false : _ref13$testItem, _ref13$keepOldVersion = _ref13.keepOldVersions, keepOldVersions = _ref13$keepOldVersion === void 0 ? true : _ref13$keepOldVersion, _ref13$metadata = _ref13.metadata, metadata = _ref13$metadata === void 0 ? {} : _ref13$metadata, _ref13$headers = _ref13.headers, headers = _ref13$headers === void 0 ? {} : _ref13$headers, _ref13$wait = _ref13.wait, wait = _ref13$wait === void 0 ? true : _ref13$wait, _ref13$auth = _ref13.auth, auth = _ref13$auth === void 0 ? newEmptyAuth() : _ref13$auth;

                  if (identifier) {
                    _context18.next = 3;
                    break;
                  }

                  throw new Error("Missing required args");

                case 3:
                  if (testItem) {
                    metadata["collection"] = "test_collection";
                  }

                  requestHeaders = {};
                  Object.keys(metadata).forEach(function (k) {
                    str2arr(metadata[k]).forEach(function (v, idx) {
                      k = k.replace(/_/g, "--");
                      var headerKey = "x-archive-meta".concat(idx, "-").concat(k);
                      requestHeaders[headerKey] = v;
                    });
                  });
                  Object.assign(requestHeaders, headers, authToHeaderS3(auth));

                  if (autocreate) {
                    requestHeaders["x-archive-auto-make-bucket"] = 1;
                  }

                  if (skipDerive) {
                    requestHeaders["x-archive-queue-derive"] = 0;
                  }

                  requestHeaders["x-archive-keep-old-version"] = keepOldVersions ? 1 : 0;
                  requestUrl = key ? "".concat(this.API_BASE, "/").concat(identifier, "/").concat(key) : "".concat(this.API_BASE, "/").concat(identifier);
                  _context18.next = 13;
                  return fetch(requestUrl, {
                    method: "PUT",
                    headers: requestHeaders,
                    body: body
                  });

                case 13:
                  response = _context18.sent;

                  if (!(response.status !== 200)) {
                    _context18.next = 16;
                    break;
                  }

                  throw new Error("Response: ".concat(response.status));

                case 16:
                  if (wait) {
                    _context18.next = 18;
                    break;
                  }

                  return _context18.abrupt("return", response);

                case 18:
                  _context18.next = 20;
                  return response.text();

                case 20:
                  return _context18.abrupt("return", _context18.sent);

                case 21:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this);
        }));

        function upload(_x13) {
          return _upload.apply(this, arguments);
        }

        return upload;
      }()
    }]);

    return S3API;
  }();

  var SearchAPI = /*#__PURE__*/function () {
    function SearchAPI() {
      _classCallCheck(this, SearchAPI);

      this.API_BASE = "https://archive.org/advancedsearch.php";
    }

    _createClass(SearchAPI, [{
      key: "get",
      value: function () {
        var _get6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
          var _ref14,
              _ref14$q,
              q,
              _ref14$page,
              page,
              _ref14$fields,
              fields,
              options,
              reqParams,
              encodedParams,
              url,
              _args19 = arguments;

          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  _ref14 = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : {}, _ref14$q = _ref14.q, q = _ref14$q === void 0 ? null : _ref14$q, _ref14$page = _ref14.page, page = _ref14$page === void 0 ? 1 : _ref14$page, _ref14$fields = _ref14.fields, fields = _ref14$fields === void 0 ? ["identifier"] : _ref14$fields, options = _objectWithoutProperties(_ref14, ["q", "page", "fields"]);

                  if (q) {
                    _context19.next = 3;
                    break;
                  }

                  throw new Error("Missing required arg 'q'");

                case 3:
                  if (_typeof(q) == "object") {
                    q = this.buildQueryFromObject(q);
                  }

                  reqParams = _objectSpread2(_objectSpread2({
                    q: q,
                    page: page,
                    fl: fields
                  }, options), {}, {
                    output: "json"
                  });
                  encodedParams = paramify(reqParams);
                  url = "".concat(this.API_BASE, "?").concat(encodedParams);
                  return _context19.abrupt("return", fetchJson(url));

                case 8:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19, this);
        }));

        function get() {
          return _get6.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "search",
      value: function () {
        var _search2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(q) {
          return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  _context20.next = 2;
                  return this.get({
                    q: q
                  });

                case 2:
                  return _context20.abrupt("return", _context20.sent);

                case 3:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20, this);
        }));

        function search(_x14) {
          return _search2.apply(this, arguments);
        }

        return search;
      }()
    }, {
      key: "buildQueryFromObject",
      value: function buildQueryFromObject(qObject) {
        // Map dictionary to a key=val search query
        return Object.keys(qObject).map(function (key) {
          if (Array.isArray(qObject[key])) {
            return "".concat(key, ":( ").concat(qObject[key].map(function (v) {
              return "\"".concat(v, "\"");
            }).join(" OR "), " )");
          } else {
            return "".concat(key, "=").concat(qObject[key]);
          }
        }).join(" AND ");
      }
    }]);

    return SearchAPI;
  }();

  var SearchTextAPI = function SearchTextAPI() {
    _classCallCheck(this, SearchTextAPI);
  };

  var ViewsAPI = /*#__PURE__*/function () {
    function ViewsAPI() {
      _classCallCheck(this, ViewsAPI);

      // https://be-api.us.archive.org/views/v1/short/<identifier>[,<identifier>,...]
      this.API_BASE = "https://be-api.us.archive.org/views/v1/short";
    }

    _createClass(ViewsAPI, [{
      key: "get",
      value: function () {
        var _get7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
          var _ref15,
              _ref15$identifier,
              identifier,
              _args21 = arguments;

          return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
              switch (_context21.prev = _context21.next) {
                case 0:
                  _ref15 = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : {}, _ref15$identifier = _ref15.identifier, identifier = _ref15$identifier === void 0 ? null : _ref15$identifier;
                  identifier = Array.isArray(identifier) ? identifier.join(",") : identifier;
                  return _context21.abrupt("return", fetchJson("".concat(this.API_BASE, "/").concat(identifier)));

                case 3:
                case "end":
                  return _context21.stop();
              }
            }
          }, _callee21, this);
        }));

        function get() {
          return _get7.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ViewsAPI;
  }();

  var WaybackAPI = /*#__PURE__*/function () {
    function WaybackAPI() {
      _classCallCheck(this, WaybackAPI);

      this.AVAILABLE_API_BASE = "https://archive.org/wayback/available";
      this.CDX_API_BASE = corsWorkAround("https://web.archive.org/cdx/search/");
      this.SAVE_API_BASE = corsWorkAround("https://web.archive.org/save/");
    }
    /**
     * @see https://archive.org/help/wayback_api.php
     */


    _createClass(WaybackAPI, [{
      key: "available",
      value: function () {
        var _available = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
          var _ref16,
              _ref16$url,
              url,
              _ref16$timestamp,
              timestamp,
              params,
              searchParams,
              fetchFunction,
              response,
              _args22 = arguments;

          return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  _ref16 = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : {}, _ref16$url = _ref16.url, url = _ref16$url === void 0 ? null : _ref16$url, _ref16$timestamp = _ref16.timestamp, timestamp = _ref16$timestamp === void 0 ? null : _ref16$timestamp;
                  params = {
                    url: url
                  };

                  if (timestamp !== null) {
                    params.timestamp = timestamp;
                  }

                  searchParams = paramify(params);
                  fetchFunction = isInBrowser() ? fetchJsonp : fetch;
                  _context22.next = 7;
                  return fetchFunction("".concat(this.AVAILABLE_API_BASE, "?").concat(searchParams));

                case 7:
                  response = _context22.sent;
                  _context22.next = 10;
                  return response.json();

                case 10:
                  return _context22.abrupt("return", _context22.sent);

                case 11:
                case "end":
                  return _context22.stop();
              }
            }
          }, _callee22, this);
        }));

        function available() {
          return _available.apply(this, arguments);
        }

        return available;
      }()
      /**
       * @see https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
       */

    }, {
      key: "cdx",
      value: function () {
        var _cdx = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
          var options,
              searchParams,
              response,
              raw,
              json,
              _args23 = arguments;
          return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  options = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : {};
                  options.output = "json";
                  searchParams = paramify(options);
                  _context23.next = 5;
                  return fetch("".concat(this.CDX_API_BASE, "?").concat(searchParams));

                case 5:
                  response = _context23.sent;
                  _context23.next = 8;
                  return response.text();

                case 8:
                  raw = _context23.sent;

                  try {
                    json = JSON.parse(raw);
                  } catch (e) {
                    json = {
                      error: raw.trim()
                    };
                  }

                  return _context23.abrupt("return", json);

                case 11:
                case "end":
                  return _context23.stop();
              }
            }
          }, _callee23, this);
        }));

        function cdx() {
          return _cdx.apply(this, arguments);
        }

        return cdx;
      }()
      /**
       * @see https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/edit
       */

    }, {
      key: "savePageNow",
      value: function () {
        var _savePageNow = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
          var _ref17,
              _ref17$url,
              url,
              _ref17$captureOutlink,
              captureOutlinks,
              _ref17$captureAll,
              captureAll,
              _ref17$captureScreens,
              captureScreenshot,
              _ref17$skipFirstArchi,
              skipFirstArchive,
              _ref17$ifNotArchivedW,
              ifNotArchivedWithin,
              _ref17$auth,
              auth,
              params,
              response,
              _args24 = arguments;

          return regeneratorRuntime.wrap(function _callee24$(_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                  _ref17 = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : {}, _ref17$url = _ref17.url, url = _ref17$url === void 0 ? null : _ref17$url, _ref17$captureOutlink = _ref17.captureOutlinks, captureOutlinks = _ref17$captureOutlink === void 0 ? 0 : _ref17$captureOutlink, _ref17$captureAll = _ref17.captureAll, captureAll = _ref17$captureAll === void 0 ? true : _ref17$captureAll, _ref17$captureScreens = _ref17.captureScreenshot, captureScreenshot = _ref17$captureScreens === void 0 ? false : _ref17$captureScreens, _ref17$skipFirstArchi = _ref17.skipFirstArchive, skipFirstArchive = _ref17$skipFirstArchi === void 0 ? true : _ref17$skipFirstArchi, _ref17$ifNotArchivedW = _ref17.ifNotArchivedWithin, ifNotArchivedWithin = _ref17$ifNotArchivedW === void 0 ? null : _ref17$ifNotArchivedW, _ref17$auth = _ref17.auth, auth = _ref17$auth === void 0 ? newEmptyAuth() : _ref17$auth;
                  url = url.replace(/^https?\:\/\//, "");
                  params = {
                    url: url,
                    capture_outlinks: captureOutlinks,
                    capture_all: captureAll ? "1" : "0",
                    capture_screenshot: captureScreenshot ? "1" : "0",
                    skip_first_archive: skipFirstArchive ? "1" : "0"
                  };

                  if (ifNotArchivedWithin) {
                    params.if_not_archived_within = ifNotArchivedWithin;
                  }

                  _context24.next = 6;
                  return fetch(this.SAVE_API_BASE, {
                    credentials: "omit",
                    method: "POST",
                    body: paramify(params),
                    headers: _objectSpread2({
                      Accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded"
                    }, authToHeaderS3(auth))
                  });

                case 6:
                  response = _context24.sent;
                  _context24.next = 9;
                  return response.json();

                case 9:
                  return _context24.abrupt("return", _context24.sent);

                case 10:
                case "end":
                  return _context24.stop();
              }
            }
          }, _callee24, this);
        }));

        function savePageNow() {
          return _savePageNow.apply(this, arguments);
        }

        return savePageNow;
      }()
    }]);

    return WaybackAPI;
  }();

  var ZipFileAPI = /*#__PURE__*/function () {
    function ZipFileAPI() {
      _classCallCheck(this, ZipFileAPI);
    }

    _createClass(ZipFileAPI, [{
      key: "ls",

      /**
       * List the contents of a zip file in an item
       * Eg: https://archive.org/download/goodytwoshoes00newyiala/goodytwoshoes00newyiala_jp2.zip/
       */
      value: function () {
        var _ls2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(identifier, zipPath) {
          var auth,
              requestUrl,
              response,
              html,
              tableHtml,
              table,
              rows,
              results,
              _loop,
              i,
              _ret,
              _args25 = arguments;

          return regeneratorRuntime.wrap(function _callee25$(_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                  auth = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : newEmptyAuth();

                  if (zipPath.match(/\.(7z|cbr|cbz|cdr|iso|rar|tar|zip)$/)) {
                    _context25.next = 3;
                    break;
                  }

                  throw new Error("Invalid zip type");

                case 3:
                  requestUrl = corsWorkAround("https://archive.org/download/".concat(identifier, "/").concat(enc(zipPath), "/"));
                  _context25.next = 6;
                  return fetch(requestUrl, {
                    headers: authToHeaderCookies(auth)
                  });

                case 6:
                  response = _context25.sent;

                  if (!(response.status != 200)) {
                    _context25.next = 9;
                    break;
                  }

                  throw Error({
                    error: "not found"
                  });

                case 9:
                  _context25.next = 11;
                  return response.text();

                case 11:
                  html = _context25.sent;
                  // This page has <td>'s without closing el tags (took a while to
                  // figure this out). This breaks the DOMparser, so I added a workaround
                  // to add closing tags
                  tableHtml = html.match(/(<table class="archext">[\w\W]*<\/table>)/g)[0];
                  tableHtml = tableHtml.replace(/(<td[^>]*>[\w\W]*?)(?=<(?:td|\/tr))/g, "$1</td>");
                  table = new xmldom.DOMParser().parseFromString(tableHtml);
                  rows = table.getElementsByTagName("tr");
                  results = [];

                  _loop = function _loop(i) {
                    var cells = rows.item(i).getElementsByTagName("td");
                    if (cells.length != 4) return "continue";

                    try {
                      var a = cells.item(0).getElementsByTagName("a").item(0);
                      results.push({
                        key: a.textContent,
                        href: "https:" + a.getAttribute("href"),
                        jpegUrl: function () {
                          try {
                            return "https:" + cells.item(1).getElementsByTagName("a").item(0).getAttribute("href");
                          } catch (e) {
                            return null;
                          }
                        }(),
                        timestamp: cells.item(2).textContent,
                        size: cells.item(3).textContent
                      });
                    } catch (e) {}
                  };

                  i = 0;

                case 19:
                  if (!(i < rows.length)) {
                    _context25.next = 26;
                    break;
                  }

                  _ret = _loop(i);

                  if (!(_ret === "continue")) {
                    _context25.next = 23;
                    break;
                  }

                  return _context25.abrupt("continue", 23);

                case 23:
                  i++;
                  _context25.next = 19;
                  break;

                case 26:
                  return _context25.abrupt("return", results);

                case 27:
                case "end":
                  return _context25.stop();
              }
            }
          }, _callee25);
        }));

        function ls(_x15, _x16) {
          return _ls2.apply(this, arguments);
        }

        return ls;
      }()
    }]);

    return ZipFileAPI;
  }();

  var iajs = {
    Auth: new Auth(),
    BookReaderAPI: new BookReaderAPI(),
    GifcitiesAPI: new GifcitiesAPI(),
    FavoritesAPI: new FavoritesAPI(),
    MetadataAPI: new MetadataAPI(),
    RelatedAPI: new RelatedAPI(),
    ReviewsAPI: new ReviewsAPI(),
    SearchAPI: new SearchAPI(),
    SearchTextAPI: new SearchTextAPI(),
    S3API: new S3API(),
    ViewsAPI: new ViewsAPI(),
    WaybackAPI: new WaybackAPI(),
    ZipFileAPI: new ZipFileAPI()
  };

  return iajs;

})));
