import { BlockPrimitiveNode } from "../syntax-tree/nodes/block-node";
import { CallPrimitiveNode } from "../syntax-tree/nodes/call-node";
import { CompilationUnitPrimitiveNode } from "../syntax-tree/nodes/compilation-unit-node";
import { IfPrimitiveNode } from "../syntax-tree/nodes/if-node";
import { ProgramPrimitiveNode } from "../syntax-tree/nodes/program-node";
import { RepeatPrimitiveNode } from "../syntax-tree/nodes/repeat-node";
import { WhilePrimitiveNode } from "../syntax-tree/nodes/while-node";
import { ElsePrimitiveToken } from "../syntax-tree/tokens/else-token";
import { EndOfFilePrimitiveToken } from "../syntax-tree/tokens/end-of-file-token";
import { EndPrimitiveToken } from "../syntax-tree/tokens/end-token";
import { IdentifierPrimitiveToken } from "../syntax-tree/tokens/identifier-token";
import { IfPrimitiveToken } from "../syntax-tree/tokens/if-token";
import { IsPrimitiveToken } from "../syntax-tree/tokens/is-token";
import { NotPrimitiveToken } from "../syntax-tree/tokens/not-token";
import { NumberPrimitiveToken } from "../syntax-tree/tokens/number-token";
import { ProgramPrimitiveToken } from "../syntax-tree/tokens/program-token";
import { RepeatPrimitiveToken } from "../syntax-tree/tokens/repeat-token";
import { TimesPrimitiveToken } from "../syntax-tree/tokens/times-token";
import { WhilePrimitiveToken } from "../syntax-tree/tokens/while-token";
import { ParserContext } from "./parser-context";

/**
 * Parser of the Karel language. Turns a token stream into a syntax tree.
 */
export class Parser {
    /**
     * Parses tokens from the passed context.
     * @param context Parser context.
     * @returns Created syntax tree.
     */
    static parseCompilationUnit(context: ParserContext, filePath: string): CompilationUnitPrimitiveNode {
        const programs: ProgramPrimitiveNode[] = [];
        let endOfFileToken: EndOfFilePrimitiveToken | null = null;
    
        while (!(context.current instanceof EndOfFilePrimitiveToken)) {
            if (context.current instanceof ProgramPrimitiveToken) {
                const program = this.parseProgram(context);
                programs.push(program);
            }
            else
                context.skip();
        }

        endOfFileToken = context.current;
    
        return new CompilationUnitPrimitiveNode(programs, endOfFileToken, filePath);
    }
    
    private static parseProgram(context: ParserContext): ProgramPrimitiveNode {
        let programToken = null;
        let nameToken = null;
        let body = null;
    
        programToken = context.current;
        context.goNext();
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof IdentifierPrimitiveToken) {
            nameToken = context.current;
            context.goNext();
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken))
            body = this.parseBlock(context);
    
        return new ProgramPrimitiveNode(programToken, nameToken, body);
    }
    
    private static parseBlock(context: ParserContext): BlockPrimitiveNode {
        const statements = [];
        let endToken = null;
    
        while (!(context.current instanceof EndOfFilePrimitiveToken) && !(context.current instanceof EndPrimitiveToken)) {
            let statement = null;
    
            if (context.current instanceof IfPrimitiveToken)
                statement = this.parseIf(context);
            else if (context.current instanceof WhilePrimitiveToken)
                statement = this.parseWhile(context);
            else if (context.current instanceof RepeatPrimitiveToken)
                statement = this.parseRepeat(context);
            else if (context.current instanceof IdentifierPrimitiveToken)
                statement = this.parseCall(context);
            else
                context.skip();
    
            if (statement !== null)
                statements.push(statement);
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof EndPrimitiveToken) {
            endToken = context.current;
            context.goNext();
        }
    
        return new BlockPrimitiveNode(statements, endToken);
    }
    
    private static parseIf(context: ParserContext): IfPrimitiveNode {
        let ifToken = null;
        let operationToken = null;
        let condition = null;
        let body = null;
        let elseToken = null;
        let elseBody = null;
    
        ifToken = context.current;
        context.goNext();
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && (context.current instanceof IsPrimitiveToken || context.current instanceof NotPrimitiveToken)) {
            operationToken = context.current;
            context.goNext();
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof IdentifierPrimitiveToken)
            condition = this.parseCall(context);
    
        if (!(context.current instanceof EndOfFilePrimitiveToken))
            body = this.parseBlock(context);
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof ElsePrimitiveToken) {
            elseToken = context.current;
            context.goNext();
    
            if (!(context.current instanceof EndOfFilePrimitiveToken))
                elseBody = this.parseBlock(context);
        }
    
        return new IfPrimitiveNode(ifToken, operationToken, condition, body, elseToken, elseBody);
    }
    
    private static parseWhile(context: ParserContext): WhilePrimitiveNode {
        let whileToken = null;
        let operationToken = null;
        let condition = null;
        let body = null;
    
        whileToken = context.current;
        context.goNext();
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && (context.current instanceof IsPrimitiveToken || context.current instanceof NotPrimitiveToken)) {
            operationToken = context.current;
            context.goNext();
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof IdentifierPrimitiveToken)
            condition = this.parseCall(context);
    
        if (!(context.current instanceof EndOfFilePrimitiveToken))
            body = this.parseBlock(context);
    
        return new WhilePrimitiveNode(whileToken, operationToken, condition, body);
    }
    
    private static parseRepeat(context: ParserContext): RepeatPrimitiveNode {
        let repeatToken = null;
        let countToken = null;
        let timesToken = null;
        let body = null;
    
        repeatToken = context.current;
        context.goNext();
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof NumberPrimitiveToken) {
            countToken = context.current;
            context.goNext();
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken) && context.current instanceof TimesPrimitiveToken) {
            timesToken = context.current;
            context.goNext();
        }
    
        if (!(context.current instanceof EndOfFilePrimitiveToken)) {
            body = this.parseBlock(context);
        }
    
        return new RepeatPrimitiveNode(repeatToken, countToken, timesToken, body);
    }
    
    private static parseCall(context: ParserContext): CallPrimitiveNode {
        let nameToken = null;
    
        nameToken = context.current;
        context.goNext();
    
        return new CallPrimitiveNode(nameToken);
    }
}