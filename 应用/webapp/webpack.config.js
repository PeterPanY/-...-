
module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push(["import", { libraryName: "antd", style: "css" }]);
  return webpackConfig;
};
