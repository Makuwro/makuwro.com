"use strict";

module.exports = {
  options: {
    buildType: "spa",
  },
  modifyPaths({paths}) {

    paths.appBuildPublic = paths.appBuild;
    paths.appBuildStaticExportRoutes = `${paths.appBuild}\\static_routes.js`;
    console.log(paths);
    return paths;

  }
};