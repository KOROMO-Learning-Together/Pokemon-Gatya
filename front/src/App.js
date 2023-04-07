import { SpyPokemonGacha } from "./SpyPokemonGacha";

function App(PokemonGacha) {

  // const gacha = new SpyPokemonGacha('easy')

  return (
    <div className="App">
      <div id="page">
        <div id='mainContainer'>
            <img id='initialScreen' src='images/start.png' alt='start'/>
            <button id='gachaButton' type='button' onClick={()=>{PokemonGacha.start()}}>
                <img id='gachaButtonImg' src='images/gachaButton.png' alt="button"/>
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;
