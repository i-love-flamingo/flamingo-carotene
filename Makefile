.PHONY: link

link:
	find ./modules/* -maxdepth 1 -type f -name package.json -execdir npm link \;
