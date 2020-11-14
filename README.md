# iajs

**Internet Archive JavaScript Client which supports reading and writing data in NodeJS and the Browser**

The Internet Archive is a non-profit open platform for archiving the world's free websites, books, movies, software, music, and more.

This JavaScript library enables reading and writing to the Internet Archive APIs in NodeJS **and** in the browser. To learn more about the Internet Archive visit <https://archive.org/about/>.

It's lightweight with very little dependencies.

The major APIs are documented here <https://archive.org/services/docs/api/index.html>, but this library supports additional APIs to enable more functionality. It does not abstract much from the APIs, but rather aggregates access to them all in a single multi-purpose library.

This library contains enough functionality to create powerful experiments and new experiences using the Internet Archive's platform and data.

## Live demos

<https://rchrd2.github.io/iajs/examples/web/01.html>


## Usage Examples

```
<script src="ia.browser.js"></script>
<script>
ia.GifcitiesAPI.search("snowglobe").then(console.log);

ia.MetadataAPI.get({
  identifier: "mma_the_sphynx_and_great_pyramid_geezeh_271101",
}).then(console.log);

ia.SearchAPI.get({
  q: {collection: "metropolitanmuseumofart-gallery"},
  fields: ["identifier", "title"]
}).then(console.log);
</script>
```

## Running NodeJS examples

```
npm i
node examples/node/01-hello.js

# this will ask you to sign in and create a login config file for other examples
node examples/node/02-login.js

node examples/node/03-reviews.js

# and so on...
```

## Planned features

- ✅ Read item metadata and list of files (Metadata API)
- ✅ Update item metadata (Metadata API)
- ✅ Search (Search API)
- ✅ Search gifcities.org (GifCities API)
- ✅ Query related item API (Related Items API)
- ✅ Sign in with user/pass (Xauthn API)
- ✅ Sign in with s3 tokens
- ✅ Sign in from archive.org session cookies
- ✅ Add reviews (Reviews API)
- ✅ Add page to Wayback (Save Page Now API)
- ✅ Query the Wayback Machine (CDX and Available APIs)
- ✅ Add/remove/list favorites (bookmarks.php API)
- ✅ Create items (S3 API)
- ✅ Upload item files (S3 API)
- OpenLibrary.org APIs
- BookReaderJSIA aka manifest API
- Book IIIF API
- TV
- Radio
- List reviews by user
- Generate embed codes for books/videos/music files in item
- Include a JSON diff library
- more tbd


## Misc

Note:
I wanted to build this while I worked at Internet Archive, but did not have the bandwidth. Now I'm working on this in my free time.

See Also:

- Official Internet Archive Python Client - https://github.com/jjjake/internetarchive

---

Screenshot of web usage example

![screenshot](./documentation/img/examples-ss-1.png)
