import Round from "../src/models/Round.js";
import crypto from "crypto";

const game={
    status: "waiting",
    multiplier: 1.00,
    crashPoint: 0,
    round: 1
}

const players={};
const history =[];
export let currentRoundId = null;

// function generateCrashPoint(){
//     return (Math.random()*5+1).toFixed(2);
// }

function gameStart(){
    startWaiting();
}

function startWaiting() {

    game.status = "waiting";

    game.multiplier = 1.00;

    game.crashPoint = 0;

    console.log("Waiting for next round...");

    setTimeout(() => {
        start();
    }, 5000);

}

async function start(){
   
const roundId =
    crypto.randomUUID();

currentRoundId = roundId;

game.status = "start";

game.multiplier = 1.00;

const crashPoint = generateCrashPoint();

game.crashPoint = crashPoint;

await Round.create({
    roundId,
    crashPoint
});
    console.log("crash Point:", crashPoint);
    
    const repeat = setInterval(()=>{
        game.multiplier += 0.01;

        // console.log("multiplier:", game.multiplier.toFixed(2))
        if(game.multiplier>=crashPoint){
            clearInterval(repeat);
            startCrash();
        }
    },100);
}

function startCrash(){
    game.status="crash";
    console.log("Market crashed");
    history.unshift(game.crashPoint);

    if(history.length > 15){
    history.pop();
}

Object.values(players).forEach((player) => {

    if(player.bet){

        if(player.hasCashedOut){

            console.log("Player WON the round");

        } else {

            console.log("Player LOST the round");

        }

        player.bet = null;

        player.hasCashedOut = false;

    }

});

    game.round++;
    setTimeout(()=>{
        startWaiting();
    },3000)
}

function generateCrashPoint() {

    const serverSeed =
        crypto.randomBytes(32)
        .toString("hex");

    const hash =
        crypto
        .createHmac(
            "sha256",
            serverSeed
        )
        .update(Date.now().toString())
        .digest("hex");

    const hex =
        hash.substring(0, 8);

    const int =
        parseInt(hex, 16);

    const crash =
        (int % 1000) / 100 + 1;

    return Math.max(
        1.00,
        Number(crash.toFixed(2))
    );

}
setTimeout(()=>{
    gameStart();
},8000);

export {game, players, history};