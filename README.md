# grunt-cache-buster

> Bust yo cache like a baws

This grunt task is still very much in development, use at your own risk :)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cache-buster --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cache-buster');
```

## Cache Buster
_Run this task with the `cache_buster` command._

### Overview
The cache buster task performs five basic operations:

- Opens an asset file and generates a md5 has of its contents
- Prepends the md5 hash to the asset file's name and saves it in the same directory
- Opens a specified template file
- Uses a specified regex to replace a given token with a specified baseUrl + new asset filename
- Renders a derived template in a specified location

```js
grunt.initConfig({
  cache_buster: {
    your_target: {
      targets:[]
    },
  },
})
```

### Options

#### options.target
Type: `Array`
Default value: `null`

A list of assets and template targets


#### options.target.asset
Type: `String`
Default value: `null`

Path to a given asset file (js, css, .jpg ... etc)

If a null or undefined value is given the task will write the baseUrl property to the derived template

#### options.target.target
Type: `String`
Default value: `null`

Path to a template file in which a given token will be replaced.

#### options.target.dest
Type: `String`
Default value: `null`

The path and filename used to save the derived template.

#### options.target.baseUrl
Type: `String`
Default value: `null`

The path which is prepended to the new asset file.

#### options.target.regex
Type: `RegEx`
Default value: `null`

The regex used to evaluate the template files content.


### Usage Examples

#### Production:
In the below example a built js file (public/js/dist/main.build.js) will be used to generate a hash appended file, for example:

e0d68c3748f71771d402aaba41f44211.main.build.js

It would then take 'views/imports/_importjs.twig.html':

```html
<script data-main="/public/js/main.js" src="--filename--"></script>
```

and build out: 'views/imports/importjs.twig.html', which would look like this:

```html
<script data-main="/public/js/main.js" src="http://my-dope-ass-domain.com/js/dist/e0d68c3748f71771d402aaba41f44211.main.build.js"></script>
```

```js
grunt.initConfig({
  cache_buster: {
    production:{
        targets: [{
            asset: 'public/js/dist/main.build.js',
            target: 'views/imports/_importjs.twig.html',
            dest: 'views/imports/importjs.twig.html',
            baseUrl: 'http://my-dope-ass-domain.com/js/dist',
            regex: (/\-\-filename\-\-/)
        }],
    }
  },
})
```

#### Development:
In the below example a template file (views/imports/_importjs.twig.html) will be read, this template would look like:

```html
<script data-main="/public/js/main.js" src="--filename--"></script>
```

and build out: 'views/imports/importjs.twig.html', which would look like this:

```html
<script data-main="/public/js/main.js" src="public/js/lib/requirejs/require.js"></script>
```

```js
grunt.initConfig({
  cache_buster: {
    development:{
        targets: [{
            asset: null,
            target: 'views/imports/_importjs.twig.html',
            dest: 'views/imports/importjs.twig.html',
            baseUrl: 'public/js/lib/requirejs/require.js',
            regex: (/\-\-filename\-\-/)
        }],
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
