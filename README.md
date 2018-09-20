# `flamingo-carotene`

## Description
@TODO

## How to create a new module
@TODO

## How to publish

Lint and Test your Stuff 1st!

### Lint all Packages

Inside the main package (flamingo-carotene, the folder where this MD exists) simply run
```
yarn lint
```

### Test all Packages
If there are no linting errors you may call
```
yarn test
```
which iterates over all packages and executes the test script which is defined in the package.json of every package

### Publish with lerna
You can only publish versions if: 
* Your stuff is lint-error-free!
* You've executed all tests (and there are no issues)
* ```git-status``` reports no dirty workspace

To publish a new version of flamingo-carotene simply execute
```
yarn lerna version
```
It will show you the current version and gives you the ability to select a new one.
While we're in alpha mode, you need to select "Custom Version" - and type in the version number you want to publish. (without the "v" in front).

So - as an example - if the current version is
```v6.0.0-alpha.29``` you may want to select ```Custom Version``` and type in ```6.0.0-alpha.30```

The new Version tag will be pushed, and the CIGitlab /CD Pipeline will start
https://gitlab.aoe.com/shared/i-love-flamingo/flamingo-carotene/pipelines

If there are no errors while building, the package will be pushed in the artifactory and is ready to use as dependency in other projects
   






 


