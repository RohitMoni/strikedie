# webboardgame

WIP

## Requirements

* Node.js
* npm

## Getting Started

1. Clone the repo
2. Run `npm install` to install the required packages
3. Run `npm start` to host a simple node.js express server serving a boardgame.io tictactoe game.

## Relevant commands

* Run `npm run dev` if you want to just host a local dev server running the client app. This include hot-reloading when files change.
* Run `npm run build` if you want to build / pack the client source files for distribution. They end up in the `dist` folder. Our entry point is `src/client/index.html`. The command `npm start` does a build as a pre-start step so it can serve pre-packaged files.

## Todo

* Host on heroku / get it working on heroku
* Get a custom domain (subdomain) working on heroku
* Get HTTPS working on heroku
* Integrate phaser as our view framework