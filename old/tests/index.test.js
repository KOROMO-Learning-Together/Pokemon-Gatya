const fs = require("fs");
const { JSDOM } = require("jsdom");
const PokemonGacha = require('../../front/src/PokemonGacha') 


describe("ポケモンガチャのtest", () => {
  let document;
  let jsdom;
  let gacha;
  beforeEach(() => {
    //index.htmlをテキストとして読み込む
    const indexHtmlText = fs.readFileSync(__dirname + "/../index.html", {
      encoding: "utf-8",
    });
    //テキストを仮想DOMにする
    jsdom = new JSDOM(indexHtmlText).window;
    document = jsdom.document;
    // gacha = new PokemonGacha('easy')

  });
  describe("index.html", () => {
    describe("page", () => {
      it("子にmainContainerを持っている", () => {
        const page = document.getElementById('page')
        const mainContainer = document.getElementById('mainContainer')
        expect(page.childElementCount).toBe(1);
        expect(page.firstElementChild).toBe(mainContainer);
      });
    });

    //１ボタンがあるかどうか
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
        expect(initialScreen.src).toContain('start.png');
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
      it("クリックするとgacha.start関数を実行する", async () => {

        // gacha.start = jest.fn().mockReturnValue('start')

        const gachaButton = document.getElementById('gachaButton')
        gachaButton.dispatchEvent(new jsdom.MouseEvent('click'))
        

        // expect(gacha.start).toHaveBeenCalled();

      });
    });
    describe("gachaButtonImg", () => {
      let gachaButtonImg

      beforeEach(() => {
        gachaButtonImg = document.getElementById("gachaButtonImg");
      });

      it("gachaButton.pngを表示している", () => {
        expect(gachaButtonImg.src).toContain('gachaButton.png');
      });


    });
  });
  describe("main.js", () => {

    //２ボタンを押したらランダムな数字を取得するテスト
    beforeEach(() =>{
      document =jsdom.document;
    })
    describe("class PokemonGacha", () => {
      it("gachaButtonをクリックした時にMath .random()が実行されていること", () => {
        const randomSpy = jest.spyOn(global.Math, 'random')

        gacha.randomSelectPokemon()

        expect(randomSpy).toHaveBeenCalledTimes(1)
        randomSpy.mockRestore()
      });
    });
  });
});
