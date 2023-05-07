KarlBot is a development environment for educational programming language [Karel](https://compedu.stanford.edu/karel-reader/docs/python/en/chapter1.html). Karel's original author is Professor Richard Pattis, but since then many more or less similar variants have been created and this is one of them. It has the following features:

- Syntax highlighting (not in this guide yet 🙁)
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

This guide is divided into three parts, first describes the programming language, second the application from the user's point of view, and third for interest from the administrator's point of view. 

## Karel's world

Karel lives in a *town*. His town is a rectangular tile map with *walls* and *land*. Walls are also around the town. Despite the fact that Karel is a robot, he has also his own *home*.

![](/assets/shared/presentation/pages/user-guide/town.png)

*Karel's abilities and his town in this application were inspired by [Robot Karel](http://karel.oldium.net/) app of Oldřich Jedlička.*

## Karel Language Reference

### Commands for interaction

Karel is a simple robot. He has only two commands for movement.

- `step`: Moves Karel one tile forward.
- `turnLeft`: Turns Karel 90 degrees left.

He can also mark the tile where he stands with a *sign*. A maximum of 8 signs can fit on a tile.

- `put`: Puts one sign on the tile where Karel stands.
- `pick`: Picks one sign from the tile where Karel stands.

### Programs

Yes, Karel commands are simple, however, you can create your own, more complex. Also, every Karel's command has to be in some *program*.

```
program myProgram
    step
    step
    turnLeft
end
```

### If statements

*If statements* allow Karel to execute different commands based on some condition. Basic if statement can look like this:

```
if is sign
    step
end
```

If you execute this program Karel moves only when he stands on a sign. Conditions can also be inverted with `not` operator:

```
if not sign
    step
end
```

Sometimes it's useful to execute something in both cases, positive and negative. You can write two opposite conditions, but Karel provides an easier way:

```
if not wall
    step
end
else
    turnLeft
    step
end
```

### Commands for testing

As conditions, you can use various commands.

Firstly, Karel is able to recognize the world direction he is facing:

- `north`: Checks if he faces north. 
- `east`: Checks if he faces east.
- `west`: Checks if he faces west.
- `south`: Checks if he faces south.

He can also make decisions based on his surroundings.

- `sign`: Checks if on the tile before Karel is a sign.
- `wall`: Checks if before Karel is a wall.
- `home`: Checks if Karel is home.

### Loops

Copying commands every time you need to execute them more times wouldn't be much fun. That is the reason Karel has `repeat` *loop*:

```
repeat 8 times
    put
end
```

Repeat loop looks good, but what if you don't know beforehand how many times you want to execute it? `while` loop comes as a solution:

```
while not wall
    step
end
```

### Exceptions

Karel is not much careful and can easily damage himself. He does everything you tell him, and so for example when you instruct him to go to the wall he does it. At that time Karel program stops and an *exception* is thrown. Other exceptions occur when Karel tries to pick a sign from a tile where are not any and when Karel tries to put on a tile more signs than 8.

### Recursion

Karel does not have variables like common programming languages. However, this does not prevent from implementing slightly more advanced algorithms. A tool that can be used in many cases instead is *recursion*. Recursion is the ability of a program to call itself. At first thought it can look useless but if you combine it with conditions some advanced algorithms can be created. The most basic example of recursion can look like this:

```
program toWall
    if not wall
        step
        toWall
    end
end
```

This is a recursive version of the *iterative* program shown in the previous code example.

### Comments

Some programs, especially those containing recursion, can be difficult to understand. It is therefore good practice to write *comments* explaining them. Karel has two types of comments.

*Single-line comment* starts with `//` and ends at the end of the line:

```
// Some useful comment
```

*Multi-line comments* can be used when the information can not fit on a single line. They start with `/*` and end with `*/`.

```
/* Some even
   more useful
   comment */
```

## Using the application

KarlBot uses the concept of *projects*. The project is a container that consists of settings and *files*. Files can be of two types: 

- *Code file*: Contains Karel's program.
- *Town file*: Contains Karel's town.

![](/assets/shared/presentation/pages/user-guide/editor.png)

Projects can be edited on a page called *Editor*. This page is composed of several panels:

- *File Explorer*: Here you can manage files in your project and open them. You can only have open one of each type at the same time.
- *Code Editor*: Allows to edit code in the current code file. You can take advantage of syntax highlighting, code completion, automatic indentation, and error checking.
- *Town Editor*: Allows to edit town in the current town file. In addition to common editing features it has some more advanced too, like rectangular selection, pan, and zoom.
- *Settings*: At this panel, you can specify run settings.
- *Error List*: Shows syntax errors while you are typing.
- *Call Stack View*: Shown instead of the error list when the program is paused. Displays a state of the call stack.
- *Header*: Contains buttons for frequently used actions and menus that contain them all. It also shows the project name. You can click on it to change it.

To run the code you must select one of the defined programs as an *entry point* and press either the *Run* or *Run Read-only* button. The only difference is that the read-only version reverts the town back when the program ends.

When the program is running you can pause or stop it. In paused state, you can use the debugger. Another way to pause the program is to put a *breakpoint* on some of its lines (by clicking next to its number). Debugger provides multiple options for stepping:

- *Step Into*: Steps the program command by command.
- *Step Over*: Same as previous, but when a custom program is called it does not go into it and executes it as a whole.
- *Step Out*: Executes commands until it is returned from the current program.

Don't forget to save the project. The project can be saved either locally into your computer (*Export* button) or online on the application server (*Save* button). For the second option, you have to be signed in.

Also for all remaining features, you have to sign in on the *Sign in* page. At this time, the only option is via Google account.

![](/assets/shared/presentation/pages/user-guide/sign-in.png)

After you save the project on the server you can see it on the *Projects* page. Here you can also create new or delete some existing ones. If you really like some of your projects you can share it with somebody via URL. That can be done on the editor page with the *Share* button.

![](/assets/shared/presentation/pages/user-guide/projects.png)

If you think you grasped the basics you can test your knowledge and compete with others in *challenges*. A list of all challenges is available on the *Challenges* page. Each challenge has difficulty, which can help you to choose. You can also see how many people have the challenge completed and your status of completion is represented by an icon next to the challenge name.

![](/assets/shared/presentation/pages/user-guide/challenges.png)

On the page *Challenge* you can see challenge assignment and example test cases. Here you can also send one of your **previously** created projects as a solution. The application then immediately evaluates it and shows you the result.

![](/assets/shared/presentation/pages/user-guide/challenge.png)

## How challenges are created

Only administrators are allowed to create challenges, but just for curiosity, you can look at how it's done. 

Challenges are evaluated with *test cases*. Every challenge has one or typically more test cases. The test case consists of an input town and an output town. The program is run on the input town and the output is then compared with the expected output town configured in the test case. Not always is needed exact match, so in every test case is possible to specify what has to be equal. Available options are:

- Karel position
- Karel direction
- Count of signs on tiles

A few test cases can be public and serve as an example, the rest is private to ensure the generality of submitted programs. For submission to be successful, all test cases must pass.

The challenge with its test cases can be edited on the *Challenge editor* page.

![](/assets/shared/presentation/pages/user-guide/challenge-editor.png)