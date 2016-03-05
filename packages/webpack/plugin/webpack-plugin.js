Plugin.registerCompiler({
  extensions: [
    'import.css', // Ignore CSS files that are going to be bundled with components
    'js', 'jsx', 'ts', 'tsx', 'coffee' // watch JavaScript, CoffeeScript and TypeScript files
  ],
  filenames: [
    'webpack.json',
    'webpack.conf.js',
    'webpack.packages.json'
  ]
}, () => new WebpackCompiler());
