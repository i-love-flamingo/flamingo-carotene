# Windows 10 Setup guide


## Preparation of go in the Windows Subsystem

### Install Ubuntu Bash on Windows

See: https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/
  
If you want to install the app from cmd line:

Ensure the feature "Windows Subsystem for Linux" is activated under Windows-Features and run the following command: 
```
lxrun /install
```

### Link your Windows SSH Certificate folder 

```bash
ln -s "/mnt/c/Users/<your.user.folder>/.ssh" ~
```

### Install and configure go on Ubuntu Subsystem

#### Install Go on Ubuntu Subsystem

```bash
sudo add-apt-repository ppa:gophers/archive
sudo apt update
sudo apt-get install golang-1.10-go
```
   
#### Configure go Paths

-  Edit `~/.profile` and insert at the end of file:  
    ```bash
    PATH="$PATH:/usr/lib/go-1.10/bin"
    ```

-  Set GoEnvVars  
   Edit  `~/.bashrc` and insert at the end of file:
   ```bash
   export GOROOT=/usr/lib/go-1.9/
   export GOPATH=/mnt/c/projects/go
   ```

- Make changes happen  
   <b>Close and reopen bash</b>

- Validate correct paths in bash  
   ```bash
   go env
   ```
   and double check `GOPATH` value. 
   
#### Install dep

```bash
rm -rf $GOPATH/pkg/
rm -rf $GOPATH/src/github.com/golang/dep
go get -v -u github.com/golang/dep/cmd/dep
```

You can test if dep is available now correctly by running
```bash
dep version
```
    
## Install Flamingo Dependencies
    

### Check the base setup

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
eval `ssh-agent -s` && ssh-add <(cat PATH_TO_YOUR_ID_RSA)
dep ensure -v
```

Your Project will compile and run now, try:

```bash
go run main.go config
```

The output should be a json object (which implies a correct setup till here)
    
You can start the HTTP Server als well:

```bash
go run main.go serve
```

and browse to [http://localhost:3322](http://localhost:3322)
which will result in warning and erros, which is ok at this stage.

To speed up the project (with precompile dependencies):

```bash
go build -i -o /dev/null
```

### Install Required Tools

#### Install Node

```bash
cd ~
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Please check, if npm reports 5.6.0 or higher
```bash
npm -v
```

Please check, if node reports v9.4.0 or higher
```bash
node -v
```

#### Install YARN

```bash
cd ~
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Please check, yarn should report 1.3.2 or higher

```bash
yarn -v
```

#### Initial Frontend setup

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
yarn
yarn build
```

after this, your go server can be run with:
```bash
go run main.go serve
```

Browse to [http://localhost:3322/](http://localhost:3322/)

#### Carotene CLI Dev Server

Frontent Watcher & HotReloading Frontend Server

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
yarn dev
```

Check if the dev server is available [http://localhost:1337/](http://localhost:1337/)

## Help / Pitfalls

### Help - i cant save files in my Intelli IDE if the carotene-cli watcher listen to changes

- Dont Panic!
- Open your IDE 
- `File` -> `Settings`
- `Appearance & Behaviours` -> `System Settings`
- UNCHECK `Use 'safe write'`


### Usefull Lines

#### Update Flamingo library and core

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo
eval `ssh-agent -s` && ssh-add ~/.ssh/id_rsa
dep ensure -v -update flamingo.me/flamingo
```

#### Completely build the Frontend

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend
yarn build
```

#### Start Frontend Dev-Server and watch on file changes 

```bash
cd $GOPATH/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend
yarn dev
```


### WARNING: DATA LOSS on "Git Push -> Stash -> Rebase -> Stash Commit"chain

This is a strange behaviour of node/watch/webpack on lxss
Install lsyncd and sync files from frontend to frontend-sync locally.
Start yarn dev in frontend-sync

-   
  ```bash
  sudo apt-get install lsyncd
  sudo mkdir /etc/lsyncd
  touch /etc/lsyncd/lsyncd.conf.lua
  ```
  
- Add the following config to your `lsyncd.conf`  

    ```json
    settings {
        logfile = "/var/log/lsyncd.log",
        statusFile = "/var/log/lsyncd.status",
        statusInterval = 10
    }

    bash = {
        maxProcesses = 3,
        onAttrib = "cp -r ^sourcePathname ^targetPathname",
        onCreate = "cp -r ^sourcePathname ^targetPathname",
        onModify = "cp -r ^sourcePathname ^targetPathname",
        onDelete = "rm -rf ^targetPathname",
        onMove   = "mv ^o.targetPathname ^d.targetPathname"
    }

    sync {
        bash,
        source = "/mnt/c/projects/go/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend/src",
        target = "/mnt/c/projects/go/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend-synced/src"
    }
    ```

- start lsyncd

  ```bash
  sudo service lsyncd start
  ```

- use the `resync.sh` script to completely rebuild

  ```bash
  #!/bin/bash
  
  # stopping lsyncd.
  sudo service lsyncd stop
  
  # goto sync folder
  cd /mnt/c/projects/go/src/[PROJECT-DOMAIN]/[PROJECT-NAME]/flamingo/frontend-synced
  
  # kill everything
  sudo rm -rv *
  
  # go to real frontend folder
  cd ../frontend
  
  # copy everything except node_modules 
  find . -maxdepth 1 ! -name node_modules ! -name . -exec cp -prv {} ../frontend-synced \;
  
  # go to synced folder
  cd ../frontend-synced
  
  # link node modues
  ln -s ../frontend/node_modules .
  
  # start lsyncd again
  sudo service lsyncd start
  ```
  
