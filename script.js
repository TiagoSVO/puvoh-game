// document.addEventListener("DOMContentLoaded", function() {
//   alert("Olá!");
// });
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {

        var PuvohGame = {

          options: {
            gameField: null,
            pointsScore: null,
            currentBug: null,
            lastBugId: 0,
            points: 0,
            inicialTimeInSeconds: 60,
            periodGenerateInSecs: 7,
            endGame: false,
            bugs: [],
            timeouts: []
          },

          getGameField: function() {
            var gameField = document.getElementById('p-game-field');
            return gameField
          },

          init: function(options) {
            console.log('Initializing...');
            this.options.gameField = this.getGameField();
            this.options.pointsScore = this.getPointsScore();
            this.printPoint();
            this.initEvents();
          },

          printPoint: function() {
            this.options.pointsScore.innerHTML = this.options.points.toString();
          },

          getPointsScore: function() {
            var scoreTag = document.getElementById('score');
            return scoreTag;
          },

          initEvents: function() {
            this.startGame();
          },

          startGame: function(e) {
            console.log('Start Game...');
            this.options.endGame = false;
            this.options.currentGame = setInterval(this.generateBugs.bind(this), 1000);
            this.startClockCountDown();
          },

          getRandomPositionInt: function (min, max) {
            var min = Math.ceil(min);
            var max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
          },

          generateBugs: function () {
            var _this = this;
            if (!_this.options.endGame) {
              var generate = setTimeout(function() {
                var bug = _this.createBug();
                _this.addBugInGameField(bug);
                var genBugTime = setTimeout(function() {
                  if(bug.parentNode) {
                    _this.removeBug(bug);
                  }
                }, _this.getRandomPositionInt(1, _this.options.periodGenerateInSecs)*1000)
              }, _this.getRandomPositionInt(1, _this.options.periodGenerateInSecs)*1000)
              _this.options.timeouts.push(generate)
            }
          },

          createBug: function() {
            var bugDiv = document.createElement("div");
            var maxAreaFieldGameWidth = this.options.gameField.offsetWidth
            var maxAreaFieldGameHeight = this.options.gameField.offsetHeight
            var positionTop = this.getRandomPositionInt(10, (maxAreaFieldGameHeight - 35));
            var positionLeft = this.getRandomPositionInt(10, (maxAreaFieldGameWidth - 35));
            bugDiv.classList.add('p-bug');
            bugDiv.setAttribute('style', 'top:' + positionTop + 'px; left:' + positionLeft + 'px;');
            bugDiv.setAttribute('id', 'bugId-' + this.setBugId());
            bugDiv.addEventListener('click', this.eventBitBug.bind(this), false)
            this.options.bugs.push(bugDiv);
            return bugDiv;
          },

          addBugInGameField: function(bug) {
            return this.options.gameField.appendChild(bug);
          },

          setBugId: function() {
            return this.options.lastBugId = this.options.lastBugId + 1;
          },

          eventBitBug: function(e) {
            var currentBug = e.currentTarget;
            this.bitBug(currentBug);
          },

          bitBug: function(bug) {
            this.bugSound();
            this.removeBug(bug);
            this.options.points = this.options.points + 1;
            this.printPoint();
          },

          bugSound: function() {
            var audioBug = new Audio("puvoh.mp4");
            audioBug.play;
          },

          removeBug: function(currentBug) {
            currentBug.removeEventListener('click', this.eventBitBug.bind(this), false);
            var itemId = this.options.bugs.indexOf(currentBug);
            this.options.bugs.splice(itemId, 1);
            this.options.gameField.removeChild(currentBug);
          },

          countdownClock: function(getTimeInSeconds) {
            var getHour = Math.floor((getTimeInSeconds/3600)%24);
            var getMin = Math.floor((getTimeInSeconds/60)%60);
            var getSec = Math.floor(getTimeInSeconds%60);

            getHour = this.formatZeroTime(getHour);
            getMin = this.formatZeroTime(getMin);
            getSec = this.formatZeroTime(getSec);

            var formattedTime = `${getHour}:${getMin}:${getSec}`

            return formattedTime
          },

          formatZeroTime: function(time) {
            if(time < 10) {
              time = '0'+time
            }
            return time
          },

          startClockCountDown: function() {
            var _this = this
            var timeCounter = this.options.inicialTimeInSeconds
            var startClock = setInterval(function() {
              _this.displayCountdownClock(_this.countdownClock(timeCounter))
              if(timeCounter > 0) {
                  timeCounter = timeCounter -1
              } else {
                clearInterval(startClock)
                _this.endGame()
              }
            }, 1000)
          },

          displayCountdownClock: function(clockTime) {
            var clockTag = document.getElementById('countdownClock');
            clockTag.innerHTML = clockTime;
          },

          endGame: function() {
            var _this = this
            var clockTag = document.getElementById('countdownClock');
            var bugsInFieldGame = [..._this.options.gameField.getElementsByClassName('p-bug')];
            clearInterval(_this.options.currentGame)
            bugsInFieldGame.forEach(function(bug){
              _this.options.gameField.removeChild(bug);
            })
            _this.options.timeouts.forEach(function(timeout) {
              //TODO: remover os bugs remanescentes após o final do jogo;
              clearTimeout(timeout)
            })
            _this.options.endGame = true;
            clockTag.innerHTML = "End Game";
          }

        }

        PuvohGame.init();

    }
}
