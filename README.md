# Vector Analytics

\[WIP\] Minimal alternative to Google Analytics.

## About Vue.js

Vue.js is in the transition phase from v2 to v3, and the project will continue to be based on v2 temporarily because the adaptation of the community ecosystem is not stable yet.

Options API prop order:

```
render => name => components => props => data => computed => watch => methods => lifecycle functions
```

## Bypass Block Extensions

Add `VUE_APP_TRACKER_FILENAME` environment variable to customize the tracker script name, for example:

```
VUE_APP_TRACKER_FILENAME="jquery.min.js"
```

## Local Development

First you need to fork this repo and clone it. Then create a `.env.development` then set the development environment variables below.

Note that this project uses husky and lint-staged to format source code, so the git commands may be slow due to the Prettier formatting workflow.

After these, you can simply:

```bash
npm install
npm run dev
```

Remember to use `npm run lint` to check the errors before commiting.

Check the [Environment Variables](#environment-variables) section for more details.

## Environment Variables

The varibales below are available both in development mode and production mode:

```
SERVER_PORT=3000  # control panel server port
DATABASE_URL="mongodb://localhost:27017/goosedb_preview" # database url (mongodb)
VUE_APP_TRACKER_FILENAME="goose.min.js" # tracker script file name
VUE_APP_TITLE="Vector Analytics" # app title on control panel
```

### Development

In development mode, the website itself is provided by Vue CLI on `SERVER_PORT`.

Difference is that the API server is deployed on `SERVER_API_PORT` without static file provider, then proxyed by Vue CLI's webpack-dev-server to the same port as `SERVER_PORT`.

```
SERVER_API_PORT=3001
```

### Production

Production mode needs `npm run build` first. Both the API server and website files built are provided by express.js on port `SERVER_PORT`.

```
BASE_URL="/"
```

## License

This project is released under `Apache License 2.0`, for more information read the [LICENSE](https://github.com/amzrk2/vector-analytics/blob/main/LICENSE).

**Copyright © 2020-present DSRKafuU <https://amzrk2.cc/>**
