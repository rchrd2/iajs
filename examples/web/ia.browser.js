(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
  typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
  (global = global || self, global.ia = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;

  const jsonFetch = async function (url) {
    const res = await fetch(url);
    const body = await res.text();
    return JSON.parse(body);
  };

  const REQUIRED = "__REQUIRED__";

  const checkRequired = function (options) {
    return null; // TODO
  };

  class AuthAPI {
    constructor() {
      this.API_BASE = "https://archive.org/account/login";
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
      let required = checkRequired();
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

  var main = {
    AuthAPI: new AuthAPI(),
    BookReaderAPI: new BookReaderAPI(),
    DetailsPageAPI: new DetailsPageAPI(),
    GifcitiesAPI: new GifcitiesAPI(),
    MetadataAPI: new MetadataAPI(),
    RelatedAPI: new RelatedAPI(),
    SearchAPI: new SearchAPI(),
    SearchTextAPI: new SearchTextAPI(),
    WaybackAPI: new WaybackAPI(),
  };

  return main;

})));
