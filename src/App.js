import 'bulma/css/bulma.min.css';
import './App.css';


import React from 'react';
import p5 from 'p5';

import { ethers } from 'ethers';
import { getAlgo, algoList } from "./utils/dictionary.js";
import { connectWallet, getCurrentWalletConnected, mintNFT, waitTx } from "./utils/interact.js";
import { createMetadata, uploadMetadata, uploadFile } from './utils/pinata';
import { create } from 'ipfs-http-client';

import meta from './img/metamask.png';

const fs = require('fs');
const $ = require( "jquery" );
const client = create('https://ipfs.infura.io:5001/api/v0')

const App = () => {

  // States for art generation
  
  const [imgScript, setImgScript] = React.useState("")
  const [load, setLoad] = React.useState(0)
  const [canvas, setCanvas] = React.useState(0)
  const [algo, setAlgo] = React.useState("Chromie Squiggle")
  const [seed, setSeed] = React.useState("")
  const [message, setMessage] = React.useState("")
  const algos = algoList()
  const metamask = "Connect Metamask"

  React.useEffect(async () => {
    toggleDropdown()
    globalToggleDropdown()
    const {address, status} = await getCurrentWalletConnected();
    
    setWallet(address)
    addWalletListener();
  }, []);

  React.useEffect(() => {
    resizeEvent()
  }, [canvas]);

  React.useEffect(() => {
    keyDown()
    selectDropdown()
  }, [algo, load]);


  // States for wallet connection
  const [walletAddress, setWallet] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [button, setButton] = React.useState("");

  // React.useEffect(async () => { 
  //   const {address, status} = await getCurrentWalletConnected();
    
  //   setWallet(address)
  //   console.log("heelo" + address)
  //   // enableButton()
  //   // setStatus("Mint");
  //   // setLoad("button") 
  //   // if (address == "") {
  //   //   setButton(true)
  //   // } else {
  //   //   setButton(false)
  //   // }
  //   // console.log(button)
    
  //   addWalletListener();
  // }, [imgScript]);


  function enableButton() {
    console.log(walletAddress)
    console.log(document.querySelectorAll('iframe').length)
    // if (walletAddress != "" && (document.querySelectorAll('iframe').length)) {
    //   console.log("hello")
    //   document.getElementById("mint").disabled = false
    // } else {
    //   document.getElementById("mint").disabled = true
    // }
  }
  
  const connectWalletPressed = async () => { 
    const walletResponse = await connectWallet();

    setWallet(walletResponse.address);
    if (walletAddress != "" && (document.querySelectorAll('iframe').length)) {
      console.log("hello")
      // document.getElementById("mint").disabled = false
    } else {
      // document.getElementById("mint").disabled = true
    }
    // if (walletResponse.address == "") {
    //   setButton(true)
    // } else {
    //   setButton(false)
    // }
    
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          enableButton()
          // setStatus("");
          // setButton(true)
        } else {
          setWallet("");
          enableButton()
          // setStatus("");
          // setButton(false)
        }
      });
    }
  } 


  // Generate new art when space or enter is pressed
  function keyDown() {
    document.addEventListener("keydown", function(e) {
      if ((e.code == "Space" && e.target == document.body) || e.code == "Enter") {
        e.preventDefault();
        e.stopPropagation();
        generate()
      }
    });
  }

  //Toggle dropdown when clicked
  function toggleDropdown(){
    let dropdown = document.getElementById("algo")
    dropdown.addEventListener("click", function(ev) {
      ev.stopPropagation();
      dropdown.classList.toggle("is-active");
    });
  }

  // Toggle Dropdown when other areas are clicked
  function globalToggleDropdown(){
    let dropdown = document.getElementById("algo")
    document.addEventListener("click", function(ev) {
      ev.stopPropagation();
      dropdown.classList.remove('is-active')
    })
  }

  // Set algo state when selected from Dropdown
  function selectDropdown() {
    var items = document.getElementsByClassName('dropdown-item');
    let dropdown = document.getElementById("algo")
    items.forEach(function (el) {
      el.onclick = function (event) {
        event.stopPropagation();
        dropdown.classList.remove('is-active')
        let active = document.getElementsByClassName("dropdown-item is-active")
        if (active.length > 0) {
          active[0].classList.remove("is-active")
        }
        el.classList.toggle("is-active")
        var text = el.innerText || el.textContent;
        setAlgo(text)
      }
    });
  }

  // Initial loading image
  // function initImg() {
    // let img = (
    //   <div id="image-container">
    //     <img src="initial2.gif" id="init"/>
    //   </div>
    // )
    // return img
  //   return ""
  // }

  // Function to save rendered canvas into image
  async function save() {
    setLoad(1)
    var minter = document.getElementById("mint")
    minter.disabled = true

    var notif = document.getElementById("notif")
    minter.classList.toggle("is-loading");
    var iframe = document.getElementById("artframe");
    // let canvas = iframe.contentWindow.document.getElementById('defaultCanvas0')
    let canvases = iframe.contentWindow.document.getElementsByTagName('canvas')
    let canvas = canvases[0]
    // var element = iframe.contentWindow.document.getElementById('defaultCanvas0');
    // console.log(element)
    var dataURL = canvas.toDataURL()

    // console.log(dataURL)
    
    // var location = await saveAjax(dataURL, seed, "../tmp/")
    // console.log(location)
    // const readableStreamForFile = fs.createReadStream(location);
    // const added = await client.add(location)
    const blob = dataURLtoBlob(dataURL)
    // console.log(blob)
    const file = new File([blob], "image.png", {
      type: blob.type,
    });
    // console.log(file)
    const url = await client.add(file)
    // const streamFile = test(dataURL, "test.png")
    // console.log(streamFile)
    // var location = await saveAjax(dataURL, seed, "../tmp/")
    // var url = uploadFile(test.stream(), "")
    // console.log(url)
    var metadata = createMetadata(algo, "#1", "ipfs://" + url.path, seed)

    var hash = await uploadMetadata(metadata, "")
    var tokenURI = "ipfs://" + hash.IpfsHash
    
    var result = await mintNFT(tokenURI)
    minter.classList.toggle("is-loading");
    if (result.success) {
      notif.classList.add("is-success")
      const result = await waitTx(result.status)
    } else {
      notif.classList.add("is-danger")
    }
    notif.setAttribute("style",`display: block`)

    setMessage("Transaction Hash: "+result.status)
    // setMessage("Image Uploaded: https://ipfs.io/ipfs/")
    
    // console.log(added)
    // console.log(tokenURI)
    /* upload the file */
    // console.log(hash)
    minter.disabled = false
    setLoad(0)
  }

  function delNotif() {
    var notif = document.getElementById("notif")
    notif.setAttribute("style",`display: none`)
  }

  // async function saveAjax(_data_url, _name, _location) {
  //   var result = await $.ajax({
  //     type: "POST",
  //     url: "http://localhost:8000/php/script.php",
  //     data: { 
  //         data_url: _data_url,
  //         name: _name,
  //         location: _location
  //     }
  //   })

  //   return "./tmp/"+ _name + ".png"
  // }

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  // function test(dataUrl, filename) {
  //   var blob = dataURLtoBlob(dataUrl);
  //   var fd = new FormData();
  //   fd.append("file", blob, filename);
  //   return fd
  // }

  // Helper function to resize artboard
  function resize() {
    var iframe = document.getElementById("artframe");
    console.log(iframe.contentWindow.location.href)
    // let canvas = iframe.contentWindow.document.getElementById('defaultCanvas0')
    let canvases = iframe.contentWindow.document.getElementsByTagName('canvas')
    if (canvases.length > 0) {
    } else {
      canvases = iframe.contentWindow.document.getElementsByTagName('svg')
    }
    let canvas = canvases[0]
    // console.log(canvases)
    
    let board = document.getElementById("board")
    let button = document.getElementById("generate")
    let container = document.getElementById("container")

    let margin = 12
    let ww = container.clientWidth - margin*2
    let wh = window.innerHeight - 250
    let bw = board.clientWidth
    let bh = board.clientHeight
    let cw = canvas.clientWidth
    let ch = canvas.clientHeight

    let predicted_cw = cw/ch * bw.toFixed(2)
    // console.log(predicted_cw, ww, wh)


    if (predicted_cw - ww > 1) {
      // console.log("true")
      canvas.setAttribute("style",`width: ${ww}px`);
      board.setAttribute("style",`height: ${canvas.clientHeight}px`);
      board.style.width = `${canvas.clientWidth}px`;
      button.setAttribute("style",`width: ${canvas.clientWidth}px`);
    } else {    
      canvas.setAttribute("style",`height: ${wh}px`);
      button.setAttribute("style",`width: ${canvas.clientWidth}px`);
      // console.log(canvas.clientWidth)
      board.setAttribute("style",`width: ${canvas.clientWidth}px`);
      board.style.height = `${canvas.clientHeight}px`;
      
    }
  }

  // Helper function to wait for iframe to render
  function waitForCanvas(){
    var iframe = document.getElementById("artframe");
    console.log(iframe.contentWindow.location.href)
    var checkExist = setInterval(function() {
      
        // if (iframe.contentWindow.document.querySelectorAll('#defaultCanvas0').length) {
        if (iframe.contentWindow.document.querySelectorAll('canvas').length) {
          clearInterval(checkExist);
          // setLoad(-1)
          setCanvas(1)
          resize()
          // console.log(true)
        } 
        else if (iframe.contentWindow.document.querySelectorAll('svg').length) {
          clearInterval(checkExist);
          // setLoad(-1)
          setCanvas(1)
          resize()
        } 
    }, 100);
    console.log(walletAddress)
    enableButton()
    // if (walletAddress != "") {
    //   document.getElementById("mint").removeAttribute("disabled")
    // }
  }

  // Resize art board when window is resized
  function resizeEvent() {
    window.addEventListener('resize', function(event) {
      event.stopPropagation();
      if (canvas == 1) {
        resize()
      }
    }, true);
  }

  // Generate seed to generate art
  function generateSeed() {
    let seed = Math.floor(Math.random() * 1e13);
    let seedString = ethers.utils.hexlify(seed);
    return ethers.utils.keccak256(seedString);
  }

  // Compose the HTML for p5 execution
  function composeImgScript(seed, filename) {
    return (
      `<html>
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js"></script>
        </head>
        <body style="margin: 0"></body>
        <script>
          let tokenData = {
            hash: "${seed}",
            hashes: ["${seed}"],
          };
        </script>
        <script src="algorithms/${filename}"></script>
      </html>`
    )
  }

  // Create the iframe to run p5 script
  function composeIframe(imgScript) {
    let container = document.getElementById('board');
    // let windowHeight = container.clientHeight
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
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        onLoad={waitForCanvas}
    >
    </iframe>
    )
  }

  // Generate new art
  function generate() {
    if (load == 0) {
      let algorithm = getAlgo(algo)

      let seed = generateSeed()
      setSeed(seed)
  
      let imgScript = composeImgScript(seed, algorithm)
      let iFrame = composeIframe(imgScript)
      setImgScript(iFrame)
      // waitForCanvas()
    }
  }

  //Return app layout
  return (
    <div id="top" style={{backgroundColor: "#282c34"}}>
        <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
          {/* <div class="columns" id="test">
            <div class="column">
              <h1><b>[ ART-MINTER ]</b></h1>
            </div>
            <div class="column">
              <div class="buttons">
                <a class="button is-light is-dark" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                  "Connected: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : ("Connect Metamask \u00A0"
                )}
                {walletAddress.length > 0 ? ("") : (<img id='meta' src={meta}/>)}
                </a>
              </div>
            </div>
            <div class="dropdown column" id="algo">
              <div class="dropdown-trigger">
                <button class="button is-dark" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>{algo}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  {algos.map(function (x, i) { 
                    return (
                      <a class="dropdown-item">
                        {x}
                      </a>
                    )
                  })}
      
                </div>
              </div>
            </div>
          </div>
           */}
          <div class="navbar-brand">
            <a class="navbar-item" href="">
              <h1><b>[ ART-MINTER ]</b></h1>
            </a>

            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light is-dark" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                  "Connected: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : ("Connect Metamask \u00A0"
                )}
                {walletAddress.length > 0 ? ("") : (<img id='meta' src={meta}/>)}
                </a>
              </div>
            </div>

            <div class="dropdown navbar-item" id="algo">
              <div class="dropdown-trigger">
                <button class="button is-dark" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>{algo}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  {algos.map(function (x, i) { 
                    return (
                      <a class="dropdown-item">
                        {x}
                      </a>
                    )
                  })}
      
                </div>
              </div>
            </div>
          </div>
        
        </nav>
        {/* <div class="columns" id="test">
            <div class="column" id="title">
              <h1><b>[ ART-MINTER ]</b></h1>
            </div>
            <div class="column">
              <div class="buttons">
                <a class="button is-light is-dark" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                  "Connected: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : ("Connect Metamask \u00A0"
                )}
                {walletAddress.length > 0 ? ("") : (<img id='meta' src={meta}/>)}
                </a>
              </div>
            </div>
            
            
        </div> */}
        <div class="columns">
          <div class="column" id="text">
            <div class="content">
              <h1>Mint "Art".</h1>
              
              <p>How it works:</p>
              <ol>
                <li>Select algorithm</li>
                <li>Generate the art</li>
                <li>Mint if you find something you like</li>
              </ol>
            </div>
            <div class="buttons">
              <button id="mint" class="button is-info is-rounded" onClick={save}>
                Mint (0.05 ETH)
              </button>
            </div>
            <div class="notification" style={{display: "none"}} id="notif">
              <button class="delete" onClick={delNotif}></button>
              {message}
            </div>
          </div>
          <div class="column is-two-thirds" id="container">
            <div id="board" class="art">
              {/* <a class="button is-loading" id="loader" disabled style={{zIndex:load}}>
              </a> */}
              <img src="initial2.gif" id="init" style={{zIndex:load}}/>
              {imgScript}
            </div>
            <div>
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