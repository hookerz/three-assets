const requests = new Map();

export function load() {

  const arg = arguments[0];

  if (Array.isArray(arg) && arguments.length === 1) {

    return loadAssetManifest(arg);

  } else if (arguments.length === 1) {

    return loadAssetObject(arg)

  } else if (arguments.length === 2) {

    return loadAsset(...arguments);

  }

}

function loadAsset(key, url, loaderclass) {

  if (typeof key !== 'string') {

    throw new Error(`The asset key is missing.`);

  }

  if (typeof url !== 'string') {

    throw new Error(`The asset URL for "${ key }" is missing.`);

  }

  if (loaderclass === undefined) {

    throw new Error(`The asset loader for "${ key }" is missing.`);

  }

  const loader = loaders[loaderclass] = (loaders[loaderclass] || new loaderclass());

  if (key && keyToURL[key]) {

    debug(`duplicate key "${ key }"`);

    keyToURL[key] = url;

  } else if (key) {

    keyToURL[key] = url;

  }

  if (requests.has(url)) {

    return requests.get(url);

  } else {

    return new Promise(function (resolve, reject) {

      function onLoad(asset) {

        debug(`loaded "${ url }"`);
        assets[url] = asset;
        resolve(asset);

      }

      function onProgress(event) {



      }

      function onError(err) {

        debug(`error while loading "${ url }" : ${ err.reason || err.message || err }`);
        reject(err);

      }

      loader.load(url, onLoad, onProgress, onError);

    });

  }

}

function loadAssetObject(descriptor) {

  return loadAsset(descriptor.key, descriptor.url, descriptor.loader);

}

function loadAssetManifest(manifest) {

  const promises = manifest.map(loadAssetObject);

  debug(`loading ${ promises.length } assets`);

  return Promise.all(promises);

}
