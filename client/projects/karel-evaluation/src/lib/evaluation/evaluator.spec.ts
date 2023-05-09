import { CodeFile, CompilationUnitParser, Project, Settings, StandardLibrary, Town, TownDirection, TownTile, Vector } from "karel";
import { Evaluator } from "./evaluator";
import { TestCase } from "./test-case";

describe("Evaluator", () => {
    it("evaluate - Returns success when all test cases pass.", async () => {
        const project = createToWallProject();
        
        const result = await Evaluator.evaluate(project, [createToWallTestCase()]);

        expect(result.successRate).toBe(1);
        expect(result.message).toBe("");
    });

    it("evaluate - Returns an error when some test cases do not pass.", async () => {
        const project = createToWallProject();
        
        const result = await Evaluator.evaluate(project, [createToWallTestCase(), createIdentityTestCase()]);

        expect(result.successRate).not.toBe(1);
        expect(result.message).not.toBe("");
    });

    it("evaluate - Calculates success rate as a ratio of passed test cases to all test cases.", async () => {
        const project = createToWallProject();
        
        const result = await Evaluator.evaluate(project, [createToWallTestCase(), createToWallTestCase(), createToWallTestCase(), createIdentityTestCase()]);

        expect(result.successRate).toBe(0.75);
    });

    it("evaluate - Returns an error when no test cases were given.", async () => {
        const project = createToWallProject();
        
        const result = await Evaluator.evaluate(project, []);

        expect(result.successRate).toBe(0);
        expect(result.message).not.toBe("");
    });

    it("evaluate - Returns an error when no valid entrypoint is selected.", async () => {
        const project = createToWallProject().withSettings(new Settings("notExistingEntryPoint", 100, 1000));
        
        const result = await Evaluator.evaluate(project, [createAllPassesTestCase()]);

        expect(result.successRate).toBe(0);
        expect(result.message).not.toBe("");
    });

    it("evaluate - Returns an error when the project contains errors.", async () => {
        const project = createErrorProject();
        
        const result = await Evaluator.evaluate(project, [createAllPassesTestCase()]);

        expect(result.successRate).toBe(0);
        expect(result.message).not.toBe("");
    });

    it("evaluate - Returns an error when an exception is thrown.", async () => {
        const project = createExceptionProject();
        
        const result = await Evaluator.evaluate(project, [createAllPassesTestCase()]);

        expect(result.successRate).toBe(0);
        expect(result.message).not.toBe("");
    });
});

function createToWallProject() {
    const codeFile = new CodeFile(CompilationUnitParser.parse("program toWall\n   while not wall\n        step\n    end\nend", "File"), []);
    return createProject([codeFile], "toWall");
}

function createErrorProject() {
    const codeFile = new CodeFile(CompilationUnitParser.parse("program errorProgram", "File"), []);
    return createProject([codeFile], "errorProgram");
}

function createExceptionProject() {
    const codeFile = new CodeFile(CompilationUnitParser.parse("program exceptionProgram while not wall step end step end", "File"), []);
    return createProject([codeFile], "exceptionProgram");
}

function createProject(codeFiles: CodeFile[], entryPoint: string) {
    return Project.create("Some name", codeFiles, StandardLibrary.getProgramReferences(), new Settings(entryPoint, 100, 1000));
}

function createToWallTestCase() {
    const inputTown = Town.create(10, 10, new Vector(0, 0), TownDirection.right, Vector.ZERO, Array(100).fill(TownTile.land), Array(100).fill(0));
    const outputTown = Town.create(10, 10, new Vector(9, 0), TownDirection.right, Vector.ZERO, Array(100).fill(TownTile.land), Array(100).fill(0));
    return new TestCase(inputTown, outputTown, true, true, false);
}

function createIdentityTestCase() {
    return new TestCase(Town.createEmpty(5, 5), Town.createEmpty(5, 5), true, true, true);
}

function createAllPassesTestCase() {
    return new TestCase(Town.createEmpty(5, 5), Town.createEmpty(5, 5), false, false, false);
}