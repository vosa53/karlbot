KarlBot is a development environment for educational programming language [Karel](/assets/shared/presentation/pages/user-guide/town.png). It has following features:

- Syntax highlighting (not in this guide yet 🙁)
- Code completion
- Automatic indentation
- Error checking
- Advanced town editor
- Saving and sharing projects on server
- Debugger
- Automatically evaluated challenges
- Mobile phones support

## Karel's world

Karel lives in a town. His town is a rectangular tile map with walls and land. Walls are also around the town.

![](/assets/shared/presentation/pages/user-guide/town.png)

## Karel Language Reference

### Commands for interaction

Karel is a simple robot. He has only two commands for movement.

- `step`: Moves Karel one tile forward.
- `turnLeft`: Turns Karel 90 degrees left.

He can also mark the tile where he stands with a sign. A maximum of 8 signs can fit on a tile.

- `put`: Puts one sign on the tile where Karel stands.
- `pick`: Picks one sign from tile where Karel stands.

### Programs

Yes, karel commands are simple, however you can create your own, more complex. Also every Karel's command has to be in some program.

```
program myProgram
    step
    step
    turnLeft
end
```

### If statements

If statements allows Karel to execute different commands based on some condition. Basic if statement can look like this:

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

Sometimes it's useful to execute something in both cases, positive and negative one. You can write two opposite conditions, but Karel provides an easier way:

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

As conditions you can use various commands.

Firstly, Karel is able to recognize world direction he is facing:

- `norht`: Checks if he faces north. 
- `east`: Checks if he faces east.
- `west`: Checks if he faces west.
- `south`: Checks if he faces south.

He can also make decisions based on his surroundings.

- `sign`: Checks if on the tile before Karel is a sign.
- `wall`: Checks if before Karel is wall.
- `home`: Checks if Karel is home.

### Loops

Copying commands every time you need to execute them more times would not be much fun. That is the reason Karel has `repeat` loop:

```
repeat 8 times
    put
end
```

Repeat loop looks good, but what if you doesn't know beforehand how many times you want to execute it? `while` loop comes as a solution:

```
while not wall
    step
end
```

### Exceptions

Karel is not much careful and can easily damage himself. He does everything you tell him, and so for example when you instruct him to go to wall he does it. In that time Karel program stops and *exception* is thrown. Another exceptions occurs when Karel tries to pick sign from a tile where is not any and when Karel tries to put on a tile more signs than 8.

### Recursion

Karel does not have variables like common programming languages. Hovewer this does not prevent from implementing sligthly more advanced algorithms. Tool that used in many cases instead is *recursion*. Recursion is ability of program to call itself. On first thought it can look useless but if you combine it with conditions some advanced algorithms can be created. Most basic example of recursion can look like this:

```
program toWall
    if not wall
        step
        toWall
    end
end
```

This is a recursive version of *iterative* program shown on the previous code example.