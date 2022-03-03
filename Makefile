LEET_CACHE_VERSION := $(shell cat package.json | jq -r '.version')

.PHONY: install
install:
	npm install

.PHONY: start
start:
	npm run start

.PHONY: build
build:
	npm run build

# Use dash before command to ignore error(s) when removing a file/dir that does not exist
.PHONY: clean
clean:
	-rm *.zip
	-rm -rf node_modules
	-rm -rf dist

.PHONY: package
package: clean install build src dist

.PHONY: src
src:
	zip -r -9 ./leet-cache-$(LEET_CACHE_VERSION)-src.zip * --exclude "*.git*" "node_modules/*" "*.zip" "dist/*"

.PHONY: dist
dist: build
	cd dist/ && zip -r -9 ../leet-cache-$(LEET_CACHE_VERSION)-dist.zip *
