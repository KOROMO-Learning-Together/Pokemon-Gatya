import axios from 'axios';
import {PokemonGacha} from './PokemonGacha.js'

//Gachaのインスタンスを作成
const gacha = new PokemonGacha('easy')

const button = document.getElementById('gachaButton');
button.addEventListener('click',click)

const buttonImg = document.getElementById('gachaButtonImg');
buttonImg.addEventListener('mouseover',mouseOver)
buttonImg.addEventListener('mouseout',mouseOut)

async function click(){
    //Gachaをスタート
    gacha.start()
}

function mouseOver(){
    //マウスホバーで画像を切り替え
    buttonImg.src='images/gachaButtonHover.png'
}

function mouseOut(){
    //マウスが離れたら画像を元に戻す
    buttonImg.src='images/gachaButton.png'
}