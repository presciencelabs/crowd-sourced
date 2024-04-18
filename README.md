# crowd-sourced

TODO; Add README.md Information

## Getting Started

### User Interface (/ui)

1. Install node/npm: https://nodejs.org/en/download/

2. Clone this repository, navigate to the "ui" directory, and install npm dependencies with `npm install`.

3. Start the local development server: `npm start` and navigate to localhost:1234 in a browser window.

#### Building & Deploying the User Interface

1. `npm run build`

2. Commit changes. `git commit`

3. Push changes to the 'embed' (embedable) and 'site' (github pages) branches.

   a. Publish Embed

   `git subtree split --branch=embed --prefix=ui/dist/embed/`

   `git push origin embed`

   b. Publish Site (github pages)

   `git subtree split --branch=site --prefix=ui/dist/site/`

   `git push origin site`

### RESTful API (/api)

The api stores information created via the user interface. It can be launched locally using docker-compose (`docker compose up --build`), which will make the api available on localhost:8080.

The API can also be developed/debugged using a locally-installed version of the [go programming language](https://go.dev/).
