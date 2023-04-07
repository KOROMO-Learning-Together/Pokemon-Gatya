import { useState } from "react";


function App(props) {
  const[gachaButtonImg, setGachaButtonImg] = useState("images/gachaButton.png")

  function mouseOver(){
      //マウスホバーで画像を切り替え
      setGachaButtonImg("images/gachaButtonHover.png")
  }

  function mouseOut(){
      //マウスが離れたら画像を元に戻す
      setGachaButtonImg("images/gachaButton.png")
  }


  return (
    <div className="App">
      <div id="page">
        <div id='mainContainer'>
            <img id='initialScreen' src='images/start.png' alt='start'/>
            {/* Appのテストを通すときはここのコメントアウトを外す */}
            {/* <button id='gachaButton' type='button' onClick={()=>{props.PokemonGacha.start()}}>
                <img id='gachaButtonImg' 
                src={gachaButtonImg} 
                alt="button"
                onMouseOver={mouseOver}
                onMouseOut={mouseOut}
                />
            </button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
