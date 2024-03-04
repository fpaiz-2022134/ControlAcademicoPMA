'use strict'

import {Schema, model} from 'mongoose'

const courseSchema = Schema({
    name: {
    type: String,
    required: true
    },
    description: {
    type: String,
    required: true
    },
    duration: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    }

})



export default model ('course', courseSchema)