
export class PokemonGacha {

    constructor(mode){
                this.mode = mode;
            }    
        
    pokemon = {};

    async start(){

        // ゲットするポケモンを決めるメソッドを呼ぶ
        await this.randomSelectPokemon()
    }

    async randomSelectPokemon(){
        // ランダムなポケモンIDを生成

        // pokeAPIからポケモンの情報を取得
        try{

            // pokemonに格納

        }catch(error){
            console.error('fetch error', error)
        }
    }
}
