import Debug from 'debug';
import { EventDispatcher, LoadingManager } from 'three';

const debug = Debug('three-assets');
const noop  = function() {};

export default function Assets() {

  const assets = new EventDispatcher();

  // A map of three.js loader classes to loader instances. It seems like we
  // only need one instance of each implementation so we just cache them.
  const loaders = {};

  // A map from asset keys to asset URLs. This lets us use multiple keys
  // per URL, if different developers happen to request the same asset with
  // different keys.
  const keyToURL = {};

  // A map from URLs to request promises. This lets us prevent duplicate
  // requests to the same asset URL.
  const requests = {};

  // A map from URLs to loaded and parsed assets. In contrast to the request
  // map, this only gets populated after requests are fulfilled and is only
  // intended for synchronous access.
  const assets = {};

  const manager = new LoadingManager(undefined, onProgress, undefined);

  /**
   * Load an asset.

   * @param key - The unique key used to identify the asset.
   * @param url - The URL of the asset.
   * @param loaderclass - A three.js loader.
   */
  obj.add = function (key, url, loaderclass) {

    if (arguments.length === 1 && Array.isArray(arguments[0]) === true) {

      const manifest = arguments[0];
      const promises = manifest.map(descriptor => obj.load(descriptor));

      debug(`loading ${ promises.length } assets`);

      return Promise.all(promises);

    } else if (arguments.length === 1) {

      // Support asset descriptors.
      key = arguments[0].key;
      url = arguments[0].url;
      loaderclass = arguments[0].loader;

    } else if (arguments.length === 2) {

      // The asset key is optional.
      key = null;
      url = arguments[0];
      loaderclass = arguments[1];

    }

    if (url === undefined) {

      throw new Error(`three-assets needs a URL to load the asset`);

    }

    if (loaderclass === undefined) {

      throw new Error(`three-assets needs a three.js loader class to load and parse the asset at "${ url }"`);

    }

    const loader = loaders[loaderclass] = (loaders[loaderclass] || new loaderclass());

    if (key && keyToURL[key]) {

      debug(`duplicate key "${ key }"`);

      keyToURL[key] = url;

    } else if (key) {

      keyToURL[key] = url;

    }

    // Reuse a pending or previous request to the same URL.
    requests[url] = requests[url] || new Promise(function(resolve, reject) {

      function onLoad(asset) {

        debug(`loaded "${ url }"`);
        assets[url] = asset;
        resolve(asset);

      }

      function onError(err) {

        debug(`error while loading "${ url }" : ${ err.reason || err.message || err }`);
        reject(err);

      }

      loader.load(url, onLoad, noop, onError);

    });

    return requests[url];

  };

  /**
   * Access an asset.
   *
   * @param {String} key - The unique key used to identify the asset.
   * @returns {*} The asset.
   */
  obj.get = function(key) {

    const url = keyToURL[key] || key;
    const asset = assets[url];

    if (asset) {

      return asset;

    } else {

      throw new Error(`The asset "${ key }" is not available, either because it was not loaded or it is still pending`);

    }

  };

  return obj;

}
