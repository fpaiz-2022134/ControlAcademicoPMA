'use strict'

import express from 'express'

import {
    validateJwtS,
    isStudent
} from '../middleware/validate-jwt.js'


import {
    test,
    registerEst,
    getCourses,
    updateEst,
    login,
    deleteEst
} from './student.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/registerEst',  registerEst)
api.get('/getCourses', [validateJwtS, isStudent], getCourses)
api.put('/updateEst/:id',[validateJwtS, isStudent], updateEst)
api.post('/login', login),
api.delete('/deleteEst/:id', [validateJwtS, isStudent], deleteEst)
export default api