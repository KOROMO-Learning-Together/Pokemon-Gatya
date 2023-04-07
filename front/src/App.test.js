/* eslint-disable testing-library/no-node-access */

import { render, screen } from '@testing-library/react';
import App from './App';
import { PokemonGacha } from './PokemonGacha';
import { SpyPokemonGacha } from './SpyPokemonGacha';

import userEvent from '@testing-library/user-event'


//１ボタンがあるかどうか
    describe("mainContainer", () => {
      it("子にgachaButtonを持っている", () => {
        render(<App PokemonGacha={SpyPokemonGacha}/>);
        const mainContainer = document.querySelector('#mainContainer')
        const gachaButton = document.getElementById('gachaButton')

        expect(mainContainer.querySelector('#gachaButton')).toBe(gachaButton);
      });
    });

    describe("PokemonGachaテスト", ()=>{
      it("ボタンを押したらMath.randomを読ばれていること", ()=>{
        const originalRandom = Math.random; // テスト前にMath.randomを保存
        Math.random = jest.fn(); // Math.randomをモックする

        render(<App PokemonGacha={PokemonGacha}/>);
        const gachaButton = document.getElementById('gachaButton')

        userEvent.click(gachaButton); // ボタンをクリック

        expect(Math.random).toHaveBeenCalled(); // Math.randomが呼び出されたか確認
        Math.random = originalRandom; // テスト後にMath.randomを元に戻す
      })

      it("ボタンを押したらstart()が読ばれていること", ()=>{
        render(<App PokemonGacha={PokemonGacha}/>);
        const gachaButton = document.getElementById('gachaButton')

        userEvent.click(gachaButton); // ボタンをクリック

        // const spyPokemonGacha = new SpyPokemonGacha()


        expect(PokemonGacha.start_isCalled).toBe(true); // Math.randomが呼び出されたか確認
      })
    })
