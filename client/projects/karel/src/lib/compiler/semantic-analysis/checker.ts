import { Compilation } from "./../compilation";
import { DataType } from "./../data-type";
import { Error } from "./../errors/error";
import { LineTextRange } from "../../text/line-text-range";
import { CallNode } from "./../syntax-tree/nodes/call-node";
import { CompilationUnitNode } from "./../syntax-tree/nodes/compilation-unit-node";
import { IfNode } from "./../syntax-tree/nodes/if-node";
import { Node } from "./../syntax-tree/nodes/node";
import { ProgramNode } from "./../syntax-tree/nodes/program-node";
import { WhileNode } from "./../syntax-tree/nodes/while-node";
import { AmbiguousSymbol } from "./../symbols/ambiguous-symbol";
import { ExternalProgramSymbol } from "./../symbols/external-program-symbol";
import { ProgramSymbol } from "./../symbols/program-symbol";
import { SyntaxElement } from "./../syntax-tree/syntax-element";

/**
 * Finds errors in a compilation.
 */
export class Checker {
    /**
     * Checks the given compilation for errors and returns them.
     * @param compilation Compilation to check.
     */
    static check(compilation: Compilation): Error[] {
        const errors: Error[] = [];

        for (const compilationUnit of compilation.compilationUnits)
            this.checkNode(compilationUnit, errors, compilationUnit, compilation);

        return errors;
    }

    private static checkNode(node: Node, errors: Error[], compilationUnit: CompilationUnitNode, compilation: Compilation) {
        this.addSyntaxErrors(node, errors, compilationUnit);

        if (node instanceof CallNode)
            this.checkCall(node, errors, compilationUnit, compilation);
        if (node instanceof IfNode)
            this.checkIf(node, errors, compilationUnit, compilation);
        if (node instanceof WhileNode)
            this.checkWhile(node, errors, compilationUnit, compilation);
        if (node instanceof ProgramNode)
            this.checkProgram(node, errors, compilationUnit, compilation);

        for (const child of node.children) {
            if (child instanceof Node)
                this.checkNode(child, errors, compilationUnit, compilation);
            else
                this.addSyntaxErrors(child, errors, compilationUnit);
        }
    }

    private static addSyntaxErrors(element: SyntaxElement, errors: Error[], compilationUnit: CompilationUnitNode) {
        for (const syntaxError of element.primitive.syntaxErrors) {
            errors.push(new Error(syntaxError.message, compilationUnit, new LineTextRange(
                element.startLine + syntaxError.textRange.startLine - 1,
                syntaxError.textRange.startLine > 1 ? syntaxError.textRange.startColumn : element.startColumn + syntaxError.textRange.startColumn - 1,
                element.startLine + syntaxError.textRange.endLine - 1,
                syntaxError.textRange.endLine > 1 ? syntaxError.textRange.endColumn : element.startColumn + syntaxError.textRange.endColumn - 1
            )));
        }
    }

    private static checkIf(ifNode: IfNode, errors: Error[], compilationUnit: CompilationUnitNode, compilation: Compilation) {
        if (ifNode.condition === null)
            return;

        const conditionSymbol = compilation.symbolTable.getByNode(ifNode.condition);

        if (conditionSymbol instanceof ProgramSymbol) {
            errors.push(new Error("Invalid condition symbol type", compilationUnit, ifNode.condition.getLineTextRangeWithoutTrivia()));
        }
        if (conditionSymbol instanceof ExternalProgramSymbol && conditionSymbol.externalProgram.returnType !== DataType.number) {
            errors.push(new Error("Invalid condition data type", compilationUnit, ifNode.condition.getLineTextRangeWithoutTrivia()));
        }
    }

    private static checkWhile(whileNode: WhileNode, errors: Error[], compilationUnit: CompilationUnitNode, compilation: Compilation) {
        if (whileNode.condition === null)
            return;

        const conditionSymbol = compilation.symbolTable.getByNode(whileNode.condition);

        if (conditionSymbol instanceof ProgramSymbol) {
            errors.push(new Error("Invalid condition symbol type", compilationUnit, whileNode.condition.getLineTextRangeWithoutTrivia()));
        }
        if (conditionSymbol instanceof ExternalProgramSymbol && conditionSymbol.externalProgram.returnType !== DataType.number) {
            errors.push(new Error("Invalid condition data type", compilationUnit, whileNode.condition.getLineTextRangeWithoutTrivia()));
        }
    }

    private static checkCall(callNode: CallNode, errors: Error[], compilationUnit: CompilationUnitNode, compilation: Compilation) {
        const symbol = compilation.symbolTable.getByNode(callNode);

        if (symbol === null) {
            errors.push(new Error("Unresolved symbol", compilationUnit, callNode.getLineTextRangeWithoutTrivia()));
        }
        if (symbol instanceof AmbiguousSymbol) {
            errors.push(new Error("Ambiguous symbol", compilationUnit, callNode.getLineTextRangeWithoutTrivia()));
        }
    }

    private static checkProgram(programNode: ProgramNode, errors: Error[], compilationUnit: CompilationUnitNode, compilation: Compilation) {
        if (programNode.nameToken === null)
            return;

        const symbol = compilation.symbolTable.getByName(programNode.nameToken.text);

        if (symbol instanceof AmbiguousSymbol)
            errors.push(new Error("Program declared twice", compilationUnit, programNode.nameToken.getLineTextRangeWithoutTrivia()));
    }
}