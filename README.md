# Vector Analytics

Minimal alternative to Google Analytics based on Vue.js and MongoDB.

- [Documentation](https://aofuji.ink)
- [Dedicated Tracker](https://github.com/dsrkafuu/aofuji-tracker)

## About the Project

This project does not use semantic versioning until v1 is officially released, so please check the changelog carefully before each upgrade to see if it is still working properly.

## About Vue.js

Vue.js is in the transition phase from v2 to v3, and the project will continue to be based on v2 temporarily because the adaptation of the community ecosystem is not stable yet.

## Getting Started

Go to [documentation site](https://aofuji.ink) for detailed instructions.

### Installation

#### Get Source

```sh
git clone https://github.com/dsrkafuu/aofuji-analytics.git
cd aofuji-analytics
```

Checkout the latest release after cloned:

```sh
git checkout v0.1.0
```

> You can get the latest release tag at [release page](https://github.com/dsrkafuu/aofuji-analytics/releases).

#### Setup Environment Variables

Create a `.env.production` file and set the only required environment variable `DATABASE_URL`. If you're using a locally installed MongoDB server, your setup looks like this:

```sh
echo "DATABASE_URL=mongodb://username:password@localhost:27017/dbname" > .env.production
```

> Check out the [Environment Variables](environment-variables) for more optional variables.

#### Install Deps and Build

```sh
npm ci
npm run build
```

#### Start Application

```sh
npm start
```

When the server starts up at port 3000, you can expose it directly to the public network (not recommended) or provide it to a reverse proxy.

### Update Application

#### Fetch Latest Source

```sh
git fetch
git checkout v0.1.1 # latest tags will show in terminal when fetch
```

#### Update Deps and Build

```sh
npm ci
npm run build
npm start
```

## Contribute

### Local Development

First you need to fork this repo and clone it.

Then create a `.env.development` then set the development environment variables above. Check the [Environment Variables](environment-variables) section for more details.

After these, you can simply:

```sh
npm install
npm run dev
```

Local MongoDB server is also needed.

### Code Style

This project uses [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to format source code, so the git commands may be slow due to the [Prettier](https://prettier.io) formatting workflow.

#### Options API Props Order

```
render
name => components
props => data => computed => watch
lifecycle functions
methods
```

#### SCSS Scopes

All basic components in `@/components` should not use scoped styles, styles of those needs to be named like `a-component-ctx`.

Alternatively, all view components in `@/views` should use scoped styles.

## License

This project is released under `MIT License`, for more information read the [LICENSE](https://github.com/dsrkafuu/aofuji-analytics/blob/main/LICENSE).

Copyright © 2020-present DSRKafuU (<https://dsrkafuu.su>)
