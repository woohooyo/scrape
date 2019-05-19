linter:
	./node_modules/.bin/tslint --project .

init_mongo:
	ts-node ./script/init-mongo-db.ts
