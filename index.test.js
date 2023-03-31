const fs = require("fs");
const { JSDOM } = require("jsdom");

describe("ポケモンガチャのtest", () => {
  describe("index.html", () => {
    let document;
    let jsdom;
    beforeEach(() => {
      //index.htmlをテキストとして読み込む
      const indexHtmlText = fs.readFileSync("./index.html", {
        encoding: "utf-8",
      });
      //テキストを仮想DOMにする
      jsdom = new JSDOM(indexHtmlText).window;
      document = jsdom.document;
    });
    describe("page", () => {
      it("子にmainContainerを持っている", () => {
        const page = document.getElementById('page')
        const mainContainer = document.getElementById('mainContainer')

        expect(page.childElementCount).toBe(1);
        expect(page.firstElementChild).toBe(mainContainer);
      });
    });
    describe("mainContainer", () => {
      it("子にinitialScreenとgachaButtonを持っている", () => {
        const mainContainer = document.getElementById('mainContainer')
        const initialScreen = document.getElementById('initialScreen')
        const gachaButton = document.getElementById('gachaButton')

        expect(mainContainer.childElementCount).toBe(2);
        expect(mainContainer.firstElementChild).toBe(initialScreen);
        expect(mainContainer.lastElementChild).toBe(gachaButton);
      });
    });
    describe("initialScreen", () => {
      it("start.pngを参照して表示している", () => {
        const initialScreen = document.getElementById('initialScreen')

        expect(initialScreen.tagName).toBe('IMG');
        expect(initialScreen.src).toBe('start.png');
      });
    });
    describe("gachaButton", () => {
      it("子にgachaButtonImgを持つ", () => {
        const gachaButton = document.getElementById('gachaButton')
        const gachaButtonImg = document.getElementById('gachaButtonImg')

        expect(gachaButton.childElementCount).toBe(1);
        expect(gachaButton.firstElementChild).toBe(gachaButtonImg);
        expect(gachaButton.tagName).toBe('BUTTON');
        expect(gachaButton.type).toBe('button');
      });
      // it("クリックするとmain関数を実行する", async () => {
      //   const gachaButton = document.getElementById('gachaButton')

      // });
    });
    describe("gachaButtonImg", () => {
      let gachaButtonImg

      beforeEach(() => {
        gachaButtonImg = document.getElementById("gachaButtonImg");
      });

      it("gachaButton.pngを表示している", () => {
        expect(gachaButtonImg.src).toEqual('gachaButton.png');
      });

      it("MouseHoverで画像が切り替わる", async () => {
        const mouseover = new jsdom.MouseEvent('mouseover')
        await gachaButtonImg.dispatchEvent(mouseover)
        expect(gachaButtonImg.src).toBe('gachaButtonHover.png');

        const mouseout = new jsdom.MouseEvent('mouseout')
        gachaButtonImg.dispatchEvent(mouseout);
        expect(gachaButtonImg.src).toBe('gachaButton.png');
      });
    });
  });
  // describe("main.js", () => {
  //   beforeEach(() => {
      
  //   });
  //   describe("main()", () => {
  //     it("", () => {
        
  //     });
  //   });
  //   describe("class PokemonGacha", () => {
  //     it("", () => {
        
  //     });
  //   });
  // });
});
