# KarlBot

Application is available online at [karlbot.dev](https://karlbot.dev/).

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

### Project overview

Application uses three tier architecture. It is divided into client, server and database. Main used technologies are these:

- Client: **TypeScript**, **Angular**
    - User interface: **Angular Material**
    - Code editor: **CodeMirror**
    - Rendering Markdown: **markdown-it**
- Server: **C#**, **ASP.NET Core**
    - ORM: **Entity Framework Core**
    - Running JavaScript (challenge evaluation): **ClearScript**
- Database: **Microsoft SQL Server**

For users authentication is used **Firebase Authentication**.

And many others.

#### Directory structure

- `.github/workflows`: CI/CD pipeline.
- `client`: Client implementation.
- `server`: Server implementation.
- `firebase-emulator`: Emulator of Firebase platform.

### How to run

Prerequisites:

- Git installed
- Node.js installed
- dotnet SDK installed
- Java JDK installed (Firebase emulator dependency)

If you want to run project yourself, please follow these steps:

- ``


