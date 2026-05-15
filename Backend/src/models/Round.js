import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({

    crashPoint: {
        type: Number,
        required: true
    },

    roundId: {
        type: String,
        required: true
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    endedAt: {
        type: Date,
        default: Date.now
    }

});

const Round =
    mongoose.model(
        "Round",
        roundSchema
    );

export default Round;