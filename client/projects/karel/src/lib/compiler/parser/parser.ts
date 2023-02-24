import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { CallPrimitiveNode } from "../primitive-nodes/call-primitive-node";
import { CompilationUnitPrimitiveNode } from "../primitive-nodes/compilation-unit-primitive-node";
import { IfPrimitiveNode } from "../primitive-nodes/if-primitive-node";
import { ProgramPrimitiveNode } from "../primitive-nodes/program-primitive-node";
import { RepeatPrimitiveNode } from "../primitive-nodes/repeat-primitive-node";
import { WhilePrimitiveNode } from "../primitive-nodes/while-primitive-node";
import { ElsePrimitiveToken } from "../primitive-tokens/else-primitive-token";
import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { EndPrimitiveToken } from "../primitive-tokens/end-primitive-token";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { IfPrimitiveToken } from "../primitive-tokens/if-primitive-token";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { NumberPrimitiveToken } from "../primitive-tokens/number-primitive-token";
import { ProgramPrimitiveToken } from "../primitive-tokens/program-primitive-token";
import { RepeatPrimitiveToken } from "../primitive-tokens/repeat-primitive-token";
import { TimesPrimitiveToken } from "../primitive-tokens/times-primitive-token";
import { WhilePrimitiveToken } from "../primitive-tokens/while-primitive-token";
import { ParserContext } from "./parser-context";

export class Parser {
    static parseCompilationUnit(context: ParserContext, filePath: string): CompilationUnitPrimitiveNode {
        let programs: ProgramPrimitiveNode[] = [];
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
        let statements = [];
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