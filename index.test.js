const fs = require("fs");
const { JSDOM } = require("jsdom");

describe("test", () => {
  let document;
  beforeEach(() => {
    //index.htmlをテキストとして読み込む
    const indexHtmlText = fs.readFileSync("./index.html", {
      encoding: "utf-8",
    });
    //テキストを仮想DOMにする
    const jsdom = new JSDOM(indexHtmlText).window;
    document = jsdom.document;
  });

  it("rootというidを持った要素があること", () => {
    const rootElement = document.getElementById("root");

    expect(rootElement.innerHTML).toBe("test!!!!");
  });

  it("root要素のテキストをmasashiに変えていること", () => {
    const rootElement = document.getElementById("root");

    rootElement.innerHTML = "masashi";

    expect(rootElement.innerHTML).toBe("masashi");
  });
});
