import fs from "fs";``
import {PokemonGacha} from './PokemonGacha.js';
import { JSDOM } from "jsdom";
import { jest } from '@jest/globals';

describe("ポケモンガチャ全体のテスト", () => {
  let jsdom;
  let gacha;
  let originalMath;
  let originalFetch;

  beforeAll(() => {
    // モック化したMathオブジェクトを元に戻すときに使う
    originalMath = Object.create(global.Math);
    originalFetch = Object.create(global.fetch);
  });

  beforeEach(() => {
    //index.htmlをテキストとして読み込む
    const indexHtmlText = fs.readFileSync("./public/index.html", {
      encoding: "utf-8",
    });
    //globalのMathオブジェクトをモック化する準備
    const mockMath = Object.create(global.Math);
    global.Math = mockMath;
    //globalのfetchをモック化する準備
    const mockFetch = Object.create(global.fetch);
    global.fetch = mockFetch;
    //テキストを仮想DOMにする
    jsdom = new JSDOM(indexHtmlText).window;
    //globalのwindowオブジェクトとdocumentオブジェクトを仮想DOMに入れ替える
    global.window = jsdom
    global.document = jsdom.document;
    //main.jsの処理をセットアップ
    gacha = new PokemonGacha('easy')

    const button = document.getElementById('gachaButton');
    button.addEventListener('click',()=>{gacha.start()})

    const buttonImg = document.getElementById('gachaButtonImg');
    buttonImg.addEventListener('mouseover',()=>{gacha.mouseover()})
    buttonImg.addEventListener('mouseout',()=>{gacha.mouseout()})
  });

  afterEach(()=>{
    global.window = undefined;
    global.document = undefined;
    jsdom.document.close()
    global.Math = originalMath;
    global.fetch = originalFetch;
  })

  describe("index.htmlについてのテスト", () => {
    describe("page要素は", () => {
      it("子にmainContainerを持っている", () => {
        const page = document.getElementById('page')
        const mainContainer = document.getElementById('mainContainer')
        expect(page.childElementCount).toBe(1);
        expect(page.firstElementChild).toBe(mainContainer);
      });
    });
    describe("mainContainer要素は", () => {
      it("子にinitialScreenとgachaButtonを持っている", () => {
        const mainContainer = document.getElementById('mainContainer')
        const initialScreen = document.getElementById('initialScreen')
        const gachaButton = document.getElementById('gachaButton')
        expect(mainContainer.childElementCount).toBe(2);
        expect(mainContainer.firstElementChild).toBe(initialScreen);
        expect(mainContainer.lastElementChild).toBe(gachaButton);
      });
    });
    describe("initialScreen要素は", () => {
      it("start.pngを参照して表示している", () => {
        const initialScreen = document.getElementById('initialScreen')
        expect(initialScreen.tagName).toBe('IMG');
        expect(initialScreen.src).toBe('start.png');
      });
    });

    // ここからDay１
    // まずはボタンから作り始める
    describe("gachaButton要素は", () => {
      it("子にgachaButtonImgを持つ", () => {
        const gachaButton = document.getElementById('gachaButton')
        const gachaButtonImg = document.getElementById('gachaButtonImg')
        expect(gachaButton.childElementCount).toBe(1);
        expect(gachaButton.firstElementChild).toBe(gachaButtonImg);
        expect(gachaButton.tagName).toBe('BUTTON');
        expect(gachaButton.type).toBe('button');
      });
      it("クリックするとgacha.startを呼び出す", async () => {
        // arange
        gacha.start = jest.fn()
        const gachaButton = document.getElementById('gachaButton')

        // act
        gachaButton.dispatchEvent(new jsdom.MouseEvent('click'))

        // assert
        expect(gacha.start).toHaveBeenCalled();
      });
    });
    describe("gachaButtonImg要素は", () => {
      let gachaButtonImg

      beforeEach(() => {
        gachaButtonImg = document.getElementById("gachaButtonImg");
      });

      it("gachaButton.pngを表示している", () => {
        expect(gachaButtonImg.src).toEqual('gachaButton.png');
      });

      it("MouseHoverで画像が切り替わる", () => {
        const mouseover = new jsdom.MouseEvent('mouseover')
        gachaButtonImg.dispatchEvent(mouseover)
        expect(gachaButtonImg.src).toBe('gachaButtonHover.png');

        const mouseout = new jsdom.MouseEvent('mouseout')
        gachaButtonImg.dispatchEvent(mouseout);
        expect(gachaButtonImg.src).toBe('gachaButton.png');
      });
    });
  });

  describe("PokemonGacha.jsについてのテスト", () => {
    describe("startメソッドを実行すると", () => {
      it("randomSelectPokemonを呼び出す", async () => {
        // arange
        gacha.randomSelectPokemon = jest.fn()

        // act
        gacha.start()

        // assert
        expect(gacha.randomSelectPokemon).toHaveBeenCalled()
      });
      it("mainContainerの要素を全て消す", async () => {
        // arange
        gacha.randomSelectPokemon = jest.fn()
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove = jest.fn()

        // act
        gacha.start()

        // assert
        expect(mainContainer.remove).toHaveBeenCalled()
      });
      it("showPokemonを呼び出す", async () => {
        // arange
        gacha.randomSelectPokemon = jest.fn().mockResolvedValue('hogePokemon')
        gacha.showPokemon = jest.fn()

        // act
        gacha.start()

        // assert
        expect(gacha.showPokemon).toHaveBeenCalled()
      });
    });
    describe("randomSelectPokemonを実行すると", () => {
      it("Math.randomを使って0~1の乱数を生成している", async () => {
        // arange
        Math.random = jest.fn()
        Math.floor = jest.fn()
        fetch = jest.fn().mockResolvedValue({json:jest.fn().mockResolvedValue('hogePokemonData')})
        
        // act
        gacha.randomSelectPokemon()

        // assert
        expect(Math.random).toHaveBeenCalled()
      });
      it("Math.floorを使って0~1の乱数を1~1000の整数に変換している", async () => {
        // arange
        Math.random = jest.fn().mockReturnValue(0.001)
        Math.floor = jest.fn()
        fetch = jest.fn().mockResolvedValue({json:jest.fn().mockResolvedValue('hogePokemonData')})
        
        // act
        await gacha.randomSelectPokemon()

        // assert
        expect(Math.floor).toHaveBeenCalledWith(1)
      });

      it("fetchに生成した整数をポケモンIDとして渡している", async () => {
         // arange
         Math.random = jest.fn()
         Math.floor = jest.fn().mockReturnValue(1000)
         fetch = jest.fn().mockResolvedValue({json:jest.fn().mockResolvedValue('hogePokemonData')})
 
         // act
         await gacha.randomSelectPokemon()
 
         // assert
         expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1000/')
      });
      it("fetchのレスポンスをpokemonに保存している", async () => {
        // arange
        Math.random = jest.fn()
        Math.floor = jest.fn()
        fetch = jest.fn().mockResolvedValue({json:jest.fn().mockResolvedValue('hogePokemonData')})

        // act
        await gacha.randomSelectPokemon()

        // assert
        expect(gacha.pokemon).toEqual('hogePokemonData')
      });
    });
    describe("showPokemonメソッドを実行すると", () => {
      it("ポケモンの画像を取得する", async () => {
        // arange
        // ポケモンの画像を取得するためのメソッド
        // 今回はこれを使っていればOK
        gacha.makePokemonImg = jest.fn().mockResolvedValue(document.createElement('div'))
        gacha.makePokemonStatus = jest.fn().mockResolvedValue(document.createElement('div'))

        // act
        gacha.showPokemon()

        // assert
        expect(gacha.makePokemonImg).toHaveBeenCalled()
      });
    });
  });
  // ここからDay2
  // まずはボタンから作り始める

});
