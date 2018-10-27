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

var precacheConfig = [["/static/css/admin.f87e6ef.css","c5772bc26ca11b2ba0600792a9f219f5"],["/static/img/401.089007e.gif","089007e721e1f22809c0313b670a36f1"],["/static/img/404.a57b6f3.png","a57b6f31fa77c50f14d756711dea4158"],["/static/img/element-icons.6f0a763.ttf","6f0a76321d30f3c8120915e57f7bd77e"],["/static/js/0.7c4fc0d.js","873b32059648346e13ae5f3c1dbcb573"],["/static/js/1.026eea1.js","ecddd20cbd81a3c93d7b30b3907fd246"],["/static/js/10.6440c93.js","aa90eaf8ec955ce31228c18cc6fecb9e"],["/static/js/11.34f2629.js","8c5b5c03c39171343b11fbc0943727c4"],["/static/js/12.74d5d8c.js","61054cfee6043125b51c74d8c5246ca3"],["/static/js/13.745cf38.js","e0a48e8f251f57cd60219f089a45177e"],["/static/js/14.c2e9a64.js","f3372bb813b60614d7e0f66aa63cfd4f"],["/static/js/15.aa91dd2.js","2db08f1fda627583292b815793a3a193"],["/static/js/16.20f031c.js","df95a1571db3c0c41508bd96e54bbe4c"],["/static/js/17.310cf41.js","c1db542d1aefe3ace015f0d371317cb6"],["/static/js/18.d59d9b8.js","b05c1981755c190331c898435b626e4f"],["/static/js/19.3fd192f.js","a32b1183f93f505795849b991766fb26"],["/static/js/2.5998be1.js","a3c355506ef1c9245e852eda64e9cc4c"],["/static/js/20.6fefa33.js","98925c95a2324d06115ecbae0dacf0d8"],["/static/js/21.cbd3a09.js","1ac96a170297d7452ac5f94cc40bf83f"],["/static/js/22.216cd19.js","fd830449c26653159ffd6497e5359d43"],["/static/js/23.fac0758.js","281eb86c4b2144337c22e4916cc1166b"],["/static/js/24.3f5e2b4.js","f7c68dd553d0d96627bdbb8ac8708f76"],["/static/js/25.a5bffdb.js","c06ee7decb8975787106f0cf3c7091f8"],["/static/js/26.0239219.js","3502ef4d4429cc01273470524bc5cad2"],["/static/js/27.a6bcc32.js","00d253f3953a21451521626472b43cda"],["/static/js/28.568b809.js","ccadffba85747800b4cc00a3b24b6eb8"],["/static/js/29.9a20d33.js","15b5126d0dfed615f885cff0099866bf"],["/static/js/3.e6b84b6.js","8de115251d1aaef3758fc42e3d70f367"],["/static/js/30.1aedbd0.js","b70f2eb0370c929ef83dd4c6207c5240"],["/static/js/31.0f14517.js","38ac1ad61124f972c613972b7f87fb8b"],["/static/js/32.aae0b7b.js","0c5b8e041649cec223d1c7afd7e1a274"],["/static/js/33.6e8090a.js","530bbffc1417314db7ea8fa4ac3c6d8e"],["/static/js/34.fae587e.js","acab60eb6932d1b38fd739329b2de2d4"],["/static/js/35.bf4d052.js","d4c986ab130c3defcbf1ffe92a8d41e8"],["/static/js/36.04ecc29.js","4a31ce76cfcf8aeab8c5da864ba13c5c"],["/static/js/37.85764f1.js","18ceb6da5137aa55300e4d41d0caea15"],["/static/js/38.6cd88ad.js","216be3cca0b688959dd69c08040b95f2"],["/static/js/39.92eb050.js","e24aa813528c6646cabefa2e8e064565"],["/static/js/4.9e9362d.js","2a5ad025457952c18390e4d02d4bf939"],["/static/js/40.d00fb09.js","81fb6f703992d6dcc3ba363c2fd0a63f"],["/static/js/41.012154d.js","afad5924095691a4dd1dba0eaa1468e5"],["/static/js/42.f21ce34.js","de9ef49764f269953f5d7c360f202faa"],["/static/js/43.7b9b209.js","8a096fa43f7eb5686adcad6b81ef5520"],["/static/js/44.2ca336f.js","807f34fd7b5752d433f108a0f43b497c"],["/static/js/45.086af4e.js","14f947fffd081718b6f93152edfe1e10"],["/static/js/46.bf9b5bb.js","e1d5d307a09644355c13b1c075de7c28"],["/static/js/47.0e6d065.js","c06ebfefa6513d08b1af337497529349"],["/static/js/48.97fb348.js","d4049aa4a089589b88aa77efbbeecb5d"],["/static/js/49.cfceb6b.js","b112cbf36440df30bf098d62680f9f07"],["/static/js/5.1e4557f.js","96823bbf90336cb6bef29e42fd4bc43b"],["/static/js/50.072cc8a.js","d71fe3bb7271f60ea0919edc877bd727"],["/static/js/51.d11d037.js","137d4e9095819378f71dc5dc9e8aefc4"],["/static/js/52.ee54caa.js","b63f6ed999e79e9438b46fde4540eb6a"],["/static/js/53.99f331e.js","646e5559ed6fff70de6251da8cfdb1a9"],["/static/js/54.138eafd.js","f74eef504d72cd5d9f4a5dc2cd01a592"],["/static/js/55.77f59f5.js","6a0ade6610f85659bb4d3386432ae2e2"],["/static/js/56.e63c831.js","53b5851923f039033e36300f9c87bbb2"],["/static/js/57.688b1a2.js","e9018d3eea1a3ef6a0664fb1e2014cc3"],["/static/js/58.fe77755.js","22c47812822c527f71adf6ef1f57522b"],["/static/js/59.59e69a8.js","7ef1333183dcd0f15e297b918fa643a9"],["/static/js/6.c039c8b.js","92e4fb921f73fbe4be39fd5dc25c1e4b"],["/static/js/60.2fd1805.js","6b030accf0a30a2506791bca694ef01b"],["/static/js/7.911e051.js","98eb1f6f486d62933d816817e53d1d20"],["/static/js/8.591f5ee.js","78c26c688bec69e58c71ccdc85b8f03e"],["/static/js/9.09fe6bc.js","89b7d1746911fd94a422259524c73305"],["/static/js/admin.575fb4e.js","0dc43fa8d01aae187877476cae96e77a"],["/static/js/element.40b20c9.js","91c0ea95c183c5a62ec5a9e7cdc40fe2"],["/static/js/manifest.db83c18.js","1d1e7c00a98331b4fe23d7137c5cf225"],["/static/js/vendor.41c198e.js","38e3a0be51e2410ad823126a769cfc66"]];
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







