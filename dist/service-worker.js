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

var precacheConfig = [["/static/css/admin.51753ad.css","063a952162e1d6e817c7ccc3c91c1db6"],["/static/img/401.089007e.gif","089007e721e1f22809c0313b670a36f1"],["/static/img/404.a57b6f3.png","a57b6f31fa77c50f14d756711dea4158"],["/static/img/element-icons.535877f.woff","535877f50039c0cb49a6196a5b7517cd"],["/static/img/element-icons.732389d.ttf","732389ded34cb9c52dd88271f1345af9"],["/static/js/0.933a9fc.js","2b127429f88613a44d83bfe1cb144787"],["/static/js/1.8526f38.js","d898fa762cf84d3b997a81b8fe2bdba6"],["/static/js/10.9b34bff.js","64d62bb6d3cf6be83c8b39c3df9781e5"],["/static/js/11.bce045c.js","f72e3aff38c24bc8213f255964f98d1b"],["/static/js/12.5307203.js","5e3fb8f73dd263d53b43f34dc3c59d09"],["/static/js/13.ec2fa9f.js","e09e1f6f19986f7585615aa0f2768184"],["/static/js/14.e5c3a3b.js","b0dd72f91b06a2a5c6e79d113d1ef2cc"],["/static/js/15.fff32b0.js","30ff98afaa0d07149ccffdb3eace648e"],["/static/js/16.e51db29.js","223fa878f2ee5d433a45dd963b43534d"],["/static/js/17.ca2f4ed.js","419f6a888647e4a6e547d44a64e193d0"],["/static/js/18.120e14a.js","ad36ed0727f27bac8dad408b7ec8b196"],["/static/js/19.87e8f80.js","323da533b3a2150cd3ef3a48b82efa11"],["/static/js/2.8eb2a16.js","57bc1a00f247a59dafc08b3a0333786b"],["/static/js/20.d2b51d1.js","c9457e4abdf3bad311d42e54551a16c2"],["/static/js/21.ef6b25a.js","4079b0c38739e8019e2286921ecee4ac"],["/static/js/22.7733238.js","739a794b71c75d24b259ce1d86097164"],["/static/js/23.968b50c.js","8c729974dfc5051282394fdd3c7ba96a"],["/static/js/24.4d9f715.js","eaa14deca3225265cd390c5275b07c7b"],["/static/js/25.93717a5.js","d2e0d3cd6343b3d9c6888c11662462b2"],["/static/js/26.5b6a1b4.js","f4029f7c90af3499e20507b1e2687d77"],["/static/js/27.6997828.js","46c8d7998102310af7718e644bed08b1"],["/static/js/28.59ab20c.js","4c5721a06ae23c2d3e8dea4bbd8b9b9c"],["/static/js/29.e80dba0.js","64eccdfeb8d03fdba61e0568ba6391f8"],["/static/js/3.2250925.js","12ccb2e7d2b543e05033d5d6fcf678c8"],["/static/js/30.04cb76d.js","056cf8d510b23ae8d58719a6102bb71e"],["/static/js/31.a959397.js","f9bf03ba014c610977e66be918a7cf82"],["/static/js/32.8d65017.js","b4130c8ab512105a9550da9c79c7d197"],["/static/js/33.39e15e8.js","38f3f289bc2fe724b92d8a593dc7e72d"],["/static/js/34.73a9dc6.js","245d5b0e9bc187331429622eaa943e4b"],["/static/js/35.2ae8232.js","962748d49a8be1898a0a912d8831cdd1"],["/static/js/36.9984ba7.js","a645495bde9fa062eb3e529e7c20b6ca"],["/static/js/37.ee74de3.js","5e08655918b18996f8c092b156a5460e"],["/static/js/38.e0e8b6e.js","5ddf4c89b14d0f08052e2a66ca35fb58"],["/static/js/39.29c9bb9.js","38ef41e5ecbfc83c3fba5a61048c0726"],["/static/js/4.28c09a4.js","e525df9e699540ec89f867eaac7db4f5"],["/static/js/40.7b5b8b3.js","876bf8da1846085c539550582a9832f8"],["/static/js/41.e9cc7a4.js","209715e5b3548259463ac014b65aefc6"],["/static/js/42.2d3fe89.js","5666fb83a612d32b4050c62b5c94c474"],["/static/js/43.14871ef.js","9d11d113eebfcc7d82fd634e534bfca3"],["/static/js/44.3faac14.js","b9e3b159fbf35bcec2d8368e9bdce2b4"],["/static/js/45.1dfcea7.js","f88ba98926ae622202eb5b7143f5db32"],["/static/js/46.fbdba5e.js","e98fb694a5903c922d9c1184523b490d"],["/static/js/47.f710efe.js","42f9d8c73ca0cfd2bbf5f161b83581a0"],["/static/js/48.feeba4a.js","1878dad106a9488124b84cfb65189159"],["/static/js/49.676f5a3.js","8e1595e5e07a4c3391050376bad07505"],["/static/js/5.5b03434.js","48532a6f5531f6f89fce5f808a696c46"],["/static/js/50.c3f2e27.js","426d62b94273ae33e326b1a09f80147c"],["/static/js/51.359e781.js","6a52f0fd156ea3a027e1adbbe16e9132"],["/static/js/52.6547cdb.js","8331e249a34d18c4d230c82fea5d5697"],["/static/js/53.cf48b65.js","fec0483cb6af765f56f2f626ede8e979"],["/static/js/54.39c3be2.js","78c2df8cf6ef46c44edb89d41e0f001b"],["/static/js/55.a5e1a1a.js","f3d9cab18ce78ddbd3833422c235eb4b"],["/static/js/56.2aa2389.js","25978d9564caf6c2db1607a811b148f6"],["/static/js/57.f65108e.js","00fff7680beee1fc474df5bb5bcf4812"],["/static/js/58.3b2c64b.js","0b0e51bf7c3b3d1551048f8e32807730"],["/static/js/59.e796391.js","1c9e08c1d28ea34bdacccdc0e3a37636"],["/static/js/6.1bab32d.js","470edadf9cb81e0f52d67cfc7f4a8e46"],["/static/js/60.5922a02.js","98263d6fca4e8732b0d89f1b2c606d4b"],["/static/js/61.159d841.js","67eb37badb043a6e45426335f2acaf14"],["/static/js/62.c031ff8.js","13aecdaf18b397f4b66197ef871fae05"],["/static/js/63.d505a06.js","c5dc0effc6358001f0185e41eeb97cf7"],["/static/js/64.46de99c.js","85f3db3db1955722dc686865065b42aa"],["/static/js/65.416ac6e.js","2c5d5e64c51a2f656c3ae7d2c909d1ac"],["/static/js/66.2dfe8f8.js","ce40722a7af2a592a32a050b6fb62a75"],["/static/js/67.255f156.js","4b7229b361c1c9ec776bd02fce841844"],["/static/js/68.562f019.js","29311c96cb3d2c840840bb19cd7e45dd"],["/static/js/7.5b987e9.js","3151eefbf6493054ef550c9e72107fed"],["/static/js/8.c323e73.js","5507fb174dcf4b628efa7cd971096d9b"],["/static/js/9.b0440e5.js","f174afa8debb92b66437cd5b4ce64344"],["/static/js/admin.cca4fc5.js","3e8c5baa09e099b28d3cb97897329cad"],["/static/js/manifest.c544396.js","6b54cc2af8dd9172f0902820a5b71914"],["/static/js/vendor.af8d545.js","4e0ad06280f0deb53430d99d9d4856bd"]];
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







