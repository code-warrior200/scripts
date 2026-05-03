const nextConfig = {
  reactStrictMode: true,
  experimental: {
    workerThreads: true,
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
