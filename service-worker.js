"use strict";var precacheConfig=[["/civic-society-members/404.html","d405e178e163f345f1729cc0e68f36ce"],["/civic-society-members/android-chrome-192x192.b0492efc.png","3b91a4ad7c672d884789ae1cdd86a2c4"],["/civic-society-members/android-chrome-192x192.png","3b91a4ad7c672d884789ae1cdd86a2c4"],["/civic-society-members/android-chrome-384x384.png","e3ec87230281dd17b25a44b43707a588"],["/civic-society-members/android-chrome-512x512.3feb7a91.png","bc303af445050f737240bc77f6a8e19b"],["/civic-society-members/apple-touch-icon.png","67654716381277a00f730a5efbb05107"],["/civic-society-members/favicon-16x16.png","60f2e3e6c343172831f0950080aa6c44"],["/civic-society-members/favicon-32x32.png","73a46ccf11d0229ad3a7e3a8ff83b61b"],["/civic-society-members/icons/android-chrome-192x192.png","3b91a4ad7c672d884789ae1cdd86a2c4"],["/civic-society-members/icons/android-chrome-384x384.png","e3ec87230281dd17b25a44b43707a588"],["/civic-society-members/icons/android-chrome-512x512.png","bc303af445050f737240bc77f6a8e19b"],["/civic-society-members/icons/apple-touch-icon.png","67654716381277a00f730a5efbb05107"],["/civic-society-members/icons/favicon-16x16.png","60f2e3e6c343172831f0950080aa6c44"],["/civic-society-members/icons/favicon-32x32.png","73a46ccf11d0229ad3a7e3a8ff83b61b"],["/civic-society-members/icons/mstile-150x150.png","ac88c6944f7ac4ce2ebf54e72b13ba35"],["/civic-society-members/index.html","a38d2b331ee243d9595be304e51dd4ae"],["/civic-society-members/mstile-150x150.png","ac88c6944f7ac4ce2ebf54e72b13ba35"],["/civic-society-members/src.e86ab8d8.js","00b93091e0d4e71f83918fd7c9826ae1"],["/civic-society-members/src.e8db4b87.css","317f9c21cf55064e8282338f7cb8a378"]],cacheName="sw-precache-v3-lcs-members-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,c){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=c),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(c){return new Response(c,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,c,n,t){var r=new URL(e);return t&&r.pathname.match(t)||(r.search+=(r.search?"&":"")+encodeURIComponent(c)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,c){if(0===e.length)return!0;var n=new URL(c).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,c){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return c.every(function(c){return!c.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var c=e[0],n=e[1],t=new URL(c,self.location),r=createCacheKey(t,hashParamName,n,/\.\w{8}\./);return[t.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(c){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!c.has(n)){var t=new Request(n,{credentials:"same-origin"});return fetch(t).then(function(c){if(!c.ok)throw new Error("Request for "+n+" returned a response with status "+c.status);return cleanResponse(c).then(function(c){return e.put(n,c)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var c=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!c.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var c,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(c=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),c=urlsToCacheKeys.has(n));!c&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(n=new URL("/civic-society-members/index.html",self.location).toString(),c=urlsToCacheKeys.has(n)),c&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(c){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,c),fetch(e.request)}))}});