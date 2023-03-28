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

    species = {}
    
    monsterBall = 'normalBall'

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

        const pageElement = document.getElementById("page")
        pageElement.appendChild(video);

        // 再生終了時のアクション => ゲットしたポケモンの画像とステータスを表示
	    video.addEventListener("ended", async () => {await this.showPokemon()}, false);
    }

    async showPokemon(){
        // 表示している動画のフレームを削除
        const gacha = document.getElementById('gacha');
        gacha.remove()

        // ポケモンの画像を取得
        const pokemonImg = await this.makePokemonImg()

        // ポケモンのステータス表示を作成
        const pokemonStatus = await this.makePkemonStatus()

        // 画面を作成
        const pokemonWindow = document.createElement('div');
        pokemonWindow.id = 'pokemonWindow'
        pokemonWindow.appendChild(pokemonImg);
        pokemonWindow.appendChild(pokemonStatus);

        // コンティニューボタンを作成
        const continueButton = document.createElement('button');
        continueButton.id = 'continueButton'
        continueButton.onclick = this.continue
        const buttonImg = document.createElement('img');
        buttonImg.id = 'continueButtonImg'
        buttonImg.src = 'continueButton.svg'
        buttonImg.onmouseenter = ()=>{buttonImg.src = 'continueButtonHover.svg'}
        buttonImg.onmouseout = ()=>{buttonImg.src = 'continueButton.svg'}
        continueButton.appendChild(buttonImg)

        const footer = document.createElement('div')
        footer.id = 'footer'
        footer.appendChild(continueButton)

        pokemonWindow.appendChild(footer);



        const pageElement = document.getElementById("page")
        pageElement.appendChild(pokemonWindow);

    }

    async makePokemonImg(){
        // ポケモンの画像を取得する
        let res = await fetch(this.pokemon.sprites.other.home.front_default)
        const blob = await res.blob()
        const pokemonImg = document.createElement('img');
        pokemonImg.id = 'pokemonImg'
        pokemonImg.src = URL.createObjectURL(blob);

        // ポケモンのidを取得する
        const pokemonId = document.createElement('p');
        pokemonId.id = 'pokemonId'
        pokemonId.innerHTML = `No.${this.pokemon.id.toString().padStart(4,'0')}`
        
        // ポケモンの名前を取得する
        const pokemonName = document.createElement('p');
        pokemonName.id = 'pokemonName'
        res = await fetch(this.pokemon.species.url)
        this.species = await res.json()
        pokemonName.innerHTML = this.species.names.filter(element => element.language.name === 'ja')[0].name

        // ポケモンの性別を取得する
        const pokemonGender = document.createElement('div');
        pokemonGender.id = 'pokemonGender'
        if(this.species.gender_rate === 8){
            const pokemonFemale = document.createElement('img');
            pokemonFemale.src = 'icon_female.svg'
            pokemonGender.appendChild(pokemonFemale)
        } else if(this.species.gender_rate === 0){
            const pokemonMale = document.createElement('img');
            pokemonMale.src = 'icon_male.svg'
            pokemonGender.appendChild(pokemonMale)
        } else if(this.species.gender_rate === -1){
            pokemonGender.innerHTML = '不明'
        } else {
            const pokemonFemale = document.createElement('img');
            pokemonFemale.src = 'icon_female.svg'
            const pokemonMale = document.createElement('img');
            pokemonMale.src = 'icon_male.svg'
            pokemonGender.appendChild(pokemonFemale)
            pokemonGender.appendChild(pokemonMale)
        }

        const header = document.createElement('div');
        header.id = 'header';
        const pokemonNameContainer = document.createElement('div');
        pokemonNameContainer.id = 'pokemonNameContainer'
        pokemonNameContainer.appendChild(pokemonId);
        pokemonNameContainer.appendChild(pokemonName);
        pokemonNameContainer.appendChild(pokemonGender)
        header.appendChild(pokemonImg);
        header.appendChild(pokemonNameContainer)
        return header
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

        const genera = document.createElement('p');
        genera.id = 'genera'
        genera.innerHTML = `分類：${this.species.genera.filter((element)=>element.language.name === 'ja')[0].genus}`

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

        const abilities = document.createElement('p');
        abilities.id = 'abilities';

        let pokemonAbilities = '';

        this.pokemon.abilities.forEach(async element => {
            const res = await fetch(element.ability.url)
            const ability = await res.json();
            pokemonAbilities += ability.names.filter(element => element.language.name === 'ja')[0].name
            pokemonAbilities += '/'
            abilities.innerHTML = `特性：${pokemonAbilities}`
        });


        const flavorText =  document.createElement('p')
        flavorText.id = 'flavorText'
        flavorText.innerHTML = this.species.flavor_text_entries.filter(element => element.language.name === 'ja')[0].flavor_text

        
        status.appendChild(genera)
        status.appendChild(types)
        status.appendChild(height)
        status.appendChild(weight)
        status.appendChild(abilities)
        status.appendChild(flavorText)


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
            if(hogehoge>90){
                this.monsterBall = 'masterBall'
            } else if (hogehoge>70){
                this.monsterBall = 'hyperBall'
            } else if (hogehoge>40){
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
        gachaButton.onmouseenter = ()=>{gachaButtonImg.src = 'gachaButtonHover.png'}
        gachaButton.onmouseout = ()=>{gachaButtonImg.src = 'gachaButton.png'}
        gachaButtonImg.alt = 'button'
        
        const initialScreen = document.createElement('img');
        initialScreen.id = 'initialScreen';
        initialScreen.src = 'start.png';
        initialScreen.alt= 'start'

        mainContainer.appendChild(initialScreen)
        gachaButton.appendChild(gachaButtonImg)
        mainContainer.appendChild(gachaButton)

        const pageElement = document.getElementById("page")
        pageElement.appendChild(mainContainer);
    }
}