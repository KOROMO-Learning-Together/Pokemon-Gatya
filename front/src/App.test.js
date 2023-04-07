/* eslint-disable testing-library/no-node-access */

import { render, screen } from '@testing-library/react';
import App from './App';
import { PokemonGacha } from './PokemonGacha';
import { SpyPokemonGacha } from './SpyPokemonGacha';

import userEvent from '@testing-library/user-event'


//１ボタンがあるかどうか
    describe("Appのテスト", () => {
      let spyPokemonGacha
      beforeEach(() => {
        spyPokemonGacha = new SpyPokemonGacha('hoge')
        render(<App PokemonGacha={spyPokemonGacha}/>);
      })
      it("子にgachaButtonを持っている", () => {
        const mainContainer = document.querySelector('#mainContainer')
        const gachaButton = document.getElementById('gachaButton')

        expect(mainContainer.querySelector('#gachaButton')).toBe(gachaButton);
      });
      it("ボタンを押したらPokemnonGacha.start()が呼ばれていること", ()=>{
        const gachaButton = document.getElementById('gachaButton')

        userEvent.click(gachaButton); // ボタンをクリック

        expect(spyPokemonGacha.start_isCalled).toBe(true); // Math.randomが呼び出されたか確認
      })
    });

    describe("PokemonGachaテスト", ()=>{
      let pokemonGacha
      let originalMathRandom
      let originalMathFloor
      let originalFetch

      beforeEach(()=>{
        pokemonGacha = new PokemonGacha('easy')

        originalMathRandom = Math.random; // テスト前にMath.randomを保存
        originalMathFloor = Math.floor; // テスト前にMath.randomを保存
        originalFetch = global.fetch

      })

      afterEach(()=>{
        Math.random = originalMathRandom; // テスト後にMath.randomを元に戻す
        Math.floor = originalMathFloor; // テスト後にMath.randomを元に戻す
        global.fetch = originalFetch

      })

      describe("start()を実行したとき",()=>{
        it("Math.randomが呼ばれていること", ()=>{
          Math.random = jest.fn(); // Math.randomをモックする
  
          pokemonGacha.start()
  
          expect(Math.random).toHaveBeenCalled(); // Math.randomが呼び出されたか確認
          
        })
        it("Math.floorが呼ばれていること",()=>{
          Math.floor = jest.fn()

          pokemonGacha.start()

          expect(Math.floor).toHaveBeenCalled
        })

        it("Math.floor内でMath.randomを使用していること",()=>{
          Math.random = jest.fn(()=>0)
          Math.floor = jest.fn()

          pokemonGacha.start()

          expect(Math.floor).toHaveBeenCalledWith(0)
        })

        it("Math.randomで生成した数字を使ってAPIにリクエストしていること", async()=>{
          Math.random = jest.fn(()=>0); // Math.randomをモックする
          global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({})
          });
  
          await pokemonGacha.start()
  
          const expectedUrl = 'https://pokeapi.co/api/v2/pokemon/0/';
          expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
        })

        it("APIのレスポンス結果をpokemonに格納していること", async()=>{
          Math.random = jest.fn(()=>0); // Math.randomをモックする
         const stubResponse = {name: "pikanchu"}
          global.fetch = jest.fn().mockResolvedValue({
            json:()=>{return stubResponse}
          });

          await pokemonGacha.start()

          expect(pokemonGacha.pokemon.name).toBe(stubResponse.name)
        })

        it("適切なURLを指定したらAPIのレスポンス結果を適切に受けていること", async()=>{
          const stubNumber = 1
          Math.floor = jest.fn(()=>stubNumber)
          const fetchResolve = await fetch(`https://pokeapi.co/api/v2/pokemon/${stubNumber}/`)
          const resultJson = await fetchResolve.json()
          const expectPokemonName = resultJson.name

          await pokemonGacha.start()

          expect(pokemonGacha.pokemon.name).toBe(expectPokemonName)

          
        })
      })
    })
