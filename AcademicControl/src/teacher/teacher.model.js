'use strict'

import { Schema, model } from "mongoose"


const teacherSchema = Schema ({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    dpi: {
        type: Number,
        require: true
    },
    username: {
        type: String,
        lowercase: true,
        require: true,
        unique: true
    }, 
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        require: true
    },
    role: {

    },
    role: {
        type: String,
        uppercase: true,
        enum: ['STUDENT_ROLE', 'TEACHER_ROLE'], //Solo los datos que estén en el arreglo son válido
        required: true
    }
    /* courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
    }],
    coursesAccount: {
        type: Number,
        default: 0,
        require: false
    } */

})

export default model ('teacher', teacherSchema)