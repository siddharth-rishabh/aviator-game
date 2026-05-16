import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import authMiddleware from "./src/middleware/authMiddleware.js";
import Bet from "./src/models/Bet.js";
import { currentRoundId } from "./game/gameLogic.js";

import { game, players, history } from "./game/gameLogic.js";

import jwt from "jsonwebtoken";
import User from "./src/models/User.js";

const app = express();

dotenv.config();

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

io.use(async (socket, next) => {

    try {

        const token =
            socket.handshake.auth.token;

        if (!token) {
            return next(
                new Error("Authentication error")
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.userId
        );

        if (!user) {
            return next(
                new Error("User not found")
            );
        }

        socket.user = user;

        next();

    } catch (error) {

        next(
            new Error("Authentication error")
        );

    }

});

io.on("connection", (socket) => {

    players[socket.user._id] = {
        balance: socket.user.balance,
        bet: null,
        hasCashedOut: false
    };

    console.log(
        "User connected:",
        socket.id
    );

    const interval = setInterval(() => {

        socket.emit("game-update", {
            game,
            player:
                players[socket.user._id]
        });

    }, 100);

    socket.on(
        "place-bet",
        async (amount) => {

            const player =
                players[socket.user._id];

            if (!amount || amount <= 0) {
                return;
            }

            if (
                game.status !== "waiting"
            ) {
                return;
            }

            if (
                player.balance < amount
            ) {
                return;
            }

            if (player.bet) {
                return;
            }

            player.balance -= amount;

            await User.findByIdAndUpdate(
                socket.user._id,
                {
                    balance:
                        player.balance
                }
            );

            player.bet = amount;

            player.hasCashedOut = false;
        
await Bet.create({

    user: socket.user._id,

    amount,

    roundId: currentRoundId

});


        }
    );

    socket.on(
        "cash-out",
        async () => {

            const player =
                players[socket.user._id];

            if (
                game.status !== "start"
            ) {
                return;
            }

            if (!player.bet) {
                return;
            }

            const winningAmount =
                player.bet *
                game.multiplier;

            player.balance +=
                winningAmount;

            await User.findByIdAndUpdate(
                socket.user._id,
                {
                    balance:
                        player.balance
                }
            );

            player.hasCashedOut = true;

            player.bet = null;

        }
    );

    socket.on("disconnect", () => {

        clearInterval(interval);

        delete players[socket.user._id];

        console.log(
            "User disconnected"
        );

    });

});

app.get("/", (req, res) => {

    res.send("server is running");

});

app.get("/game", (req, res) => {

    res.json(game);

});

app.get("/history", (req, res) => {

    res.json(history);

});

app.get(
    "/profile",
    authMiddleware,
    (req, res) => {

        res.json({
            message:
                "Protected route accessed",
            user: req.user
        });

    }
);

server.listen(5000,"0.0.0.0", () => {

    console.log(
        "server is running at PORT: 5000"
    );

});