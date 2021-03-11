# Backend Setup
The server uses Express and MongoDB. You must have MongoDB installed and set up. 

## Installation

* Install all dependencies using `npm install`

* Create a .env file in the server folder with the line: `SECRET_KEY=SomeKey`. Replace **SomeKey** with a key of your choice.

* The server uses a database name of **messengerApp** for development mode, and **messengerAppTest** for testing. You may change these names by changing the `DB_NAME` variable in the index.js file in the models directory.

## Usage

To start the server in development mode:
```bash
npm run dev
```
To run tests on the server:
```bash
npm test
```

