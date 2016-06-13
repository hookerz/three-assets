# three-assets

A simple, Promise-based loader and asset cache for three.js.

## Examples

```javascript
import three from 'three';
import Assets from 'three-assets';

const assets = Assets();

function load() {

  return Promise.all([
    assets.load('mesh', './models/mesh.obj', three.OBJLoader),
    assets.load('mesh-alpha', './images/mesh-alpha.png', three.TextureLoader),
    assets.load('mesh-diffuse', './images/mesh-diffuse.jpg', three.TextureLoader),
  ]);

}

function start() {

  const mesh = assets.get('mesh');

  mesh.material = new three.MeshStandardMaterial({

    map: assets.get('mesh-diffuse'),
    alphaMap: assets.get('mesh-alpha')

  })

  const scene = new three.Scene();

  scene.add(mesh);

}

load().then(start);
```
