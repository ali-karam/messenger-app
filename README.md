# Messenger App

A 1:1 real-time web-based messenger using React, Node, Express.js, MongoDB, and Socket.io. 

## Getting started

The project is broken down into a client and server folder. The server uses Express and MongoDB. You must have MongoDB installed and set up. 

# Backend Setup

## Installation

* Install all dependencies in the server folder using `npm install`

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

# Frontend Setup

## Installation

* Install all dependencies in the client folder using `npm install`

## Usage

* Start the application using `npm start`
