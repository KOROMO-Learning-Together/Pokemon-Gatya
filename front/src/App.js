import { PokemonGacha } from './PokemonGacha';

function App() {

  // const gacha = new PokemonGacha('easy')

  // gacha.start()


  return (
    <div className="App">
      <div id="page">
        <div id='mainContainer'>
            <img id='initialScreen' src='images/start.png' alt='start'/>
            <button id='gachaButton' type='button'>
                <img id='gachaButtonImg' src='images/gachaButton.png' alt="button"/>
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;
