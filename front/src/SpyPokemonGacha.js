export class SpyPokemonGacha {

    constructor(mode){
                this.mode = mode;
                this.start_isCalled = false
            }    

    start(){
        const randomNumber = Math.random() * 3
        this.start_isCalled = true
    }
}