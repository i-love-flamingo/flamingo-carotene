# macOS Setup Guide

This guide will help you to run a flamingo project encapsulating flamingo-carotene as frontend development toolchain on Macintosh machines.

## Preparation of Go programming language

### Install and configure Go

To run the project's HTTP server we need to install Go first.

#### Install Go on Mac

**Official install**

[Download the package file](https://golang.org/dl/), open it, and follow the prompts to install the Go tools. 
The package installs the Go distribution to */usr/local/go*.
The package should put the */usr/local/go/bin* directory in your PATH environment variable.

**Install using Brew**: Install [brew](https://brew.sh/) and use ```brew install go```

You may need to restart any open Terminal sessions for the change to take effect.

Run ```go version``` to check if installation was successful.

#### Configure environment variables

Check official paths by executing ```go env GOPATH GOROOT``` and if you don't want to change them, adopt those to your terminal configuration.

Change GOPATH here to have a custom directory for Go packages and projects. Also change GOROOT path if you want to use a different Go version.

In your ```~/.bash_profile``` or ```~/.zshrc``` insert GOPATH and GOROOT to your environment variables and add the binary directory to your binary PATHs at the end of the file.

```bash
export GOPATH=$HOME/go
export GOROOT=/usr/local/go
export PATH=$PATH:$GOPATH/bin
```

Restart your Terminal session or reload configuration file by running ```source ~/.bash_profile``` or ```source ~/.zshrc```.

Check if GOPATH environment variable is set by executing ```go env GOPATH```.
   
#### Install dep

Make sure you have Git installed by checking ```git --version```. 
If you don't, please install it by running ```xcode-select --install```.

**Attention**:
In newer project, where the project has to be located outside the GOPATH directory, is no need for *dep*.

```bash
sudo rm -rf $GOPATH/pkg/
sudo rm -rf $GOPATH/src/github.com/golang/dep
go get -v -u github.com/golang/dep/cmd/dep
```

You can test if dep is available now correctly by running ```dep version```
    
## Install Flamingo Dependencies

Now that Go is installed

### Check the base setup

Use *dep* to load all dependencies. 

**Attention**:
In newer project, where the project has to be located outside the GOPATH directory, 
skip directly to running the project with server. All dependencies will load during compile time.

Add SSH key if not yet done. SSH key may need to be installed at ```~/.ssh/id_rsa``` and  ```~/.ssh/id_rsa.pub```.

```bash
ssh-add
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
dep ensure -v
```

Check if project compiles with ```go run main.go config```. The output should be a JSON object, which implies a correct setup up to here.
    
To start the HTTP Server use this. Newer projects (not located within GOPATH) can run the HTTP server directly.
All dependencies should load automatically. 

```bash
go run main.go serve
```

Now browse to [http://localhost:3322](http://localhost:3322).
It will show warning and erros, which is ok at this stage.

To speed up the project (with precompile dependencies):

```bash
go build -i -o /dev/null
```

### Install Required Tools for Flamingo Carotene

#### Install NodeJS

**Official install**

Execute the following to install latest stable NodeJS version and follow the installers instructions.

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(curl -sL https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

Please check, if ```npm -v``` reports 5.6.0 or higher

Please check, if ```node -v``` reports v9.4.0 or higher

**Install using NVM**: Install [Node Version Manager (NVM)](https://github.com/creationix/nvm) and then ```nvm install stable```.

**Install using Brew**: Install [Brew](https://brew.sh/) and then ```brew install node```


#### Initial Frontend build

Install all NodeJS dependencies and fully build the project's frontend once.

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend
npm i
npx flamingo-carotene build
```

After this back in the root directory your Go HTTP server can be run with ```go run main.go serve``` and the result can be seen at [http://localhost:3322/](http://localhost:3322/).

#### Flamingo Carotene dev server - file watcher and static server

The flamingo-carotene developer server lets you watch all frontend file for changes, re-builds them on change and triggers a reload in the browser.

It can optionally provide a small static server. 

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
npx flamingo-carotene dev
```

Check if hot reloading available using the normal server [http://localhost:3322/](http://localhost:3322/) or the development server at [http://localhost:1337](http://localhost:1337)

If no server available at *localhost:1337* then the project might not be configured to use it.

## Help

### Update Flamingo library and core

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
dep ensure -v -update flamingo.me/flamingo
```

### Completely build the Frontend

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend
npx flamingo-carotene build
```

#### Start Frontend Dev-Server and watch on file changes

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend
npx flamingo-carotene dev
```
