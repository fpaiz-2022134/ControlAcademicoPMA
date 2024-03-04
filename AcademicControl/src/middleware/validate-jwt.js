'use strict'

import jwt from 'jsonwebtoken'
import Teacher from '../teacher/teacher.model.js'
import Student from '../student/student.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { token } = req.headers
        //Verificar si viene el token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //obtener el uid que envió el token
        let { uid } = jwt.verify(token, secretKey)
        //Validar si el usuario aún existe en la BD
        let teacher = await Teacher.findOne({_id: uid})
        if(!teacher) return res.status(404).send({message: 'User not found - Unauthorized'})
        //Ok del Middleware
        req.teacher = teacher
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

export const validateJwtS = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { token } = req.headers
        //Verificar si viene el token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //obtener el uid que envió el token
        let { uid } = jwt.verify(token, secretKey)
        //Validar si el usuario aún existe en la BD
        let student = await Student.findOne({_id: uid})
        if(!student) return res.status(404).send({message: 'User not found - Unauthorized'})
        //Ok del Middleware
        req.student = student
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

export const isTeacher = async(req, res, next)=>{
    try{
        let { role, username } = req.teacher
        if(!role || role !== 'TEACHER_ROLE') return res.status(403).send({message: `You dont have access | username ${username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}

export const isStudent = async(req, res, next)=>{
    try{
        let { role, username } = req.student
        if(!role || role !== 'STUDENT_ROLE') return res.status(403).send({message: `You dont have access | username ${username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}