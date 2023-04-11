export class PokemonGacha {
    constructor(mode){
        mode = mode;
    }

    pokemon = {}
    species = {}
    monsterBall = 'normalBall'

    // ボタンがクリックされたときに実行されるメソッド
    async start(){
        // 1-❶
        await this.randomSelectPokemon()
        // 1-❻
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove()
        // 1-❼
        await this.showPokemon()

    }

    // ボタンにカーソルが乗ったときに実行されるメソッド
    mouseover(){
        const buttonImg = document.getElementById('gachaButtonImg');
        buttonImg.src = 'gachaButtonHover.png'
    }

    // ボタンからカーソルが外れたときに実行されるメソッド
    mouseout(){
        const buttonImg = document.getElementById('gachaButtonImg');
        buttonImg.src = 'gachaButton.png'
    }

    // ガチャアクションの動画をAuto再生するメソッド
    gachaAction(){
        // video要素を作成
        const video = document.createElement('video');
        video.id = 'gacha';
        // 使用するモンスターボールで使う動画を切り替える
        if(this.monsterBall === 'superBall'){
            video.src = './gachaActionSuper.mov';
        } else if(this.monsterBall === 'hyperBall'){
            video.src = './gachaActionHyper.mov';
        } else if(this.monsterBall === 'masterBall'){
            video.src = './gachaActionMaster.mov';
        } else {
            video.src = './gachaAction.mov';
        }
        // Auto再生の設定
        video.autoplay = true;
        video.muted = true;
        video.playsinline = true;
        // 作成したvideo要素をpage要素に追加
        const pageElement = document.getElementById("page")
        pageElement.appendChild(video);

        // 動画再生終了時のアクション
	    video.addEventListener("ended", async () => {
            // 表示している動画のフレームを削除
            const gacha = document.getElementById('gacha');
            gacha.remove()
            // ゲットしたポケモンの画像とステータスを表示
            await this.showPokemon()
        }, false);
    }

    // ゲットしたポケモンを表示するメソッド
    async showPokemon(){
        // 1-❽
        const pokemonImg = await this.makePokemonImg()
        // 1-❾
        const pokemonWindow = document.createElement('div');
        pokemonWindow.id = 'pokemonWindow';
        pokemonWindow.appendChild(pokemonImg)
        const page = document.getElementById('page')
        page.appendChild(pokemonWindow)

    }

    // ポケモンの画像を取得した情報から作成するためのメソッド
    async makePokemonImg(){
        // ポケモンの画像を取得する
        // ランダムに取得したポケモンのデータから必要な画像のURLを抽出して画像データを取得する
        let res = await fetch(this.pokemon.sprites.other.home.front_default)
        const blob = await res.blob()
        // 取得した画像データをimgタグに貼り付ける
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

    // ポケモンのステータスを取得した情報から作成するためのメソッド
    async makePkemonStatus(){
        
    }

    // ランダムなポケモンの情報を外部APIから取得するためのメソッド
    async randomSelectPokemon(){
        // 1-❷　1-❸
        const pokemonId = Math.floor(Math.random()*1000)
        // 1-❹
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        // 1-❺
        this.pokemon = await res.json()
        
    }

    // ランダムに動画で表示するモンスターボールを選択するためのメソッド
    randomSelectMonsterBall(){
        
    }

    
    continue(gacha){
        // getしたポケモンを消す
        const pokemonWindow = document.getElementById('pokemonWindow')
        pokemonWindow.remove()
        
        // 初期状態の画面を作る
        const mainContainer = document.createElement('div');
        mainContainer.id = 'mainContainer';
        const gachaButton = document.createElement('Button');
        gachaButton.id = 'gachaButton';
        gachaButton.type = 'button';
        gachaButton.onclick = ()=>{gacha.start()};

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
