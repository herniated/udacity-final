# udacity-final

This application provides the ability to create sports leagues and add players to the leagues.  A League can have one name property and have many players registered for the league.  This repository includes both a backend API and a frontend client.  The backend API is an AWS serverless application using AWS Cloud Formation, API Gateway, Dynamo DB (2 tables), Lambda functions, function-level permissions, logging, distributed tracing, request validation.  The code is split into multiple layers, separating business logic from I/O related code.  In addition, Auth0 is used Authentication.  

# Backend Info

## API

The following paths have been implemented as the backend API:

```
/leagues
/leagues/{{leagueId}}/registrations
/registrations
```

## Postman API Collection

A Postman Collection has been [included](https://github.com/herniated/udacity-final/blob/master/backend/udacity-sls-final-api.postman_collection.json) to doucument the backend API.  Please import it into Postman to experiment with the API.

## Authentication

The read APIs do not require Authentication while the create, update, and delete API methods do require authentication.  In order to use the Postman Collection, please launch the client app (see instructions below), login to the app, then use the browser developer tools to retrieve the id token from the console.  The token must be added as a Postman collection variable named "authToken".

## Metadata

The created date, creating user, modified date, and modifying user of all leagues are tracked and made available via the API.

The created date, and creating user of all registrations are tracked and made available via the API.

## Postman API Test Collection

A Postman Test Collection has been [included](https://github.com/herniated/udacity-final/blob/master/backend/udacity-sls-final-api-tests.postman_collection.json) to test the backend API.  Please import the collection into Postman and execute as a Runner to test the API.

# Frontend Info

## Leagues List

The main page is the Leagues List page.  It will display a list of all leagues in the system.  If authenticated, the user can create new leagues, edit existing leagues, or delete existing leagues.  If a user clicks on a league name, they will navigate to the Registrations List page.  If a user clicks the Pencil icon next to a league name, they will navigate to the League Editor.  If a user clicks the Delete (X) icon next to a league name, they will delete the league.

## League Editor

The League Editor allows a user to change the name of a league.

## Registrations List

The Registrations List page will display a list of all registered users for a particular league.  If authenticated, the user can add new registered players to a league or delete registered players from a league.  If a user clicks the Delete (X) icon next to a player's name, the player will be deleted from the league.

# How to run the application

## Backend

The backend has already been deployed.  The frontend application has already been configured to work with the deployed backend.

## Frontend

To run the client application, run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the backend.
