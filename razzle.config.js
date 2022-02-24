"use strict";

module.exports = {
  options: {
    buildType: "spa"
  },
  modifyWebpackConfig(opts) {

    const config = {...opts.webpackConfig};

    config.module.rules = config.module.rules.map((rule) => {

      if (rule.use.constructor === Array) {

        rule.use = rule.use.map((value) => {

          if (value.ident === "razzle-css-loader") {

            value.options.modules = {
              
              ...value.options.modules,
              localIdentName: "[name]__[local]"
            
            };

          }

          return value;

        });

      }
      
      return rule;

    });

    return config;

  }
};