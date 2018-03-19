require('reify');

import fs from 'fs';
import path from 'path';
import test from 'tape';
import asynctest from 'blue-tape';
import * as assets from '../src';

// Create a loader shim that kinda acts like the three.js loaders. The three.js
// loaders rely on XMLHttpRequest which isn't available in node. The most
// popular shim for it (the xmlhttprequest package) doesn't support the
// `overrideMimeType` function which prevents the loaders from working.

function TestJSONLoader() {}

TestJSONLoader.prototype.load = function (url, onLoad, onProgress, onError) {

  const filepath = path.resolve(__dirname, url);
  const callback = (err, data) => err ? onError(err) : onLoad(JSON.parse(data));

  fs.readFile(filepath, { encoding: 'utf8' }, callback);

};

asynctest('load named assets', assert => {

  return assets.load('test', './fixtures/test.json', TestJSONLoader).then(asset => {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('test'));

  });

});

asynctest('load unnamed assets', assert => {

  const assets = Assets();

  return assets.load('./fixtures/test.json', TestJSONLoader).then(asset => {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('./fixtures/test.json'));

  });

});

asynctest('load asset object', assert => {

  const assets = Assets();

  const descrip = {

    key: 'test',
    url: './fixtures/test.json',
    loader: TestJSONLoader

  };

  return assets.load(descrip).then(asset => {

    assert.true(asset.foobar);
    assert.same(asset, assets.get('test'));

  });

});

asynctest('load asset manifest', assert => {

  const assets = Assets();

  const manifest = [

    {
      key: 'testA',
      url: './fixtures/test.json',
      loader: TestJSONLoader
    },
    {
      key: 'testB',
      url: './fixtures/test.json',
      loader: TestJSONLoader
    }

  ];

  return assets.load(manifest).then(list => {

    assert.same(list[0], assets.get('testA'));
    assert.same(list[1], assets.get('testB'));

  });

});

test('reuse pending requests', assert => {

  const assets = Assets();

  const requestA = assets.load('testA', './fixtures/test.json', TestJSONLoader);
  const requestB = assets.load('testB', './fixtures/test.json', TestJSONLoader);

  assert.equal(requestA, requestB);

  assert.end();

});
