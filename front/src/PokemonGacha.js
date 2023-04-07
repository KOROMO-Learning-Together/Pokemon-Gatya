
export class PokemonGacha {

    constructor(mode){
                this.mode = mode;
            }    
        
    pokemon = {};

    async start(){
        // 表示している要素を消す

        // ゲットするポケモンを決める
        await this.randomSelectPokemon()
    }

    async randomSelectPokemon(){
        // ランダムなポケモンIDを生成
        const pokemonId = Math.floor(Math.random()*721)

        // pokeAPIからポケモンの情報を取得
        try{
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
            // プロパティに格納
            this.pokemon= await res.json()
        }catch(error){
            console.error('fetch error', error)
        }

    }

}
