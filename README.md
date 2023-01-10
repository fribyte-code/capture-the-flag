# friByte Capture the flag
friByte has a tradition for hosting Capture the Flag, this is our open source code repository for our self developed and self hosted solution.

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
