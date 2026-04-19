import mongoose, { Schema, model, models, Model } from "mongoose";

// --- User Model ---
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
});

// Assign to a constant so it can be exported and used as a Class/Model
export const User = (models.User as Model<any>) || model('User', UserSchema);


// --- Project Model ---
const ProjectSchema = new Schema({
    projectName: { type: String, required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['building', 'ready', 'failed'],
        default: 'building'
    },
    repoUrl: { type: String, required: true },
}, {
    timestamps: true
});

const Project = models.Projects || model('Projects', ProjectSchema);
export default Project;