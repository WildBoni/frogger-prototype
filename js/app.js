// populate two arrays for x and y values based on number and sizes of tiles
var XVALUE = [0, 101, 202, 303, 404];
var YVALUE = [68, 151, 234, 317, 400];
// The score that player needs to win
var victoryScore = 3000;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -50;
    // Selecting coordinates from YVALUE array, but only for "road" tiles
    this.y = YVALUE[Math.floor(Math.random() * 3)];
    // Setting enemy speed from a range of values
    this.speed = ((Math.floor(Math.random() * (8 - 4 + 1)) + 4) * 40) + 60;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    // When enemy runs off screen, it reappears on the left side
    if (this.x > 600) {
        this.x = -50;
        this.y = YVALUE[Math.floor(Math.random() * 3)];
    this.speed = ((Math.floor(Math.random() * (8 - 4 + 1)) + 4) * 40) + 60;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create 3 enemies
var enemy = new Enemy();
var enemy1 = new Enemy();
var enemy2 = new Enemy();
// Fourth and fifth enemy will appear later in the game
var enemy3;
var enemy4;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    // Let's set some counters to keep track of points earned and lives left
    this.score = 0;
    this.lifeCounter = 3;
};

Player.prototype.update = function() {
    // Player should definitely avoid those ugly enemies!
    this.checkCollisions();
};

Player.prototype.checkCollisions = function() {
    if (this.y < 68) {
        // Player is drowning in water, life lost!
        this.reset();
    } else if (this.y >= 60 && this.y <= 240) {
        // Player is crossing the road, time to check collisions
        // Let's check enemy position
        allEnemies.forEach(function(enemy) {
            // Is the bug running on the same row as the player?
            if (enemy.y == this.y) {
                // Is the bug catching the player (in a 30px range)?
                if (enemy.x >= this.x - 30 && enemy.x <= this.x + 30) {
                    this.reset();
                }
            }
        }, this);

        // Player must collect gems, so let's check if they're on the same row
        if (gem.y == this.y) {
            // Is player collecting a gem?
            if (gem.x == this.x) {
                // Gem disappears and a new one is created
                gem.reset();
                // Player earns points
                this.score = this.score+100;
                // After a certain amount of points, a new enemy appears
                if(this.score == 1000) {
                    enemy3 = new Enemy();
                    allEnemies.push(enemy3);
                }
                // Player can get a bonus extra heart
                if(this.score == 1800) {
                    // To mix things up, bonus will appear after a random amount of time
                    setTimeout(function(){heart.reset();},
                    (Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000));
                }
                // Player is getting close to victory: let's create another bug!
                if(this.score == 2500) {
                    enemy4 = new Enemy();
                    allEnemies.push(enemy4);
                }
            }
        }

        // collecting heart to earn 1up
        if (heart.y == this.y) {
            if (heart.x == this.x) {
                // No more hearts...
                heart.disappear();
                // ...but Player earns one life!
                life.increase();
                this.lifeCounter += 1;
            }
        }
    }
};

// When player dies, he reappears at the starting point...
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 400;
    // ... and loses one life
    this.lifeCounter = this.lifeCounter-1;
    life.decrease();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Moving player character
Player.prototype.handleInput = function(key){
    switch(key) {
        case 'up':
            this.y = this.y - 83;
        break;
        case 'down':
            if(this.y < 400) {
                this.y = this.y + 83;
            } else {
                this.y = this.y;
            }
        break;
        case 'left':
            if(this.x > 0) {
                this.x = this.x - 101;
            } else {
                this.x = this.x;
            }
        break;
        case 'right':
            if(this.x < 400) {
                this.x = this.x + 101;
            } else {
                this.x = this.x;
            }
        break;
    }
};

//Creating gems
var Gem = function(){
    this.sprite = 'images/Gem Green.png';
    // Gem coordinates are random
    this.x = XVALUE[Math.floor(Math.random() * 5)];
    this.y = YVALUE[Math.floor(Math.random() * 3)];
};

Gem.prototype.update = function(dt) {
};

Gem.prototype.reset = function() {
    this.x = XVALUE[Math.floor(Math.random() * 5)];
    this.y = YVALUE[Math.floor(Math.random() * 3)];
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Creating heart bonus
var Heart = function(){
    this.sprite = 'images/Heart.png';
    // Bonus should not appear right from the start, so we put it outside canvas
    this.x = -100;
    this.y = -100;
};

Heart.prototype.update = function(dt) {
};

// Let's make heart randomly appear inside canvas
Heart.prototype.reset = function() {
    this.x = XVALUE[Math.floor(Math.random() * 5)];
    this.y = YVALUE[Math.floor(Math.random() * 3)];
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// No more bonus!
Heart.prototype.disappear = function() {
  this.x = -100;
  this.y = -100;
};

// Player has 3 lives, let's show them as icons!
var Life = function() {
    this.sprite = 'images/Life.png';
    this.life = 3;
};

Life.prototype.render = function() {
    var x = 0;
    // Render a heart icon for each player's life
    for (var i = 0; i < this.life; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, 540);
        x = x + 30;
    }
  // If player loses his last life, the game is over...
    if (this.life === 0) {
        // Let's cover the canvas with a dark rectangle
        ctx.beginPath();
        ctx.rect(0, 0, 505, 606);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.lineWidth = 30;
        ctx.strokeStyle = '#4685b3';
        ctx.stroke();
        // Now we can show the "game over" text and the final score
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("GAME OVER!",85,200);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("Your score: " + player.score,140,280);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        if (player.score > 2000) {
            ctx.fillText("Wow, that's a great score!",140,340);
        } else {
            ctx.fillText("You can do much better! Try again",96, 340);
        }
    }
};

// Player is losing one life!
Life.prototype.decrease = function() {
    if (this.life > 0) {
        this.life = this.life - 1;
    }
};

// Collecting heart adds one precious life
Life.prototype.increase = function() {
    if (this.life > 0) {
        this.life = this.life + 1;
    }
};

// This function defines the victory screen.
var victory = function(){
    ctx.beginPath();
    ctx.rect(0, 0, 505, 606);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#4685b3';
    ctx.stroke();
    ctx.font = '34px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("YOU SAVED THE EARTH!",45,200);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [enemy, enemy1, enemy2];
var player = new Player();
var gem = new Gem();
var heart = new Heart();
var life = new Life();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
