linter:
	./node_modules/.bin/tslint --project .

init_mongo:
	ts-node ./script/init-mongo-db.ts

compile:
	rm -rf ./output
	./node_modules/.bin/tsc -p tsconfig.json
