'use strict'

import express from 'express'

import { 
    validateJwt,
    isTeacher
} from '../middleware/validate-jwt.js'

import {
    registerT,
    test,
    login,
    updateTeacher,
    deleteT
} from './teacher.controller.js'

const api = express.Router()

api.get('/test', [validateJwt, isTeacher], test)
api.post('/registerT', registerT)
api.post('/login', login)
api.put('/updateTeacher/:id', [validateJwt, isTeacher],  updateTeacher)
api.delete('/deleteT/:id', [validateJwt, isTeacher], deleteT)

export default api

