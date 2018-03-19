import buble from 'rollup-plugin-buble';

export default {

  dest: 'out/index.js',
  entry: 'src/index.js',
  format: 'cjs',

  external: [ 'debug', 'three' ],

  plugins: [ buble() ]

}

