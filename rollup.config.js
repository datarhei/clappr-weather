import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg';
import html from 'rollup-plugin-html';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import pkg from './package.json';
import { version as clapprCoreVersion } from '@clappr/core/package.json';
import path from 'path';

const dev = !!process.env.DEV;
const analyzeBundle = !!process.env.ANALYZE_BUNDLE;
const minimize = !!process.env.MINIMIZE;

const servePluginOptions = { contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' };
const livereloadPluginOptions = { watch: ['dist', 'public'] };

const postcssOptions = {
	use: [
		['sass', {
			includePaths: [
				path.resolve('node_modules/@clappr/core/src/base/scss')
			]
		}]
	]
};

const plugins = [
	replace({
		preventAssignment: true,
		values: {
			VERSION: JSON.stringify(pkg.version),
			CLAPPR_CORE_VERSION: JSON.stringify(clapprCoreVersion),
		}
	}),
	commonjs(),
	nodeResolve({ browser: true, preferBuiltins: true }),
	babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
	svg({ base64: true }),
	html(),
	json(),
	postcss(postcssOptions),
	dev && serve(servePluginOptions),
	dev && livereload(livereloadPluginOptions),
	analyzeBundle && analyze(),
];

const output = [
	{
		name: 'Weather',
		file: pkg.main,
		format: 'umd',
		sourcemap: true,
		globals: { '@clappr/core': 'Clappr' },
	},
	minimize && {
		file: 'dist/weather.min.js',
		format: 'umd',
		name: 'Weather',
		sourcemap: true,
		plugins: terser(),
		globals: { '@clappr/core': 'Clappr' },
	}
];

export default {
	input: 'src/index.js',
	external: ['@clappr/core'],
	output,
	plugins,
};
