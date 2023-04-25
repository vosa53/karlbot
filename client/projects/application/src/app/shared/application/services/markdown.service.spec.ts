import { MarkdownService } from "./markdown-service";

describe("MarkdownService", () => {
    beforeEach(() => {
        jasmine.addCustomEqualityTester(equalsIgnoreWhitespaceEqualityTester);
    });

    it("render - Renders unformatted text in paragraph.", () => {
        const service = new MarkdownService();
        const html = service.render("Some unformatted text");

        expect(html).toEqual("<p>Some unformatted text</p>");
    });

    it("render - Can render bold text.", () => {
        const service = new MarkdownService();
        const html = service.render("Some **bold text**");

        expect(html).toEqual("<p>Some <strong>bold text</strong></p>");
    });

    it("render - Can render italics text.", () => {
        const service = new MarkdownService();
        const html = service.render("Some *italics text*");

        expect(html).toEqual("<p>Some <em>italics text</em></p>");
    });

    it("render - Can render heading.", () => {
        const service = new MarkdownService();
        const html = service.render("# Some heading");

        expect(html).toEqual("<h1>Some heading</h1>");
    });

    it("render - Can render unordered list.", () => {
        const service = new MarkdownService();
        const html = service.render("- item 1\n - item 2\n - item 3");

        expect(html).toEqual("<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>");
    });
});

function equalsIgnoreWhitespaceEqualityTester(a: any, b: any) {
    if (typeof a === "string" && typeof b === "string")
        return a.replaceAll(/\s/g, "") === b.replaceAll(/\s/g, "");
    else
        return undefined;
}