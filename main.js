'use strict';

//Gachaのインスタンスを作成
const gacha = new PokemonGacha('easy')

const button = document.getElementById('gachaButton');
button.addEventListener('click',click)

const buttonImg = document.getElementById('gachaButtonImg');
buttonImg.addEventListener('mouseover',mouseOver)
buttonImg.addEventListener('mouseout',mouseOut)

function click(){
    //Gachaをスタート
    gacha.start()
}

function mouseOver(){
    //マウスホバーで画像を切り替え
    buttonImg.src='gachaButtonHover.png'
}

function mouseOut(){
    //マウスが離れたら画像を元に戻す
    buttonImg.src='gachaButton.png'
}