clean:
	rm -rf ./build \
	rm tsconfig.tsbuildinfo

test:
	clear \
	&& npm run test:db \
	&& npm run test:unit \
	&& npm run test:e2e

buildDocker:
	docker build -t monsters/monsters-messages .

buildTestDocker:
	docker build --build-arg NODE_ENV=development -t monsters/monsters-messages-test .
