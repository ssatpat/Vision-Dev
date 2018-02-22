# PI Vision Extension Library Seed Project
This project is an application skeleton for a PI Vision Extension that contains [Angular][angular] components for custom display symbols as well as other future extensibility objects.

This project is an early version of the PI Vision 4 extensibility model and is <b>not intended for use in production or with prior versions of PI Vision.</b>

If you are a developer who is interested in building extensions with the new extensibility model coming in PI Vision 2018, we have some great opportunities coming up for you to get started. Stay tuned for more information on our upcoming Visualization Virtual Hackathon and the Building Symbols with PI Vision 2018 Extensibility developer lab at [PI World 2018][piworld].


## Getting Started
### Prerequisites
* [Node][node] - install the current version
* The `pi-vision-seed` source code
* Editor of your choice [Visual Studio Code][vscode] is recommended

First you must make a local copy of the pi-vision-seed project. If you have obtained this code from a git repository it is a good idea to copy the `pi-vision-seed` folder to a new location and rename it. Developing in the git cloned folder will track your changes as updates to the seed project itself which is probably not what you want.

This project contains a single example display symbol to demonstrate symbol creation of `ExampleComponent`. It is assumed that developers using this seed project would remove this example when creating an actual extension symbols.

> Note it's assumed all commands are run from a command prompt in your local and renamed folder. Commands are written in the Windows command line syntax, but all commands should work in a bash environment as well (just change your slashes)

### Installing Dependencies

The following instructions only apply if you are not working against a cloud deployment of PI Vision. If you are using a cloud deployment the published version of the seed project will come preconfigured with matching versions for all Angular dependencies.

The seed project requires some dependencies to be in sync with PI Vision dependencies so the symbols can be loaded properly. Check your [package.json](./package.json) and make sure these package versions match *exactly* with the ones used by the released version of PI Vision. The versions used at the time this document was last updated are:
```typescript
"dependencies": {
    "@angular/common": "5.2.0",
    "@angular/compiler": "5.2.0",
    "@angular/core": "5.2.0",
    "@angular/forms": "5.2.0",
    "@angular/platform-browser": "5.2.0",
    "@angular/platform-browser-dynamic": "5.2.0",
    "@angular/router": "5.2.0"
}
```

Install all dependencies specified in the file (this can take several minutes)
```bash
npm install
```
After this you should have a new folder in the project named `node_modules`

### Naming the Extension Library
The first step in developing an Extension is to decide on a new name for the Extension library. The name is stored in the file [`package.json`](package.json) under the `name` setting. Change `example-symbol-library` to something else.
```
{
  "name": "example-symbol-library",
  "version": "1.0.0",
  ...
```
Choose a new name using all lowercase characters, numbers, and dashes. The name can not start with a number or dash. It is also a good idea to rename the root folder as well. This name will be used as the base of generated file names and as the library instance name in Javascript. As an object in code the name is converted to "camel case". So in the above example `example-symbol-library` becomes `exampleSymbolLibrary`.

### Build
Run the following command to build this project as a single file JavaScript library.
```bash
npm run build
```
After this, you should find out that you have two new folders in your project.

* `dist` - contains both a compressed (minified) as well an uncompressed Extension JavaScript library
    * ***library-name***.js
    * ***library-name***.js.map
    * ***library-name***.min.js
    * ***library-name***.min.js.map
* `out-tsc` - contains tempoary files used to compile the library

> Note that it is usually more convent to use one of the deployment commands instead of `npm run build` which will both build the javascript library as well as automate the finial packaging and deployment of the Extension to a PI Vision installation.

### Loading Extension Library in development mode
PI Vision enables developers to live debug and fine-tune your extension library code in development mode before deploying the library. This section describes the steps to run a local Node.js server to debug custom symbols.

#### Creating and Installing an SSL Certificate

The first step is to create and install an SSL certificate for the Node.js server. Ideally developers should use a trusted CA signed certificate for the development server. If that is not an option, a self signed certificate can be used instead. 

##### Self-Signed SSL Certificate

>Note: The `certgen` command mentioned here requires `OpenSSL` utility installed on your machine. In Windows OS, the easiest approach is to use `Git Bash` to run the command because the command line shell comes with `OpenSSL` preinstalled. You can install `Git Bash` by downloading `git` from [here](https://git-scm.com/downloads). Otherwise, you need to download the `OpenSSL` executable manually and add the path to environment variable. `OpenSSL` is not the only option. You may generate self-signed SSL certificate using other approaches, such as the `KeyChain` tool on a Mac. 

If you are planning to use a self-signed certificate, go to the project root directory, and enter `npm run certgen` in command line to generate a certificate for localhost. You will see that a few files are generated under `./ssl` folder. `localhost.crt` and `localhost.key` will be used as the certificate and private key for running Node.js with SSL enabled.

The next step is to install the certificate. Run `npm run certinstall` to install the certificate into Trusted Root Certification Authorities. If you are using a Windows OS, you can go to `certlm.msc` to verity a `localhost` certificate has been installed. 

>Note: It is recommended that when the debugging process is complete and your extension library is ready to deploy, remove this self signed SSL certificate from Trusted Root Certification Authorities either manually from `certlm.msc` or enter command `npm run certuninstall`. Please be aware that running the `certuninstall` command will also remove any other certificates named 'localhost' from Root Certification Authorities. 

##### Trusted CA signed SSL Certificate
If you are planning to use a CA signed SSL certificate, open `server-conf.json` and you will see a property called `ssl`. This is the object we pass into `Express` framework to configure the private key location and certificate location for the HTTPS server. Change the `key` property to be the path of your private key and `cert` to your certificate path.

You might also want to change the hostname and port number before running the Node server. By default the hostname is set to `localhost` and the port number is `3001`. You can change these parameters by modifying the `localhost` and `port `properties in `server-conf.json` accordingly.

#### Running Node.js development server
Now that we have installed SSL certificate we can run a Node.js server that serves the extension library content you developed to the PI Vision site. 

Enter `npm run start` command in the console to start the Node.js server. By default the server is running at port `3001`.

Enter URL `https://localhost:3001/manifest` in your browser to verify that your development server is running properly. You should be able to receive a `JSON` object with the `path` and `name` of your extension library. 

>Note: This is for live debugging only and is not a deployment process for custom symbols. 

#### Enable development mode in PI Vision
Launch PI Vision website from your browser and in the homepage, select the Three Line Menu Icon on the upperleft and the click `Options`. In the opened dialogue switch on `development mode`. This is a temporary setting for current browser tab and you will lose the setting when you close the browser tab or clear browser cache. 

After a page refresh, your PI Vision running on current browser tab is in development mode and will prompt you to enter a URL for your extension library server. Enter `https://localhost:3001/manifest` in the input box and click connect, your extension library code is loaded to this instance of PI Vision. You can then create a new display with your custom symbol(s) and debug your code. 

#### Making code changes
Making code changes in your extension library under `./src` will automatically trigger a rebuild of the extension library and restart of the Node.js server. After refreshing the page on your browser, PI Vision is now running with your latest code.  

### Deployment to a PI Vision installation (PI Web API)

These steps are for deploying to a PI Vision site that is hosted on premises. Cloud deployments currently can only be used for developing widgets via enabling developer mode. 

>Note: This temporary deployment process is subject to change.

Build using the command:

```bash
npm run build
```

Copy the contents of the dist folder (choose whether you want to use the minified versions or not) to its own folder underneath the assets/extensions folder of the deployed PI Vision site.

Update the manifest.json file at the root of the assets/extensions folder to include your new extensions. The format is: 

```typescript
{
  "extensions": [
    { "name": "ExampleSymbols", 
      "path": "/assets/extensions/example-symbol-library/example-symbol-library.js" }]
}
```

## Development
This section describes the structure of the source code in general. You will find more details for creating an Angular component as a PI Vision symbol in [symbol-creation-guide](./symbol-creation-guide.md).

### Directory Layout

<pre>
<b>assets/</b>    --> all external HTML resources, typically images
  <b>images/</b> --> image files use by components (jpegs, svg, etc)
<b>src/</b>       --> all of the source files for the application
  <b>example/</b>    --> all the files for an example PI Vision display symbol (named "ExampleComponent")
    <b>example.component.css</b>          --> css file for the symbol component
    <b>example.component.html</b>         --> Angular HTML template
    <b>example.component.spec.ts</b>      --> unit tests
    <b>example.component.ts</b>           --> the main Angular component for the symbol
  <b>framework/</b>
    <b>index.ts</b>          --> rollup of imports
    <b>library.ts</b>        --> classes for the exported library.
    <b>symbol-types.ts</b>   --> classes for working with symbol extensions.
    <b>tokens.ts</b>         --> the injection tokens for PI Vision providers
  <b>module.ts</b>           --> the main module for the Extension
  <b>tsconf.base.json</b>    --> TypeScript base config file
  <b>tsconfig.json</b>       --> TypeScript config for the project
  <b>tsconfig.spec.json</b>  --> TypeScript config for unit testing
<b>.editorconfig</b>    --> cross editor settings to allow supported editors to format new code consistent with the seed's style
<b>.gitignore</b>    --> git ignore file, useful for storing this project in a Git repository
<b>build.js</b>      --> node.js "script" for compiling the library (run via npm run command)
<b>deploy.js</b>     --> node.js "script" for packaging/deploying the library (run via npm run command)
<b>inline-resources.js</b>    --> helper script for builds
<b>karam-test-shim.js</b>     --> helper script for unit test
<b>karma.config.js</b>        --> Config file for running unit tests with Karma
<b>package.json</b>           --> Config file npm package manager
<b>package-update.js</b>      --> helper script to sync dependency versions with PI Vision
<b>README.md</b>                --> This file
<b>symbol-creation-guide.md</b>   --> Additional documentation for symbol creation
<b>symbol-porting-guide.md</b>   --> Additional documentation for porting symbols from PI Vision 3
<b>tslint.json</b>   --> TypeScript linting settings
</pre>

### Module
The module file [`module.ts`](src/module.ts) is the single entry point of the library to bring all parts of the Extension library into one single unit ready for use in PI Vision. You can build one or more custom symbols and put them all in one module. 

### Components
Components are UI building blocks for your custom symbol. It is a self contained unit that includes the view and logic for a symbol. In this seed project, we created a component called `ExampleComponent` which includes the code `example.component.ts`, Angular HTML template `example.component.html`, and css styles `example.component.css`. The unit test file `example.component.spec.ts` is not part of the `ExampleComponent` but for consistency purpose we put unit test file next to the code.

### Dependencies
The dependencies and devDependencies section in [package.json](./package.json) show a list of dependencies required to develop and run the extension library. All dependency versions **MUST** be in sync with the dependency versions in PI Vision. After `npm install`, you will see packages with versions specified in `package.json` installed under `node_modules`. 

#### Using External Libraries
You can use external libraries in addition to the ones listed in [package.json](./package.json). For example, you might want to feed PI data into some charting library and build your own chart symbol. The first step is to install the library through npm command:
```bash
npm install <your-package-name> --save
```

You can see the package downloaded under `node_modules` directory. A new entry will also be added to package.json. You can then import the library with one of the following `import` forms and use it in your symbol component:
```typescript
import SomeChartLibrary from 'someChartLibrary';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
```

#### Dependency Injection
Dependencies can be injected by defining them as input parameters in the component constructor. The are a few things to know to make dependency injection work in your custom symbol.
* The package that contains the dependency should first be installed through npm command.
```bash
npm install <your-package-name> --save
```

* If you would like to use your own instance of the provider, you need to import the Module for that dependency when describing the metadata of the module(`@NgModule()`) in [`module.ts`](src/module.ts).
* Add the provider as an input to your constructor. If you would like to use the same provider instance being used in PI Vision, insert `@Inject()` decorator before your input parameter with one of the injection tokens provided in [`tokens.ts`](src/framework/tokens.ts). For example, you may want to use `PiWebApiService` provider in `@osisoft/piwebapi` and use the same provider instance PI Vision so the `piWebApiService` knows the base URL to access PI Web API server. In this case, you can pass `PIWEBAPI_TOKEN` into the `@Inject()` decorator. You don't need to import `PiWebApiModule` into your extension library because Angular compiler will only look up the provider by injection key in runtime and not complain in compile time.

### Angular Namespaces

Angular components in a Extension library support importing *only* from the following angular modules:

 - @angular/core
 - @angular/common
 - @angular/forms

## Unit Testing

This project comes preconfigured with unit tests. These are written in [Jasmine][jasmine], which we run with the [Karma][karma] test runner. We provide a Karma configuration file to run them.

* The configuration is found at `karma.conf.js`.
* The unit tests are found next to the code they are testing and have an `.spec.ts` suffix (e.g.
  `example.component.spec.ts`).

The easiest way to run the unit tests is to use the supplied npm script:
```bash
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will start watching the source and test files for changes and then re-run the tests whenever any of them changes.

This is the recommended strategy; if your unit tests are being run every time you save a file then you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit. This is useful if you want to check that a particular version of the code is operating as expected. The project contains a predefined script to do this:
```bash
npm run test:once
```

## Linting
[TSLint][tslint] is an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It can be run with the following command.
```bash
npm run lint
```
> Popular editors can integrate with TSLint to provide analysis as you type. This [extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) for [VS Code][vscode] is recommended.


## Licensing
Copyright 2017-2018 OSIsoft, LLC.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please see the file named [LICENSE](./LICENSE).


[angular]: https://angular.io/
[jasmine]: https://jasmine.github.io/
[karma]: https://karma-runner.github.io/
[node]: https://nodejs.org/
[vscode]: https://code.visualstudio.com/
[tslint]: https://github.com/palantir/tslint
[piworld]: https://piworld.osisoft.com/US2018
