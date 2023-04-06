import { render, screen } from '@testing-library/react';
import App from './App';


//１ボタンがあるかどうか
    describe("mainContainer", () => {
      it("子にinitialScreenとgachaButtonを持っている", () => {
        render(<App />);
        const mainContainer = document.getElementById('mainContainer')
        const initialScreen = document.getElementById('initialScreen')
        const gachaButton = document.getElementById('gachaButton')
        expect(mainContainer.childElementCount).toBe(2);
        expect(mainContainer.firstElementChild).toBe(initialScreen);
        expect(mainContainer.lastElementChild).toBe(gachaButton);
      });
    });

    describe("PokemonGachaテスト", ()=>{
      it("ボタンを押したらMath.randomを読んでいる", ()=)
    })
