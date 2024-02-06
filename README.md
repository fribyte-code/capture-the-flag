# friByte Capture the flag

friByte has a tradition for hosting Capture the Flag, this is our open source code repository for our self developed and self hosted solution.

Functionality:

- [x] Basic auth
- [x] User roles
- [x] Automatic Swagger frontend client code generation
- [x] Bruteforce checker
- [ ] Hints for challenges
- [x] Challenges with flag
- [ ] Render challenge description as HTML or Markdown
- [x] Scoreboard
- [x] Live scoreboard
- [x] Challenges Management panel
- [x] Team Management panel
- [ ] User Management panel
- [ ] Release challenges at certain time
- [ ] SSO Auth
- [ ] Connect challenges to a certain event (allow for keeping challenges over time and reusing them)
- [ ] Easy export and import of challenges
- [ ] More features?

## Getting started

### Backend

#### Requirements:

- Dotnet 7 SDK https://dotnet.microsoft.com/en-us/
- Visual Studio Code or Visual Studio Community edition

#### Commands:

VSCode

1. Start postgres: `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres;`
2. `cd friByte.capture-the-flag.service`
3. `dotnet run`
4. Terminal will log what port it listens to

Visual Studio

1. Start postgres: `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres;`
2. Open \*.sln file (should open Visual Studio automatically)
3. Press run in the IDE
4. Terminal will log what port it listens on

#### Entity Framework migrations (modify database model)

We are using Entity Framework for handling database models. We are using the concept called `Code-First` where we define models in CSharp then EFCore automatically create SQL code.

Basic guide from Microsoft: https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app?tabs=netcore-cli

Essentially:

1. `cd friByte.capture-the-flag.service`
2. Run `dotnet ef migrations add <NAME-OF-MIGRATION> --context CtfContext` ex: `dotnet ef migrations add CtfFlag-AddHint --context CtfContext`
3. The migration will automatically be applied when you run the application either by clicking run in the IDE or by `dotnet run`.

### Frontend

#### Requirements:

- NodeJS LTS https://nodejs.org/en/
- npm / yarn

#### Development

Install dependencies: `npm i` or `yarn`

Start the application: `npm run dev` or `yarn run dev`

To make sessions acquired from logging in with swagger persist to the frontend, make sure you access them using the same hostname (either 127.0.0.1 or localhost, as long as you use the same both places)

#### Commands:

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:5173/ in browser
5. login with username: `friByte` and password: `super-duper-secret-password` (password is defined in `friByte.capture-the-flag.service/friByte.capture-the-flag.service/appsettings.json`)

#### Run frontend without backend:

1. `cd frontend`
2. `npm install`
3. `npm run dev:prod-api` -> And frontend will target the production backend https://ctf-api.fribyte.no/swagger
4. Open http://localhost:5173/ in browser
5. login with username: `friByte` and password would probably be the usual

#### Regenerating react query hooks

This is done to update the frontend's knowledge about routes the backend exposes.

`yarn run gen-backend-hooks` or `npm run gen-backend-hooks`

Make sure the backend is running on your machine on :5072 when running this command.
