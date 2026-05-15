import mongoose from "mongoose";

const betSchema = new mongoose.Schema({

    user: {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    cashoutMultiplier: {
        type: Number,
        default: null
    },

    winAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            "pending",
            "won",
            "lost"
        ],
        default: "pending"
    },

    roundId: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const Bet =
    mongoose.model(
        "Bet",
        betSchema
    );

export default Bet;
