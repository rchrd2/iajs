import fetch from "node-fetch";

const log = console.log;
const enc = encodeURIComponent;
const REQUIRED = "__REQUIRED__";
const emptyAuth = {
  success: false,
  values: {
    cookies: {},
    email: null,
    itemname: null,
    s3: { access: null, secret: null },
    screenname: null,
  },
  version: 1,
};
let CORS_PROXY = "https://iajs-cors.rchrd2.workers.dev";

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

const fetchJson = async function (url) {
  const res = await fetch(url);
  return await res.json();
};

const checkRequired = function (options) {
  return null; // TODO
  for (k in options) {
    if (options[k] == REQUIRED) {
      return k;
    }
  }
  return null;
};

class Auth {
  constructor() {
    this.XAUTH_URL = corsWorkAround(
      "https://archive.org/services/xauthn/?op=login"
    );
  }
  async login(email, password) {
    try {
      const fetchOptions = {
        method: "POST",
        body: `email=${enc(email)}&password=${enc(password)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };
      const response = await fetch(this.XAUTH_URL, fetchOptions);
      return await response.json();
    } catch (e) {
      // TODO figure out syntax for catching error reponse
      return { success: false };
    }
  }
}

class BookReaderAPI {}

class GifcitiesAPI {
  constructor() {
    this.API_BASE = "https://gifcities.archive.org/api/v1/gifsearch";
  }
  async get({ q = null } = {}) {
    if (q === null) return [];
    return fetchJson(`${this.API_BASE}?q=${encodeURIComponent(q)}`);
  }
  async search(q) {
    return this.get({ q });
  }
}

class MetadataAPI {
  constructor() {
    this.API_BASE = "https://archive.org/metadata";
  }
  async get({ identifier = null, path = "" } = {}) {
    return fetchJson(`${this.API_BASE}/${identifier}/${path}`);
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
    this.READ_API_BASE = "https://archive.org/metadata/";
  }
  async get({ identifier = null } = {}) {
    return fetchJson(`${this.READ_API_BASE}/${identifier}/reviews`);
  }
  async add({
    identifier = null,
    title = null,
    body = null,
    stars = null,
    auth = emptyAuth,
  } = {}) {
    const url = `${this.WRITE_API_BASE}${identifier}`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ title, body, stars }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `LOW ${auth.values.s3.access}:${auth.values.s3.secret}`,
      },
    });
    return await response.json();
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
      console.log(q);
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
    const encodedParams = new URLSearchParams(reqParams).toString();
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

class WaybackAPI {}

export default {
  Auth: new Auth(),
  BookReaderAPI: new BookReaderAPI(),
  GifcitiesAPI: new GifcitiesAPI(),
  MetadataAPI: new MetadataAPI(),
  RelatedAPI: new RelatedAPI(),
  ReviewsAPI: new ReviewsAPI(),
  SearchAPI: new SearchAPI(),
  SearchTextAPI: new SearchTextAPI(),
  ViewsAPI: new ViewsAPI(),
  WaybackAPI: new WaybackAPI(),
  CORS_PROXY,
};
