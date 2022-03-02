.PHONY: install start build clean

install:
	npm install

start:
	npm run start

build:
	npm run build

clean:
	rm -rf node_modules
	rm -rf dist
