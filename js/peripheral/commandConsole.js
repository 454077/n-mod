setTimeout(() => {
  fileLoads.isCommandConsoleJS = true; //for file handling in fileTester.js
}, 10);

const cmdConsole = {
  CD_cycle: 200, //on starting the game, enter cooldown for a short time.
  CD_length: 60, //cooldown to reduce spamming
  history: [], //track history
  historyIDX: 0,	//allow cycling through history
  isHistoryInputFocused: false,
  params: [], //parameters for commands
  cmdIDX: 0,
  cachedCmd: "",
  requestCmd(string) {
    simulation.closeChatWindow();
    if (string.replace(/\s/g, "") != "") {
      if (cmdConsole.history[cmdConsole.history.length - 1] !== string) {
        document.getElementById("history").max = cmdConsole.history.length + 2
        cmdConsole.history.push(string)
      }
      document.getElementById('chat-input').value = ``
      cmdConsole.historyIDX = -1
      if (cmdConsole.CD_cycle < m.cycle) {
        cmdConsole.CD_cycle = m.cycle + cmdConsole.CD_length //enter cooldown
        cmdConsole.runCmd(string)
      } else {
        setTimeout(() => {
          simulation.lastLogTime = 0
          simulation.inGameConsole(`<strong><span style="color:red;">WOAH THERE, </span> speedster!</strong>
        <br>We notice you've been quite active in the console lately.
        <br>Please slow down your command logging or you might break our game!`, 420); //show for 7 seconds
        }, 100)
      }
    }
  },
  runCmd(string) {
    let isCommand = (string[0] === "/"), oldHTML = document.getElementById('text-log').innerHTML
    if (isCommand) {
      string = string.sanitize() //clean up whitespacing before processing. [String].sanitize is defined in /lib/prototypes.js
      string = string.slice(1) //now that we know a command was inputted, we won't need the slash at the beginning any more
      cmdConsole.params = string.split(/\s+/)
      let what = cmdConsole.params[0], item = cmdConsole.cmdList[what], syntaxCheck = "" //the command to be executed
      if (item) { //run commands here
        try {
          string = string.slice(what.length + 1) //remove the command name from its input
          try {
            syntaxCheck = item.checkSyntax(string)
          } catch (e) {
            syntaxCheck = [false, ""]
          }
          if (syntaxCheck[0]) { //if syntax is correct
            item.effect(string);
          } else {
            try {
              syntaxCheck = item.checkSyntax(string)[1]
            } catch (e) {
              syntaxCheck = "Syntax logic is not defined"
            }
            throw new SyntaxError(syntaxCheck);
          }
        } catch (err) { //if an error occurs during execution
          document.getElementById('text-log').innerHTML = oldHTML //revert inGameConsole, in case logging occurred during execution
          simulation.lastLogTime = 0 //clear console
          setTimeout(() => {
            simulation.inGameConsole(`<strong style='color:red;'>ERROR:</strong> ${err.name}.
          <u>:${err.message.replaceAll("\n", "<br>")}`, 300)
          }, 100)
        }
      } else { //unknown command. Throw error
        document.getElementById('text-log').innerHTML = oldHTML //revert inGameConsole, in case logging occurred during execution
        simulation.lastLogTime = 0 //clear console
        setTimeout(() => {
          simulation.inGameConsole(`<strong style='color:red;'>ERROR:</strong> ReferenceError.
          <u>:<strong class='color-var'>${what}</strong> is not a known command`, 300)
        }, 100)
      }
    } else {
      setTimeout(() => {
        simulation.inGameConsole(`<span class='color-var'>m</span>.chat( \`${string.replaceAll("\n", "<br>")}\` )`)
      }, 100)
    }
  },
  isUpDnSwitch: false,
  switchCmd(num, setTo = false) {
    let hist = cmdConsole.history, chatInput = document.getElementById('chat-input'), historyInput = document.getElementById("history")
    if (cmdConsole.cachedCmd.replace(/\s/g, "") != "" && cmdConsole.cachedCmd !== hist[hist.length - 1]) hist.push(cmdConsole.cachedCmd);
    if (setTo) {
      cmdConsole.historyIDX = num
    } else {
      cmdConsole.historyIDX += num
    }
    if (cmdConsole.historyIDX < 0) cmdConsole.historyIDX = hist.length + 1
    cmdConsole.historyIDX = (cmdConsole.historyIDX - 1) % hist.length
    chatInput.value = hist[cmdConsole.historyIDX % hist.length] || ""
    historyInput.value = (cmdConsole.historyIDX + 1) % hist.length
  },
  cmdList: {
    run: {
      checkSyntax(input) {
        let pos = [input.indexOf("{"), input.lastIndexOf("}")];
        if (input.replace(/\s/g, "").startsWith("function(){")) {
          let trailing = input.slice(pos[1] + 1)
          if (trailing.replace(/\s/g, "") === "" || trailing.replace(/\s/g, "").startsWith("//")) {
            let invalidPhrases = ["document", "EventListener", "innerHTML", "outerHTML", "getElementsBy", "getElementBy", "prototype", "createElement",
              "appendChild", "removeChild", "eval", "runTemp", "console.", "const "], isInvalid = false, regExpTest = /cmdConsole(?!\.history)/;
            //this command should NOT access or alter HTML DOM, nor should it alter JS prototypes or request other commands, for security reasons
            isInvalid = regExpTest.test(input);
            for (let i = 0, len = invalidPhrases.length; i < len; i++) {
              let item = invalidPhrases[i]
              if (input.includes(item)) isInvalid = true
            }
            if (isInvalid) {
              return [false, `<strong class='color-var'>/run</strong> should NOT access any of the following:
              <ul>
              	<li>HTML DOM</li>
                <li>JS Prototypes</li>
                <li>Command Execution</li>
                <li>Event Listeners</li>
              </ul>`]
            } else {
              return [true, ""];
            }
          } else {
            return [false, `at "/run function... ..}&nbsp; <strong>&gt;&gt;&gt;<span style='color:red';>${trailing}</span>&lt;&lt;&lt; here</strong>`]
          }
        } else {
          let fault = input.substring(0, (pos[0] > -1 ? pos[0] + 1 : input.length - 1));
          return [false, `at "/run &nbsp; <strong>&gt;&gt;&gt;<span style='color:red';>${fault}</span>&lt;&lt;&lt; here</strong>`]
        }
      },
      effect(input) {
        let pos = [input.indexOf("{"), input.lastIndexOf("}")];
        let runTemp = () => {
          eval(input.substring(pos[0] + 1, pos[1]))
        };
        /*
        Executing JS code from a string is an EXTREME SECURITY RISK;
        With eval(), malicious code can be executed without your consent,
        and third-party code can see the scope of your application, which can possibly lead to attacks.
            -warning from W3schools.com

        I have put a trust system in place, so, HANDLE eval() WITH CARE HERE, AND DO NOT USE IT IN YOUR WEBSITES!
            -R3d5t0n3_GUY
      */
        runTemp();
      },
      description: `Allows the user to run JavaScript without needing to open their Dev Tools.
      <br><strong>SYNTAX:</strong> /run function() {<br><em>//input code to run here</em><br>}
      `
    },
    help: {
      checkSyntax(input){
        cmdConsole.params = input.split(/\s+/)
        if (cmdConsole.params.length < 2) {
          return [true, ""]
        } else {
          return [false, "<strong class='color-var'>help</strong> can have no more than one parameter"]
        }
      },
      effect(input) {
        if (input.replace(/\s/g, "") === "") {
          let result = "<strong><u>List of available commands:</u></strong><ul>", list = Object.keys(cmdConsole.cmdList);
          list.forEach(item => {
            result += `<li><em class='color-var help' onclick='cmdConsole.requestCmd("/help ${item}")'>${item}</em></li>`
          });
          result += "</ul><br>Click each of the command names above to view their info (must be in pause menu)"
          simulation.inGameConsole(result, 600)
        } else {
          let item = cmdConsole.cmdList[input] || cmdConsole.cmdList.help
          if (item) {
            let helpText = (item.descriptionFunction ? item.descriptionFunction() : item.description)
            simulation.lastLogTime = 0
            simulation.inGameConsole(helpText, 600)
          } else {
            throw new ReferenceError(`<strong class='color-var'>${input}</strong> is not a known command`)
          }
        }
      },
      description: `Explains the functionality and syntax of a given console command.
      <br><strong>SYNTAX:</strong> /help <em>[commandName]</em>`
    },
  } //will expand the list
}