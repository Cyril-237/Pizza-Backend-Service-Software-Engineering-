# Preact Pizza 1337 Frontend

## Development

To build this frontent, it is recommended to use the typescript-docker-container in
the infrastruture folder of the root project.

The easiest way to get running, is to use Visual Studio Code:

1. Open this project folder in Visual Studio Code
2. Select "Reopen with Container"

Then, a docker-container containing typescript (and npm) is build.

### Running the Frontend

To run the frontend during development, the following is necessary

1. You need to have the backend server running on localhost:8000 (this is usually done within pycharm)
2. Using a terminal inside the visual studio code project window, run `npm run dev`
3. Using http://localhost:3030 the frontend can be accessed
4. All calls to URLs starting with "v1" are passed to localhost:8000
(this is a config setting in `vite.config.ts`)

### Testing

Tests can be run with the command `npm run test` from a commandline.

## Deployment

To deploy the frontend, run the command `npm run build`
All frontend-files are build in the "dist" folder.
The dist folder is part of the commit.
This folder is used during CI/CD to build the development and release containers.

The frontend is reachable by using the base url of the project (locally this is http://localhost:8000). 

