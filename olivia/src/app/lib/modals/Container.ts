import mongoose from "mongoose";

export const User = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    hasAdmin: { type: Boolean, default: false }
})

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['building', 'ready', 'failed'],
        default: 'building'
    },
    repoUrl: { type: String, required: true },
})

export default mongoose.models.Projects || mongoose.model('Projects', ProjectSchema);