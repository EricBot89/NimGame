const aNimb = '<img src="nimb.png" alt="nimb" style="width:20px;height:20px;">';

let currentGame = 0;

setMessage("");

document.getElementById("okIntro").onclick = function() {
  fade(document.getElementById("introScreen"));
};

document.getElementById("okSetup").onclick = function() {
  let nimbCount = document.getElementById("nimbNumberInput").value;
  if (Number(nimbCount) && Number(nimbCount) > 11 && Number(nimbCount) < 161) {
    if (document.getElementById("computer").checked) {
      currentGame = new NimGame(nimbCount, "Human", "Computer");
      currentGame.resetMessage();
      fade(document.getElementById("setupScreen"));
    }
    if (document.getElementById("human").checked) {
      currentGame = new NimGame(nimbCount, "Human", "Human");
      currentGame.resetMessage();
      fade(document.getElementById("setupScreen"));
    }
    if (document.getElementById("cpuOnly").checked) {
      currentGame = new NimGame(nimbCount, "Computer", "Computer");
      currentGame.resetMessage();
      currentGame.executeComputerTurn();
      fade(document.getElementById("setupScreen"));
    }
  } else {
    document.getElementById("nimbNumberInput").value = "";
  }
};

document.getElementById("takeButton").onclick = function() {
  currentGame.takeNimb();
};

document.getElementById("doneButton").onclick = function() {
  currentGame.endTurn();
};

document.getElementById("NIM").onclick = function() {
  terminateGame();

  resetGame();
};

document.getElementById("theRules").onclick = function() {
  resetRules();
};

// ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗██╗      █████╗ ███████╗███████╗
//██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔════╝██║     ██╔══██╗██╔════╝██╔════╝
//██║  ███╗███████║██╔████╔██║█████╗      ██║     ██║     ███████║███████╗███████╗
//██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║     ██║     ██╔══██║╚════██║╚════██║
//╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╗███████╗██║  ██║███████║███████║
// ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝

class NimGame {
  constructor(nimbs, player1, player2) {
    this.nimbs = nimbs;
    this.turn = 0;
    this.player0 = player1;
    this.player1 = player2;
    this.takenThisTurn = 0;
    this.status = "playing";
    for (let i = 0; i < this.nimbs; i++) {
      let newNimb = document.createElement("div");
      newNimb.id = "n" + i;
      newNimb.className = "nimb";
      newNimb.innerHTML = aNimb;
      document.getElementById("nimStack").appendChild(newNimb);
    }
  }

  resetMessage() {
    setMessage(this["player" + this.turn] + " player " + (this.turn + 1));
  }

  takeNimb() {
    if (this.takenThisTurn < 3 && this.status == "playing") {
      fade(document.getElementById("n" + String(this.nimbs - 1)));
      this.nimbs--;
      this.takenThisTurn++;
      if (this.nimbs == 0) {
        setMessage("Player " + (this.turn + 1) + " Wins!");
        this.status = "won";
        terminateGame();
        flashButton(document.getElementById("NIM"));
      }
    } else {
      setMessage("You can't take more than three nimbs!");
      flashButton(document.getElementById("theRules"));
    }
  }

  endTurn() {
    if (this.takenThisTurn == 0) {
      setMessage("You must take at least one nimb!");
      flashButton(document.getElementById("theRules"));
    } else {
      this.turn = (this.turn + 1) % 2;
      this.resetMessage();
      this.takenThisTurn = 0;
      if (this["player" + this.turn] == "Computer") {
        this.executeComputerTurn();
      }
    }
  }

  executeComputerTurn() {
    let target = this.nimbs % 4;
    if (target == 0) {
      target = Math.ceil(3 * Math.random());
    }
    for (let k = 0; k < target; k++) {
      this.takeNimb();
    }
    if (this.status == "playing") {
      setTimeout(() => {
        currentGame.endTurn();
      }, 1000);
    }
  }
}

//███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
//██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
//█████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
//██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
//██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
//╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

function setMessage(message) {
  document.getElementById("output").innerHTML = message;
}

function resetGame() {
  fadeIn(document.getElementById("setupScreen"));
}

function resetRules() {

	fadeIn(document.getElementById("introScreen"));

}



function fade(element) {
  let opacity = 1;

  let timer = setInterval(function() {
    if (opacity <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }

    element.style.opacity = opacity;

    element.style.filter = "alpha(opacity=" + opacity * 100 + ")";

    opacity -= opacity * 0.15;
  }, 25);
}


function fadeIn(element) {
  let opacity = .1;

  element.style.display = "block";

  let timer = setInterval(function() {
    if (opacity >= .8) {
      clearInterval(timer);
		opacity = 1;
		element.style.opacity = opacity;
		element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }

    element.style.opacity = opacity;

    element.style.filter = "alpha(opacity=" + opacity * 100 + ")";

    opacity += opacity * 0.3;
  }, 25);
}

function terminateGame() {
  currentGame = 0;
  while (document.getElementById("nimStack").firstChild) {
    document
      .getElementById("nimStack")
      .removeChild(document.getElementById("nimStack").firstChild);
  }
}

function flashButton(button) {
  let inverted = 0.1;

  let timer = setInterval(function() {
    if (inverted >= 0.2) {
      inverted = 0;
      button.style.filter = "invert(" + inverted * 100 + "%)";
      clearInterval(timer);
    }

    button.style.filter = "invert(" + inverted * 100 + "%)";

    inverted += inverted * 0.065;
  }, 15);
}