const fetch = require('node-fetch');

const rawFetch = async function (url) {
  const res = await fetch(url);
  return body = await res.text();
}

const jsonFetch = async function (url) {
  const res = await fetch(url);
  const body = await res.text();
  return JSON.parse(body);
}

class AuthAPI {
  constructor() {
    this.API_BASE = 'https://archive.org/account/login';
  }
}

class DetailsPageAPI {
  /* TODO scrape details page for display information */
  constructor() {
    this.API_BASE = 'https://archive.org/details';
  }
}

class FilesXmlAPI {
  constructor() {
    this.API_PATTERN = 'https://archive.org/download/{identifier}/{identifier}_files.xml';
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
    this.API_BASE = 'https://archive.org/metadata';
  }
  async get({ identifier = null, path = '' } = {}) {
    return jsonFetch(`${this.API_BASE}/${identifier}/${path}`);
  }
}

class RelatedAPI {
  constructor() {
    this.API_BASE = 'https://be-api.us.archive.org/mds/v1';
  }
  async get({ identifier = null } = {}) {
    return jsonFetch(`${this.API_BASE}/get_related/all/${identifier}`)
  }
}

class SearchAPI {
  constructor() {
    // this.API_BASE = 'TODO';
  }
}

module.exports = {
  AuthAPI: new AuthAPI(),
  DetailsPageAPI: new DetailsPageAPI(),
  FilesXmlAPI: new FilesXmlAPI(),
  MetadataAPI: new MetadataAPI(),
  RelatedAPI: new RelatedAPI(),
  SearchAPI: new SearchAPI()
};