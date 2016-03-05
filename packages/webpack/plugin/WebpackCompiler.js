const webpack = Npm.require('webpack');
const _ = Npm.require('underscore');
const MemoryFS = Npm.require('memory-fs');
const shell = Npm.require('shelljs');
const mkdirp = Npm.require('mkdirp');

const fs = Plugin.fs;
const path = Plugin.path;

const _fs = Npm.require('fs');
const _path = Npm.require('path');

const npm = Npm.require('npm');
const http = Npm.require('http');
const connect = Npm.require('connect');
const cors = Npm.require('cors');

let devServerApp = null;
let devServerMiddleware = {};
let devServerHotMiddleware = {};
let configHashes = {};
let webpackStats = null;

const IS_WINDOWS = process.platform === 'win32';
const CWD = _path.resolve('./');
const PROCESS_ENV = process.env;

const argv = process.argv.map(arg => arg.toLowerCase());

console.log(argv)
const PORT = argv.indexOf('--port') >= 0 ? argv[argv.indexOf('--port') + 1] : undefined
console.log(PORT)

// Detect production mode
let IS_BUILD =
  argv.indexOf('build') >= 0 ||
  argv.indexOf('bundle') >= 0 ||
  argv.indexOf('deploy') >= 0;

let IS_DEBUG =
  argv.indexOf('--production') < 0 &&
  (!IS_BUILD || argv.indexOf('--debug') >= 0);

WebpackCompiler = class WebpackCompiler {
  processFilesForTarget(files, options) {
    // Waiting for the PR to be merged
    // https://github.com/meteor/meteor/pull/5448
    if (options) {
      IS_DEBUG = options.buildMode !== 'production';
    }

    checkMigration();

    files = files.filter(file => file.getPackageName() !== 'webpack:webpack');
    const packageFiles = files.filter(file => file.getPackageName() !== null);

    if (packageFiles && packageFiles.length > 0) {
      throw new Error('You cannot use the webpack compiler inside a package');
    }

    const configFiles = filterFiles(files, 'webpack.conf.js');

    const platform = files[0].getArch();
    const shortName =
      (platform.indexOf('cordova') >= 0) ?
        'cordova' :
        (platform.indexOf('web') >= 0) ? 'web' : 'server';

    const entryFileName = getEntryFileName(shortName);
    const entryFile = files.find(file => file.getPathInPackage() === entryFileName);

    if (!entryFile) {
      console.error('Cannot find the entry point "' + entryFileName + '" for the ' + shortName);
      process.exit(1);
    }

    const settingsFiles = filterFiles(files, 'webpack.json');
    const settings = readSettings(settingsFiles, shortName);

    let webpackConfig = {
      entry: entryFile ? _path.join(CWD, entryFile.getPathInPackage()) : null,
      module: {
        loaders: []
      },
      plugins: [],
      resolve: {
        extensions: ['']
      },
      externals: {},
      devServer: settings.devServer
    };

    if (settings.root) {
      webpackConfig.resolve.root = _path.join(CWD, settings.root);
    }

    const unibuilds = files[0]._resourceSlot.packageSourceBatch.processor.unibuilds;
    settings.packages = unibuilds.map(unibuild => unibuild.pkg.name);
    generateExternals(webpackConfig, unibuilds);
    const configs = readPackageConfig(shortName, webpackConfig, unibuilds, settings);

    // Don't need to run NPM install again on mirrors
    if (!PROCESS_ENV.IS_MIRROR) {
      updateNpmPackages(shortName, configs);
    }

    configs.load();

    runWebpack(shortName, webpackConfig, entryFile, configFiles);

    // Every startup.js files are sent directly to Meteor
    files.filter(file => file.getBasename() === 'meteor.startup.js').forEach(file => {
      file.addJavaScript({
        path: file.getPathInPackage(),
        data: file.getContentsAsString()
      });
    });
  }
}

function getEntryFileName(platform) {
  let name;

  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json')).toString());
    name = platform === 'server' ? pkg.main : pkg.browser || pkg.main;
  } catch(e) {
    console.error('Error in your package.json: ' + e.message);
    process.exit(1);
  }

  return name || 'index.js';
}

function readSettings(settingsFiles, platform) {
  let settings = {};

  settingsFiles.forEach(file => {
    try {
      const setting = JSON.parse(file.getContentsAsString());
      settings = _.extend(settings, setting);
    } catch(e) {
      file.error({
        message: e.message
      });
    }
  });

  settings.platform = platform;
  settings.isDebug = IS_DEBUG;

  return settings;
}

let npmPackagesCache = { web: {}, cordova: {}, server: {} };

function updateNpmPackages(target, configs) {
  // List the dependencies
  // Fix peer dependencies for webpack
  // webpack-hot-middleware is required for HMR

  let dependencies = configs.dependencies;

  let devDependencies = _.extend({
    'webpack': '^1.12.9',
    'webpack-hot-middleware': '^2.4.1'
  }, configs.devDependencies);

  let pkg = {};
  const packageFile = path.join(CWD, 'package.json');

  if (fs.existsSync(packageFile)) {
    pkg = JSON.parse(fs.readFileSync(packageFile).toString());
  }

  if (!pkg.dependencies) {
    pkg.dependencies = {};
  }

  if (!pkg.devDependencies) {
    pkg.devDependencies = {};
  }

  let hasChanged = false;

  for (let depName in dependencies) {
    if (isNpmPackageOlder(dependencies[depName], pkg.dependencies[depName])) {
      pkg.dependencies[depName] = dependencies[depName];
      hasChanged = true;
    }
  }

  for (let depName in devDependencies) {
    if (isNpmPackageOlder(devDependencies[depName], pkg.devDependencies[depName])) {
      pkg.devDependencies[depName] = devDependencies[depName];
      hasChanged = true;
    }
  }

  if (hasChanged) {
    fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
    console.log('Your package.json has been updated. Please, run npm install in your project directory.')
    process.exit(1);
  }
}

function isNpmPackageOlder(depVersion, currentVersion) {
  if (!currentVersion) {
    return true;
  }

  const depVersions = depVersion.replace(/^[\^~]/, '').split('.');
  const currentVersions = currentVersion.replace(/^[\^~]/, '').split('.');

  for (let i = depVersions.length; i < 3; ++i) {
    depVersions.push('0');
  }

  for (let i = currentVersions.length; i < 3; ++i) {
    depVersions.push('0');
  }

  if (depVersions[0] > currentVersions[0]) {
    return true;
  } else if (depVersions[0] < currentVersions[0]) {
    return false;
  }

  if (depVersions[1] > currentVersions[1]) {
    return true;
  } else if (depVersions[1] < currentVersions[1]) {
    return false;
  }

  if (depVersions[2] > currentVersions[2]) {
    return true;
  } else if (depVersions[2] < currentVersions[2]) {
    return false;
  }

  return false;
}

function runWebpack(shortName, webpackConfig, entryFile, configFiles) {
  configFiles.forEach(configFile => {
    const filePath = configFile.getPathInPackage();
    const data = configFile.getContentsAsString();

    readWebpackConfig(webpackConfig, shortName, configFile, filePath, data);
  });

  const usingDevServer =
    IS_DEBUG && !IS_BUILD &&
    shortName !== 'server' &&
    !PROCESS_ENV.IS_MIRROR; // Integration tests (velocity) should not use dev server

  prepareConfig(shortName, webpackConfig, usingDevServer);

  if (usingDevServer) {
    compileDevServer(shortName, entryFile, configFiles, webpackConfig);
  } else {
    compile(shortName, entryFile, configFiles, webpackConfig);
  }
}

function readPackageConfig(platform, webpackConfig, unibuilds, settings) {
  let deps = {};
  let devDeps = {};
  let configs = [];

  for (let i = 0; i < unibuilds.length; ++i) {
    if (unibuilds[i].uses.find(use => use.package === 'webpack:core-config')) {
      const resource = unibuilds[i].resources.find(resource => resource.path === 'webpack.config.js');

      try {
        eval(resource.data.toString());
        const dep = dependencies(settings);
        deps = _.extend(deps, dep.dependencies);
        devDeps = _.extend(devDeps, dep.devDependencies);
        configs.push({ weight, config });
      } catch(e) {
        console.error(e);
      }
    }
  }

  configs = configs.sort(config => config.weight).map(config => config.config);

  return {
    dependencies: deps,
    devDependencies: devDeps,
    load: () => {
      configs.forEach(config => {
        try {
          const result = config(settings, requirePolyfill);

          if (result.loaders) {
            webpackConfig.module.loaders = webpackConfig.module.loaders.concat(result.loaders);
          }

          if (result.plugins) {
            webpackConfig.plugins = webpackConfig.plugins.concat(result.plugins);
          }

          if (result.extensions) {
            webpackConfig.resolve.extensions = webpackConfig.resolve.extensions.concat(result.extensions);
          }

          if (result.externals) {
            for (let key in result.externals) {
              webpackConfig.externals[key] = result.externals[key];
            }
          }
        } catch(e) {
          console.error(e.stack);
        }
      });
    }
  };
}

function requirePolyfill(module) {
  if (module === 'webpack') {
    return Npm.require(module);
  }

  if (module === 'fs') {
    return _fs;
  }

  if (module === 'path') {
    return _path;
  }

  try {
    return NpmWorkaround.require(CWD + '/node_modules/' + module);
  } catch(e) {}

  return NpmWorkaround.require(module);
}

function readWebpackConfig(webpackConfig, target, file, filePath, data) {
  let module = { exports: {} };
  var fileSplit = filePath.split('/');
  fileSplit.pop();

  const __dirname = _path.join(CWD, fileSplit.join(_path.sep));
  const process = {
    env: _.assign({}, PROCESS_ENV, { 'NODE_ENV': IS_DEBUG ? 'development' : 'production' })
  };

  const require = requirePolyfill;

  const Meteor = {
    isServer: target === 'server',
    isClient: target !== 'server',
    isCordova: target === 'cordova'
  };

  try {
    eval(data);

    // Make sure the entry path is relative to the correct folder
    if (module.exports && !module.exports.context && module.exports.entry) {
      module.exports.context = __dirname;
    }
  } catch(e) {
    file.error({
      message: e.message
    });
  }

  webpackConfig = _.extend(webpackConfig, module.exports);
}

function prepareConfig(target, webpackConfig, usingDevServer) {
  if (!webpackConfig.output) {
    webpackConfig.output = {};
  }

  if (target === 'server') {
    webpackConfig.target = 'node';
    webpackConfig.node = {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: true,
      __dirname: true
    };
  }

  if (IS_DEBUG) {
    webpackConfig.devtool = webpackConfig.devtool || 'cheap-eval-source-map';

    if (!webpackConfig.devServer) {
      webpackConfig.devServer = {};
    }

    webpackConfig.devServer.protocol = webpackConfig.devServer.protocol || 'http:';
    webpackConfig.devServer.host = webpackConfig.devServer.host || 'localhost';
    webpackConfig.devServer.port = PORT || webpackConfig.devServer.port || 3500;
  } else {
    webpackConfig.devtool = webpackConfig.devtool || 'cheap-source-map';
  }

  if (usingDevServer) {
    const port = PORT || webpackConfig.devServer.port
    let options = 'path=' + webpackConfig.devServer.protocol + '//' + webpackConfig.devServer.host + ':' + port + '/__webpack_hmr';

    if (webpackConfig.hotMiddleware) {
      for (let key in webpackConfig.hotMiddleware) {
        const val = webpackConfig.hotMiddleware[key];
        options += '&' + key + '=';

        if (typeof val === 'boolean') {
          options += val ? 'true' : 'false';
        } else {
          options += val;
        }
      }
    }

    webpackConfig.entry = [].concat(
      'webpack-hot-middleware/client?' + options,
      webpackConfig.entry
    );
  }

  const port = PORT || webpackConfig.devServer.port

  webpackConfig.output.path = '/memory/webpack';
  webpackConfig.output.publicPath = IS_DEBUG ? webpackConfig.devServer.protocol + '//' + webpackConfig.devServer.host + ':' + port + '/assets/' : '/assets/';
  webpackConfig.output.filename = target + '.js';

  if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
  }

  if (!IS_DEBUG) {
    webpackConfig.plugins.unshift(new webpack.optimize.DedupePlugin());
  }

  let definePlugin = {
    'process.env.NODE_ENV': JSON.stringify(IS_DEBUG ? 'development' : 'production'),
    'Meteor.isClient': JSON.stringify(target !== 'server'),
    'Meteor.isServer': JSON.stringify(target === 'server'),
    'Meteor.isCordova': JSON.stringify(target === 'cordova')
  };

  for (let name in PROCESS_ENV) {
    if (name === 'NODE_ENV') {
      continue;
    }

    definePlugin['process.env.' + name] = JSON.stringify(PROCESS_ENV[name]);
  }

  webpackConfig.plugins.unshift(new webpack.DefinePlugin(definePlugin));

  if (!IS_DEBUG) {
    // Production optimizations
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  }

  if (usingDevServer) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
  }
}

const compilers = {};

function compile(target, entryFile, configFiles, webpackConfig) {
  if (!configHashes[target] || _.some(configFiles, file => !configHashes[target][file.getSourceHash()])) {
    compilers[target] = new webpack(webpackConfig);
    compilers[target].outputFileSystem = new MemoryFS();

    configHashes[target] = {};
    configFiles.forEach(file => { configHashes[target][file.getSourceHash()] = true; });
  }

  const file = entryFile || configFiles[0];
  const fs = compilers[target].outputFileSystem;
  let errors = null;

  Meteor.wrapAsync(done => {
    compilers[target].run(function(err, stats) {
      if (stats) {
        if (stats.hasErrors()) {
          errors = stats.toJson({ errorDetails: true }).errors;
        }

        // Save the chunk file names in the private folder of your project
        if (target === 'web') {
          webpackStats = stats.toJson({ chunks: true });

          // Only keep what we need for code splitting
          for (var key in webpackStats) {
            if (key !== 'assetsByChunkName' && key !== 'publicPath') {
              delete webpackStats[key];
            }
          }
        }
      }

      if (err) {
        if (errors) {
          errors.unshift(err);
        } else {
          errors = [err];
        }
      }

      done();
    });
  })();

  if (errors) {
    for (let error of errors) {
      file.error({
        message: error
      });
    }
  } else {
    const outputPath = path.join(webpackConfig.output.path, webpackConfig.output.filename);
    const sourceMapPath = `/memory/webpack/${target}.js.map`;

    // We have to fix the source map until Meteor update source-map:
    // https://github.com/meteor/meteor/pull/5411

    let sourceMapData;
    let sourceMap;

    // In case the source map isn't in a file
    try {
      sourceMapData = fs.readFileSync(sourceMapPath);
    } catch(e) {}

    if (sourceMapData) {
      sourceMap = JSON.parse(sourceMapData.toString());
      WebpackSourceMapFix(sourceMap);
    }

    let data = fs.readFileSync(outputPath).toString();

    if (target === 'server') {
      data =
        'global.require = Npm.require;\n' + // Polyfill the require to Meteor require
        'if (typeof global.jQuery === \'undefined\') { global.jQuery = {}; }\n' + // Polyfill so importing jquery in a file doesn't crash the server
        'WebpackStats = ' + JSON.stringify(webpackStats) + ';\n' + // Infos on Webpack build
        data;

      if (_fs.existsSync(_path.join(CWD, 'node_modules', 'react'))) {
        // Also expose React on the server for ssr
        data = 'global.React = Npm.require(\'react\');\n' + data;
      }
    }

    file.addJavaScript({
      path: target + '.js',
      data,
      sourceMap
    });

    if (!IS_DEBUG && target !== 'server') {
      addAssets(target, file, fs);
    }
  }
}

function addAssets(target, file, fs) {
  const assets = fs.readdirSync('/memory/webpack');

  for (let asset of assets) {
    if (asset !== target + '.js' && asset !== target + '.js.map') {
      const data = fs.readFileSync('/memory/webpack/' + asset);

      // Send CSS files to Meteor
      if (/\.css$/.test(asset)) {
        file.addStylesheet({
          path: 'assets/' + asset,
          data: data.toString()
        });
      } else {
        file.addAsset({
          path: 'assets/' + asset,
          data
        });
      }
    }
  }
}

function compileDevServer(target, entryFile, configFiles, webpackConfig) {
  if (webpackConfig.devServer) {
    const file = entryFile || configFiles[0];

    file.addJavaScript({
      path: 'webpack.conf.js',
      data: '__WebpackDevServerConfig__ = ' + JSON.stringify(webpackConfig.devServer) + ';'
    });
  }

  if (configHashes[target] && configFiles && _.every(configFiles, file => configHashes[target][file.getSourceHash()])) {
    // Webpack is already watching the files, only restart if the config has changed
    return;
  }

  configHashes[target] = {};
  configFiles.forEach(file => { configHashes[target][file.getSourceHash()] = true; });

  if (!devServerApp) {
    devServerApp = connect();
    devServerApp.use(cors());

    const port = PORT || webpackConfig.devServer.port
    console.log('listening to ' + port)
    http.createServer(devServerApp).listen(port);
  }

  if (devServerMiddleware[target]) {
    devServerMiddleware[target].close();

    devServerApp.stack.splice(
      devServerApp.stack.indexOf(devServerMiddleware[target]),
      1
    );

    devServerApp.stack.splice(
      devServerApp.stack.indexOf(devServerHotMiddleware[target]),
      1
    );
  }

  const compiler = webpack(webpackConfig);

  devServerMiddleware[target] = Npm.require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    watchOptions: webpackConfig.watchOptions
  });

  devServerHotMiddleware[target] = Npm.require('webpack-hot-middleware')(compiler);

  devServerApp.use(devServerMiddleware[target]);
  devServerApp.use(devServerHotMiddleware[target]);
}

function filterFiles(files, name) {
  return files
    .filter(file => file.getBasename() === name)
    // Sort by shallower files
    .sort((file1, file2) => file1.getPathInPackage().split('/').length - file2.getPathInPackage().split('/').length);
}

function getLispCase(exportName) {
  let result = '';
  let lastWasUpper = false;

  for (let i = 0; i < exportName.length; ++i) {
    const isUpper = exportName[i] === exportName[i].toUpperCase();

    if (i > 0 && isUpper && !lastWasUpper) {
      result += '-';
    }

    result += exportName[i].toLowerCase();
    lastWasUpper = isUpper;
  }

  return result;
}

function generateExternals(webpackConfig, isobuilds) {
  const npmDependencies = findAllDependencies(CWD);
  let hasReactPackage = false;

  webpackConfig.externals = webpackConfig.externals || {};

  for (let i = 0; i < isobuilds.length; ++i) {
    const { declaredExports } = isobuilds[i];

    // Support import from Meteor packages
    webpackConfig.externals['meteor/' + isobuilds[i].pkg.name] = 'Package[\'' + isobuilds[i].pkg.name + '\']';

    for (let j = 0; j < declaredExports.length; ++j) {
      if (!declaredExports[j].testOnly) {
        const declaredExport = declaredExports[j].name;
        const lowerCaseExport = declaredExports[j].name.toLowerCase();
        const lispCaseExport = getLispCase(declaredExport);

        // Don't override a NPM module or user external
        if (npmDependencies.indexOf(declaredExport.toLowerCase()) < 0 && !webpackConfig.externals[declaredExport]) {
          webpackConfig.externals[declaredExport] = declaredExport;
        }

        if (npmDependencies.indexOf(lispCaseExport) < 0 && !webpackConfig.externals[lispCaseExport]) {
          webpackConfig.externals[lispCaseExport] = declaredExport;
        }

        if (npmDependencies.indexOf(lowerCaseExport) < 0 && !webpackConfig.externals[lowerCaseExport]) {
          webpackConfig.externals[lowerCaseExport] = declaredExport;
        }
      }
    }

    // Use React from Meteor instead of NPM if we use the package
    if (isobuilds[i].pkg.name === 'react-runtime') {
      webpackConfig.externals.React = 'React';
      webpackConfig.externals.react = 'React';
      webpackConfig.externals.ReactDOM = 'ReactDOM';
      webpackConfig.externals['react-dom'] = 'ReactDOM';
    }
  }

  // Make sure jQuery isn't undefined if not available on the server
  if (!webpackConfig.externals.jquery && npmDependencies.indexOf('jquery') < 0) {
    webpackConfig.externals.jquery = 'jQuery';
    webpackConfig.externals.jQuery = 'jQuery';
    webpackConfig.externals.$ = 'jQuery';
  }
}

function findAllDependencies(modulesPath, isNodeModules) {
  const folders = fs.readdirSync(modulesPath).filter(
    file => file[0] !== '.' && fs.statSync(path.join(modulesPath, file)).isDirectory()
  );

  let modules = isNodeModules ? folders : [];

  folders.forEach(folder => {
    modules = modules.concat(
      findAllDependencies(path.join(modulesPath, folder), folder === 'node_modules')
    );
  });

  return modules;
}

function checkMigration() {
  let hasMigrated = false;

  if (fs.existsSync(CWD + '/node_modules')) {
    const symPath = fs.realpathSync(CWD + '/node_modules');

    if (symPath && symPath.indexOf('.meteor/local/webpack-npm') > 0) {
      fs.unlinkSync(CWD + '/node_modules');
      hasChanged = true;
    }
  }

  if (fs.existsSync(CWD + '/webpack.packages.json') && !fs.existsSync(CWD + '/package.json')) {
    try {
      const deps = JSON.parse(fs.readFileSync(CWD + '/webpack.packages.json').toString());
      const depsName = Object.keys(deps);

      const dependenciesName = depsName.filter(name =>
        !/-loader$/.test(name) &&
        name.indexOf('webpack') < 0 &&
        name.indexOf('babel') < 0 &&
        name.indexOf('react-transform') !== 0 &&
        name !== 'redbox-react'
      );
      const dependencies = {};
      dependenciesName.forEach(name => dependencies[name] = deps[name]);

      const devDependenciesName = depsName.filter(name =>
        /-loader$/.test(name) ||
        name.indexOf('webpack') >= 0 ||
        name.indexOf('babel') >= 0 ||
        name.indexOf('react-transform') === 0 ||
        name === 'redbox-react'
      );
      const devDependencies = {};
      devDependenciesName.forEach(name => devDependencies[name] = deps[name]);

      const cwdPaths = CWD.split('/');

      fs.writeFileSync(CWD + '/package.json', JSON.stringify({
        name: cwdPaths[cwdPaths.length - 1],
        private: true,
        main: 'entry/server/index.js',
        browser: 'entry/client/index.js',
        dependencies,
        devDependencies
      }, null, 2));

      fs.renameSync(CWD + '/webpack.packages.json', CWD + '/webpack.packages.json.backup');
      hasChanged = true;
    } catch (e) {}
  }

  if (hasMigrated) {
    console.log('The project has been migrated. You must run npm install in your project folder to continue.');
    process.exit(1);
  }
}
