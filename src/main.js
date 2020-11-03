import fetch from "node-fetch";

const CORS_PROXY = "https://iajs-cors.rchrd2.workers.dev";

const rawFetch = async function (url) {
  const res = await fetch(url);
  return await res.text();
};

const jsonFetch = async function (url) {
  const res = await fetch(url);
  const body = await res.text();
  return JSON.parse(body);
};

const log = console.log;

const REQUIRED = "__REQUIRED__";

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
    this.XAUTH_URL = "https://archive.org/services/xauthn/?op=login";
    if (!(typeof window === "undefined")) {
      this.XAUTH_URL = `${CORS_PROXY}/${this.XAUTH_URL}`;
    }
  }
  async login(email, password) {
    try {
      const enc = encodeURIComponent;
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
    return jsonFetch(`${this.API_BASE}?q=${encodeURIComponent(q)}`);
  }
  async search(q) {
    return this.get({ q });
  }
}

class DetailsPageAPI {
  /* TODO scrape details page for display information */
  constructor() {
    this.API_BASE = "https://archive.org/details";
  }
}

class MetadataAPI {
  constructor() {
    this.API_BASE = "https://archive.org/metadata";
  }
  async get({ identifier = null, path = "" } = {}) {
    return jsonFetch(`${this.API_BASE}/${identifier}/${path}`);
  }
}

class RelatedAPI {
  constructor() {
    this.API_BASE = "https://be-api.us.archive.org/mds/v1";
  }
  async get({ identifier = null } = {}) {
    return jsonFetch(`${this.API_BASE}/get_related/all/${identifier}`);
  }
}

class SearchAPI {
  constructor() {
    this.API_BASE = "https://archive.org/advancedsearch.php";
    // ?q=test&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&save=yes';
  }
  async get({
    q = REQUIRED,
    page = 1,
    fields = ["identifier"],
    ...options
  } = {}) {
    const reqOptions = {
      q,
      page,
      fl: fields,
      ...options,
      output: "json",
    };
    let required = checkRequired(reqOptions);
    if (required !== null) {
      return { required };
    }
    const encodedParams = new URLSearchParams(reqOptions).toString();
    const url = `${this.API_BASE}?${encodedParams}`;
    return jsonFetch(url);
  }
  async search(q) {
    return await this.get({ q });
  }
}

class SearchTextAPI {}
class WaybackAPI {}

export default {
  Auth: new Auth(),
  BookReaderAPI: new BookReaderAPI(),
  DetailsPageAPI: new DetailsPageAPI(),
  GifcitiesAPI: new GifcitiesAPI(),
  MetadataAPI: new MetadataAPI(),
  RelatedAPI: new RelatedAPI(),
  SearchAPI: new SearchAPI(),
  SearchTextAPI: new SearchTextAPI(),
  WaybackAPI: new WaybackAPI(),
};
