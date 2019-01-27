.PHONY: link

link:
	find ./modules/* -type f -name package.json -maxdepth 1 -execdir npm link \;
