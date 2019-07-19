# Mobivate
## Backend Server / Database
#### Authors: Chris Kozlowski, Rebecca Peterson, Jagdeep Singh, Mellisa Stock

## Overview
This backend allows users to create accounts and log in with their Twitter credentials, and create goals and track their progress.

## Modules
#### `app.js`
* Creates and initializes a server with `express`.  
* Contains routes to handle Twitter OAuth 1.0a, user creation, goal creation, and goal updates.  
* Uses the `passport` package to accomodate Twitter OAuth 1.0a.

#### `oauth-helpers.js`
* `buildUserData` takes a request object and creates a single user object from different parts of the request object.
* `hashUserData` uses `bcrypt` and `jsonwebtoken` to encrypt and encode sensitive data for safer transmittal to the frontend or database storage.

#### `sql-methods.js`
* Connects to a SQL database with the `pg` library for PostgreSQL.
* `createUser` structures data from the Twitter OAuth callback and creates a new user or updates an existing user in the database.
* `createGoal` structures data from a fontend form and creates a new goal and progress tracker for that user.
* `getGoals` queries the database with a user id and returns a response to the frontend with an array of all goals and their progress for that user.
* `updateGoal` takes a goal id, and based on if it is a daily goal or weekly goal, sets a new due date for that goal.  The new due date is returned as a response to the frontend.

#### `sql.js`
* Contains an object that holds all SQL query strings used in the application.

## Operation

All routes in this backend are accesed through the React Native application.

## Testing

Tests performed:
* Routes that access the database are querying the database with the correct data.
* Data for users that is collected from Twitter OAuth is structured correctly.
* Data retrieved from the database is structured correctly.
* Uses a mock to control responses from the database.