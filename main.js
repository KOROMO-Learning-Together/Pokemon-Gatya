'use strict';

// main関数　ボタンが押されたら読み込まれる
function main (){
    //Gachaのインスタンスを作成
    const gacha = new PokemonGacha('easy')
    gacha.start()
}

class PokemonGacha {
    constructor(mode){
        this.mode = mode;
    }

    pokemon = {}
    
    monsterBall = 'normal'

    async start(){
        // 表示している要素を消す
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove()

        // 使用するモンスターボールを決める
        this.randomSelectMonsterBall()

        // ゲットするポケモンを決める
        this.randomSelectPokemon()

        // ガチャのアクションを再生
        this.gachaAction()
    }

    gachaAction(){
        // ガチャアクションの動画をオート再生
        const video = document.createElement('video');
        video.id = 'gacha';
        if(this.monsterBall === 'superBall'){
            video.src = './gachaActionSuper.mov';
        } else if(this.monsterBall === 'hyperBall'){
            video.src = './gachaActionHyper.mov';
        } else if(this.monsterBall === 'masterBall'){
            video.src = './gachaActionMaster.mov';
        } else {
            video.src = './gachaAction.mov';
        }
        video.autoplay = true;
        video.muted = true;
        video.playsinline = true;
        document.body.appendChild(video);

        // 再生終了時のアクション => ゲットしたポケモンの画像とステータスを表示
	    video.addEventListener("ended", async () => {await this.showPokemon()}, false);
    }

    async showPokemon(){
        // 表示している動画のフレームを削除
        const gacha = document.getElementById('gacha');
        gacha.remove()

        // ポケモンの画像を取得
        const pokemon = await this.getPokemon()

        // ポケモンのステータス表示を作成
        const pokemonStatus = await this.makePkemonStatus()

        // ポケモンを表示
        const pokemonWindow = document.createElement('div');
        pokemonWindow.id = 'pokemonWindow'
        pokemonWindow.appendChild(pokemon);
        pokemonWindow.appendChild(pokemonStatus);
        document.body.appendChild(pokemonWindow)
    }

    async getPokemon(){
        const res = await fetch(this.pokemon.sprites.other.home.front_default)
        const blob = await res.blob()
        const pokemonImg = document.createElement('img');
        pokemonImg.id = 'pokemonImg'
        pokemonImg.src = URL.createObjectURL(blob);
        const pokemonName = document.createElement('div');
        pokemonName.id = 'pokemonName'

        const response = await fetch(this.pokemon.species.url)
        const species = await response.json()

        pokemonName.innerHTML = species.names.filter(element => element.language.name === 'ja')[0].name
        const pokemon = document.createElement('div');
        pokemon.id = 'pokemon'
        pokemon.appendChild(pokemonName);
        pokemon.appendChild(pokemonImg);
        return pokemon
    }

    async makePkemonStatus(){
        const status = document.createElement('div');
        status.id =  'status'

        const height = document.createElement('p');
        height.id = 'height'
        height.innerHTML = `身長：${this.pokemon.height*10} cm`

        const weight = document.createElement('p');
        weight.id = 'weight'
        weight.innerHTML = `体重：${this.pokemon.weight/10} kg`

        const types = document.createElement('p');
        types.id = 'types';

        let pokemonTypes = '';

        this.pokemon.types.forEach(async element => {
            const res = await fetch(element.type.url)
            const type = await res.json();
            pokemonTypes += type.names.filter(element => element.language.name === 'ja')[0].name
            pokemonTypes += '/'
            types.innerHTML = `タイプ：${pokemonTypes}`
        });

        const continueButton = document.createElement('button');
        continueButton.id = 'continueButton'
        continueButton.onclick = this.continue
        continueButton.innerHTML = 'もう一度ゲットする！！';

        status.appendChild(types)
        status.appendChild(height)
        status.appendChild(weight)
        status.appendChild(continueButton)

        return status

    }

    async randomSelectPokemon(){
        // ランダムなポケモンIDを生成
        const pokemonId = Math.floor(Math.random()*721)
        // pokeAPIからポケモンの情報を取得
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        // プロパティに格納
        this.pokemon= await res.json()
    }

    randomSelectMonsterBall(){
        // 設定によって出現するモンスターボールの確率を変更
        if(this.mode === 'easy'){
            const hogehoge = Math.floor(Math.random()*100)
            if(hogehoge>95){
                this.monsterBall = 'masterBall'
            } else if (hogehoge>85){
                this.monsterBall = 'hyperBall'
            } else if (hogehoge>65){
                this.monsterBall = 'superBall'
            } else {
                this.monsterBall = 'normalBall'
            }
        }
    }

    
    continue(){
        // getしたポケモンを消す
        const pokemonWindow = document.getElementById('pokemonWindow')
        pokemonWindow.remove()

        // 初期状態の画面を作る
        const mainContainer = document.createElement('div');
        mainContainer.id = 'mainContainer';

        const gachaButton = document.createElement('Button');
        gachaButton.id = 'gachaButton';
        gachaButton.type = 'button';
        gachaButton.onclick = main;

        const gachaButtonImg = document.createElement('img');
        gachaButtonImg.id = 'gachaButtonImg'
        gachaButtonImg.src = 'gachaButton.png'
        gachaButtonImg.alt = 'button'
        
        const initialScreen = document.createElement('img');
        initialScreen.id = 'initialScreen';
        initialScreen.src = 'start.png';
        initialScreen.alt= 'start'

        mainContainer.appendChild(initialScreen)
        gachaButton.appendChild(gachaButtonImg)
        mainContainer.appendChild(gachaButton)
        document.body.appendChild(mainContainer);
    }
}