# friByte Capture the flag
friByte has a tradition for hosting Capture the Flag, this is our open source code repository for our self developed and self hosted solution.

Functionality:

- [ ] Basic auth
- [ ] User roles
- [ ] Hints for challenges
- [ ] Challenges with flag
- [ ] Scoreboard
- [ ] Live scoreboard
- [ ] Challenges Management panel
- [ ] Team Management panel
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
2. Open *.sln file (should open Visual Studio automatically)
3. Press run in the IDE
4. Terminal will log what port it listens on

#### Entity Framework migrations (modify database model)

We are using Entity Framework for handling database models. We are using the concept called `Code-First` where we define models in CSharp then EFCore automatically create SQL code.

Basic guide from Microsoft: https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app?tabs=netcore-cli 

Essentially:
1. Update models in the `models` folder
2. Run `dotnet ef migrations add <NAME-OF-MIGRATION>` ex: `dotnet ef migrations add CtfFlag-AddHint`
3. The migration will automatically be applied when you run the application either by clicking run in the IDE or by `dotnet run`.


### Frontend

#### Requirements:

- NodeJS LTS https://nodejs.org/en/
- Yarn / npm

#### Development

Install dependencies: `yarn` or `npm i`
Start the application: `yarn run dev` or `npm run dev`

#### Commands:

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:8080/ in browser
