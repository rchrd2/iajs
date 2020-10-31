const fetch = require("node-fetch");

const rawFetch = async function (url) {
  const res = await fetch(url);
  return (body = await res.text());
};

const jsonFetch = async function (url) {
  const res = await fetch(url);
  const body = await res.text();
  return JSON.parse(body);
};

const log = console.log;

const REQUIRED = "__REQUIRED__";

const checkRequired = function (options) {
  for (k in options) {
    if (options[k] == REQUIRED) {
      return k;
    }
  }
  return null;
};

class AuthAPI {
  constructor() {
    this.API_BASE = "https://archive.org/account/login";
  }
}

class BookReaderAPI {}

class DetailsPageAPI {
  /* TODO scrape details page for display information */
  constructor() {
    this.API_BASE = "https://archive.org/details";
  }
}

class FilesXmlAPI {
  constructor() {
    this.API_PATTERN =
      "https://archive.org/download/{identifier}/{identifier}_files.xml";
  }
  async get({ identifier = null } = {}) {
    const url = this.API_PATTERN.replace(/{identifier}/g, identifier);
    const response = await rawFetch(url);
    // TODO parse the XML
    // const parser = new DOMParser();
    // const xml = parser.parseFromString(response, "application/xml");
    // return xml;
    return response;
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
    log(url);
    return jsonFetch(url);
  }
}

class SearchTextAPI {}
class WaybackAPI {}

module.exports = {
  AuthAPI: new AuthAPI(),
  BookReaderAPI: new BookReaderAPI(),
  DetailsPageAPI: new DetailsPageAPI(),
  FilesXmlAPI: new FilesXmlAPI(),
  MetadataAPI: new MetadataAPI(),
  RelatedAPI: new RelatedAPI(),
  SearchAPI: new SearchAPI(),
  SearchTextAPI: new SearchTextAPI(),
  WaybackAPI: new WaybackAPI(),
};
