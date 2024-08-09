crowd-sourced-api
=================

API to receive linguistic data.

# Setup

```
cp .env.example .env
npm install
```

For testing and development, start a MongoDB container:

```
docker run --name dev-mongo -p 27017:27017 -d mongo
```

# Test

I use `jasmine` and `zombie` for testing. These are included in the package's development dependencies.

Run all the tests:

```
npm test
```

Run one set of tests:

```
NODE_ENV=test npx jasmine spec/features/indexSpec.js
```

# Production

Configure:

```
cp .env.example .env
```

Set fields as appropriate.

Install production dependencies:

```
npm install --omit=dev
```

Create `uploads/` directory:

```
mkdir uploads
```

Start container:

```
docker-compose up -d
```

