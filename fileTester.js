const jsSrcs = [
  {
    name: "Matter",
    src: 'lib/matter.min.js'
  },
  {
    name: "Prototypes",
    src: 'lib/prototypes.js'
  },
  {
    name: "Simulation",
    src: "js/simulation.js"
  },
  {
    name: "Player",
    src: "js/entities/player.js"
  },
  {
    name: "PowerUp",
    src: "js/entities/powerup.js"
  },
  {
    name: "Tech",
    src: "js/tech.js"
  },
  {
    name: "Bullet",
    src: "js/entities/bullet.js"
  },
  {
    name: "Mob",
    src: "js/entities/mob.js"
  },
  {
    name: "Spawn",
    src: "js/entities/spawn.js"
  },
  {
    name: "Level Handler",
    src: "js/level/levelHandler.js"
  },
  {
    name: "Level List",
    src: "js/level/levelList.js"
  },
  /*
  {
    name: "Main Levels",
    src: "js/level/mainLevels.js"
  },
  {
    name: "Training Levels",
    src: "js/level/trainingLevels.js"
  },
  {
    name: "Community Levels",
    src: "js/level/communityLevels.js"
  },
  {
    name: "Lore Levels",
    src: "js/level/loreLevels.js"
  },
  {
    name: "Removed Levels",
    src: "js/level/removedLevels.js"
  },
  {
    name: "Mod Levels",
    src: "js/level/modLevels.js"
  },
  */
  {
    name: "Lore",
    src: "js/lore.js"
  },
  {
    name: "Engine",
    src: "js/engine.js"
  },
  {
    name: "Index",
    src: "js/index.js"
  },
  {
    name: "Script Loader",
    src: "js/peripheral/scriptLoader.js"
  },
  {
    name: "Audio Player",
    src: "js/peripheral/audioPlayer.js"
  },
  {
    name: "Command Console",
    src: "js/peripheral/commandConsole.js"
  }
];
const fileLoads = { //each of these values is (supposed to be) set to true in its respective .js file
  isMatterMinJS: false,
  isPrototypesJS: false,
  isSimulationJS: false,
  isPlayerJS: false,
  isPowerUpJS: false,
  isTechJS: false,
  isBulletJS: false,
  isMobJS: false,
  isSpawnJS: false,
  isLevelHandlerJS: false,
  isLevelListJS: false,
  /*
  isMainLevelsJS: false,
  isTrainingLevelsJS: false,
  isCommunityLevelsJS: false,
  isLoreLevelsJS: false,
  isRemovedLevelsJS: false,
  isModLevelsJS: false,
  */
  isLoreJS: false,
  isEngineJS: false,
  isIndexJS: false,
  isScriptLoaderJS: false,
  isAudioPlayer: false,
  isCommandConsoleJS: false
};
//const fullLevelList = {}
let startBtn = document.getElementById("start-button"), trainBtn = document.getElementById("training-button"),
  experimentBtn = document.getElementById("experiment-button"), splashStart = document.getElementById("splash"),
  infoDiv = document.getElementById("info"), communityMaps = document.getElementById("community-maps"),
  hideHUD = document.getElementById("hide-hud"), hideImages = document.getElementById("hide-images"),
  bannedLevels = document.getElementById("banned")
try {
  let errors = [], dotCount = 0, text = ""
  setTimeout(() => {
    const loadText = setInterval(() => {
      text = "loading"
      text = text.padEnd(dotCount + 7, ".")
      if (dotCount < 3) text += " "
      text = text.padEnd(10, "\u00A0")
      startBtn.innerHTML = `<text x="10" y="32" font-size="12px">${text}</text>`;
      trainBtn.innerHTML = `<text x="10" y="32">${text}</text`;
      experimentBtn.innerHTML = `<text stroke='none' fill='#333' stroke-width="2" font-size="15px",
            	sans-serif" x="10" y="32">${text}</text>`;
      document.title = `n-mod (${text})`
      dotCount = (dotCount + 1) % 4
    }, 250);
    for (let i = 0; i <= jsSrcs.length; i++) {
      if (i < jsSrcs.length) { //load each .js file
        let tag = document.createElement('script'), obj = jsSrcs[i]
        tag.src = obj.src
        tag.onerror = () => { //check for syntax errors
          errors.push(obj)
        }
        setTimeout(() => {
          document.body.append(tag);
        }, 250)
      } else {
        setTimeout(() => {
          let validities = Object.values(fileLoads)
          for (let j = 0; j < validities.length; j++) {
            if (!validities[j] && !errors.includes(jsSrcs[j])) { //for each file not properly defined, push its source url to error list
              errors.push(jsSrcs[j]);
            }
          }
          clearInterval(loadText);
          if (errors.length > 0) { //if any files are not properly defined, overwrite document with error report
            document.body.style.backgroundColor = "white";
            let text = `<h1 style="color:red"><u>ERROR LOADING THE FOLLOWING FILES:</u></h1><hr><ul>`
            errors.forEach(function (item) { //compile list of error locations
              text += `<li><a href="${item.src}">${item.name}</a></li>`
            });
            text += `</ul><hr>Please define and/or fix the files at these source locations.`
            document.body.innerHTML = text
            document.title = "n-mod: FAULTY FILES DETECTED"
            favIcon.href = 'Error.png'
          } else {
            document.title = 'n-mod'
            startBtn.innerHTML = `<text x="10" y="32">start</text>`
            trainBtn.innerHTML = `<text x="10" y="32">training</text>`
            experimentBtn.innerHTML = `<text stroke='none' fill='#333' stroke-width="2" font-size="15px",
            	sans-serif" x="10" y="32">experiment</text>`
            startBtn.style.cursor = "pointer"
            trainBtn.style.cursor = "pointer"
            experimentBtn.style.cursor = "pointer"
            splashStart.innerHTML = `
            <g class="fade-in" transform="translate(100,210) scale(34)" fill='#afafaf' stroke='none'>
        <path d="M0 0  h1  v0.2  h1.7  l0.3 0.3  v2.6  h-1  v-1.7  h-1  v1.7  h-1 z" /><!--N (fill)--> 
        <rect x="4" y="1.25" width="1" height="0.5" rx='0.03' /><!--Hyphen (fill)-->
        <path class="draw-lines" transform="translate(6,0)" d="M0 0 h1  v0.2  h1  l0.3 0.3 0.3 -0.3 1.3 0 0.3 0.3 v2.6 h-.8 v-1.8 h-0.8 v1.8 h-.8 v-1.8 h-.8 v1.8 h-1 z " stroke-width='0.0875' /><!--M (fill)-->
        <path transform="translate(11.9,0) scale(1.25)" d="M0 0  h1  l 0.7 0.7  v1  l -0.7 0.7  h-1  l -0.7 -0.7  v-1  l 0.7 -0.7 Z" /><!--O (fill)-->
        <path transform="translate(15.9,0) scale(1.25)" d="M0 0  h1  l 0.3 0.3  v-2 h0.8 v4.1 h-.8 v -0.3 l -.3 .3 h-1  l -0.7 -0.7  v-1  l 0.7 -0.7 Z" /><!--D (fill)-->
      </g>
      <g transform="translate(100,210) scale(34)" fill='none' stroke='#333' stroke-linejoin="round" stroke-linecap="round">
        <path class="draw-lines-n" d="M0 0  h1  v0.2  h1.7  l0.3 0.3  v2.6  h-1  v-1.7  h-1  v1.7  h-1 z" stroke-width='0.0875' /><!--N (outline)-->
        <rect class="draw-lines-dash" x="4" y="1.25" width="1" height="0.5" stroke-width='0.0875' rx='0.03' /><!--Hyphen (outline)-->
        <path class="draw-lines-m" transform="translate(6,0)" d="M0 0  h1  v0.2  h1  l0.3 0.3 0.3 -0.3 1.3 0 0.3 0.3 v2.6 h-.8 v-1.8 h-0.8 v1.8 h-.8 v-1.8 h-.8 v1.8 h-1 z " stroke-width='0.0875' /><!--M (trace)-->
        <path class="draw-lines-o" transform="translate(11.9,0) scale(1.25)" d="M0 0  h1  l 0.7 0.7  v1  l -0.7 0.7  h-1  l -0.7 -0.7  v-1  l 0.7 -0.7 Z" stroke-width='0.07' /><!--O (outline)-->
        <path class="draw-lines-d" transform="translate(15.9,0) scale(1.25)" d="M0 0  h1  l 0.3 0.3  v-2 h0.8 v4.1 h-.8 v -0.3 l -.3 .3 h-1  l -0.7 -0.7  v-1  l 0.7 -0.7 Z" stroke-width='0.07' /><!--D (outline)-->
      </g>
        <!-- mouse -->
        <g class="draw-lines3" transform="translate(290,430) scale(0.28)" stroke-linecap="round" stroke-linejoin="round" stroke-width="10px" stroke="#333" fill="none">
            <path class="fade-in" stroke="none" fill="#fff" d="M827,112 h30 a140,140,0,0,1,140,140 v268 a140,140,0,0,1-140,140 h-60 a140,140,0,0,1-140-140v-268 a140,140,0,0,1,140-140h60" />
            <path class="fade-in" d="M832.41,106.64 V322 H651.57 V255 c0-82,67.5-148,150-148 Z" fill="rgb(0, 200, 255)" stroke="none" />
            <path d="M827,112 h30 a140,140,0,0,1,140,140 v268 a140,140,0,0,1-140,140 h-60 a140,140,0,0,1-140-140v-268 a140,140,0,0,1,140-140h60" />
            <path d="M657 317 h340 h-170 v-25 m0 -140 v-42 s 21 -59, -5 -59 S 807 7, 807 7" />
            <ellipse fill="none" cx="827.57" cy="218.64" rx="29" ry="68" />
            <ellipse fill="#fff" class="fade-in-fast" cx="827.57" cy="218.64" rx="29" ry="68" />
        </g>

        <!-- keys -->
        <g transform="translate(195,480) scale(0.8)">
            <!-- fade in background -->
            <g fill='#fff' stroke='none' class="fade-in">
                <path d="M0 60 h60 v-60 h-60 v60" class="draw-lines-box-1" />
                <path d="M70 60 h60 v-60 h-60 v60" class="draw-lines-box-2" />
                <path d="M140 60 h60 v-60 h-60 v60" class="draw-lines-box-3" />
                <path d="M0 70 h60 v60 h-60 v-60" class="draw-lines-box-1" />
                <path d="M70 70 h60 v60 h-60 v-60" class="draw-lines-box-2" />
                <path d="M140 70 h60 v60 h-60 v-60" class="draw-lines-box-3" />
            </g>
            <g fill='none' stroke='#333' stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
                <path d="M0 60 h60 v-60 h-60 v60" class="draw-lines-box-1" />
                <!-- <rect x="0" y="0" width="60" height="60" rx="10" ry="10" class="draw-lines-box-1" /> -->
                <path d="M70 60 h60 v-60 h-60 v60" class="draw-lines-box-2" />
                <path d="M140 60 h60 v-60 h-60 v60" class="draw-lines-box-3" />
                <path d="M0 70 h60 v60 h-60 v-60" class="draw-lines-box-1" />
                <path d="M70 70 h60 v60 h-60 v-60" class="draw-lines-box-2" />
                <path d="M140 70 h60 v60 h-60 v-60" class="draw-lines-box-3" />
            </g>
            <g class="draw-lines4" text-anchor="middle" stroke='#000' fill='none' stroke-width="2" font-size="38px">
                <text x="30" y="45" id="splash-previous-gun" stroke-width="2">Q</text>
                <text x="100" y="45" id="splash-up">W</text>
                <text x="170" y="45" id="splash-next-gun" stroke-width="2">E</text>
                <text x="30" y="113" id="splash-left">A</text>
                <text x="100" y="113" id="splash-down">S</text>
                <text x="170" y="113" id="splash-right">D</text>
            </g>
        </g>
        <g class="fade-in" fill="none" stroke="#aaa" stroke-width="1">
            <path d="M 254 433.5 h-35.5 v40" />
            <path d="M 295 433.5 h36.5 v40" />
            <path d="M 274 625 v-35" />
            <path d="M 430.5 442 v50 h38" />
            <path d="M 612.5 442 v50 h-38" />
        </g>
        <g class="fade-in" stroke="none" fill="#aaa" font-size="16px">
            <text x="253" y="422">switch</text>
            <text x="257" y="438">guns</text>
            <text x="255" y="638">move</text>
            <text x="420" y="438">fire</text>
            <text x="599" y="438">field</text>
        </g>
            `//when game finishes loading, start splash screen animation

            //Object.assign(fullLevelList, mainLevels, trainingLevels, communityLevels, removedLevels, modLevels, loreLevels); //populate level list
            if (localSettings) {
              communityMaps.checked = localSettings.isCommunityMaps
              hideHUD.checked = localSettings.isHideHUD
              hideImages.checked = localSettings.isHideImages
              bannedLevels.innerHTML = localSettings.banList
            }
            document.getElementById("fps-select").addEventListener("input", () => {
              let value = document.getElementById("fps-select").value
              if (value === 'max') {
                simulation.fpsCapDefault = 999999999;
              } else {
                simulation.fpsCapDefault = Number(value)
              }
              localSettings.fpsCapDefault = value
              if (localSettings.isAllowed) localStorage.setItem("localSettings", JSON.stringify(localSettings)); //update local storage
            });

            bannedLevels.addEventListener("input", () => {
              localSettings.banList = document.getElementById("banned").value
              if (localSettings.isAllowed) localStorage.setItem("localSettings", JSON.stringify(localSettings)); //update local storage
            });

            communityMaps.addEventListener("input", () => {
              simulation.isCommunityMaps = document.getElementById("community-maps").checked
              localSettings.isCommunityMaps = simulation.isCommunityMaps
              if (localSettings.isAllowed) localStorage.setItem("localSettings", JSON.stringify(localSettings)); //update local storage
            });
            infoDiv.style.visibility = 'visible'
            startBtn.onclick = function () { tryRunning.start() }
            trainBtn.onclick = function () { tryRunning.training() }
            experimentBtn.onclick = function () { tryRunning.experiment() }
            splashStart.onclick = function () { tryRunning.start() }
            document.body.appendChild(container); //append script loader (created in scriptLoader.js)
            /*
            const todoDetails = document.getElementById("todo-list")
            todoDetails.addEventListener("toggle", function () {
              if (todoDetails.open) {
                try {
                  let todoIframe = document.getElementById("todo-file")
                  let todoContent = todoIframe.contentDocument || todoIframe.contentWindow.contentDocument;
                  const todoSpan = document.getElementById("todo-iframe")
                  todoContent = todoContent.body.textContent;
                  setTimeout(() => {
                    todoSpan.innerHTML = todoContent
                  }, 500)
                } catch (err) {
                  window.alert(err)
                }
              }
            })
            const aboutDetails = document.getElementById("about")
            aboutDetails.addEventListener("toggle", function () {
              if (aboutDetails.open) {
                try {
                  let ReadMeIframe = document.getElementById("README-file")
                  let ReadMeContent = ReadMeIframe.contentDocument || ReadMeIframe.contentWindow.contentDocument;
                  const ReadMeSpan = document.getElementById("README-span")
                  setTimeout(() => {
                    ReadMeSpan.innerHTML = ReadMeContent.innerHTML
                  }, 500)
                } catch (err) {
                  window.alert(err)
                }
              }
            })*/

          }
        }, 250 * Object.values(fileLoads).length + 100); //ensure .js files are loaded BEFORE attempting error check
      }
    }
    fileLoads.isFileTesterJS = true
  }, 50); /*protection against reload spamming occasionally throwing error report.
  Not as effective when reloading during bad internet connection or other sources of lag*/
} catch (error) {
  document.body.style.backgroundColor = "white";
  document.body.innerHTML = `<h1 style="color:red">UNCAUGHT ERROR:</h1><hr><u>${error}</u>`
  document.title = "n-mod: UNCAUGHT ERROR"
  favIcon.href = 'Error.png'
}
/*

  **************************************************************************************************
  **************************************************************************************************
  ********************************************  NOTES  *********************************************
  **************************************************************************************************
  **************************************************************************************************


  I wrote this file because previously, I kept accidentally overwriting the wrong .js file after making changes to the code.
  And when I went to test the changes made (by refreshing the index.html page in my browser, so n-gon could recognize that
  there were any changes in its code) I wouldn't know that I had saved my changes to the wrong file, until I tried running the
  game and discovered that it wouldn't run. To fix this, I decided to engineer a way for the game to attempt to load its .js
  files, see what code it's missing, and, if it detects that it's missing some of its functional code, overwrite the document
  with an error report containing the locations of the faulty/undefined files. After a couple days of testing, debugging,
  rinse and repeat, it was done. My file tester was working. Now, whenever I save changes for one file, but overwrite another
  file with them, the game will tell me that not only I have overwritten the wrong file, but also what files are faulty.

  This file will also throw the report if there are syntax errors in any of the files.

  Let me know what you think! :)

    -R3d5t0n3_GUY

*/