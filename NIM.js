const aNimb = '<img src="nimb.png" alt="nimb" style="width:40px;height:40px;">';

let currentGame = 0;

setMessage("");

document.getElementById("okIntro").onclick = function() {
  fade(document.getElementById("introScreen"));
};

document.getElementById("okSetup").onclick = function() {
  let nimbCount = document.getElementById("nimbNumberInput").value;
  if (Number(nimbCount) && Number(nimbCount) > 11 && Number(nimbCount) < 46) {
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
    let gD1 = document.createElement("div");
    let gD2 = document.createElement("div");
    let gD3 = document.createElement("div");
    gD1.id = "gD1";
    gD2.id = "gD2";
    gD3.id = "gD3";
    gD1.className = "gridDiv";
    gD2.className = "gridDiv";
    gD3.className = "gridDiv";
    document.getElementById("nimStack").appendChild(gD1);
    document.getElementById("nimStack").appendChild(gD2);
    document.getElementById("nimStack").appendChild(gD3);
    document.getElementById("nimbCounter").innerHTML = this.nimbs;
    document.getElementById("counterBox").style.color = "white";
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
      document.getElementById("nimbCounter").innerHTML = this.nimbs;
      if (this.nimbs == 0) {
        setMessage("Player " + (this.turn + 1) + " Wins!");
        this.status = "won";
        terminateGame();
        flashButton(document.getElementById("NIM"));
      }
    } else {
      setMessage("You can't take more than three nimbs!");
      flashButton(document.getElementById("theRules"));
      setTimeout(() => {currentGame.resetMessage()},800);

    }
  }

  endTurn() {
    if (this.takenThisTurn == 0) {
      setMessage("You must take at least one nimb!");
      flashButton(document.getElementById("theRules"));
      setTimeout(() => {currentGame.resetMessage()},800);
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
  document.getElementById("counterBox").style.color = "black";
  document.getElementById("nimbCounter").innerHTML = "";
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
