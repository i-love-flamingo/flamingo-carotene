.PHONY: link

build:
	npx lerna run build

install:
	npx lerna clean --yes
	npx lerna bootstrap

link:
	npx lerna run link

test:
	npx lerna run test

updateModules:
	npx lerna exec -- npm update

fixAudit:
	npx lerna exec -- npm audit fix

cleanDep:
	npx lerna clean --yes

ci:
	npx lerna exec -- npm ci

yarn-link:
	lerna exec -- yarn link
