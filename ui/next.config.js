const path = require("path");

module.exports = {
  // basePath: "/zokrates-nextjs-demo",
  // assetPrefix: "/zokrates-nextjs-demo/",
  reactStrictMode: true,
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  webpack: function (config, { isServer, dev }) {
    config.experiments = { syncWebAssembly: true, layers: true };
    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }
    config.ignoreWarnings = [
      {
        module: /zokrates-js/,
      },
    ];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

class WasmChunksFixPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          })
      );
    });
  }
}
