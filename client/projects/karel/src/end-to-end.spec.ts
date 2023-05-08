import { TestUtils } from "./lib/utils/test-utils";
import { Checker, Compilation, CompilationUnitParser, Emitter, Interpreter, InterpretStopToken, MutableTown, StandardLibrary, TownDirection, TownTile, Vector, NormalInterpretResult } from "./public-api";

describe("End to end tests", () => {
    it("One step", async () => {
        await testProgram("oneStep", `
            program oneStep
                step
            end
            `,
            `
            R..
            ...
            ...
            `,
            `
            .R.
            ...
            ...
        `);
    });

    it("To wall", async () => {
        await testProgram("toWall", `
            program toWall
                while not wall
                    step
                end
            end
            `,
            `
            ...D.
            .....
            .x...
            x..x.
            `,
            `
            .....
            .....
            .x.D.
            x..x.
        `);
    });

    it("To corner", async () => {
        await testProgram("corner", `
            program corner
                while not west
                    turnLeft
                end
                toWall
                turnLeft
                toWall
                turnLeft
            end
            
            program toWall
                while not wall
                    step
                end
            end
            `,
            `
            ......
            ....D.
            ......
            ......
            `,
            `
            ......
            ......
            ......
            R.....
        `);
    });

    it("To home", async () => {
        await testProgram("goHome", `
            program goHome
                while not home step end
                step
            end
            `,
            `
            .R...H...
            `,
            `
            .....HR..
        `);
    });

    it("Border", async () => {
        await testProgram("border", `
            program border
                repeat 4 times
                    fillRow
                    turnLeft
                end
                step
                turnLeft
                step
            end

            program fillRow
                while not wall
                    fillTile
                    step
                end
            end

            program fillTile
                repeat 8 times
                    put
                end
            end
            `,
            `
            ....
            ....
            ....
            R...
            `,
            `
            8888
            8..8
            8U.8
            8888
        `);
    });

    it("DFS", async () => {
        await testProgram("startDFS", `
            program startDFS
                DFS

                // Pick sign under Karel, because count of signs under Karel can not be specified in assertions.
                pick
            end

            program DFS
                put
                repeat 4 times
                    if not wall
                        step
                        if not sign
                            DFS
                        end
                        turnBack
                        step
                        turnBack
                    end
                    turnLeft
                end
            end

            program turnRight
                repeat 3 times
                    turnLeft
                end
            end

            program turnBack
                repeat 2 times
                    turnLeft
                end
            end
            `,
            `
            ...x..x
            .Rx....
            .x....x
            ......x
            ...x.x.
            `,
            `
            111x11x
            1Rx1111
            1x1111x
            111111x
            111x1x.
        `);
    });
});

async function testProgram(entryPointName: string, code: string, inputTownText: string, outputTownText: string) {
    const inputTown = createTown(TestUtils.dedent(inputTownText));
    const outputTown = createTown(TestUtils.dedent(outputTownText));

    const externalProgramReferences = StandardLibrary.getProgramReferences();

    const compilationUnit = CompilationUnitParser.parse(TestUtils.dedent(code), "File");
    const compilation = new Compilation([compilationUnit], externalProgramReferences);

    const errors = Checker.check(compilation);
    expect(errors).toHaveSize(0);

    const assembly = Emitter.emit(compilation);
    const entryPoint = assembly.programs.find(p => p.name === entryPointName);
    expect(entryPoint).not.toBeUndefined();

    const externalPrograms = StandardLibrary.getPrograms(inputTown, () => 0);
    const interpreter = new Interpreter(assembly, entryPoint!, externalPrograms);

    const result = await interpreter.interpretAll(new InterpretStopToken());

    expect(result).toBeInstanceOf(NormalInterpretResult);
    expect(inputTown).toEqual(outputTown);
}

function createTown(text: string): MutableTown {
    const lines = text.split("\n");
    const town = MutableTown.createEmpty(lines[0].length, lines.length);
    for (let y = 0; y < town.height; y++) {
        for (let x = 0; x < town.width; x++) {
            const character = lines[y][x];
            if (character === "x") town.setTileAt(x, y, TownTile.wall);
            if (character === "U" || character === "R" || character === "D" || character === "L") town.karelPosition = new Vector(x, y);
            if (character === "U") town.karelDirection = TownDirection.up;
            if (character === "R") town.karelDirection = TownDirection.right;
            if (character === "D") town.karelDirection = TownDirection.down;
            if (character === "L") town.karelDirection = TownDirection.left;
            if (character === "H") town.homePosition = new Vector(x, y);
            if (character >= "0" && character <= "9") town.setSignCountAt(x, y, parseInt(character, 10));
        }
    }
    return town;
}
