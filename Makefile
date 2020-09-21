.PHONY: link

build:
	npx lerna run build

publishToNpm:
	npx lerna publish

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

outdated:
	npx lerna exec -- npm outdated

upgradeAll:
	npx lerna exec -- npx npm-check-updates -u

yarn-link:
	lerna exec -- yarn link
