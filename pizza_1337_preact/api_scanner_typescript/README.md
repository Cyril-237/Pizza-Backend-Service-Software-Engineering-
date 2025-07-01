# Generate Open-API code for typescript

1. Get the openapi.json file by running http://localhost:8000/openapi.json
2. Save the file into openapi.json
3. Run a docker container with a node-js / typescript environment
4. Run the command `npm install`
5. Run the command `node ./node_modules/openapi-typescript-codegen/bin/index.js -i openapi.json -o src/api`

The typescript code to access the API is generated in src/api

