crowd-sourced
=============

This application is intended to be delivered via this Drupal plugin: https://www.drupal.org/project/crowd_sourced_popup

It presents a popup for collecting textual and auditory language data.

# Setup and Deploy

In addition to the Drupal module named above, this application consists of two parts: the `preact` UI and the `node`/`express` API. _Note_ the `go` API preserved for historical reasons. The overall architecture is convoluted and will be simpilifed if resources allow.

The instructions that follow document how to set up the project for local development and production deployment.

## Development

Start a Dockerized `mongo` server:

```
docker run --name dev-mongo -p 27017:27017 -d mongo
```

Once downloaded and executed, the `mongo` server can be restarted like this:

```
docker start dev-mongo
```

### API (/api)

The API needs to run in its own process. The easiest way to do that is by executing the following instructions in their own terminal window/tab.

From the `api/` directory:

```
cd api
```

Configure:

```
cp .env.example .env
```

Install dependencies:

```
npm install
```

Launch server:

```
npm start
```

It is now running on http://localhost:3001/

## UI

From the `ui/` directory:

```
cd ui
```

Install dependencies:

```
npm install
```

Run the build server:

```
npm start
```

It is now running on http://localhost:1234

## Testing

Tests are executed against the dev server and the running API:

```
npm test
```

# Production

## API

```
cd api
cp .env.example .env
npm install
```

## UI

```
cd ui
cp .env.example .env
npm install
npm run build
```

From the **base** application directory, copy and configure:

```
cp .env.example .env
```

Launch the server:

```
docker compose up -d
```

## nginx-proxy

All the certs are provided courtesy of _Let's Encrypt_. There is an example proxy server defined in `nginx-proxy`. You only need one of these per server, so it is prudent to copy the directory into a new location:

```
cp -r nginx-proxy ..
cd ../nginx-proxy
```

Start the container:

```
docker compose up -d
```

# License

MIT

