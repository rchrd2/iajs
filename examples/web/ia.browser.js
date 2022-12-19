function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch'), require('xmldom')) : typeof define === 'function' && define.amd ? define(['node-fetch', 'xmldom'], factory) : (global = global || self, global.ia = factory(global.fetch, global.xmldom));
})(this, function (fetch, xmldom) {
  'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;
  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
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

  var fetchJson = function fetchJson(url, options) {
    return Promise.resolve().then(function () {
      return fetch(url, options);
    }).then(function (_resp) {
      var res = _resp;
      return res.json();
    });
  };

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
      value: function login(email, password) {
        var _this2 = this;

        return Promise.resolve().then(function () {
          return Promise.resolve().then(function () {
            var fetchOptions = {
              method: "POST",
              body: "email=".concat(enc(email), "&password=").concat(enc(password)),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            };
            return fetch("".concat(_this2.XAUTH_BASE, "?op=login"), fetchOptions);
          }).then(function (_resp) {
            var response = _resp;
            return response.json();
          }).then(function (_resp) {
            var data = _resp;

            if (!data.success) {
              data.values = _objectSpread(_objectSpread({}, data.values), newEmptyAuth().values);
            }

            return data;
          })["catch"](function (e) {
            // TODO figure out syntax for catching error response
            return newEmptyAuth();
          });
        }).then(function () {});
      }
    }, {
      key: "fromS3",
      value: function fromS3(access, secret) {
        var newAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : newEmptyAuth();
        return Promise.resolve().then(function () {
          newAuth.success = 1;
          newAuth.values.s3.access = access;
          newAuth.values.s3.secret = secret;
          return fetchJson("https://s3.us.archive.org?check_auth=1", {
            headers: authToHeaderS3(newAuth)
          });
        }).then(function (_resp) {
          var info = _resp;
          newAuth.values.email = info.username;
          newAuth.values.itemname = info.itemname;
          newAuth.values.screenname = info.screenname; // Note the auth object is missing cookie fields.
          // It is still TBD if those are needed

          return newAuth;
        });
      }
    }, {
      key: "fromCookies",
      value: function fromCookies(loggedInSig, loggedInUser) {
        var newAuth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : newEmptyAuth();

        var _this4 = this;

        return Promise.resolve().then(function () {
          newAuth.values.cookies["logged-in-sig"] = loggedInSig;
          newAuth.values.cookies["logged-in-user"] = loggedInUser;
          return fetch(corsWorkAround("https://archive.org/account/s3.php?output_json=1"), {
            headers: authToHeaderCookies(newAuth)
          });
        }).then(function (_resp) {
          var s3response = _resp;
          return s3response.json();
        }).then(function (_resp) {
          var s3 = _resp;

          if (!s3.success) {
            throw new Error();
          }

          return _this4.fromS3(s3.key.s3accesskey, s3.key.s3secretkey, newAuth);
        });
      }
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
      value: function get(_ref) {
        var _ref$screenname = _ref.screenname,
            screenname = _ref$screenname === void 0 ? null : _ref$screenname,
            _ref$auth = _ref.auth,
            auth = _ref$auth === void 0 ? newEmptyAuth() : _ref$auth;

        var _this5 = this;

        return Promise.resolve().then(function () {
          if (!screenname && auth.values.screenname) {
            screenname = auth.values.screenname;
          }

          if (screenname) {
            var params = {
              output: "json",
              screenname: screenname
            };
            return fetchJson("".concat(_this5.API_BASE, "?").concat(paramify(params)));
          } else {
            throw new Error("Neither screenname or auth provided for bookmarks lookup");
          }
        });
      }
    }, {
      key: "add",
      value: function add() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$identifier = _ref2.identifier,
            identifier = _ref2$identifier === void 0 ? null : _ref2$identifier,
            _ref2$comments = _ref2.comments,
            comments = _ref2$comments === void 0 ? "" : _ref2$comments,
            _ref2$auth = _ref2.auth,
            auth = _ref2$auth === void 0 ? newEmptyAuth() : _ref2$auth;

        var _this6 = this;

        return Promise.resolve().then(function () {
          return _this6.modify({
            identifier: identifier,
            add_bookmark: 1
          }, auth);
        });
      }
    }, {
      key: "remove",
      value: function remove() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref3$identifier = _ref3.identifier,
            identifier = _ref3$identifier === void 0 ? null : _ref3$identifier,
            _ref3$auth = _ref3.auth,
            auth = _ref3$auth === void 0 ? null : _ref3$auth;

        var _this7 = this;

        return Promise.resolve().then(function () {
          return _this7.modify({
            identifier: identifier,
            del_bookmark: identifier
          }, auth);
        });
      }
    }, {
      key: "modify",
      value: function modify(params, auth) {
        var _this8 = this;

        return Promise.resolve().then(function () {
          return Promise.resolve().then(function () {
            return iajs.MetadataAPI.get({
              identifier: params.identifier,
              path: "/metadata"
            });
          }).then(function (_resp) {
            var mdResponse = _resp;
            params.title = str2arr(mdResponse.result.title).join(", ");
            params.mediatype = mdResponse.result.mediatype;
          })["catch"](function (e) {
            throw new Error("Metadata lookup failed for: ".concat(params.identifier));
          });
        }).then(function () {
          params.output = "json";
          return fetch("".concat(_this8.API_BASE, "?").concat(paramify(params)), {
            method: "POST",
            headers: authToHeaderCookies(auth)
          });
        }).then(function (_resp) {
          var response = _resp;
          return response.json()["catch"](function (e) {
            return {
              error: e
            };
          });
        });
      }
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
      value: function get() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref4$q = _ref4.q,
            q = _ref4$q === void 0 ? null : _ref4$q;

        var _this9 = this;

        return Promise.resolve().then(function () {
          if (q === null) {
            return [];
          } else {
            return fetchJson("".concat(_this9.API_BASE, "?q=").concat(enc(q)));
          }
        });
      }
    }, {
      key: "search",
      value: function search(q) {
        var _this10 = this;

        return Promise.resolve().then(function () {
          return _this10.get({
            q: q
          });
        });
      }
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
      value: function get() {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref5$identifier = _ref5.identifier,
            identifier = _ref5$identifier === void 0 ? null : _ref5$identifier,
            _ref5$path = _ref5.path,
            path = _ref5$path === void 0 ? "" : _ref5$path,
            _ref5$auth = _ref5.auth,
            auth = _ref5$auth === void 0 ? newEmptyAuth() : _ref5$auth;

        var _this11 = this;

        return Promise.resolve().then(function () {
          var options = {};
          options.headers = authToHeaderS3(auth);
          return fetchJson("".concat(_this11.READ_API_BASE, "/").concat(identifier, "/").concat(path), options);
        });
      }
    }, {
      key: "patch",
      value: function patch() {
        var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref6$identifier = _ref6.identifier,
            identifier = _ref6$identifier === void 0 ? null : _ref6$identifier,
            _ref6$target = _ref6.target,
            target = _ref6$target === void 0 ? "metadata" : _ref6$target,
            _ref6$priority = _ref6.priority,
            priority = _ref6$priority === void 0 ? -5 : _ref6$priority,
            _ref6$patch = _ref6.patch,
            _patch = _ref6$patch === void 0 ? {} : _ref6$patch,
            _ref6$auth = _ref6.auth,
            auth = _ref6$auth === void 0 ? newEmptyAuth() : _ref6$auth;

        var _this12 = this;

        return Promise.resolve().then(function () {
          // https://archive.org/services/docs/api/metadata.html#targets
          var reqParams = {
            "-target": target,
            "-patch": JSON.stringify(_patch),
            priority: priority,
            secret: auth.values.s3.secret,
            access: auth.values.s3.access
          };
          var url = "".concat(_this12.WRITE_API_BASE, "/").concat(identifier);
          var body = paramify(reqParams);
          return fetch(url, {
            method: "POST",
            body: body,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
        }).then(function (_resp) {
          var response = _resp;
          return response.json();
        });
      }
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
      value: function get() {
        var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref7$identifier = _ref7.identifier,
            identifier = _ref7$identifier === void 0 ? null : _ref7$identifier;

        var _this13 = this;

        return Promise.resolve().then(function () {
          return fetchJson("".concat(_this13.API_BASE, "/get_related/all/").concat(identifier));
        });
      }
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
      value: function get() {
        var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref8$identifier = _ref8.identifier,
            identifier = _ref8$identifier === void 0 ? null : _ref8$identifier;

        var _this14 = this;

        return Promise.resolve().then(function () {
          return fetchJson("".concat(_this14.READ_API_BASE, "/").concat(identifier, "/reviews"));
        });
      }
    }, {
      key: "add",
      value: function add() {
        var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref9$identifier = _ref9.identifier,
            identifier = _ref9$identifier === void 0 ? null : _ref9$identifier,
            _ref9$title = _ref9.title,
            title = _ref9$title === void 0 ? null : _ref9$title,
            _ref9$body = _ref9.body,
            body = _ref9$body === void 0 ? null : _ref9$body,
            _ref9$stars = _ref9.stars,
            stars = _ref9$stars === void 0 ? null : _ref9$stars,
            _ref9$auth = _ref9.auth,
            auth = _ref9$auth === void 0 ? newEmptyAuth() : _ref9$auth;

        var _this15 = this;

        return Promise.resolve().then(function () {
          var url = "".concat(_this15.WRITE_API_BASE).concat(identifier);
          return fetch(url, {
            method: "POST",
            body: JSON.stringify({
              title: title,
              body: body,
              stars: stars
            }),
            headers: _objectSpread({
              "Content-Type": "application/json"
            }, authToHeaderS3(auth))
          });
        }).then(function (_resp) {
          var response = _resp;
          return response.json();
        });
      }
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
      value: function ls() {
        var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref10$identifier = _ref10.identifier,
            identifier = _ref10$identifier === void 0 ? null : _ref10$identifier,
            _ref10$auth = _ref10.auth,
            auth = _ref10$auth === void 0 ? newEmptyAuth() : _ref10$auth;

        var _this16 = this;

        return Promise.resolve().then(function () {
          // throw new Error("TODO parse that XML");
          if (!identifier) {
            throw new Error("Missing required args");
          }

          return fetch("".concat(_this16.API_BASE, "/").concat(identifier));
        }).then(function (_resp) {
          return _resp.text();
        });
      }
    }, {
      key: "createEmptyItem",
      value: function createEmptyItem() {
        var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref11$identifier = _ref11.identifier,
            identifier = _ref11$identifier === void 0 ? null : _ref11$identifier,
            _ref11$testItem = _ref11.testItem,
            testItem = _ref11$testItem === void 0 ? false : _ref11$testItem,
            _ref11$metadata = _ref11.metadata,
            metadata = _ref11$metadata === void 0 ? {} : _ref11$metadata,
            _ref11$headers = _ref11.headers,
            headers = _ref11$headers === void 0 ? {} : _ref11$headers,
            _ref11$wait = _ref11.wait,
            wait = _ref11$wait === void 0 ? true : _ref11$wait,
            _ref11$auth = _ref11.auth,
            auth = _ref11$auth === void 0 ? newEmptyAuth() : _ref11$auth;

        var _this17 = this;

        return Promise.resolve().then(function () {
          return _this17.upload({
            identifier: identifier,
            testItem: testItem,
            metadata: metadata,
            headers: headers,
            wait: wait,
            auth: auth,
            autocreate: true
          });
        });
      }
    }, {
      key: "upload",
      value: function upload(_ref12) {
        var _ref12$identifier = _ref12.identifier,
            identifier = _ref12$identifier === void 0 ? null : _ref12$identifier,
            _ref12$key = _ref12.key,
            key = _ref12$key === void 0 ? null : _ref12$key,
            _ref12$body = _ref12.body,
            body = _ref12$body === void 0 ? "" : _ref12$body,
            _ref12$autocreate = _ref12.autocreate,
            autocreate = _ref12$autocreate === void 0 ? false : _ref12$autocreate,
            _ref12$skipDerive = _ref12.skipDerive,
            skipDerive = _ref12$skipDerive === void 0 ? false : _ref12$skipDerive,
            _ref12$testItem = _ref12.testItem,
            testItem = _ref12$testItem === void 0 ? false : _ref12$testItem,
            _ref12$keepOldVersion = _ref12.keepOldVersions,
            keepOldVersions = _ref12$keepOldVersion === void 0 ? true : _ref12$keepOldVersion,
            _ref12$metadata = _ref12.metadata,
            metadata = _ref12$metadata === void 0 ? {} : _ref12$metadata,
            _ref12$headers = _ref12.headers,
            headers = _ref12$headers === void 0 ? {} : _ref12$headers,
            _ref12$wait = _ref12.wait,
            wait = _ref12$wait === void 0 ? true : _ref12$wait,
            _ref12$auth = _ref12.auth,
            auth = _ref12$auth === void 0 ? newEmptyAuth() : _ref12$auth;

        var _this18 = this;

        return Promise.resolve().then(function () {
          if (!identifier) {
            throw new Error("Missing required args");
          }

          if (testItem) {
            metadata["collection"] = "test_collection";
          }

          var requestHeaders = {};
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
          var requestUrl = key ? "".concat(_this18.API_BASE, "/").concat(identifier, "/").concat(key) : "".concat(_this18.API_BASE, "/").concat(identifier);
          return fetch(requestUrl, {
            method: "PUT",
            headers: requestHeaders,
            body: body
          });
        }).then(function (_resp) {
          var response = _resp;

          if (response.status !== 200) {
            // NOTE this may not be the right thing to check.
            // Maybe different codes are okay
            throw new Error("Response: ".concat(response.status));
          }

          if (!wait) {
            return response;
          } else {
            // The finished response seems to be empty
            return response.text();
          }
        });
      }
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
      value: function get() {
        var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref13$q = _ref13.q,
            q = _ref13$q === void 0 ? null : _ref13$q,
            _ref13$page = _ref13.page,
            page = _ref13$page === void 0 ? 1 : _ref13$page,
            _ref13$fields = _ref13.fields,
            fields = _ref13$fields === void 0 ? ["identifier"] : _ref13$fields,
            options = _objectWithoutProperties(_ref13, ["q", "page", "fields"]);

        var _this19 = this;

        return Promise.resolve().then(function () {
          if (!q) {
            throw new Error("Missing required arg 'q'");
          }

          if (_typeof(q) == "object") {
            q = _this19.buildQueryFromObject(q);
          }

          var reqParams = _objectSpread(_objectSpread({
            q: q,
            page: page,
            fl: fields
          }, options), {}, {
            output: "json"
          });

          var encodedParams = paramify(reqParams);
          var url = "".concat(_this19.API_BASE, "?").concat(encodedParams);
          return fetchJson(url);
        });
      }
    }, {
      key: "search",
      value: function search(q) {
        var _this20 = this;

        return Promise.resolve().then(function () {
          return _this20.get({
            q: q
          });
        });
      }
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
            return "".concat(key, ":\"").concat(qObject[key], "\"");
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
      value: function get() {
        var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref14$identifier = _ref14.identifier,
            identifier = _ref14$identifier === void 0 ? null : _ref14$identifier;

        var _this21 = this;

        return Promise.resolve().then(function () {
          identifier = Array.isArray(identifier) ? identifier.join(",") : identifier;
          return fetchJson("".concat(_this21.API_BASE, "/").concat(identifier));
        });
      }
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
      value: function available() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref15$url = _ref15.url,
            url = _ref15$url === void 0 ? null : _ref15$url,
            _ref15$timestamp = _ref15.timestamp,
            timestamp = _ref15$timestamp === void 0 ? null : _ref15$timestamp;

        var _this22 = this;

        return Promise.resolve().then(function () {
          var params = {
            url: url
          };

          if (timestamp !== null) {
            params.timestamp = timestamp;
          }

          var searchParams = paramify(params);
          var fetchFunction = isInBrowser() ? fetchJsonp : fetch;
          return fetchFunction("".concat(_this22.AVAILABLE_API_BASE, "?").concat(searchParams));
        }).then(function (_resp) {
          var response = _resp;
          return response.json();
        });
      }
      /**
       * @see https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
       */

    }, {
      key: "cdx",
      value: function cdx() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _this23 = this;

        return Promise.resolve().then(function () {
          options.output = "json";
          var searchParams = paramify(options);
          return fetch("".concat(_this23.CDX_API_BASE, "?").concat(searchParams));
        }).then(function (_resp) {
          var response = _resp;
          return response.text();
        }).then(function (_resp) {
          var raw = _resp;
          var json;

          try {
            json = JSON.parse(raw);
          } catch (e) {
            json = {
              error: raw.trim()
            };
          }

          return json;
        });
      }
      /**
       * @see https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/edit
       */

    }, {
      key: "savePageNow",
      value: function savePageNow() {
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref16$url = _ref16.url,
            url = _ref16$url === void 0 ? null : _ref16$url,
            _ref16$captureOutlink = _ref16.captureOutlinks,
            captureOutlinks = _ref16$captureOutlink === void 0 ? 0 : _ref16$captureOutlink,
            _ref16$captureAll = _ref16.captureAll,
            captureAll = _ref16$captureAll === void 0 ? true : _ref16$captureAll,
            _ref16$captureScreens = _ref16.captureScreenshot,
            captureScreenshot = _ref16$captureScreens === void 0 ? false : _ref16$captureScreens,
            _ref16$skipFirstArchi = _ref16.skipFirstArchive,
            skipFirstArchive = _ref16$skipFirstArchi === void 0 ? true : _ref16$skipFirstArchi,
            _ref16$ifNotArchivedW = _ref16.ifNotArchivedWithin,
            ifNotArchivedWithin = _ref16$ifNotArchivedW === void 0 ? null : _ref16$ifNotArchivedW,
            _ref16$auth = _ref16.auth,
            auth = _ref16$auth === void 0 ? newEmptyAuth() : _ref16$auth;

        var _this24 = this;

        return Promise.resolve().then(function () {
          url = url.replace(/^https?\:\/\//, "");
          var params = {
            url: url,
            capture_outlinks: captureOutlinks,
            capture_all: captureAll ? "1" : "0",
            capture_screenshot: captureScreenshot ? "1" : "0",
            skip_first_archive: skipFirstArchive ? "1" : "0"
          };

          if (ifNotArchivedWithin) {
            params.if_not_archived_within = ifNotArchivedWithin;
          }

          return fetch(_this24.SAVE_API_BASE, {
            credentials: "omit",
            method: "POST",
            body: paramify(params),
            headers: _objectSpread({
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            }, authToHeaderS3(auth))
          });
        }).then(function (_resp) {
          var response = _resp;
          return response.json();
        });
      }
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
      value: function ls(identifier, zipPath) {
        var auth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : newEmptyAuth();
        return Promise.resolve().then(function () {
          if (!zipPath.match(/\.(7z|cbr|cbz|cdr|iso|rar|tar|zip)$/)) {
            throw new Error("Invalid zip type");
          }

          var requestUrl = corsWorkAround("https://archive.org/download/".concat(identifier, "/").concat(enc(zipPath), "/"));
          return fetch(requestUrl, {
            headers: authToHeaderCookies(auth)
          });
        }).then(function (_resp) {
          var response = _resp;

          if (response.status != 200) {
            throw Error({
              error: "not found"
            });
          }

          return response.text();
        }).then(function (_resp) {
          var html = _resp; // This page has <td>'s without closing el tags (took a while to
          // figure this out). This breaks the DOMparser, so I added a workaround
          // to add closing tags

          var tableHtml = html.match(/(<table class="archext">[\w\W]*<\/table>)/g)[0];
          tableHtml = tableHtml.replace(/(<td[^>]*>[\w\W]*?)(?=<(?:td|\/tr))/g, "$1</td>");
          var table = new xmldom.DOMParser().parseFromString(tableHtml);
          var rows = table.getElementsByTagName("tr");
          var results = [];

          var _loop = function _loop(i) {
            var cells = rows.item(i).getElementsByTagName("td");

            if (cells.length != 4) {
              return "continue";
            }

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

          for (var i = 0; i < rows.length; i++) {
            var _ret = _loop(i);

            if (_ret === "continue") continue;
          }

          return results;
        });
      }
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
});
