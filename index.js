const scoreEl = document.getElementById('scoreEl');
const nameEl = document.getElementById('nameEl');
const level = document.getElementById('level');
const numberLevel = document.getElementById('numberLevel');
const text = document.getElementById('text');
const textScore = document.getElementById('textScore');
const buttonStart = document.getElementById('classButton1');
const buttonRestart = document.getElementById('classButton2');
const ruler = document.getElementById('ruler');
const rulerMove = document.getElementById('rulerMove')
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1366;
canvas.height = 768;

let Player = function () {

    this.velocity = { x: 0, y: 0 };

    let image = new Image();
    image.src = "./assets/image/spaceship.png";
    image.onload = () => {
        let scale = 0.15;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20
        };
    }

    this.rotation = 0;
    this.opacity = 1;

    this.draw = function () {
        ctx.save();
        ctx.globalAlpha = this.opacity
        ctx.translate(
            +player.position.x + player.width / 2,
            +player.position.y + player.height / 2
        );

        ctx.rotate(this.rotation);

        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        ctx.restore();
    }
    this.update = function () {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}


let Projectile = function ({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.position.x + 34, this.position.y + 34, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
    this.update = function () {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

/**
 * Pháo bông lúc đạn mình bắn trúng
 * @param {} param0 
 */
let Particle = function ({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;

    this.draw = function () {
        ctx.save();
        ctx.globalApha = this.opacity
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    this.update = function () {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.fades) {
            this.opacity -= 0.01;
        }

    }

}
/**
 * Kẻ địch
 * @param {} position 
 */
let Invader = function (position) {

    this.velocity = { x: 0, y: 0 };

    let image = new Image();
    image.src = "./assets/image/invader.png";
    image.onload = () => {
        let scale = 1;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
            x: position.x,
            y: position.y
        };
    }

    this.draw = function () {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
    this.update = function (velocity) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
    this.shoot = function (invaderProjectile) {
        // let velocity_x = Math.random*(2 - (-2)) + -2;
        invaderProjectile.push(new InvaderProjectile({
            position: { x: this.position.x + this.width / 2, y: this.position.y + this.height },
            velocity: { x: Math.floor(Math.random() * (3 - -3)) + -3, y: 5 }
        }))
    }
}
/**
 * Đạn kẻ địch
 * @param {} param0 
 */
let InvaderProjectile = function ({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;

    this.draw = function () {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    this.update = function () {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}
/**
 * đối tượng lưu danh sách Mảng lưu các kẻ địch
 */
let Grid = function () {
    this.position = { x: 0, y: 0 }
    this.velocity = { x: 3, y: 0 };
    this.invader = [];
    let rows = Math.floor(Math.random() * 5 + 1);
    let cols = Math.floor(Math.random() * 10 + 5);
    this.width = cols * 30;

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            this.invader.push(new Invader(position = { x: x * 30, y: y * 30 }))
        }
    };
    this.update = function () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = - this.velocity.x;
            this.velocity.y = 20;
        }
    }
}


function init() {
    player = new Player();
    projectiles = [];
    grids = [];
    invaderProjectiles = [];
    particles = [];
    game = {
        over: false,
        active: true
    }
    //  statusGame = false;
    score = 0;
    lvl = 1;
    velocity_x = 3;
    sound = true;
    soundBackgroud = new Audio('./assets/audio/backgroundMusic.wav');
    soundShoot = new Audio('./assets/audio/shoot.wav');
    soundEnemyShoot = new Audio('./assets/audio/enemyShoot.wav');
    soundGameOver = new Audio('./assets/audio/gameOver.mp3');
    soundScore = new Audio('./assets/audio/bonus.mp3');
    soundStart = new Audio('./assets/audio/start.mp3');
    ButtonState = {
        BUTTON_LEFT: {
            pressed: false
        },
        BUTTON_RIGHT: {
            pressed: false
        },
        BUTTON_DOWN: {
            pressed: false
        },
        BUTTON_UP: {
            pressed: false
        },
        space: {
            pressed: false
        }
    }
    frames = 0;
    for (let i = 0; i < 100; i++) {
        particles.push(
            new Particle({
                position: { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
                velocity: { x: 0, y: 0.3 },
                radius: Math.random() * 3,
                color: 'white'
            })
        )
    }
}
init();
// let player = new Player();
// let projectiles = [];
// let grids = [];
// let invaderProjectiles = [];
// let particles = [];
// let game = {
//     over: false,
//     active: true
// }
// // let statusGame = false;
// let score = 0;
// let sound = true;
// let soundBackgroud = new Audio('./assets/audio/backgroundMusic.wav');
// let soundShoot = new Audio('./assets/audio/shoot.wav');
// let soundEnemyShoot = new Audio('./assets/audio/enemyShoot.wav');
// let soundGameOver = new Audio('./assets/audio/gameOver.mp3');
// let soundScore = new Audio('./assets/audio/bonus.mp3');
// let soundStart = new Audio('./assets/audio/start.mp3');
// let ButtonState = {
//     BUTTON_LEFT: {
//         pressed: false
//     },
//     BUTTON_RIGHT: {
//         pressed: false
//     },
//     BUTTON_DOWN: {
//         pressed: false
//     },
//     BUTTON_UP: {
//         pressed: false
//     },
//     space: {
//         pressed: false
//     }
// }
// let frames = 0;
let randomInterval = Math.floor(Math.random() * 500) + 500;

let createParticles = function ({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle({
                position: { x: object.position.x + object.width / 2, y: object.position.y + object.height / 2 },
                velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
                radius: Math.random() * 3,
                color: color || '#BAA0DE',
                fades
            })
        )
    }
}

let animateStart = function () {
    requestAnimationFrame(animateStart);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let image = new Image();
    image.src = "./assets/image/startScreenBackground.png";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

let animate = function () {
    soundBackgroud.play();
    if (sound == false) {
        soundBackgroud.pause();
        soundShoot.pause();
        soundEnemyShoot.pause();
        soundScore.pause();
    }
    if (game.active == false) {
        textScore.innerHTML = `GAME OVER! <br><br> Your score is: ${score}`;
        textScore.hidden = false;
        // statusGame = false;
        scoreEl.innerHTML = 0;
        numberLevel.innerHTML = 1;
        soundGameOver.pause();
        nameEl.hidden = true;
        scoreEl.hidden = true;
        level.hidden = true;
        numberLevel.hidden = true;
        buttonStart.hidden = true;
        buttonRestart.hidden = false;
        init();
        return;
    }
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = - particle.radius;
        }
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1);
            }, 0);
        } else {
            particle.update();
        }
    })

    // Tạo đạn bắn
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1);
            }, 0);
        } else {
            invaderProjectile.update();
        }
        if (
            invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.y + invaderProjectile.height <= player.position.y + player.height &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x + invaderProjectile.width <= player.position.x + player.width
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true;
                sound = false;
            }, 0);
            setTimeout(() => {
                game.active = false;
            }, 2000);

            createParticles({ object: player, color: 'white', fades: true });
        }

        if (score % 5000 == 0) {
            setTimeout(() => {
                invaderProjectile.velocity.y = 8;
            }, 0);

        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update();
        if (frames % 100 == 0 && grid.invader.length > 0) {
            grid.invader[Math.floor(Math.random() * grid.invader.length)].shoot(invaderProjectiles);
        }
        grid.invader.forEach((invader, i) => {
            invader.update(grid.velocity);
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y + projectile.radius >= invader.position.y &&
                    projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width
                ) {

                    setTimeout(() => {
                        let invaderFound = grid.invader.find((invader2) => invader2 === invader);
                        let projectileFound = projectiles.find((projectile2) => projectile2 === projectile);

                        if (invaderFound && projectileFound) {
                            score += 100;
                            scoreEl.innerHTML = score;
                            soundEnemyShoot.play();
                            grid.invader.splice(i, 1);
                            projectiles.splice(j, 1);

                            createParticles({ object: invader, fades: true });

                            if (grid.invader.length > 0) {
                                let firstInvader = grid.invader[0];
                                let lastInvader = grid.invader[grid.invader.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else {
                                grids.splice(gridIndex, 1);
                            }
                            if (score % 5000 == 0) {
                                lvl  += 1;
                                numberLevel.innerHTML = lvl;
                            }

                            if (score > 5000) {
                                for (let i = 0; i < grids.length; i++)
                                    grids[i].velocity.x = 5;
                            } else if (score > 10000) {
                                for (let i = 0; i < grids.length; i++)
                                    grids[i].velocity.x = 10;
                            } else if (score > 20000) {
                                for (let i = 0; i < grids.length; i++)
                                    grids[i].velocity.x = 15;
                            }
                        }
                    }, 0)
                }
            })
        })
    });

    if (ButtonState.BUTTON_LEFT.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    } else if (ButtonState.BUTTON_RIGHT.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;
    } else if (ButtonState.BUTTON_UP.pressed && player.position.y + player.height <= canvas.height) {
        player.position.y += 2;
        player.rotation = 0;
    } else if (ButtonState.BUTTON_DOWN.pressed && player.position.y >= 0) {
        player.position.y -= 2;
        player.rotation = 0;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;

    }

    if (frames % randomInterval == 0) {
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random() * 500) + 500;
        frames = 0;
    }
    frames++;

};
// animate();

addEventListener('keydown', (evt) => {
    if (game.over) {
        soundGameOver.play();
        return;
    }

    switch (evt.keyCode) {
        case 37:
            ButtonState.BUTTON_LEFT.pressed = true;
            break;
        case 39:
            ButtonState.BUTTON_RIGHT.pressed = true;
            break;
        case 38:
            ButtonState.BUTTON_DOWN.pressed = true;
            break;
        case 40:
            ButtonState.BUTTON_UP.pressed = true;
            break;
        case 32:
            soundShoot.play();
            projectiles.push(new Projectile({
                position: { x: player.position.x, y: player.position.y },
                velocity: { x: 0, y: -10 }
            }));
            break;
    }
})

addEventListener('keyup', (evt) => {
    if (game.over) {
        soundGameOver.play();
        return;
    }
    switch (evt.keyCode) {
        case 37:
            ButtonState.BUTTON_LEFT.pressed = false;
            break;
        case 39:
            ButtonState.BUTTON_RIGHT.pressed = false;
            break;
        case 38:
            ButtonState.BUTTON_DOWN.pressed = false;
            break;
        case 40:
            ButtonState.BUTTON_UP.pressed = false;
            break;
        case 32:
            break;
    }
})


if (game.active == true) {
    nameEl.hidden = true;
    scoreEl.hidden = true;
    level.hidden = true;
    numberLevel.hidden = true;
    buttonStart.hidden = false;
    buttonRestart.hidden = true;
    if (sound == true) {
        soundBackgroud.pause();
        soundShoot.pause();
        soundEnemyShoot.pause();
        soundGameOver.pause()
        soundScore.pause()
        soundStart.pause()
    }
    animateStart();
}

function startGame() {
    // game.active = true;
    // if (game.active == true) {
    nameEl.hidden = false;
    scoreEl.hidden = false;
    level.hidden = false;
    numberLevel.hidden = false;
    text.hidden = true;
    ruler.hidden = true;
    rulerMove.hidden = true;
    buttonStart.hidden = true;
    buttonRestart.hidden = true;
    soundStart.play();
    animate();

}

// if (statusGame == false) {
//     nameEl.hidden = true;
//     scoreEl.hidden = true;
//     buttonStart.hidden = false;
//     buttonRestart.hidden = true;
//     animateStart();
// }
// if (statusGame) {
//     animateStart();
// }

function restartGame() {
    game.active = true;
    text.hidden = false;
    textScore.hidden = true;
    ruler.hidden = false;
    rulerMove.hidden = false;
    if (game.active == true) {
        nameEl.hidden = true;
        scoreEl.hidden = true;
        level.hidden = true;
        numberLevel.hidden = true;
        buttonStart.hidden = false;
        buttonRestart.hidden = true;
        animateStart();
    }
}




