# KarlBot

The application is available online at [karlbot.dev](https://karlbot.dev/).

KarlBot is a development environment for educational programming language [Karel](https://compedu.stanford.edu/karel-reader/docs/python/en/chapter1.html). Karel's original author is Professor Richard Pattis, but since then many more or less similar variants have been created and this is one of them. It has the following features:

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

## Developer Guide

### Project Overview

The application uses three-tier architecture. It is divided into client, server, and database. The main used technologies are these:

- Client: **TypeScript**, **Angular**
    - User interface: **Angular Material**
    - Code editor: **CodeMirror**
    - Rendering Markdown: **markdown-it**
- Server: **C#**, **ASP.NET Core**
    - ORM: **Entity Framework Core**
    - Running JavaScript (challenge evaluation): **ClearScript**
- Database: **Microsoft SQL Server**

For user authentication is used **Firebase Authentication**.

...And many others.

#### Directory structure

- `/.github/workflows`: CI/CD pipeline.
- `/client`: Client implementation.
- `/server`: Server implementation.
- `/firebase-emulator`: Emulator of Firebase platform.

#### Development configuration files

- Client: `/client/projects/application/src/environments/environment.development.ts`
- Server: `/server/KarlBot/appsettings.Development.json`
   - Integration tests: `/server/Infrastructure.Tests/appsettings.json`
- Firebase: `/firebase-emulator/firebase.json`

### How to run

Prerequisites:
- Windows (or Linux, not tested, but it should work)
- [Git](https://git-scm.com/downloads) installed
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download) installed
- [SQL Server Express LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver16) (or other SQL Server distribution) installed and running
- [Node.js](https://nodejs.org/) installed
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) installed (`npm install -g firebase-tools`)
- [Angular CLI](https://angular.io/cli#installing-angular-cli) installed (`npm install -g @angular/cli`)

If you want to run the project yourself, please follow these instructions:

Clone repository:
```
git clone https://github.com/vosa53/karlbot.git
cd karlbot
```

Start Firebase Authentication emulator:
```
cd firebase-emulator
firebase emulators:start --import data --export-on-exit data --project demo-test
```

*Note: Or just use `/firebase-emulator/start-firebase-emulator.bat` in the case of Windows operating system.*

Build client:
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

Start server:

```
cd server/KarlBot
dotnet run --launch-profile "https"
```

*For Linux users: SQL Server Express LocalDB does not support Linux, you have to use different SQL Server distribution and specify its connection string in the server configuration file*.

*Note: On Windows, you can use [Visual Studio](https://visualstudio.microsoft.com/). Open `/server/KarlBot.sln` and run project `KarlBot` with `https` launch profile.*

It should run at `https://localhost:7105`. Its REST API documentation in Swagger UI is available at [https://localhost:7105/swagger](https://localhost:7105/swagger).

Start client:
```
cd client
ng serve --open
```

It also opens the browser with application GUI.

### How to run tests

Prerequisites:

- Previous step

Server:
```
cd server
dotnet test
```

*For Linux users: Same thing with SQL Server as in the run section. Please specify your connection string in the server integration tests configuration file.*

Client:
```
cd client
npm run test
npm run lint
```

### How to generate documentation

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