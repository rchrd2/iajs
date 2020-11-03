(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
  typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
  (global = global || self, global.ia = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;

  const CORS_PROXY = "https://iajs-cors.rchrd2.workers.dev";

  const jsonFetch = async function (url) {
    const res = await fetch(url);
    const body = await res.text();
    return JSON.parse(body);
  };

  const REQUIRED = "__REQUIRED__";

  const checkRequired = function (options) {
    return null; // TODO
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

  class ReviewsAPI {
    constructor() {
      this.WRITE_API_BASE =
        "https://archive.org/services/reviews.php?identifier=";
      this.READ_API_BASE = "https://archive.org/metadata/";
    }
    async get({ identifier = null } = {}) {
      return jsonFetch(`${this.READ_API_BASE}/${identifier}/reviews`);
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
      let required = checkRequired();
      if (required !== null) {
        return { required };
      }
      if (typeof q == "object") {
        q = this.buildQueryFromObject(q);
        console.log(q);
      }
      const reqOptions = {
        q,
        page,
        fl: fields,
        ...options,
        output: "json",
      };
      const encodedParams = new URLSearchParams(reqOptions).toString();
      const url = `${this.API_BASE}?${encodedParams}`;
      return jsonFetch(url);
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
      return jsonFetch(`${this.API_BASE}/${identifier}`);
    }
  }

  class WaybackAPI {}

  var main = {
    Auth: new Auth(),
    BookReaderAPI: new BookReaderAPI(),
    DetailsPageAPI: new DetailsPageAPI(),
    GifcitiesAPI: new GifcitiesAPI(),
    MetadataAPI: new MetadataAPI(),
    RelatedAPI: new RelatedAPI(),
    ReviewsAPI: new ReviewsAPI(),
    SearchAPI: new SearchAPI(),
    SearchTextAPI: new SearchTextAPI(),
    ViewsAPI: new ViewsAPI(),
    WaybackAPI: new WaybackAPI(),
  };

  return main;

})));
