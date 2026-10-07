import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	images: { unoptimized: true },
	trailingSlash: false,
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx'],
	reactCompiler: true,
	turbopack: {
		root: path.join(__dirname, '..'),
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
};

export default nextConfig;
