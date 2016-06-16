# three-assets

A simple Promise-based asset loader and cache for three.js.

## Examples

```javascript
import three from 'three';
import Assets from 'three-assets';

const assets = Assets();

function load() {

  return assets.load('mesh', './models/mesh.obj', three.OBJLoader);

}

function start() {

  const mesh = assets.get('mesh');
  const scene = new three.Scene();

  scene.add(mesh);

}

load().then(start);
```

If you prefer named arguments, you can describe your assets with objects instead.

```javascript
function load() {

  return assets.load({

    key: 'mesh',
    url: './models/mesh.obj',
    loader: three.OBJLoader

  });

}
```

You can also provide all of your assets to `three-assets` at once, using the manifest syntax. See [Assets#load(manifest)](\#Assets\#load\(manifest\)) for details.

```javascript
function load() {

  const manifest = [
    {
      key: 'mesh',
      url: './models/mesh.obj',
      loader: three.OBJLoader
    },
    {
      key: 'mesh-alpha',
      url: './models/mesh-alpha.png',
      loader: three.TextureLoader
    },
    {
      key: 'mesh-diffuse',
      url: './models/mesh-diffuse.png',
      loader: three.TextureLoader
    }
  ];

  return assets.load(manifest);

}
```

## API

#### `Assets()`

Create a new asset loader/cache.

#### `Assets#load([key, ]url, loader)`

Asynchronously load an asset. `key` is optional, and will be used in addition to the `url` to cache the loaded asset. `loader` is a three.js loader class, like `THREE.TextureLoader` or `THREE.ImageLoader`.

Returns a `Promise` that resolves to the loaded asset. 

```javascript
assets.load('./some/url/diffuse.png', THREE.TextureLoader);

// You can use a key to make it easier to access the asset in the cache.
assets.load('diffuse', './some/url/diffuse.png', THREE.TextureLoader);

// The key doesn't have to be a string.
const DiffuseAssetID = Symbol();
assets.load(DiffuseAssetID, './some/url/diffuse.png', THREE.TextureLoader);
```

#### `Assets#load(asset)`

An alternate syntax for `Assets#load` that uses named parameters. `asset.url` and `asset.loader` are mandatory, while `asset.key` is optional.

Returns a `Promise` that resolves to the loaded asset. 

```javascript
assets.load({
  
  key: 'diffuse'
  url: './some/url/diffuse.png',
  loader: THREE.TextureLoader

});
```

#### `Assets#load(manifest)`

An alternate syntax for `Assets#load` that loads an entire list of assets. `manifest` should be an array of asset objects, like `{ key, url, loader }`.

__Warning__: this uses `Promise.all` internally, which is failfast in most environments. If any of your asset requests timeout or don't resolve, the entire promise will reject and some of your assets might have never been requested.

Returns a `Promise` that resolves to an array of the loaded assets.

#### `Assets#get(keyOrURL)`

Get a loaded asset, either by the `key` or the `url` it was loaded with.

Returns the asset if it has finished loading. If not, throws an error.

```javascript
assets.load('diffuse', './some/url/diffuse.png', THREE.TextureLoader).then(start)

function start() {

  assets.get('diffuse') === assets.get('./some/url/diffuse.png');
  assets.get('diffuse') instanceof THREE.Texture;

}
```
