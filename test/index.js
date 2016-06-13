import fs from 'fs';
import path from 'path';
import test from 'blue-tape';
import Assets from '../src';

// Create a loader shim that kinda acts like the three.js loaders. The three.js
// loaders rely on XMLHttpRequest which isn't available in node. The most
// popular shim for it (the xmlhttprequest package) doesn't support the
// `overrideMimeType` function which prevents the loaders from working.

function TestJSONLoader() {}

TestJSONLoader.prototype.load = function(url, onLoad, onProgress, onError) {

  const filepath = path.resolve(__dirname, url);
  const callback = (err, data) => err ? onError(err) : onLoad(JSON.parse(data));

  fs.readFile(filepath, { encoding: 'utf8' }, callback);

}

test('load named assets', function(assert) {

  const assets = Assets();

  const verify = function(asset) {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('test'));

  };

  return assets.load('test', './fixtures/test.json', TestJSONLoader).then(verify);

});

test('load unnamed assets', function(assert) {

  const assets = Assets();

  const verify = function(asset) {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('./fixtures/test.json'));

  };

  return assets.load('./fixtures/test.json', TestJSONLoader).then(verify);

});

test('load asset object', function(assert) {

  const assets = Assets();

  const verify = function(asset) {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('test'));

  };

  return assets.load({

    key: 'test',
    url: './fixtures/test.json',
    loader: TestJSONLoader

  }).then(verify);

});
