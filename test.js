const {
  AuthAPI,
  DetailsPageAPI,
  FilesXmlAPI,
  MetadataAPI,
  RelatedAPI,
  SearchAPI
} = require('./index');

const log = console.log;
const identifier = 'example-png';

(async () => {
  log(await MetadataAPI.get({ identifier, path: 'metadata' }));
  log(await MetadataAPI.get({ identifier, path: 'metadata/identifier' }));
  log(await RelatedAPI.get({ identifier }));
  log(await FilesXmlAPI.get({ identifier }));
})();
