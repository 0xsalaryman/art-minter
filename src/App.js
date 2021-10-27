import 'bulma/css/bulma.min.css';
import React from 'react';
import p5 from 'p5';
import './App.css';
// import { sketch } from './algorithms/shapes.js';
import meta from './img/metamask.png';
import { ethers } from 'ethers';
var $ = require( "jquery" );



const App = () => {

  // const [algorithm, setAlgorithm] = React.useState("Chromie Squiggle");
  const [imgScript, setImgScript] = React.useState(initImg())
  const [load, setLoad] = React.useState(1)
  const [canvas, setCanvas] = React.useState(0)
  const [dropdown, setDropdown] = React.useState(0)

  React.useEffect(() => {
    keyDown()
    toggleDropdown()
    globalToggleDropdown()
    selectDropdown()
  }, []);

  React.useEffect(() => {
    console.log(0)
    resizeEvent()
  }, [canvas]);


  
  function generateSeed() {
    let seed = Math.floor(Math.random() * 1e13);
    let seedString = ethers.utils.hexlify(seed);
    return ethers.utils.keccak256(seedString);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function resizeEvent() {
    window.addEventListener('resize', function(event) {
      event.stopPropagation();
      // console.log(1)
      // console.log(canvas)
      if (canvas == 1) {
        let container = document.getElementById('shapes');
        let windowHeight = container.clientHeight
        console.log(windowHeight)
        var iframe = document.getElementById("artframe");
        var element = iframe.contentWindow.document.getElementById('defaultCanvas0').setAttribute("style",`height:${windowHeight}px`);
        let width = iframe.contentWindow.document.getElementById('defaultCanvas0').clientWidth
        // document.getElementById("shapes").setAttribute("style",`min-width:0`);
        document.getElementById("shapes").style.width = `${width}px`
        // document.getElementById("generate").style.minWidth = "0";
        document.getElementById("generate").style.width = `${width}px`;
        
      }
    
    }, true);
  }

  function keyDown() {
    document.addEventListener("keydown", function(e) {
      if ((e.code == "Space" && e.target == document.body) || e.code == "Enter") {
        e.preventDefault();
        e.stopPropagation();
        generate()
      }
    });
  }

  function selectDropdown() {
    var items = document.getElementsByClassName('dropdown-item');
    console.log(items)
  }

  function initImg() {
    let img = (
      <div id="image-container">
        <img src="initial.gif" id="init"/>
      </div>
    )
    return img
  }

  function save() {
    var iframe = document.getElementById("artframe");
    var element = iframe.contentWindow.document.getElementById('defaultCanvas0');
    // console.log(element)
    var dataURL = element.toDataURL()
    // // console.log(dataURL)
    // saveAjax(dataURL)
  }

  function waitForCanvas(){
    var iframe = document.getElementById("artframe");
    var checkExist = setInterval(function() {
        if (iframe.contentWindow.document.querySelectorAll('#defaultCanvas0').length) {
          clearInterval(checkExist);
          setLoad(-1)
          setCanvas(1)
          let width = iframe.contentWindow.document.getElementById('defaultCanvas0').clientWidth
          document.getElementById("shapes").setAttribute("style",`min-width:0`);
          document.getElementById("shapes").style.width = `${width}px`;
          document.getElementById("generate").setAttribute("style",`min-width:0`)
          document.getElementById("generate").style.width = `${width}px`;
        }
    }, 100);
    
  }

  function saveAjax(dataUrl) {
    $.ajax({
      type: "POST",
      url: "http://localhost:8000/script.php",
      data: { 
          imgBase64: dataUrl
      }
    }).done(function(o) {
      console.log('saved'); 
    });
  }

  function toggleDropdown(){
    let dropdown = document.getElementById("algo")
    dropdown.addEventListener("click", function(ev) {
      ev.stopPropagation();
      dropdown.classList.toggle("is-active");
      console.log("hello")
    });
  }

  function globalToggleDropdown(){
    let dropdown = document.getElementById("algo")
    document.addEventListener("click", function(ev) {
      ev.stopPropagation();
      dropdown.classList.remove('is-active')
    })
  }


  function composeImgScript(seed, filename) {
    return (
      `<html>
        <head>
            <script src='https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js'>
            </script>
            <script>
              let tokenData = {
                hash: "${seed}",
                hashes: ["${seed}"],
              };
            </script>
            <script src="algorithms/${filename}"></script>
        </head>
        <body style="margin: 0">
            <main>
            </main>
        </body>
      </html>`
    )
  }

  function composeIframe(imgScript) {
    let container = document.getElementById('shapes');
    let windowHeight = container.clientHeight
    // console.log(windowHeight)
    return (
      <iframe
        id="artframe"
        title="art"
        height="100%"
        width="100%"
        srcDoc={imgScript}
        scrolling="no"
        frameBorder={0}
        allowFullScreen
        sandbox="allow-scripts"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        onLoad={waitForCanvas}
    >
    </iframe>
    )
  }

  // function getAlgo() {
  //   var e = document.getElementById("algo");
  //   console.log(e.selectedIndex)
  //   var strUser = e.options[e.selectedIndex].text;
  //   console.log(strUser)
  //   console.log(e)
  // }

  function generate() {
    setLoad(1)
    // let algorithm = getAlgo()


    let seed = generateSeed()
    let imgScript = composeImgScript(seed, "fidenza.js")
    let iFrame = composeIframe(imgScript)
    setImgScript(iFrame)
    // waitForCanvas()
  }


  return (
    <div id="top" style={{backgroundColor: "#282c34"}}>
        <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="">
              <h1><b>[ ART-MINTER ]</b></h1>
            </a>

            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light is-dark">
                  {"Connect Metamask \u00A0"} <img id="meta" src={meta}/>
                </a>
              </div>
            </div>

            <div class="dropdown navbar-item" id="algo">
              <div class="dropdown-trigger">
                <button class="button is-dark" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>Dropdown button</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item">
                    Dropdown item
                  </a>
                  <a class="dropdown-item">
                    Other dropdown item
                  </a>
                  <a href="#" class="dropdown-item is-active">
                    Active dropdown item
                  </a>
                  <a href="#" class="dropdown-item">
                    Other dropdown item
                  </a>
                  <hr class="dropdown-divider"/>
                  <a href="#" class="dropdown-item">
                    With a divider
                  </a>
                </div>
              </div>
            </div>
          </div>
        
        </nav>
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <div class="content">
                <h1>Mint "Art".</h1>
                <br/>
                <p>How it works:</p>
                <ol>
                  <li>Connect Metamask</li>
                  <li>Select the algorithm</li>
                  <li>Click on the canvas on the right to generate the art</li>
                  <li>Mint when you see something you like</li>
                </ol>
              </div>
              <a class="button is-info" onClick={save}>
                Mint
              </a>
              
            </div>
            <div class="column">
              <div id="shapes" class="art">
                <a class="button is-loading" id="clickable" style={{zIndex:load}}>
                </a>
                {imgScript}
              </div>
              
              <a class="button is-small is-dark" id="generate" onClick={generate}>
                Generate (⎵ or ↵)
              </a>
            </div>
          </div>
        </div>
      </div>
      
      
  )
}
  
export default App;