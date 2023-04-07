'use strict';

import {PokemonGacha} from './PokemonGacha.js'

//Gachaのインスタンスを作成
const gacha = new PokemonGacha('easy')

const button = document.getElementById('gachaButton');
button.addEventListener('click',()=>{gacha.start()})

const buttonImg = document.getElementById('gachaButtonImg');
buttonImg.addEventListener('mouseover',()=>{gacha.mouseover()})
buttonImg.addEventListener('mouseout',()=>{gacha.mouseout()})
