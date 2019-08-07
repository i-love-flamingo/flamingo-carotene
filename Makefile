.PHONY: link

link:
	npx lerna run link

build:
	npx lerna run build

test:
	npx lerna run test

updateModules:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm update \;

fixAudit:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm audit fix \;

cleanDep:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir rm -rf node_modules \;

ci:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm ci \;

install:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm install \;

yarn-link:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir yarn link \;
