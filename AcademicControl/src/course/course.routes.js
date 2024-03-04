'use strict'

//Rutas del Curso

import { 
    validateJwt,
    isTeacher
} from '../middleware/validate-jwt.js'

import express from 'express'

import {test, addCourse, updateCourse, getTeacherCourses, deleteCourse} from './course.controller.js'

const api = express.Router()

//Middleware

api.get('/test',[validateJwt, isTeacher], test)
api.post('/addCourse', [validateJwt, isTeacher], addCourse)
api.put('/updateCourse/:id', [validateJwt, isTeacher], updateCourse)
api.get('/getTeacherCourses', [validateJwt, isTeacher], getTeacherCourses)
api.delete('/deleteCourse/:id',[validateJwt, isTeacher], deleteCourse )

export default api