module.exports = {
  plugins: [
    "styled-components",
    "transform-object-rest-spread"
  ],
  presets: [
    "react",
    ["env", {
      targets: {
        browsers: [
          "last 2 versions"
        ]
      },
      modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs',
      exclude: [
        "transform-regenerator"
      ]
    }]
  ],
};
