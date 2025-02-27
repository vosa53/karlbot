# KarlBot

The application is available online at [karlbot.dev](https://karlbot.dev/).

KarlBot is a development environment for an educational programming language [Karel](https://compedu.stanford.edu/karel-reader/docs/python/en/chapter1.html). Karel's original author is Professor Richard Pattis, but since then many more or less similar variants have been created and this is one of them. It has the following features:

- Syntax highlighting
- Code completion
- Automatic indentation
- Error checking
- Advanced town editor
- Running Karel's program
- Saving projects on the server
- Saving projects locally
- Sharing projects via URL
- Debugger with stepping, breakpoints and call stack view 
- Automatically evaluated challenges
- Mobile phones support

![](/client//projects/application/src/assets/shared/presentation/pages/user-guide/editor.png)

## Developer Guide

### Project Overview

The application uses a three-tier architecture. It is divided into client, server, and database. The main used technologies are these:

- Client: [TypeScript](https://www.typescriptlang.org/), [Angular](https://angular.io/)
    - User interface: [Angular Material](https://material.angular.io/)
    - Code editor: [CodeMirror](https://codemirror.net/)
    - Markdown renderer: [markdown-it](https://github.com/markdown-it/markdown-it)
    - Tests: [Cypress](https://www.cypress.io/), [Jasmine](https://jasmine.github.io/)
    - Documentation: [Compodoc](https://compodoc.app/), [TypeDoc](https://typedoc.org/)
- Server: [C#](https://learn.microsoft.com/en-us/dotnet/csharp/), [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core)
    - ORM: [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
    - Running JavaScript (challenge evaluation): [ClearScript](https://github.com/microsoft/ClearScript)
    - Tests: [NUnit](https://nunit.org/), [Moq](https://github.com/moq/moq)
    - Documentation: [Swagger UI](https://swagger.io/tools/swagger-ui/), [docfx](https://dotnet.github.io/docfx/)
- Database: [Microsoft SQL Server](https://www.microsoft.com/cs-cz/sql-server)

For user authentication is used [Firebase Authentication](https://firebase.google.com/docs/auth).

...And many others.

#### Directory structure

- `/.github`: CI/CD pipeline.
- `/client`: Client implementation.
- `/server`: Server implementation.
- `/firebase-emulator`: Emulator of the Firebase platform.

#### Development configuration files

- Client: `/client/projects/application/src/environments/environment.development.ts`
- Server: `/server/KarlBot/appsettings.Development.json`
   - Database integration tests: `/server/Infrastructure.Tests/appsettings.json`
- Firebase emulator: `/firebase-emulator/firebase.json`

#### Git branches

- `develop`: The actual development is taking place here.
- `master`: Contains the latest release version. When a new version of the application is ready, a merge from `develop` to `master` is performed and the CI/CD pipeline automatically deploys it to [karlbot.dev](https://karlbot.dev/).

### How to run it

Prerequisites:
- Windows (or Linux &ndash; not tested, but it should work)
- [Git](https://git-scm.com/downloads) installed
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download) installed
- [SQL Server Express LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver16) (or another SQL Server distribution) installed and running
- [Node.js 18](https://nodejs.org/) installed
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) installed (`npm install -g firebase-tools`)
- [Angular CLI](https://angular.io/cli#installing-angular-cli) installed (`npm install -g @angular/cli`)

If you want to run the project locally, please follow these steps:

Clone the repository:
```
git clone https://github.com/vosa53/karlbot.git
cd karlbot
```

Start the Firebase Authentication emulator:
```
cd firebase-emulator
firebase emulators:start --import data --export-on-exit data --project demo-test
```

*Alternative: Or just use `/firebase-emulator/start-firebase-emulator.bat` in the case of the Windows operating system.*

Build the client:
```
cd client
npm install

cd projects/karel
npm install
ng build karel
npm run build

cd ../karel-evalution
npm install
ng build karel-evaluation
npm run build
```

Start the server:

```
cd server/KarlBot
dotnet run --launch-profile "https"
```

*Alternative: On Windows, you can use [Visual Studio](https://visualstudio.microsoft.com/). Open `/server/KarlBot.sln` and run project `KarlBot` with `https` launch profile.*

*For Linux users: SQL Server Express LocalDB does not support Linux, you have to use a different SQL Server distribution and specify its connection string in the server configuration file*.

It should run at `https://localhost:7105`. Its REST API documentation in Swagger UI is then available at [https://localhost:7105/swagger](https://localhost:7105/swagger).

Start the client:
```
cd client
ng serve --open
```

It also opens a web browser with the application GUI.

#### How to get administrator permissions

Challenge editation is available only for administrators.

1. Sign in to the application.
2. Go to the database and find your user ID (`AspNetUsers` table).
3. Run these SQL commands:
```sql
INSERT INTO AspNetRoles(Id, Name) VALUES('f21cd4b8-94b0-4516-9429-311da93b5a2d', 'Admin')
INSERT INTO AspNetUserRoles(UserId, RoleId) VALUES('<Your ID>', 'f21cd4b8-94b0-4516-9429-311da93b5a2d')
```

### How to run tests

Prerequisites:

- Previous step

Server:
```
cd server
dotnet test
```

*For Linux users: Same problem with SQL Server as in the run section. Please specify your connection string in the server integration tests configuration file.*

Client:
```
cd client
npm run test
npm run lint
```

End-to-end:

1. Launch the client and server with an environment variable `IsEndToEndTest` set to `true` (that clears the database and prepares test data).

2. Run:
```
cd client
npx cypress open
```
3. Wait for Cypress UI to open.
4. Click on *E2E Testing*.
5. Select *Chrome* browser.
6. Click on *Start E2E Testing in Chrome*.
7. Open `create-project-challenge-and-submit-it.cy.ts` test spec.

*Alternative: If you don't need the UI* then simply use `npx cypress run` (client and server running is still needed).

### How to generate the documentation

Prerequisites:

- Previous steps
- [docfx](https://dotnet.github.io/docfx/) installed (`dotnet tool update -g docfx`)

Server:
```
cd server
docfx docfx_project/docfx.json
```

Documentation is generated in `/server/docfx_project/_site`. It has to be served by some (local) web server (opening `index.html` directly in the browser won't work). For example, [this](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) web server can be used.

Client:
```
cd client
npm run documentation
```

Documentation is generated in `/client/docs`. Every project has its own folder.