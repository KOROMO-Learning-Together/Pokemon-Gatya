import fs from "fs";
import {PokemonGacha} from './PokemonGacha.js';
import { JSDOM } from "jsdom";
import { jest } from '@jest/globals';
import pikachu from './pikachu.json'
import pikacuSpecies from './pikachuSpecies.json'
import pikacuType from './pikachuType.json'
import pikacuAbility1 from './pikachuAbility1.json'
import pikacuAbility2 from './pikachuAbility2.json'

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

  beforeEach(async () => {
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
  // day1 ここからやっていきます。
  describe("PokemonGacha.jsについてのテスト", () => {
    describe("startメソッドを実行すると", () => {
      beforeEach(()=>{
        gacha.randomSelectPokemon = jest.fn().mockResolvedValue('hogePokemon')
        gacha.showPokemon = jest.fn()
        gacha.gachaAction = jest.fn()
        gacha.makeContinueButton = jest.fn()
        gacha.randomSelectMonsterBall = jest.fn()
      })
      // 1-❶
      it("randomSelectPokemonを呼び出す", async () => {
        // arange

        // act
        await gacha.start()

        // assert
        expect(gacha.randomSelectPokemon).toHaveBeenCalled()
      });
      // 1-❻
      // 1-❻
      it("mainContainerの要素を全て消す", async () => {
        // arange
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove = jest.fn()
        gacha.showPokemon = jest.fn()

        // act
        await gacha.start()
        await gacha.start()

        // assert
        expect(mainContainer.remove).toHaveBeenCalled()
      });
      // 3-❻
      it("randomSelectMonsterBallを呼び出す", async () => {
        // arange

        // act
        await gacha.start()

        // assert
        expect(gacha.randomSelectMonsterBall).toHaveBeenCalled()
      });
      // 1-❼ ⇨ 3-❶
      // it("showPokemonを呼び出す", async () => {
      it("gachaActionを呼び出す", async () => {
        // arange

        // act
        await gacha.start()

        // assert
        expect(gacha.gachaAction).toHaveBeenCalled()
      });
    });
    describe("randomSelectPokemonを実行すると", () => {
      beforeEach(()=>{
        // arange
        Math.random = jest.fn().mockReturnValue(1)
        Math.floor = jest.fn().mockReturnValue(1000)
        fetch = jest.fn().mockResolvedValue({json:jest.fn().mockResolvedValue('hogePokemonData')})
      })
      // 1-❷
      it("Math.randomを使って0~1の乱数を生成している", async () => {
        // arange
        // act
        await gacha.randomSelectPokemon()

        // assert
        expect(Math.random).toHaveBeenCalled()
      });
      // 1-❸
      it("Math.floorを使って0~1の乱数を1~1000の整数に変換している", async () => {
        // 1000までの整数を作るためにMath.randomで生成した乱数を1000倍にしてから整数に変換する
        // arange
        // act
        await gacha.randomSelectPokemon()

        // assert
        expect(Math.floor).toHaveBeenCalledWith(1000)
      });
      // 1-❹
      it("fetchに生成した整数をポケモンIDとして渡している", async () => {
         // arange
         // act
         await gacha.randomSelectPokemon()
 
         // assert
         expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1000/')
      });
      // 1-❺
      it("fetchのレスポンスをpokemonに保存している", async () => {
        // arange
        // act
        await gacha.randomSelectPokemon()

        // assert
        expect(gacha.pokemon).toEqual('hogePokemonData')
      });
    });
    describe("showPokemonメソッドを実行すると", () => {
      beforeEach(()=>{
        // ポケモンの画像を取得するためのメソッド
        // 今回はこれを使っていればOK
        const hogePokemonImg = document.createElement('div')
        hogePokemonImg.id = 'hogePokemonImg'
        gacha.makePokemonImg = jest.fn().mockResolvedValue(hogePokemonImg)
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove()
        const hogePokemonStatus = document.createElement('div')
        hogePokemonStatus.id = 'hogePokemonStatus'
        gacha.makePokemonStatus = jest.fn().mockResolvedValue(hogePokemonStatus)
        const hogeContinueButton = document.createElement('div')
        hogeContinueButton.id = 'hogeContinueButton'
        gacha.makeContinueButton = jest.fn().mockReturnValue(hogeContinueButton)
      })
      // 1-❽
      it("ポケモンの画像を作成する", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        expect(gacha.makePokemonImg).toHaveBeenCalled()
      });
      // 1-❾
      it("ポケモンの画像を表示する", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        const page = document.getElementById('page')
        const pokemonWindow = document.getElementById('pokemonWindow')
        const result = document.getElementById('hogePokemonImg')
        expect(page.childElementCount).toBe(1);
        expect(page.firstElementChild).toBe(pokemonWindow);
        // expect(pokemonWindow.childElementCount).toBe(2);
        // コンティニューボタンを実装したらテストを書き換える
        expect(pokemonWindow.childElementCount).toBe(3);
        expect(pokemonWindow.firstElementChild).toBe(result);
      });

      // 2-❶
      it("ポケモンのステータスを作成する", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        expect(gacha.makePokemonStatus).toHaveBeenCalled()
      });
      // 2-❷
      it("ポケモンのステータスを表示する", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        const pokemonWindow = document.getElementById('pokemonWindow')
        const result = document.getElementById('hogePokemonStatus')
        // expect(pokemonWindow.childElementCount).toBe(2);
        // コンティニューボタンを実装したらテストを書き換える
        expect(pokemonWindow.childElementCount).toBe(3);
        expect(pokemonWindow.children[1]).toBe(result);
      });
      // 3-❷
      it("makeContinueButtonを呼び出す", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        expect(gacha.makeContinueButton).toHaveBeenCalled()
        
      });
      // 3-❸
      it("コンティニューボタンを表示する", async () => {
        // arange

        // act
        await gacha.showPokemon()

        // assert
        const pokemonWindow = document.getElementById('pokemonWindow')
        const result = document.getElementById('hogeContinueButton')
        expect(pokemonWindow.childElementCount).toBe(3);
        expect(pokemonWindow.lastElementChild).toBe(result);
      });
    });
    describe("makePokemonStatusメソッドを実行すると", () => {
      beforeEach(async ()=>{
        // ピカチュウのデータをpokemonに格納しておく
        gacha.pokemon = pikachu
        gacha.species = pikacuSpecies
        fetch = jest.fn()
          .mockResolvedValueOnce({json:jest.fn().mockResolvedValue(pikacuType)})
          .mockResolvedValueOnce({json:jest.fn().mockResolvedValue(pikacuAbility1)})
          .mockResolvedValueOnce({json:jest.fn().mockResolvedValue(pikacuAbility2)})
      })
      // 2-❸
      it("ポケモンのステータスを表示する場所を作成する(空のdiv)", async () => {
        // arange

        // act
        const statusWindow = await gacha.makePokemonStatus()

        // assert
        expect(statusWindow.id).toBe('statusWindow')
      });
      // 2-❹
      it("ポケモンの身長を表示する", async () => {
        // arange

        // act
        const statusWindow = await gacha.makePokemonStatus()

        const height = statusWindow.children[0].children[0].children[2]

        // assert
        expect(height.id).toBe('height')
        expect(height.innerHTML).toBe('身長：40 cm')
      });
      // 2-❺
      it("ポケモンの体重を表示する", async () => {
        // arange

        // act
        const statusWindow = await gacha.makePokemonStatus()
        const weight = statusWindow.children[0].children[0].children[3]

        // assert
        expect(weight.id).toBe('weight')
        expect(weight.innerHTML).toBe('体重：6 kg')
      });
    });
    describe("makeContinueButtonメソッドを実行すると", () => {
      // 3-❹
      it("コンティニューボタンが作成される", async () => {
        // arange

        // act
        const continueButton = await gacha.makeContinueButton()

        // assert
        expect(continueButton.childElementCount).toBe(1)
        expect(continueButton.firstElementChild.id).toBe('continueButton')
      });
      // 3-❺
      it("コンティニューボタンを押すとcontinueメソッドが実行される", async () => {
        // arange

        // act
        const continueButton = await gacha.makeContinueButton()

        // assert

      });
    });
    describe("randomSelectMonsterBallメソッドを実行すると", () => {
      // 3-❼
      it("this.monsterBallに選択されたモンスターボールが保存されている", async () => {
        // arange
        Math.random = jest.fn().mockReturnValue(1)
        Math.floor = jest.fn().mockReturnValue(100)

        // act
        const monsterBall = gacha.randomSelectMonsterBall()
 
        // assert
        expect(gacha.monsterBall).toBe('masterBall')
      });
    });
  });
});
