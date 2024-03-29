.PHONY: link unlink

build:
	npx lerna run build

publishToNpm:
	npx lerna publish

install:
	npx lerna clean --yes
	npm i

link:
	npx lerna run link

unlink:
	npx lerna run unlink

test:
	npx lerna run test

updateModules:
	npm update

audit:
	npm audit

fixAudit:
	npm audit fix

cleanDep:
	npx lerna clean --yes

ci:
	npm ci

outdated:
	npm outdated

upgradeAll:
	npx lerna exec -- npx npm-check-updates -u -t minor

yarn-link:
	lerna exec -- yarn link
