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

var precacheConfig = [["/static/css/admin.637c345.css","68a550d619aafdfd750cd300c9745df7"],["/static/img/401.089007e.gif","089007e721e1f22809c0313b670a36f1"],["/static/img/404.a57b6f3.png","a57b6f31fa77c50f14d756711dea4158"],["/static/img/element-icons.535877f.woff","535877f50039c0cb49a6196a5b7517cd"],["/static/img/element-icons.732389d.ttf","732389ded34cb9c52dd88271f1345af9"],["/static/js/0.6342a49.js","ca6603068f570cad1065c6f516dc73b3"],["/static/js/1.73edb0b.js","de7a4b3e3b93dd6387329d87c70dfda5"],["/static/js/10.188c0ed.js","1c973494f8c456b5836e8d8b6f39aabb"],["/static/js/11.f908680.js","21b0e14d6a89b20b40bc0dc5e1d6eb7d"],["/static/js/12.cc93768.js","79a7d1a87c87b014b31c5bb563f264d9"],["/static/js/13.32e90c3.js","45c7fb950a3925df6bdaa18b90927816"],["/static/js/14.8f93846.js","443f3dc7caa90aa2bca03c640b746ccb"],["/static/js/15.8956c3d.js","4e1ef3b9e93218fedbbf4a93231bf177"],["/static/js/16.0f10a24.js","2664a299e6871eb3a4b4299726a27345"],["/static/js/17.3c38b8f.js","9d4d42f0daecdd62c2e22fb69dbac74c"],["/static/js/18.b903df8.js","7fff6a37bcd2dad80717df0feab663bf"],["/static/js/19.9e43f68.js","792841d1210366dcab25b3e1d9000f7a"],["/static/js/2.9ae1b21.js","8b17f029b1b85dd099fdc3554ce59dfc"],["/static/js/20.9a9705e.js","c90a1e8e1b2a71bc4088ec2d3c309f6d"],["/static/js/21.938ac43.js","85b83f353d80cce398a01b80f52e76db"],["/static/js/22.00c37ea.js","3f2e7c144c6aaed31a0a658e3ee0803a"],["/static/js/23.17f0ecf.js","2171e68f81c96413ae7e1f19d93da46a"],["/static/js/24.48a2720.js","b92dc1bb370ab2e021334af7ac447878"],["/static/js/25.2b25cc3.js","0589585b4299af252eecefd02f117ad0"],["/static/js/26.091a405.js","81382a4b9cf3f56f7fb56af1de1eead9"],["/static/js/27.f01f9de.js","f095bda3ae26603db5a69a4657f06c18"],["/static/js/28.ae6738a.js","1d8c4fccc41b8109f4922e5f7b3179c2"],["/static/js/29.077a03f.js","823ab19966b0342f1496732a324961bd"],["/static/js/3.2250925.js","12ccb2e7d2b543e05033d5d6fcf678c8"],["/static/js/30.15ba122.js","04ec398fd2c37ae8647b151a127ebf9b"],["/static/js/31.21cd1de.js","a8f7d6b710f4d4c96765841be7297f92"],["/static/js/32.fe190a6.js","d720d6eac1f8ad6b5640f04a1bf9e2f8"],["/static/js/33.30f2a30.js","54108fd1dbe51b23fe44ecba0e9a3fa4"],["/static/js/34.1f44ed4.js","39b973693deef6a7f07ba0bf94e9671d"],["/static/js/35.e7d4f94.js","90c4e20fdd43b1de8473b7cde7157c67"],["/static/js/36.b339ad9.js","14a172b7d1536a8265cbdfd02da7ab1a"],["/static/js/37.3cc6a67.js","6d4bca66c5d97582c8bd8dc3255cae38"],["/static/js/38.c2f95b3.js","8de4d1dcddbcb7659638065deaa65634"],["/static/js/39.3a9523a.js","188215dbb3b2695bf0475d8dabf5d665"],["/static/js/4.28c09a4.js","e525df9e699540ec89f867eaac7db4f5"],["/static/js/40.ad0828f.js","470990bd1e3304d8f0e91e799a5c7708"],["/static/js/41.781dd62.js","912cd721fa438abad0e960489a8479cd"],["/static/js/42.facbceb.js","b0d5cfc322b19a1834e1d8f5130c6b10"],["/static/js/43.85366d5.js","5d8551988e23c360875f325d8f558f2a"],["/static/js/44.6d43781.js","5f17a1ee459f82264d60f455386ba50e"],["/static/js/45.733061f.js","b8b3093e9811e8d1fed2dde8275cce6d"],["/static/js/46.868fea9.js","d7f42248aad14dd750916722438ef605"],["/static/js/47.e2ad06b.js","970d337bf83099a86c0132ccf164db2b"],["/static/js/48.9132559.js","59a251f4d24c47100cd35a194447a497"],["/static/js/49.385777b.js","0ee123bacca7e26bb4056c20d9d41353"],["/static/js/5.e6b78fe.js","070d02dc8d95e01139cdf3efdf43ba6d"],["/static/js/50.def23e9.js","b1b6bebced6031ea3630e5e7a0bf7ad6"],["/static/js/51.08cc28d.js","2e0b99ea34f1407a745bbc555cb2a39a"],["/static/js/52.7c3a18e.js","836aa47b2c67239084082959c85a067e"],["/static/js/53.2abd413.js","0175a1ea5c0b012cce087c19e5a5f2e5"],["/static/js/54.0ce1594.js","2409379adc923e7df2ab3f3a7c41ac5d"],["/static/js/55.0151021.js","e034d6d937c4b59c6efcf49b8fdb6e2a"],["/static/js/56.b6ef19f.js","2aedd6292ac9bfc992ff51f33819b821"],["/static/js/57.a32b40e.js","566d543f5376e4a787bd4b68e3787181"],["/static/js/58.d88f898.js","8c97aada1ba8e00e6c6e5e238e56d674"],["/static/js/59.8f38f2b.js","1c9e08c1d28ea34bdacccdc0e3a37636"],["/static/js/6.b510fd4.js","b8bb3d013e87fc7d6efa58f73d63be3d"],["/static/js/60.23e4ac0.js","a30c122ba3de29c15bc9b8bb34750548"],["/static/js/61.92fdbae.js","500e87b73266bc0b3896ba071f64edff"],["/static/js/62.a245a6e.js","275eb5c2ae48bc63bd6c24585de47174"],["/static/js/63.c69e5a0.js","49c3c084ed95dc11fb86df6bf392efd0"],["/static/js/64.5c2edcf.js","9b6cea473766e62aa141e63b463f58fb"],["/static/js/65.1047497.js","2a04da09bb398deb86d56b0406500044"],["/static/js/66.527d699.js","1e47601e8345433415bea1f61d1daa32"],["/static/js/67.72a8dd9.js","4b7229b361c1c9ec776bd02fce841844"],["/static/js/68.5eb4a90.js","0efb55b13d7092d1d491904b409eeb18"],["/static/js/7.3237be1.js","d80a0fd2f67fca447e8a539c04998319"],["/static/js/8.af5044e.js","360f51f45f1d7d90dbd620747e56941f"],["/static/js/9.2c38ac6.js","2bfb24bdcd43990e1238dc048699659b"],["/static/js/admin.8a3b7cf.js","0b771e00c85e158a3f537ba60fe6a263"],["/static/js/manifest.fed5c3e.js","480bb45d296b4f5d2d857743654ae344"],["/static/js/vendor.66d8560.js","75f850ab93b7c98cd35f8cb7431e3b23"]];
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







