# Getting Started with Flamingo Carotene

If you have an new flamingo project this are the steps to do, to use flamingo-carotene:

## Prepare the Frontend

Inside your flamingo project folder:

```
mkdir -p frontend/src
cd frontend
yarn init

yarn add flamingo-carotene-core
yarn add flamingo-carotene-pug

```

This initializes your frontend project:
* flamingo-carotene-core - includes the basic commands and core logic
* flamingo-carotene-pug - includes the Build logi to work with pug


You now can add your first page template with pug:

```
cat frontend/src/page/index.pug
```

And with this command you can start building your frontend:

```
yarn flamingo-carotene build
```

The result is stored in the folder ```frontend/dist```


## Prepare the Flamingo project
You should have a running Flamingo project.

In order to use the generated templates in your flamingo project you need to add the pugtemplate module in your projects main go file:

```
...
import (
    ...
	"flamingo.me/flamingo/core/pugtemplate"
	...
)

...
    []dingo.Module{
        ...
        new(pugtemplate.Module),
        ...
    }

```

## Next Steps

After the first steps you can continue with:

* [Read more about Atomic Design](/docs/atomic-design.md)
* Use the `flamingo-carotene-webpack` package to use webpack to build JS and CSS
* Use the `flamingo-carotene-dev-server` package to benefit from Hot reloading during development
* Use the `flamingo-carotene-behavior` package to add dynmic javascript for your design components
* Use the `flamingo-carotene-state-manager` package to use the page state pattern to communicate and manage state between design components.


## Links to used tools

Read more about the tools used in flamingo carotene packages:

*Yarn and NPM*
- https://yarnpkg.com/en/
- https://www.npmjs.com/

*PUG for templating*
- https://pugjs.org/api/getting-started.html

*Sass for CSS*
- http://sass-lang.com/

*Webpack for Build*
- http://andrewhfarmer.com/webpack-hmr-tutorial/



