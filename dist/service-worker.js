/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/static/css/admin.f5fdf7a.css","7cd7f31ea9f433ba4655c7dee7e971c8"],["/static/js/0.a3fe73f.js","f5150c9bc6f89c4333ade90a02985084"],["/static/js/1.f5c119e.js","0e334d54acb4e0cb55c6907ebdbc6dd8"],["/static/js/10.c4e25d7.js","c901adeb666ce1611b5e6f846eed53ba"],["/static/js/11.386b878.js","55123e665b30fcaf34d420bcc59853bf"],["/static/js/12.8175f1d.js","ac50b3c592ae1d08401528cee8c9b0a9"],["/static/js/13.b7b9123.js","d0b79786893b7a74d06734de10418899"],["/static/js/14.06ceb2e.js","0580a2e1b824e1b261d6652e061f1795"],["/static/js/15.f27bdf1.js","6bb7130308f69ba265edd7fbcded710d"],["/static/js/16.e3950bd.js","2d1614a8fe00675043b644333ac1a7a6"],["/static/js/17.9c91d45.js","ba056cbb26dfa512db4061717f91edd8"],["/static/js/18.5f4d7ad.js","5b298a28a52ec9c0a72fa6532954b40c"],["/static/js/19.23b2c0f.js","0b7aa0a167c547900d0b46c0cf90f094"],["/static/js/2.e78134c.js","3ec3e6e7fc87b6f56d9504d408f68d0c"],["/static/js/20.a4ae743.js","cfd5891a2278a9479c00f519c457a823"],["/static/js/21.492a35f.js","3e667489981f68f9b8e0fdbeee37a802"],["/static/js/22.9c0af6a.js","568263368ae300b0f1515fe5af117fac"],["/static/js/23.853e876.js","780cabc5f3edb2efdbc4b7ed8e3b36db"],["/static/js/24.4bc4043.js","be5690895e514734a50f6853c5167f01"],["/static/js/25.37e2106.js","907d1244277e6a1132543945bce4e111"],["/static/js/26.774d140.js","b7f1c3eacf0aebda1d76b17e01672c73"],["/static/js/27.fa79e62.js","15824869ba6c79e93e1ed3fc10242133"],["/static/js/28.1f753d3.js","6e06ac8d9625f4d3f2fd87a835f1c9bc"],["/static/js/29.d4c3682.js","ff877878a3158c4fe4cb276f1dae0a6e"],["/static/js/3.4a1c087.js","48ff9a3b245b1bee23f633fb7e20f85c"],["/static/js/30.ff9ceea.js","f32813ac77dc32c0baed88b39aafa1aa"],["/static/js/31.0b9af25.js","7bffa82d11f7cf180c43e96c9f22bd83"],["/static/js/32.e1165aa.js","9bbf74e5f2c01e1ea66994703e7d9c55"],["/static/js/33.0f6a563.js","b22df2b9a913a21a63efc4f82797690c"],["/static/js/34.47db115.js","31456ca1060aecfcce2c6fd81c8d1764"],["/static/js/35.5eddc9a.js","edb99150245db98fa99a140ddd6b5251"],["/static/js/36.17de3bd.js","dfa5ff453a207e30a685a9149a2fca10"],["/static/js/37.c4751d5.js","10e716b69f7b3bd39e3a57a47a9c4f29"],["/static/js/38.46bdd3f.js","54b6c31a3257aa0f8481596cd25f2109"],["/static/js/39.a1c6e78.js","1323ce32acecc73e1a236b0a8e8f627f"],["/static/js/4.2d0a476.js","71cad9afba88cd9193810bf206cebeb8"],["/static/js/40.f20a1a3.js","6af460e0da9f8f156d23d9caac07e1c0"],["/static/js/41.3ea60dc.js","a99d7fadc7bac702e009ae8da64af0f7"],["/static/js/42.a0a0ae6.js","731e2c098f4fafff9449524c547f3f7b"],["/static/js/43.d1a442b.js","c434ad6dd152be033a9c4cb66710c36f"],["/static/js/44.845828f.js","c6ce8f8b030f0992cd4cfcb3d1b9af6a"],["/static/js/45.07507cd.js","bbebf9e83a332c96acc417423fdb6e1b"],["/static/js/46.04dbcca.js","ad74f19f544738433ae6178268600d75"],["/static/js/47.4b80120.js","c3721586b112a17525df963b0d91842a"],["/static/js/48.fa7ac20.js","50264878d2f9067c23b33b0de4bcdd49"],["/static/js/5.1711711.js","602480ac17baa4e641fb2dc7f3f725c1"],["/static/js/6.f560fbd.js","0bbac6e3275225263602e696d4e8155d"],["/static/js/7.8956344.js","69a89f46734b9e1f266e7bf444697cc6"],["/static/js/8.d09d186.js","c860e04e51789d404790107218d512f2"],["/static/js/9.dc92b6e.js","fd5b442b796538d8beac9e6ca3ecda95"],["/static/js/admin.3e14cf1.js","b3d49672423440cbb1982f8367f8bb10"],["/static/js/element.0d4b843.js","d441a13ba13922cf56d597a4fb99e6c4"],["/static/js/manifest.adca32f.js","e3a001112983770739fcc349e61de273"],["/static/js/vendor.f81cb69.js","d9ca16b843286defc833633a183aa8dd"]];
var cacheName = 'sw-precache-v3-doracms-vue2-ssr-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, /./);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







