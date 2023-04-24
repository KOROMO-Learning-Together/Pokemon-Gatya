export class PokemonGacha {
    constructor(mode){
        this.mode = mode;
    }

    pokemon = {}
    species = {}
    monsterBall = 'normalBall'

    // ボタンがクリックされたときに実行されるメソッド
    async start(){
        // 1-❶
        await this.randomSelectPokemon()
        // 3-❻
        // this.randomSelectMonsterBall()
        // 1-❻
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.remove()
        // 1-❼ → 3-❶
        await this.showPokemon()
        // await this.gachaAction()
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

        // 再生終了時のアクション
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
        // ポケモンの画像を取得
        // 1-❽
        const pokemonImg = await this.makePokemonImg()

        // ポケモンのステータス表示を作成
        // 2-❶
        const pokemonStatus = await this.makePokemonStatus()

        // コンティニューボタンを作成
        // 3-❷
        // const continueButton = this.makeContinueButton()

        // 画面を作成
        // 1-❾
        const pokemonWindow = document.createElement('div');
        pokemonWindow.id = 'pokemonWindow'
        pokemonWindow.appendChild(pokemonImg);
        // 2-❷
        pokemonWindow.appendChild(pokemonStatus); 
        // コンティニューボタンを表示
        // 3-❸
        // pokemonWindow.appendChild(continueButton); 

        const pageElement = document.getElementById("page")
        pageElement.appendChild(pokemonWindow);

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

    async makePokemonStatus(){
        const statusL = document.createElement('div');
        statusL.id =  'statusL'

        //　2-❹
        const height = document.createElement('p');
        height.id = 'height'
        height.innerHTML = `身長：${this.pokemon.height*10} cm`
        //　2-❺
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


        statusL.appendChild(genera)
        statusL.appendChild(types)
        statusL.appendChild(height)
        statusL.appendChild(weight)
        statusL.appendChild(abilities)

        const statusR = document.createElement('div');
        statusR.id =  'statusR'

        const hpColumn = document.createElement('div');
        hpColumn.id =  'hpColumn'
        const hp = document.createElement('div');
        hp.id =  'hp'
        hp.innerHTML = 'HP  '
        const hpGage = document.createElement('div');
        hpGage.id =  'hpGage'
        let hpCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'hp')[0].base_stat/10)
        if(hpCount>15){hpCount = 15}
        for (let i = 0; i < hpCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            hpGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-hpCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            hpGage.appendChild(whiteGage)
        }

        hpColumn.appendChild(hp)
        hpColumn.appendChild(hpGage)

        const attackColumn = document.createElement('div');
        attackColumn.id =  'attackColumn'
        const attack = document.createElement('div');
        attack.id =  'attack'
        attack.innerHTML = 'こうげき'
        const attackGage = document.createElement('div');
        attackGage.id =  'attackGage'
        let attackCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'attack')[0].base_stat/10)
        if(attackCount>15){hpCount = 15}
        for (let i = 0; i < attackCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            attackGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-attackCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            attackGage.appendChild(whiteGage)
        }

        attackColumn.appendChild(attack)
        attackColumn.appendChild(attackGage)

        const defenseColumn = document.createElement('div');
        defenseColumn.id =  'defenseColumn'
        const defense = document.createElement('div');
        defense.id =  'defense'
        defense.innerHTML = 'ぼうぎょ'
        const defenseGage = document.createElement('div');
        defenseGage.id =  'defenseGage'
        let defenseCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'defense')[0].base_stat/10)
        if(defenseCount>15){defenseCount = 15}
        for (let i = 0; i < defenseCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            defenseGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-defenseCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            defenseGage.appendChild(whiteGage)
        }

        defenseColumn.appendChild(defense)
        defenseColumn.appendChild(defenseGage)



        const spAttackColumn = document.createElement('div');
        spAttackColumn.id =  'spAttackColumn'
        const spAttack = document.createElement('div');
        spAttack.id =  'spAttack'
        spAttack.innerHTML = 'とくこう'
        const spAttackGage = document.createElement('div');
        spAttackGage.id =  'spAttackGage'
        let spAttackCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'special-attack')[0].base_stat/10)
        if(spAttackCount>15){spAttackCount = 15}
        for (let i = 0; i < spAttackCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            spAttackGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-spAttackCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            spAttackGage.appendChild(whiteGage)
        }

        spAttackColumn.appendChild(spAttack)
        spAttackColumn.appendChild(spAttackGage)

        const spDefenseColumn = document.createElement('div');
        spDefenseColumn.id =  'spDefenseColumn'
        const spDefense = document.createElement('div');
        spDefense.id =  'spDefense'
        spDefense.innerHTML = 'とくぼう'
        const spDefenseGage = document.createElement('div');
        spDefenseGage.id =  'spDefenseGage'
        let spDefenseCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'special-defense')[0].base_stat/10)
        if(spDefenseCount>15){spDefenseCount = 15}
        for (let i = 0; i < defenseCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            spDefenseGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-defenseCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            spDefenseGage.appendChild(whiteGage)
        }

        spDefenseColumn.appendChild(spDefense)
        spDefenseColumn.appendChild(spDefenseGage)

        const speedColumn = document.createElement('div');
        speedColumn.id =  'defenseColumn'
        const speed = document.createElement('div');
        speed.id =  'spDefense'
        speed.innerHTML = 'すばやさ'
        const speedGage = document.createElement('div');
        speedGage.id =  'speedGage'
        let speedCount = Math.floor(this.pokemon.stats.filter(element => element.stat.name === 'speed')[0].base_stat/10)
        if(speedCount>15){speedCount = 15}
        for (let i = 0; i < speedCount; i++){
            const yellowGage = document.createElement('div');
            yellowGage.className = 'yellowGage'
            speedGage.appendChild(yellowGage)
        }
        for (let i = 0; i < 15-speedCount; i++){
            const whiteGage = document.createElement('div');
            whiteGage.className = 'whiteGage'
            speedGage.appendChild(whiteGage)
        }

        speedColumn.appendChild(speed)
        speedColumn.appendChild(speedGage)


        statusR.appendChild(hpColumn)
        statusR.appendChild(attackColumn)
        statusR.appendChild(defenseColumn)
        statusR.appendChild(spAttackColumn)
        statusR.appendChild(spDefenseColumn)
        statusR.appendChild(speedColumn)

        const status = document.createElement('div');
        status.id =  'status'

        status.appendChild(statusL)
        status.appendChild(statusR)


        const flavorText =  document.createElement('p')
        flavorText.id = 'flavorText'
        flavorText.innerHTML = this.species.flavor_text_entries.filter(element => element.language.name === 'ja')[0].flavor_text

        

        const description = document.createElement('div');
        description.id =  'description'

        description.appendChild(flavorText)

        //　2-❸
        const statusWindow = document.createElement('div');
        statusWindow.id =  'statusWindow'

        statusWindow.appendChild(status)
        statusWindow.appendChild(description)

        //　2-❸
        return statusWindow
    }

    async randomSelectPokemon(){
        // ランダムなポケモンIDを生成
        const pokemonId = Math.floor(Math.random()*1000)
        // pokeAPIからポケモンの情報を取得
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        // プロパティに格納
        this.pokemon= await res.json()
    }

    randomSelectMonsterBall(){
        // 設定によって出現するモンスターボールの確率を変更
        if(this.mode === 'easy'){
            const probability = Math.floor(Math.random()*100)
            // 3-❼
            // if(probability>90){
            //     this.monsterBall = 'masterBall'
            // } else if (probability>70){
            //     this.monsterBall = 'hyperBall'
            // } else if (probability>40){
            //     this.monsterBall = 'superBall'
            // } else {
            //     this.monsterBall = 'normalBall'
            // }
        }
    }
    // コンティニューボタンを作るメソッド
    makeContinueButton(){
        // コンティニューボタンのエレメントを作成
        // 3-❹
        // const continueButton = document.createElement('button');
        // continueButton.id = 'continueButton'
        // クリック時の動作を設定
        // 3-❺
        // continueButton.onclick = ()=>{this.continue(this)}
        // ボタンに挿入するイメージの作成
        const buttonImg = document.createElement('img');
        buttonImg.id = 'continueButtonImg'
        buttonImg.src = 'continueButton.svg'
        // ボタンホバー時の動作を設定
        buttonImg.onmouseenter = ()=>{buttonImg.src = 'continueButtonHover.svg'}
        buttonImg.onmouseout = ()=>{buttonImg.src = 'continueButton.svg'}
        continueButton.appendChild(buttonImg)
        // ボタンを配置するエリアを作成
        const footer = document.createElement('div')
        footer.id = 'footer'
        // 作成したボタンを追加
        footer.appendChild(continueButton)
        return footer
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
