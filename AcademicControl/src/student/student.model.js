'use strict'

import {Schema, model} from 'mongoose'

const studentSchema = Schema({
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
    gradeCarrer: {
        type: String,
        require: true
    },
    carnet: {
        type: Number,
        require: true,
        maxLength:8,
        unique: true
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
    //Dato para asignar varios cursos
    courses: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }],
        validate: {
            validator: function(courses) {
                return courses.length <= 3;
            },
            message: 'El número máximo de cursos es 3.'
        }
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['STUDENT_ROLE', 'TEACHER_ROLE'], //Solo los datos que estén en el arreglo son válido
        required: true
    }

    /* coursesAccount: {
        type: Number,
        default: 0,
        require: false
    } */

});

export default model ('student', studentSchema)