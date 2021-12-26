var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var gameStarted = false;
var level = 1;
var i = 0;

//prevent users from clicking on buttons before the game starts
//and getting a game over
$(".btn").prop("disabled", true);

//when users press any key, they start game
//enables buttons and changes title
$(document).keypress(function () {
  if (!gameStarted) {
    $("#level-title").text("Level " + level);
    $(".btn").prop("disabled", false);
    nextSequence();
    gameStarted = true;
  }
});

//button effects; what happens when a user click on button
$(".btn").click(function () {
  var userChosenColour = this.id;
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userChosenColour, i);
  i++;
});

function nextSequence() {
  $(".btn").prop("disabled", true);
  i = 0;
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);
  //console.log(gamePattern);
  $("#level-title").text("Level " + level);

  playButtons().then(function () {
    $(".btn").prop("disabled", false);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playButtons() {
  var delayInMilliseconds = 500;
  for (var itr = 0; itr < gamePattern.length; itr++) {
    $("#" + gamePattern[itr])
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playSound(gamePattern[itr]);
    await sleep(delayInMilliseconds);
  }
}

// plays Sound for button
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// animates the button when Pressed
function animatePress(currentColour) {
  $(".btn." + currentColour).addClass("pressed");
  var delayInMilliseconds = 100;
  setTimeout(function () {
    $(".btn." + currentColour).removeClass("pressed");
  }, delayInMilliseconds);
}

//compares users input to the gamePattern array and checks for equality
function checkAnswer(currentColour, currentNumber) {
  if (currentColour === gamePattern[currentNumber]) {
    if (currentNumber === gamePattern.length - 1) {
      //prevent users from overclicking
      $(".btn").prop("disabled", true);
      level++;
      var delayInMilliseconds = 1000;
      setTimeout(function () {
        $(".btn").prop("disabled", false);
        nextSequence();
      }, delayInMilliseconds);
    }
  } else {
    $("#level-title").text("Game Over, Press Any Key to Restart");
    $("body").addClass("game-over");
    $(".btn").prop("disabled", true);
    playSound("wrong");
    var delayInMilliseconds = 200;
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, delayInMilliseconds);
    startOver();
  }
}

//resets game to the beginning
function startOver() {
  level = 1;
  gamePattern = [];
  gameStarted = false;
}
