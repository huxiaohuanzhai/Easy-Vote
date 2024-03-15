import mongoose, { Mongoose } from "mongoose";

mongoose.connect(process.env.DSN);

const TutorSchema = new mongoose.Schema({
    name: String,
    password: String,
    type: String,
    courses: [{type: mongoose.Types.ObjectId, ref: 'Course'}],
});

const StudentSchema = new mongoose.Schema({
    netId: String,
    name: String,
    password: String,
});

const SessionSchema = new mongoose.Schema({
    student: [{type: mongoose.Types.ObjectId, ref: 'Student'}],
    tutor: [{type: mongoose.Types.ObjectId, ref: 'Tutor'}],
    courses: [{type: mongoose.Types.ObjectId, ref: 'Course'}],
    startTime: Date,
});

const CourseSchema = new mongoose.Schema({
    id: String,
    name: String,
    location: String,
    instructor: String
});

export const Tutor = mongoose.model('Tutor', TutorSchema);
export const Student = mongoose.model('Student', StudentSchema);
export const Session = mongoose.model('Session', SessionSchema);
export const Course = mongoose.model('Course', CourseSchema);