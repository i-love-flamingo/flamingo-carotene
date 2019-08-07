.PHONY: link

link:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm link \;

updateModules:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm update \;

cleanDep:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir rm -rf node_modules \;

yarn-link:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir yarn link \;
