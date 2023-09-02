function sayHelloWorld() {
    console.log("\n");
    console.log("*** Hello World from Type Script code. ***");
    console.log("\n");
}
var canvas;
var ctx;
//   let width = window.innerWidth;
//   let height = window.innerHeight;
var width = 1366;
var height = 768;
// Game modes
var classic_mode = false;
// Difficulties unlocked
var difficulty_Score = 0;
var difficulty_ballAndPaddle = 0;
var isUnlocked_RandomRGB1 = false;
var isUnlocked_Gnome = false;
var isUnlocked_Harkinian = false;
var isUnlocked_RandomRGB2 = false;
var isUnlocked_Fox = false;
var isUnlocked_Video = false;
var isUnlocked_SecondBall = false;
var isUnlocked_Popups = false;
// Balls and Fox
var ball_radius = 15;
var ball_speedDefault = 1;
var ball_speedAddedPerma = 0;
var ball_speedAddedTemp = 0;
var ball1_x = width / 2;
var ball1_y = height / 2;
var ball1_dirX = 1;
var ball1_dirY = 1;
var ball1_speedX = 1;
var ball1_speedY = 1;
var ball2_x = width / 2;
var ball2_y = height / 2;
var ball2_dirX = 1;
var ball2_dirY = 1;
var ball2_speedX = 1;
var ball2_speedY = 1;
if (Math.floor(Math.random() * 100) % 2 === 0) {
    ball1_dirY = -1;
}
else {
    ball1_dirY = 1;
}
if (Math.floor(Math.random() * 100) % 2 === 0) {
    fox_dirY = -1;
}
else {
    fox_dirY = 1;
}
// Paddles
var paddleHeight = 10;
var paddleWidth = 75;
var paddleReduction = 0;
var paddleSpeed = 5;
var paddleP1_X = (width - paddleWidth) / 2;
var paddleP1_speedMod = 0;
var paddleP2_X = (width - paddleWidth) / 2;
var paddleP2_speedMod = 0;
var paddleP1_isAttacked = false;
var paddleP2_isAttacked = false;
var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var keyAPressed = false;
var keyDPressed = false;
var keySPressed = false;
// Colors
var colorCodeRGB_Background = "000000";
var colorCodeRGB_Score = "FFFFFF";
var colorCodeRGB_Ball1 = "0095DD";
var colorCodeRGB_Ball2 = "0095DD";
var colorCodeRGB_P1 = "0095DD";
var colorCodeRGB_P2 = "0095DD";
// Gnome
var gnome_isActive = false;
var gnome_startTime = null;
// King Harkinian
var harkinian_isActive = false;
var harkinian_x = width / 2;
var harkinian_y = height / 2;
var harkinian_width = 200;
var harkinian_height = 150;
// Fox
var fox_x = width / 2;
var fox_y = height / 2;
var fox_dirX = 1;
var fox_dirY = 1;
var fox_speedDefault = 1;
var fox_speed = 1;
var fox_isEvil = false;
var fox_isEnraged = false;
var fox_isAttacking = false;
var fox_timestampLastAppeased = null;
var fox_timeTillEnraged = 10000 + Math.random() * 20;
var Collisions = {
    collision_ball1_paddle1: 0,
    collision_ball1_paddle2: 0,
    collision_ball1_wall: false,
    ball1_loser: 0,
    collision_ball2_paddle1: 0,
    collision_ball2_paddle2: 0,
    collision_ball2_wall: false,
    ball2_loser: 0,
    fox_ball1: "",
    fox_ball2: "",
    fox_paddle1: false,
    fox_paddle2: false,
    fox_wall: "",
};
// Game stats
var ballPaddleBounces = 0;
var scoreP1 = 0;
var scoreP2 = 0;
var whoLostBall = 0;
// Assets
// Music
const music_Bavaria = new Audio('Music_Meanwhile_in_Bavaria.mp3');
const music_MushroomKingdom = new Audio('Music_Mushroom_Kingdom.mp3');
const music_NumberOne = new Audio('Music_We_Are_Number_One.mp3');
const music_Stubb = new Audio('Music_Stubb_a_Dubb.mp3');
// Video
var Mcrolld_queued = true;
const video_Mcrolld = document.createElement('video');
video_Mcrolld.src = 'Video_Mcrolld.mp4';
var McrolldReverse_queued = false;
const video_Mcrolld_reverse = document.createElement('video');
video_Mcrolld_reverse.src = 'Video_Mcrolld_reverse.mp4';
var videoToDraw = video_Mcrolld;
// Gnome
const image_Gnome = new Image(161, 178);
image_Gnome.src = "Image_Gnome.png";
const audio_Gnome = new Audio('SoundEffect_Gnome.mp3');
// King Harkinian
const video_Harkinian_Hit = document.createElement('video');
video_Harkinian_Hit.src = 'Video_Harkinian_Hit.mp4';
const audio_Harkinian_Hit = new Audio('SoundEffect_Harkinian_Hit.mp3');
const audio_Harkinian_Oah = new Audio('SoundEffect_Harkinian_Oah.mp3');
// Fox
const image_Fox_bad = new Image(50, 49);
image_Fox_bad.src = "Image_Fox_bad.png";
const image_Fox_good = new Image(50, 49);
image_Fox_good.src = "Image_Fox_good.png";
const image_Fox_enraged = new Image(50, 49);
image_Fox_enraged.src = "Image_Fox_enraged_ORIGINAL.png";
const audio_Fox_Enrage = new Audio('SoundEffect_Fox_Enrage.mp3');
// Good sounds
const audio_Fox_Meow = new Audio('SoundEffect_Fox_Meow.mp3');
const audio_Fox_Woof = new Audio('SoundEffect_Fox_Woof.mp3');
const audio_Fox_Quack = new Audio('SoundEffect_Fox_Quack.mp3');
const audio_Fox_Chicken = new Audio('SoundEffect_Fox_Chicken.mp3');
const audio_Fox_Goat = new Audio('SoundEffect_Fox_Goat.mp3');
const audio_Fox_Pig = new Audio('SoundEffect_Fox_Pig.mp3');
const audio_Fox_Tweet = new Audio('SoundEffect_Fox_Tweet.mp3');
// Evil sounds
const audio_Fox_Ahee = new Audio('SoundEffect_Fox_Ahee.mp3');
const audio_Fox_Cha = new Audio('SoundEffect_Fox_Cha.mp3');
const audio_Fox_Kaka = new Audio('SoundEffect_Fox_Kaka.mp3');
const audio_Fox_Papa = new Audio('SoundEffect_Fox_Papa.mp3');
const audio_Fox_Yok = new Audio('SoundEffect_Fox_Yok.mp3');
function draw(timestamp) {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    mcrolld();
    drawBalls();
    drawPaddles();
    drawFox();
    drawGnome(timestamp);
    drawHarkinian();
    drawScore();
    updateVariables();
    collisionCheck();
    control_music();
    control_RGB();
    movePaddles();
    moveBalls();
    moveFox(timestamp);
    popup_trap(); // Works, but needs more research
    updateVariables();
    updateScores();
    difficultyHandler();
    requestAnimationFrame(draw);
}
function randomizeColors() {
    colorCodeRGB_Background = Math.floor(Math.random() * Math.random() * 16777215 / 2).toString(16);
    colorCodeRGB_Score = Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16);
    colorCodeRGB_Ball1 = Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16);
    colorCodeRGB_Ball2 = Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16);
    colorCodeRGB_P1 = Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16);
    colorCodeRGB_P2 = Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16);
}
function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "#" + colorCodeRGB_Background;
    ctx.fill();
    ctx.closePath();
}
function drawBalls() {
    if (gnome_isActive === false) {
        ctx.beginPath();
        ctx.arc(ball1_x, ball1_y, ball_radius, 0, Math.PI * 2);
        ctx.fillStyle = "#" + colorCodeRGB_Ball1;
        ctx.fill();
        ctx.closePath();
        if (isUnlocked_SecondBall) {
            ctx.beginPath();
            ctx.arc(ball2_x, ball2_y, ball_radius, 0, Math.PI * 2);
            ctx.fillStyle = "#" + colorCodeRGB_Ball2;
            ctx.fill();
            ctx.closePath();
        }
    }
}
function drawPaddles() {
    ctx.beginPath();
    ctx.rect(paddleP1_X, height - paddleHeight, paddleWidth - paddleReduction, paddleHeight);
    ctx.fillStyle = "#" + colorCodeRGB_P1;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(paddleP2_X, 0, paddleWidth - paddleReduction, paddleHeight);
    ctx.fillStyle = "#" + colorCodeRGB_P2;
    ctx.fill();
    ctx.closePath();
}
function drawScore() {
    ctx.font = "16px Sherwood";
    ctx.fillStyle = "#" + colorCodeRGB_Score;
    ctx.fillText(`Score P1: ${scoreP1}`, width - 100, height - 10);
    ctx.fillText(`Score P2: ${scoreP2}`, 8, 20);
}
function drawGnome(timestamp) {
    if (isUnlocked_Gnome) {
        if (gnome_isActive === false) {
            if (Math.floor(Math.random() * 1000) === 666) {
                gnome_startTime = timestamp;
                gnome_isActive = true;
                audio_Gnome.play();
                gnome_swap();
            }
        }
        else if (timestamp - gnome_startTime <= 200) {
            ctx.drawImage(image_Gnome, ball1_x - 80, ball1_y - 90);
            if (isUnlocked_SecondBall) {
                ctx.drawImage(image_Gnome, ball2_x - 80, ball2_y - 90);
            }
            if (isUnlocked_Fox) {
                ctx.drawImage(image_Gnome, fox_x - 80, fox_y - 90);
            }
        }
        else {
            gnome_isActive = false;
        }
    }
}
function drawHarkinian() {
    if (isUnlocked_Harkinian) {
        if (harkinian_isActive === false) {
            if (Math.floor(Math.random() * 1000) === 666) {
                harkinian_isActive = true;
                video_Harkinian_Hit.play();
                audio_Harkinian_Oah.play();
                audio_Harkinian_Hit.play();
                harkinian_hit(Math.floor(Math.random() * 100));
            }
        }
        else if (video_Harkinian_Hit.paused === false) {
            ctx.drawImage(video_Harkinian_Hit, harkinian_x, harkinian_y, harkinian_width, harkinian_height);
        }
        else {
            harkinian_isActive = false;
        }
    }
}
function drawFox() {
    if (isUnlocked_Fox) {
        if (fox_isEnraged) {
            ctx.drawImage(image_Fox_enraged, fox_x, fox_y);
        }
        else if (fox_isEvil) {
            ctx.drawImage(image_Fox_bad, fox_x, fox_y);
        }
        else {
            ctx.drawImage(image_Fox_good, fox_x, fox_y);
        }
    }
}
function collisionCheck_ballPaddle(ball_futureX, ball_futureY) {
    let collision = 0;
    // Paddle 1
    if (ball_futureY >= height - ball_radius) {
        if (ball_futureX >= paddleP1_X &&
            ball_futureX <= paddleP1_X + paddleWidth - paddleReduction) {
            collision = 1;
        }
    }
    // Paddle 2
    else if (ball_futureY <= 0 + ball_radius) {
        if (ball_futureX >= paddleP2_X &&
            ball_futureX <= paddleP2_X + paddleWidth - paddleReduction) {
            collision = 2;
        }
    }
    return collision;
}
function collisionCheck_ballWall(ball_futureX, ball_futureY) {
    let collision = false;
    if (ball_futureX <= 0 ||
        ball_futureX >= width) {
        collision = true;
    }
    return collision;
}
function collisionCheck_lostBall(ball_futureX, ball_futureY) {
    let whoLostBall = 0;
    if (ball_futureY <= 0 + ball_radius) {
        whoLostBall = 2;
    }
    else if (ball_futureY >= height - ball_radius) {
        whoLostBall = 1;
    }
    return whoLostBall;
}
function collisionCheck_foxBall(ballx, bally, fox_width, fox_height) {
    let collision = "";
    // Check "up" (with 2 pixels error margin)
    if (ballx >= fox_x && ballx <= fox_x + fox_width &&
        bally >= fox_y - 2 && bally <= fox_y + 2) 
    //bally >= fox_y - 3 && bally <= fox_y + 3)
    {
        collision = "up";
    }
    // Check "down" (with 2 pixels error margin)
    else if (ballx >= fox_x && ballx <= fox_x + fox_width &&
        bally >= fox_y + fox_height && bally - 2 <= fox_y + fox_height + 2) 
    //bally >= fox_y + image_Fox_bad.height - 3 && bally <= fox_y + image_Fox_bad.height + 3)
    {
        collision = "down";
    }
    // Check "left" (with 2 pixels error margin)
    else if (bally >= fox_y && bally <= fox_y + fox_height &&
        ballx >= fox_x - 2 && ballx <= fox_x + 2) 
    //ballx >= fox_x - 3 && ballx <= fox_x + 3)
    {
        collision = "left";
    }
    // Check "right" (with 2 pixels error margin)
    else if (bally >= fox_y && bally <= fox_y + fox_height &&
        ballx >= fox_x + fox_width - 2 && ballx <= fox_x + fox_width + 2) 
    //ballx >= fox_x + image_Fox_bad.width - 3 && ballx <= fox_x + image_Fox_bad.width + 3)
    {
        collision = "right";
    }
    return collision;
}
function collisionCheck_foxPaddle(paddlex, paddley, fox_width, fox_height) {
    let collision = false;
    if (paddley === 0) {
        if (fox_x + fox_width >= paddlex && fox_x <= paddlex + paddleWidth - paddleReduction &&
            fox_y <= paddley + paddleHeight) {
            collision = true;
        }
    }
    else {
        if (fox_x + fox_width >= paddlex && fox_x <= paddlex + paddleWidth - paddleReduction &&
            fox_y + fox_height >= paddley) {
            collision = true;
        }
    }
    return collision;
}
// With position correction
function collisionCheck_foxWall(fox_width, fox_height) {
    let collision = "";
    if (fox_x + (fox_speed * fox_dirX) <= 0) {
        collision = "left";
        fox_x = 1;
    }
    else if (fox_x + fox_width + (fox_speed * fox_dirX) >= width) {
        collision = "right";
        fox_x = width - fox_width - 1;
    }
    else if (fox_y + (fox_speed * fox_dirY) <= 0) {
        collision = "up";
        fox_y = 1;
    }
    else if (fox_y + fox_height + (fox_speed * fox_dirY) >= height) {
        collision = "down";
        fox_y = height - fox_height - 1;
    }
    return collision;
}
function collisionCheck() {
    Collisions.collision_ball1_paddle1 = 0;
    Collisions.collision_ball1_paddle2 = 0;
    Collisions.collision_ball1_wall = false;
    Collisions.ball1_loser = 0;
    Collisions.collision_ball2_paddle1 = 0;
    Collisions.collision_ball2_paddle2 = 0;
    Collisions.collision_ball2_wall = false;
    Collisions.ball2_loser = 0;
    Collisions.fox_ball1 = "";
    Collisions.fox_ball2 = "";
    Collisions.fox_paddle1 = false;
    Collisions.fox_paddle2 = false;
    Collisions.fox_wall = "";
    Collisions.collision_ball1_paddle1 = collisionCheck_ballPaddle(ball1_x + (ball1_speedX * ball1_dirX), ball1_y + (ball1_speedY * ball1_dirY));
    Collisions.collision_ball1_paddle2 = collisionCheck_ballPaddle(ball1_x + (ball1_speedX * ball1_dirX), ball1_y + (ball1_speedY * ball1_dirY));
    Collisions.collision_ball1_wall = collisionCheck_ballWall(ball1_x + (ball1_speedX * ball1_dirX), ball1_y + (ball1_speedY * ball1_dirY));
    Collisions.ball1_loser = 0;
    if (Collisions.collision_ball1_paddle1 === 0 && Collisions.collision_ball1_paddle2 === 0) {
        Collisions.ball1_loser = collisionCheck_lostBall(ball1_x + (ball1_speedX * ball1_dirX), ball1_y + (ball1_speedY * ball1_dirY));
    }
    if (isUnlocked_SecondBall) {
        Collisions.collision_ball2_paddle1 = collisionCheck_ballPaddle(ball2_x + (ball2_speedX * ball2_dirX), ball2_y + (ball2_speedY * ball2_dirY));
        Collisions.collision_ball2_paddle2 = collisionCheck_ballPaddle(ball2_x + (ball2_speedX * ball2_dirX), ball2_y + (ball2_speedY * ball2_dirY));
        Collisions.collision_ball2_wall = collisionCheck_ballWall(ball2_x + (ball2_speedX * ball2_dirX), ball2_y + (ball2_speedY * ball2_dirY));
        Collisions.ball2_loser = 0;
        if (Collisions.collision_ball2_paddle1 === 0 || Collisions.collision_ball2_paddle2 === 0) {
            Collisions.ball2_loser = collisionCheck_lostBall(ball2_x + (ball2_speedX * ball2_dirX), ball2_y + (ball2_speedY * ball2_dirY));
        }
    }
    if (isUnlocked_Fox) {
        if (fox_isEnraged) {
            var fox_width = 153;
            var fox_height = 149;
        }
        else {
            var fox_width = 50;
            var fox_height = 49;
        }
        Collisions.fox_ball1 = collisionCheck_foxBall(ball1_x, ball1_y, fox_width, fox_height);
        Collisions.fox_ball2 = collisionCheck_foxBall(ball2_x, ball2_y, fox_width, fox_height);
        Collisions.fox_paddle1 = collisionCheck_foxPaddle(paddleP1_X, height - paddleHeight, fox_width, fox_height);
        Collisions.fox_paddle2 = collisionCheck_foxPaddle(paddleP2_X, 0, fox_width, fox_height);
        Collisions.fox_wall = collisionCheck_foxWall(fox_width, fox_height);
    }
}
function moveBalls() {
    // Move Ball 1
    if (isUnlocked_Fox && fox_isEnraged) {
        if (Collisions.fox_ball1 === "up") {
            if (ball1_dirY === 1) {
                ball1_dirY = -ball1_dirY;
            }
        }
        else if (Collisions.fox_ball1 === "down") {
            if (ball1_dirY === -1) {
                ball1_dirY = -ball1_dirY;
            }
        }
        else if (Collisions.fox_ball1 === "left") {
            if (ball1_dirX === 1) {
                ball1_dirX = -ball1_dirX;
            }
        }
        else if (Collisions.fox_ball1 === "right") {
            if (ball1_dirX === -1) {
                ball1_dirX = -ball1_dirX;
            }
        }
    }
    if (Collisions.collision_ball1_paddle1 != 0 || Collisions.collision_ball1_paddle2 != 0) {
        ball1_dirY = -ball1_dirY;
        ball1_y = ball1_y + (ball1_speedY * ball1_dirY);
    }
    else if (Collisions.collision_ball1_wall === true) {
        ball1_dirX = -ball1_dirX;
        ball1_x = ball1_x + (ball1_speedX * ball1_dirX);
    }
    else if (Collisions.ball1_loser != 0) {
        ball1_x = width / 2;
        ball1_y = height / 2;
    }
    else {
        ball1_x = ball1_x + (ball1_speedX * ball1_dirX);
        ball1_y = ball1_y + (ball1_speedY * ball1_dirY);
    }
    // Move Ball 2
    if (isUnlocked_SecondBall) {
        if (isUnlocked_Fox && fox_isEnraged) {
            if (Collisions.fox_ball2 === "up") {
                if (ball2_dirY === 1) {
                    ball2_dirY = -ball2_dirY;
                }
            }
            else if (Collisions.fox_ball2 === "down") {
                if (ball2_dirY === -1) {
                    ball2_dirY = -ball2_dirY;
                }
            }
            else if (Collisions.fox_ball2 === "left") {
                if (ball2_dirX === 1) {
                    ball2_dirX = -ball2_dirX;
                }
            }
            else if (Collisions.fox_ball2 === "right") {
                if (ball2_dirX === -1) {
                    ball2_dirX = -ball2_dirX;
                }
            }
        }
        if (Collisions.collision_ball2_paddle1 != 0 || Collisions.collision_ball2_paddle2 != 0) {
            ball2_dirY = -ball2_dirY;
            ball2_y = ball2_y + (ball2_speedY * ball2_dirY);
        }
        else if (Collisions.collision_ball2_wall === true) {
            ball2_dirX = -ball2_dirX;
            ball2_x = ball2_x + (ball2_speedX * ball2_dirX);
        }
        else if (Collisions.ball2_loser != 0) {
            ball2_x = width / 2;
            ball2_y = height / 2;
        }
        else {
            ball2_x = ball2_x + (ball2_speedX * ball2_dirX);
            ball2_y = ball2_y + (ball2_speedY * ball2_dirY);
        }
    }
}
function moveFox(timestamp) {
    if (isUnlocked_Fox) {
        if (fox_isAttacking) {
            if (Math.floor(Math.random() * 100) === 42) {
                fox_timestampLastAppeased = timestamp;
                fox_timeTillEnraged = 10000 + Math.random() * 20;
                fox_isAttacking = false;
                fox_isEnraged = false;
                fox_isEvil = false;
                fox_speed = fox_speedDefault + ball_speedAddedPerma;
            }
        }
        else if (fox_isEnraged) {
            if (Math.floor(Math.random() * 100) === 42) {
                fox_dirX = -fox_dirX;
            }
            if (Math.floor(Math.random() * 100) === 42) {
                fox_dirY = -fox_dirY;
            }
            fox_x = fox_x + (fox_speed * fox_dirX);
            fox_y = fox_y + (fox_speed * fox_dirY);
            if (Collisions.fox_paddle1 === true || Collisions.fox_paddle2 === true) {
                fox_isAttacking = true;
                fox_speed = 0;
                fox_sounds_evil();
            }
        }
        else if (fox_isEvil) {
            fox_x = fox_x + (fox_speed * fox_dirX);
            fox_y = fox_y + (fox_speed * fox_dirY);
            if (Collisions.fox_paddle1 === true || Collisions.fox_paddle2 === true) {
                fox_isAttacking = true;
                fox_speed = 0;
                fox_sounds_evil();
            }
            if (fox_isAttacking === false && Math.floor(Math.random() * 1000) % 100 === 0) {
                fox_isEvil = false;
            }
            if (fox_isAttacking === false && timestamp - fox_timestampLastAppeased >= fox_timeTillEnraged) {
                audio_Fox_Enrage.play();
                fox_isEnraged = true;
                fox_isEvil = true;
                fox_speed = 5;
            }
        }
        else {
            fox_x = fox_x + (fox_speed * fox_dirX);
            fox_y = fox_y + (fox_speed * fox_dirY);
            if (Collisions.fox_paddle1 === true) {
                fox_dirY = -1;
                fox_timestampLastAppeased = timestamp;
                fox_timeTillEnraged = 10000 + Math.random() * 20;
                fox_sounds_good();
            }
            else if (Collisions.fox_paddle2 === true) {
                fox_dirY = 1;
                fox_timestampLastAppeased = timestamp;
                fox_timeTillEnraged = 10000 + Math.random() * 20;
                fox_sounds_good();
            }
            if (Math.floor(Math.random() * 1000) % 100 === 0) {
                fox_isEvil = true;
            }
            if (fox_isAttacking === false && timestamp - fox_timestampLastAppeased >= fox_timeTillEnraged) {
                audio_Fox_Enrage.play();
                fox_isEnraged = true;
                fox_isEvil = true;
                fox_speed++;
            }
        }
        if (Collisions.fox_wall === "up") {
            fox_y++;
            fox_dirY = -fox_dirY;
        }
        else if (Collisions.fox_wall === "down") {
            fox_y--;
            fox_dirY = -fox_dirY;
        }
        else if (Collisions.fox_wall === "left") {
            fox_x++;
            ;
            fox_dirX = -fox_dirX;
        }
        else if (Collisions.fox_wall === "right") {
            fox_x--;
            fox_dirX = -fox_dirX;
        }
    }
    else {
        fox_timestampLastAppeased = timestamp;
    }
}
function fox_sounds_good() {
    let selector = Math.floor(Math.random() * 100) % 7;
    if (selector === 0) {
        audio_Fox_Chicken.play();
    }
    else if (selector === 1) {
        audio_Fox_Goat.play();
    }
    else if (selector === 2) {
        audio_Fox_Meow.play();
    }
    else if (selector === 3) {
        audio_Fox_Pig.play();
    }
    else if (selector === 4) {
        audio_Fox_Quack.play();
    }
    else if (selector === 5) {
        audio_Fox_Tweet.play();
    }
    else if (selector === 6) {
        audio_Fox_Woof.play();
    }
}
function fox_sounds_evil() {
    let selector = Math.floor(Math.random() * 100) % 5;
    if (selector === 0) {
        audio_Fox_Ahee.play();
    }
    else if (selector === 1) {
        audio_Fox_Cha.play();
    }
    else if (selector === 2) {
        audio_Fox_Kaka.play();
    }
    else if (selector === 3) {
        audio_Fox_Papa.play();
    }
    else if (selector === 4) {
        audio_Fox_Yok.play();
    }
}
function movePaddles() {
    if (isUnlocked_Fox) {
        if (fox_isEvil) {
            if (Collisions.fox_paddle1 === true) {
                paddleP1_isAttacked = true;
                paddleP2_isAttacked = false;
            }
            else if (Collisions.fox_paddle2 === true) {
                paddleP2_isAttacked = true;
                paddleP1_isAttacked = false;
            }
            else {
                paddleP1_isAttacked = false;
                paddleP2_isAttacked = false;
            }
        }
    }
    if (paddleP1_isAttacked === false) {
        if (downPressed) {
            paddleP1_speedMod = 10;
        }
        else {
            paddleP1_speedMod = 0;
        }
        if (rightPressed) {
            paddleP1_X = Math.min(paddleP1_X + paddleSpeed + paddleP1_speedMod, width - (paddleWidth - paddleReduction));
        }
        else if (leftPressed) {
            paddleP1_X = Math.max(paddleP1_X - paddleSpeed - paddleP1_speedMod, 0);
        }
    }
    if (paddleP2_isAttacked === false) {
        if (keySPressed) {
            paddleP2_speedMod = 10;
        }
        else {
            paddleP2_speedMod = 0;
        }
        if (keyDPressed) {
            paddleP2_X = Math.min(paddleP2_X + paddleSpeed + paddleP2_speedMod, width - (paddleWidth - paddleReduction));
        }
        else if (keyAPressed) {
            paddleP2_X = Math.max(paddleP2_X - paddleSpeed - paddleP2_speedMod, 0);
        }
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    }
    if (e.keyCode === 65) {
        keyAPressed = true;
    }
    else if (e.keyCode === 68) {
        keyDPressed = true;
    }
    else if (e.keyCode === 83) {
        keySPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    }
    if (e.keyCode === 65) {
        keyAPressed = false;
    }
    else if (e.keyCode === 68) {
        keyDPressed = false;
    }
    else if (e.keyCode === 83) {
        keySPressed = false;
    }
}
function control_RGB() {
    // Randomize colors on ball bounce
    if (isUnlocked_RandomRGB1) {
        if (Collisions.collision_ball1_paddle1 != 0 ||
            Collisions.collision_ball1_paddle2 != 0 ||
            Collisions.collision_ball2_paddle1 != 0 ||
            Collisions.collision_ball2_paddle2 != 0 ||
            Collisions.collision_ball1_wall === true ||
            Collisions.collision_ball2_wall === true) {
            randomizeColors();
        }
    }
    // Randomize colors ADDITIONALLY at random times
    if (isUnlocked_RandomRGB2) {
        if (Math.floor(Math.random() * 100) === 42) {
            randomizeColors();
        }
    }
}
function control_music() {
    if (difficulty_Score < 5) {
        if (music_Bavaria.paused || music_Bavaria.ended) {
            music_Bavaria.play();
        }
    }
    else if (difficulty_Score < 10) {
        music_Bavaria.pause();
        if (music_MushroomKingdom.paused || music_MushroomKingdom.ended) {
            music_MushroomKingdom.play();
        }
    }
    else if (difficulty_Score < 15) {
        music_MushroomKingdom.pause();
        if (music_NumberOne.paused || music_NumberOne.ended) {
            music_NumberOne.play();
        }
    }
    else if (difficulty_Score < 30) {
        music_NumberOne.pause();
        if (music_Stubb.paused || music_Stubb.ended) {
            music_Stubb.play();
        }
    }
    else {
        music_Stubb.pause();
    }
}
function gnome_swap_1_2() {
    let temp_ball1_x = ball1_x;
    let temp_ball1_y = ball1_y;
    let temp_ball1_dirX = ball1_dirY;
    let temp_ball1_dirY = ball1_dirY;
    ball1_x = ball2_x;
    ball1_y = ball2_y;
    ball1_dirX = ball2_dirX;
    ball1_dirY = ball2_dirY;
    ball2_x = temp_ball1_x;
    ball2_y = temp_ball1_y;
    ball2_dirX = temp_ball1_dirX;
    ball2_dirY = temp_ball1_dirY;
}
function gnome_swap_1_fox() {
    let temp_ball1_x = ball1_x;
    let temp_ball1_y = ball1_y;
    let temp_ball1_dirX = ball1_dirY;
    let temp_ball1_dirY = ball1_dirY;
    ball1_x = fox_x;
    ball1_y = fox_y;
    ball1_dirX = fox_dirX;
    ball1_dirY = fox_dirY;
    fox_x = temp_ball1_x;
    fox_y = temp_ball1_y;
    fox_dirX = temp_ball1_dirX;
    fox_dirY = temp_ball1_dirY;
}
function gnome_swap_2_fox() {
    let temp_ball2_x = ball2_x;
    let temp_ball2_y = ball2_y;
    let temp_ball2_dirX = ball2_dirY;
    let temp_ball2_dirY = ball2_dirY;
    ball2_x = fox_x;
    ball2_y = fox_y;
    ball2_dirX = fox_dirX;
    ball2_dirY = fox_dirY;
    fox_x = temp_ball2_x;
    fox_y = temp_ball2_y;
    fox_dirX = temp_ball2_dirX;
    fox_dirY = temp_ball2_dirY;
}
function gnome_swap() {
    if (isUnlocked_SecondBall) {
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            gnome_swap_1_2();
        }
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            gnome_swap_1_fox();
        }
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            gnome_swap_2_fox();
        }
    }
    else if (isUnlocked_Fox) {
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            gnome_swap_1_fox();
        }
    }
}
function harkinian_hit(random_number) {
    var mod = 1;
    if (isUnlocked_SecondBall) {
        mod = 3;
    }
    else if (isUnlocked_Fox) {
        mod = 2;
    }
    if (random_number % mod === 0) {
        harkinian_x = ball1_x - harkinian_width / 2;
        harkinian_y = ball1_y - harkinian_height / 2;
        ball1_dirX = -ball1_dirX;
        ball1_dirY = -ball1_dirY;
    }
    else if (random_number % mod === 1) {
        harkinian_x = fox_x - harkinian_width / 2;
        harkinian_y = fox_y - harkinian_height / 2;
        fox_dirX = -fox_dirX;
        fox_dirY = -fox_dirY;
    }
    else if (random_number % mod === 2) {
        harkinian_x = ball2_x - harkinian_width / 2;
        harkinian_y = ball2_y - harkinian_height / 2;
        ball2_dirX = -ball2_dirX;
        ball2_dirY = -ball2_dirY;
    }
}
function mcrolld() {
    if (isUnlocked_Video) {
        if (McrolldReverse_queued && (video_Mcrolld.paused || video_Mcrolld.ended)) {
            videoToDraw = video_Mcrolld_reverse;
            video_Mcrolld_reverse.play();
            McrolldReverse_queued = false;
            Mcrolld_queued = true;
        }
        else if (Mcrolld_queued && video_Mcrolld_reverse.paused || video_Mcrolld_reverse.ended) {
            videoToDraw = video_Mcrolld;
            video_Mcrolld.play();
            Mcrolld_queued = false;
            McrolldReverse_queued = true;
        }
        ctx.drawImage(videoToDraw, (width - 1024) / 2, (height - 768) / 2, 1024, 768);
    }
}
function popup_trap() {
    if (isUnlocked_Popups) {
        if (Math.floor(Math.random() * 10000) === 666) {
            var selector = Math.floor(Math.random() * 100) % 5;
            if (selector === 0) {
                alert("cLICK THIS LINK AND WIN 1 BITCOIN!!! http://hostmyvirus.co.ck/f1L3r4p3");
            }
            else if (selector === 1) {
                alert("Want see many womans whit BIG BALLS??? Clik her http://baitandhack.ro/r4n50mM0n573r-Tr0j4n");
            }
            else if (selector === 2) {
                alert("You are FBI suspekt childs pronorgafy! You have right to a turny! Free lawers best servis CALL NOW!!! +40769 666 911");
            }
            else if (selector === 3) {
                alert("1 new message from Elon Musk: Hello I am Elon Musk I end world hunger I love you send $100 to my wallet 4DZpldiB34afdq5BjdwT9ayHyLJnkMbKevc8 I send you 1000.000.000 DOGE");
            }
            else if (selector === 4) {
                alert("Legal drugs online order 100% SAFE http://jestesglupilol.pl");
            }
        }
    }
}
function updateVariables() {
    ball1_speedX = ball_speedDefault + ball_speedAddedPerma + ball_speedAddedTemp;
    ball1_speedY = ball_speedDefault + ball_speedAddedPerma + ball_speedAddedTemp;
    ball2_speedX = ball_speedDefault + ball_speedAddedPerma + ball_speedAddedTemp;
    ball2_speedY = ball_speedDefault + ball_speedAddedPerma + ball_speedAddedTemp;
    // Upon losing the ball
    if (Collisions.ball1_loser != 0) {
        ballPaddleBounces = 0;
        ball_speedAddedTemp = 0;
        // Reset dir for Ball 1
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            ball1_dirX = -1;
        }
        else {
            ball1_dirX = 1;
        }
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            ball1_dirY = -1;
        }
        else {
            ball1_dirY = 1;
        }
    }
    if (Collisions.ball2_loser != 0) {
        ballPaddleBounces = 0;
        ball_speedAddedTemp = 0;
        // Reset dir for Ball 2
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            ball2_dirX = -1;
        }
        else {
            ball2_dirX = 1;
        }
        if (Math.floor(Math.random() * 100) % 2 === 0) {
            ball2_dirY = -1;
        }
        else {
            ball2_dirY = 1;
        }
    }
}
function updateScores() {
    // Ball 1
    if (Collisions.ball1_loser === 1) {
        scoreP2++;
    }
    else if (Collisions.ball1_loser === 2) {
        scoreP1++;
    }
    // Ball 2
    if (isUnlocked_SecondBall) {
        if (Collisions.ball2_loser === 1) {
            scoreP2++;
        }
        else if (Collisions.ball2_loser === 2) {
            scoreP1++;
        }
    }
}
function difficultyHandler() {
    // When total score reaches 5
    if (scoreP1 + scoreP2 === 5 && difficulty_Score < 5) {
        difficulty_Score = 5;
        isUnlocked_Gnome = true;
    }
    else if (scoreP1 + scoreP2 === 10 && difficulty_Score < 10) {
        difficulty_Score = 10;
        isUnlocked_RandomRGB1 = true;
    }
    else if (scoreP1 + scoreP2 === 15 && difficulty_Score < 15) {
        difficulty_Score = 15;
        isUnlocked_Harkinian = true;
    }
    else if (scoreP1 + scoreP2 === 20 && difficulty_Score < 20) {
        difficulty_Score = 20;
        isUnlocked_RandomRGB2 = true;
    }
    else if (scoreP1 + scoreP2 === 30 && difficulty_Score < 30) {
        difficulty_Score = 30;
        isUnlocked_Fox = true;
        isUnlocked_Video = true;
    }
    else if (scoreP1 + scoreP2 === 40 && difficulty_Score < 40) {
        difficulty_Score = 40;
        isUnlocked_SecondBall = true;
    }
    else if (scoreP1 + scoreP2 === 50 && difficulty_Score < 50) {
        difficulty_Score = 50;
        isUnlocked_Popups = true;
    }
    adjust_ballAndPaddle();
}
// Permanent adjustments to the balls and paddles
function adjust_ballAndPaddle() {
    if (Collisions.collision_ball1_paddle1 != 0 || Collisions.collision_ball1_paddle2 != 0) {
        ballPaddleBounces++;
    }
    if (isUnlocked_SecondBall &&
        (Collisions.collision_ball2_paddle1 != 0 || Collisions.collision_ball2_paddle2 != 0)) {
        ballPaddleBounces++;
    }
    ball_speedAddedTemp = ballPaddleBounces * 0.1;
    //if (ballPaddleBounces >= 10)
    //{
    //	ball_speedAddedTemp++;
    //	ballPaddleBounces = ballPaddleBounces % 10;
    //}
    if (difficulty_Score % 5 === 0 &&
        difficulty_Score > 0 &&
        difficulty_ballAndPaddle < Math.floor(difficulty_Score / 5)) {
        if (Math.floor(Math.random() * 100) % 2 === 0 || paddleWidth - paddleReduction === 35) {
            ball_speedAddedPerma = ball_speedAddedPerma + 0.2;
            fox_speed = fox_speedDefault + ball_speedAddedPerma;
        }
        else {
            paddleReduction = paddleReduction + 5;
        }
        difficulty_ballAndPaddle++;
    }
}
window.onload = () => {
    let container = document.createElement('div');
    container.id = "container";
    canvas = document.createElement('canvas');
    canvas.id = "game";
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add('red_border');
    container.appendChild(canvas);
    document.body.appendChild(container);
    ctx = canvas.getContext("2d");
    sayHelloWorld();
    //draw();
    requestAnimationFrame(draw);
};
