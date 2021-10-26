import 'bulma/css/bulma.min.css';
import React from 'react';
import p5 from 'p5';
import './App.css';
import { sketch } from './algorithms/shapes';

const App = () => {
      React.useEffect(() => {
        // draw()
        reDraw()
      });

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      function reDraw() {
        var canvas = document.querySelector('#shapes');
        canvas.addEventListener('click', function(event) {
          event.stopPropagation();
          draw()
        });
      }

      async function draw() {
        await sleep(1000)
        new p5(sketch,'shapes');
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
                    <a class="button is-light">
                      Log in
                    </a>
                  </div>
                </div>

                <div class="navbar-item">
                  <div class="select">
                    <select>
                      <option>Algorithm</option>
                      <option>Chromie Squiggle</option>
                    </select>
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
                  <a class="button">
                    Mint
                  </a>
                  
                </div>
                <div class="column">
                  <div id="shapes" class="art">
                    {/* <a class="button is-loading" id="clickable">
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
      )
  }
  
export default App;