## Frontend Development for Windows 10

For fresh maschines:

- Download & Install Node JS from  

  https://nodejs.org/en/
  
- Download & Install Git for Windows 

  https://git-scm.com/download/win
  
  (Use the MingW Git-Bash if asked)
  
- Download & Install Go for Windows
  
  https://golang.org/dl/
  
- Download & Install Make for MingW
  
  https://sourceforge.net/projects/ezwinports/files/make-4.2.1-without-guile-w32-bin.zip/download
  Extract zip, copy the contents to your Git\mingw64\ merging the folders, but do NOT overwrite/replace any existing files. (There shouldn't be any)

  
- Configure the MingW for usage of JetBrains-IDE Terminal
  
  File -> Settings -> Tools -> Terminal
  
  Shell Path: 
  ```
  "C:\Program Files\Git\bin\bash.exe"  --login -i 
  ```
 
- Use OpenSSH on Windows 10
  - Open "Manage optional features" from Startmenu 
    ("Optionale Features Verwalten" in German)
  - Add Feature
  - Add "Open SSH Server"
  - Open "Services" ("Dienste" in German)
  - Go to "OpenSSH Authentication Agent"
    - right click: set start to "Automatic"
    - start service
  - goto cmd
    - type in "where ssh"
    (should be C:\Windows\System32\OpenSSH\ssh.exe)
  - prevent that git-bash will use its own ssh (if installed)
    - type in 
      ```
      where ssh
      ```
    - if this is not the system32 folder:
      - start gitbash in elevated rights (as admin)
      - goto /usr/bin
      - type: 
        ```
        mkdir old_ssh
        mv ssh* old_ssh
        ```
  - open a cmd
    - type in 
      ```
      ssh-add [PATH TO YOUR SSH IDENTITY]
      ```



- Install windows-build-tools

  This step is needed for some frontend requisites.
  In POWERSHELL(!!!) with elevated rights (aka: run as administrator)

  ```
  npm install --global windows-build-tools
  ```
 
  You need to **reboot** after this step.
   
- PreCompile-Steps

  Inside your IDE: Open Terminal and execute inside the "flamingo"-folder:
  
  ```
  make up
  make translation
  cd frontend
  npm ci & npm run-script build
  ```

