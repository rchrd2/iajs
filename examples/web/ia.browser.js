(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
	typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
	(global = global || self, global.ia = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

	fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;

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
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    // to avoid param reassign
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
	      };

	      // Check if the user set their own params, and if not add a ? to start a list of params
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
	      }, timeout);

	      // Caught if got 404/500
	      jsonpScript.onerror = function () {
	        reject(new Error('JSONP request to ' + _url + ' failed'));

	        clearFunction(callbackFunction);
	        removeScript(scriptId);
	        if (timeoutId) clearTimeout(timeoutId);
	      };
	    });
	  }

	  // export as global function
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

	const REQUIRED = "__REQUIRED__";
	let CORS_PROXY = "https://iajs-cors.rchrd2.workers.dev";
	const enc = encodeURIComponent;
	const paramify = (obj) => new URLSearchParams(obj).toString();
	const str2arr = (v) => (Array.isArray(v) ? v : [v]);

	const isInBrowser = () => {
	  return !(typeof window === "undefined");
	};

	const corsWorkAround = (url) => {
	  if (isInBrowser()) {
	    return `${CORS_PROXY}/${url}`;
	  } else {
	    return url;
	  }
	};

	const fetchJson = async function (url, options) {
	  const res = await fetch(url, options);
	  return await res.json();
	};

	const authToHeaderS3 = function (auth) {
	  return auth.values.s3.access && auth.values.s3.secret
	    ? {
	        Authorization: `LOW ${auth.values.s3.access}:${auth.values.s3.secret}`,
	      }
	    : {};
	};
	const authToHeaderCookies = function (auth) {
	  if (
	    auth.values.cookies["logged-in-sig"] &&
	    auth.values.cookies["logged-in-user"]
	  ) {
	    let cookieStr = `logged-in-sig=${auth.values.cookies["logged-in-sig"]};`;
	    cookieStr += ` logged-in-user=${auth.values.cookies["logged-in-user"]}`;
	    const headers = { Cookie: cookieStr };
	    if (isInBrowser()) {
	      headers["X-Cookie-Cors"] = cookieStr;
	    }
	    return headers;
	  } else {
	    return {};
	  }
	};

	const newEmptyAuth = function () {
	  return JSON.parse(
	    JSON.stringify({
	      success: false,
	      values: {
	        cookies: { "logged-in-sig": null, "logged-in-user": null },
	        email: null,
	        itemname: null,
	        s3: { access: null, secret: null },
	        screenname: null,
	      },
	      version: 1,
	    })
	  );
	};

	class Auth {
	  constructor() {
	    this.XAUTH_BASE = corsWorkAround("https://archive.org/services/xauthn/");
	  }
	  async login(email, password) {
	    try {
	      const fetchOptions = {
	        method: "POST",
	        body: `email=${enc(email)}&password=${enc(password)}`,
	        headers: {
	          "Content-Type": "application/x-www-form-urlencoded",
	        },
	      };
	      const response = await fetch(`${this.XAUTH_BASE}?op=login`, fetchOptions);
	      const data = await response.json();
	      if (!data.success) {
	        data.values = { ...data.values, ...newEmptyAuth().values };
	      }
	      return data;
	    } catch (e) {
	      // TODO figure out syntax for catching error reponse
	      return newEmptyAuth();
	    }
	  }
	  async fromS3(access, secret, newAuth = newEmptyAuth()) {
	    newAuth.success = 1;
	    newAuth.values.s3.access = access;
	    newAuth.values.s3.secret = secret;
	    const info = await fetchJson("https://s3.us.archive.org?check_auth=1", {
	      headers: authToHeaderS3(newAuth),
	    });
	    newAuth.values.email = info.username;
	    newAuth.values.itemname = info.itemname;
	    newAuth.values.screenname = info.screenname;
	    // Note the auth object is missing cookie fields.
	    // It is still TBD if those are needed
	    return newAuth;
	  }
	  async fromCookies(loggedInSig, loggedInUser, newAuth = newEmptyAuth()) {
	    newAuth.values.cookies["logged-in-sig"] = loggedInSig;
	    newAuth.values.cookies["logged-in-user"] = loggedInUser;
	    const s3response = await fetch(
	      corsWorkAround("https://archive.org/account/s3.php?output_json=1"),
	      {
	        headers: authToHeaderCookies(newAuth),
	      }
	    );
	    const s3 = await s3response.json();
	    if (!s3.success) {
	      throw new Error();
	    }
	    return await this.fromS3(s3.key.s3accesskey, s3.key.s3secretkey, newAuth);
	  }
	}

	class BookReaderAPI {}

	class FavoritesAPI {
	  constructor() {
	    this.API_BASE = corsWorkAround("https://archive.org/bookmarks.php");
	    // TODO support this non-json explore endpoint
	    this.EXPLORE_API_BASE = "https://archive.org/bookmarks-explore.php";
	  }
	  async get({ screenname = null, auth = newEmptyAuth() }) {
	    if (!screenname && auth.values.screenname) {
	      screenname = auth.values.screenname;
	    }
	    if (screenname) {
	      let params = { output: "json", screenname };
	      return await fetchJson(`${this.API_BASE}?${paramify(params)}`);
	    } else {
	      throw new Error(
	        "Neither screenname or auth provided for bookmarks lookup"
	      );
	    }
	  }
	  async add({ identifier = null, comments = "", auth = newEmptyAuth() } = {}) {
	    return await this.modify({ identifier, add_bookmark: 1 }, auth);
	  }
	  async remove({ identifier = null, auth = null } = {}) {
	    return await this.modify({ identifier, del_bookmark: identifier }, auth);
	  }
	  async modify(params, auth) {
	    try {
	      let mdResponse = await iajs.MetadataAPI.get({
	        identifier: params.identifier,
	        path: "/metadata",
	      });
	      params.title = str2arr(mdResponse.result.title).join(", ");
	      params.mediatype = mdResponse.result.mediatype;
	    } catch (e) {
	      throw new Error(`Metadata lookup failed for: ${params.identifier}`);
	    }
	    params.output = "json";
	    const response = await fetch(`${this.API_BASE}?${paramify(params)}`, {
	      method: "POST",
	      headers: authToHeaderCookies(auth),
	    });
	    return await response.json().catch((e) => {
	      return { error: e };
	    });
	  }
	}

	class GifcitiesAPI {
	  constructor() {
	    this.API_BASE = "https://gifcities.archive.org/api/v1/gifsearch";
	  }
	  async get({ q = null } = {}) {
	    if (q === null) return [];
	    return fetchJson(`${this.API_BASE}?q=${enc(q)}`);
	  }
	  async search(q) {
	    return this.get({ q });
	  }
	}

	class MetadataAPI {
	  constructor() {
	    this.READ_API_BASE = "https://archive.org/metadata";
	    this.WRITE_API_BASE = corsWorkAround("https://archive.org/metadata");
	  }
	  async get({ identifier = null, path = "", auth = newEmptyAuth() } = {}) {
	    const options = {};
	    options.headers = authToHeaderS3(auth);
	    return fetchJson(`${this.READ_API_BASE}/${identifier}/${path}`, options);
	  }
	  async patch({
	    identifier = null,
	    target = "metadata",
	    priority = -5,
	    patch = {},
	    auth = newEmptyAuth(),
	  } = {}) {
	    // https://archive.org/services/docs/api/metadata.html#targets
	    const reqParams = {
	      "-target": target,
	      "-patch": JSON.stringify(patch),
	      priority,
	      secret: auth.values.s3.secret,
	      access: auth.values.s3.access,
	    };
	    const url = `${this.WRITE_API_BASE}/${identifier}`;
	    const body = paramify(reqParams);
	    const response = await fetch(url, {
	      method: "POST",
	      body,
	      headers: {
	        "Content-Type": "application/x-www-form-urlencoded",
	      },
	    });
	    return await response.json();
	  }
	}

	class RelatedAPI {
	  constructor() {
	    this.API_BASE = "https://be-api.us.archive.org/mds/v1";
	  }
	  async get({ identifier = null } = {}) {
	    return fetchJson(`${this.API_BASE}/get_related/all/${identifier}`);
	  }
	}

	class ReviewsAPI {
	  constructor() {
	    this.WRITE_API_BASE = corsWorkAround(
	      "https://archive.org/services/reviews.php?identifier="
	    );
	    this.READ_API_BASE = "https://archive.org/metadata";
	  }
	  async get({ identifier = null } = {}) {
	    return fetchJson(`${this.READ_API_BASE}/${identifier}/reviews`);
	  }
	  async add({
	    identifier = null,
	    title = null,
	    body = null,
	    stars = null,
	    auth = newEmptyAuth(),
	  } = {}) {
	    const url = `${this.WRITE_API_BASE}${identifier}`;
	    const response = await fetch(url, {
	      method: "POST",
	      body: JSON.stringify({ title, body, stars }),
	      headers: {
	        "Content-Type": "application/json",
	        ...authToHeaderS3(auth),
	      },
	    });
	    return await response.json();
	  }
	}

	class S3API {
	  constructor() {
	    this.API_BASE = "https://s3.us.archive.org";
	  }
	  async ls({ identifier = null, auth = newEmptyAuth() } = {}) {
	    // throw new Error("TODO parse that XML");
	    if (!identifier) {
	      throw new Error("Missing required args");
	    }
	    return await (await fetch(`${this.API_BASE}/${identifier}`)).text();
	  }
	  async upload({
	    identifier = null,
	    key = null,
	    body = "",
	    autocreate = false,
	    skipDerive = false,
	    testItem = false,
	    keepOldVersions = true,
	    metadata = {},
	    headers = {},
	    wait = true,
	    auth = newEmptyAuth(),
	  }) {
	    if (!identifier) {
	      throw new Error("Missing required args");
	    }

	    if (testItem) {
	      metadata["collection"] = "test_collection";
	    }

	    const requestHeaders = {};
	    Object.keys(metadata).forEach((k) => {
	      str2arr(metadata[k]).forEach((v, idx) => {
	        k = k.replace(/_/g, "--");
	        let headerKey = `x-archive-meta${idx}-${k}`;
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

	    const requestUrl = key
	      ? `${this.API_BASE}/${identifier}/${key}`
	      : `${this.API_BASE}/${identifier}`;

	    const response = await fetch(requestUrl, {
	      method: "PUT",
	      headers: requestHeaders,
	      body,
	    });

	    if (response.status !== 200) {
	      // NOTE this may not be the right thing to check.
	      // Maybe different codes are okay
	      throw new Error(`Response: ${response.status}`);
	    }

	    if (!wait) {
	      return response;
	    }
	    // The finished response seems to be empty
	    return await response.text();
	  }
	}

	class SearchAPI {
	  constructor() {
	    this.API_BASE = "https://archive.org/advancedsearch.php";
	  }
	  async get({
	    q = REQUIRED,
	    page = 1,
	    fields = ["identifier"],
	    ...options
	  } = {}) {
	    if (typeof q == "object") {
	      q = this.buildQueryFromObject(q);
	    }
	    const reqParams = {
	      q,
	      page,
	      fl: fields,
	      ...options,
	      output: "json",
	    };
	    // let required = checkRequired(reqParams);
	    // if (required !== null) {
	    //   return { required };
	    // }
	    const encodedParams = paramify(reqParams);
	    const url = `${this.API_BASE}?${encodedParams}`;
	    return fetchJson(url);
	  }
	  async search(q) {
	    return await this.get({ q });
	  }
	  buildQueryFromObject(qObject) {
	    // Map dictionary to a key=val search query
	    return Object.keys(qObject)
	      .map((key) => {
	        if (Array.isArray(qObject[key])) {
	          return `${key}:( ${qObject[key].map((v) => `"${v}"`).join(" OR ")} )`;
	        } else {
	          return `${key}=${qObject[key]}`;
	        }
	      })
	      .join(" AND ");
	  }
	}

	class SearchTextAPI {}

	class ViewsAPI {
	  constructor() {
	    // https://be-api.us.archive.org/views/v1/short/<identifier>[,<identifier>,...]
	    this.API_BASE = "https://be-api.us.archive.org/views/v1/short";
	  }
	  async get({ identifier = null } = {}) {
	    identifier = Array.isArray(identifier) ? identifier.join(",") : identifier;
	    return fetchJson(`${this.API_BASE}/${identifier}`);
	  }
	}

	class WaybackAPI {
	  constructor() {
	    this.AVAILABLE_API_BASE = "https://archive.org/wayback/available";
	    this.CDX_API_BASE = corsWorkAround("https://web.archive.org/cdx/search/");
	    this.SAVE_API_BASE = corsWorkAround("https://web.archive.org/save/");
	  }
	  /**
	   * @see https://archive.org/help/wayback_api.php
	   */
	  async available({ url = null, timestamp = null } = {}) {
	    const params = { url };
	    if (timestamp !== null) {
	      params.timestamp = timestamp;
	    }
	    const searchParams = paramify(params);
	    const fetchFunction = isInBrowser() ? fetchJsonp : fetch;
	    const response = await fetchFunction(
	      `${this.AVAILABLE_API_BASE}?${searchParams}`
	    );
	    return await response.json();
	  }
	  /**
	   * @see https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
	   */
	  async cdx(options = {}) {
	    options.output = "json";
	    const searchParams = paramify(options);
	    const response = await fetch(`${this.CDX_API_BASE}?${searchParams}`);
	    const raw = await response.text();
	    let json;
	    try {
	      json = JSON.parse(raw);
	    } catch (e) {
	      json = { error: raw.trim() };
	    }
	    return json;
	  }
	  /**
	   * @see https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/edit
	   */
	  async savePageNow({
	    url = null,
	    captureOutlinks = 0,
	    captureAll = true,
	    captureScreenshot = false,
	    skipFirstArchive = true,
	    ifNotArchivedWithin = null,
	    auth = newEmptyAuth(),
	  } = {}) {
	    url = url.replace(/^https?\:\/\//, "");
	    const params = {
	      url,
	      capture_outlinks: captureOutlinks,
	      capture_all: captureAll ? "1" : "0",
	      capture_screenshot: captureScreenshot ? "1" : "0",
	      skip_first_archive: skipFirstArchive ? "1" : "0",
	    };
	    if (ifNotArchivedWithin) {
	      params.if_not_archived_within = ifNotArchivedWithin;
	    }
	    const response = await fetch(this.SAVE_API_BASE, {
	      credentials: "omit",
	      method: "POST",
	      body: paramify(params),
	      headers: {
	        Accept: "application/json",
	        "Content-Type": "application/x-www-form-urlencoded",
	        ...authToHeaderS3(auth),
	      },
	    });
	    return await response.json();
	  }
	}

	const iajs = {
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
	};

	return iajs;

})));
