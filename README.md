# Basic Subway Store Searcher

## Description

Allows for searching of subway stores by city and state

## Requirements:

Needs a `.env` file with the following variables:
- `PORT` - The port to run the app on (Default: 3000)
- `MONGO_URI` - The MongoDB URI to connect to (Required)

Install the dependencies with `npm install` or `pnpm install`

## Features for V2:
- Caching: Using Redis, to cache the results of the "find_all_stores", "find_by_id" and "search" functions, so that the database is not queried every time
- Searchable store hours: Currently the store hours are not searchable, but they are implemented in the database

## Testing

To test, run `npm test`

Testing uses Jest, and the tests all end in *.test.ts

Although the testing is fairly basic, it does test the main functionality of the app which is searching for the stores

## Running

Development Run `npm run dev`

Production Run `npm start` (ts-node is used to run the app, as it has minimal performance impact - other than first time the code runs)

## Layout:

- `src/models` contains the Models for the app, such as the Subway Store Database Model
    - Missing Features: 
        - "Store hours" even though they implemented, they need to be transformed to an Integer, so the search function can work better
          when requesting the store hours (such as: "Is Open at: 8:30am")

- `src/routes` contains the routes for the app, such as the Subway Store Search Route