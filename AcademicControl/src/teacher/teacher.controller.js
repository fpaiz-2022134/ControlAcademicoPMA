'use strict'

import Teacher from './teacher.model.js'
import Student from '../student/student.model.js'

import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    return res.send('Hello World')
}


export const defaultTeacher = async (nameT, surnameT, ageT, emailT, dpiT, usernameT, passwordT) => {
    try {
        const teacherFound = await Teacher.findOne({ role: 'TEACHER_ROLE' })

        if (!teacherFound) { //If teacher is not found we're gonna create it!

            const data = {
                name: nameT,
                surname: surnameT,
                age: ageT,
                email: emailT,
                dpi: dpiT,
                username: usernameT,
                password: await encrypt(passwordT),
                role: 'TEACHER_ROLE'
            }
            const teacher = new Teacher(data)
            await teacher.save()
            return console.log('Default teacher has been created.')

        } else {
            return console.log('A teacher already exists')
        }
    } catch (err) {
        console.error(err)
    }
}

defaultTeacher('Josué', 'Noj', 27, 'josuenoj@gmail.com', '2345679800', 'jnoj', '987654')

export const registerT = async (req, res) => {
    try {
        //Info del profe
        let data = req.body
        //Encriptamos contraseña
        data.password = await encrypt(data.password)
        //Asignamos rol para profesor
        data.role = 'TEACHER_ROLE'
        //Guardamos
        let teacher = new Teacher(data)
        await teacher.save()
        //Respuesta
        return res.send({ message: 'Registered successfully.' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering the teacher.' })
    }
}

export const login = async (req, res) => {
    try {
        //Capturar la información (body)
        let { username, password } = req.body
        //Validar que el usuario existe
        let teacher = await Teacher.findOne({ username }) //username: 'jchitay'
        //Verifico que la contraseña coincida
        if (teacher && await checkPassword(password, teacher.password)) {
            let loggedTeacher = {
                uid: teacher._id,
                username: teacher.username,
                name: teacher.name,
                role: teacher.role
            }
            let token = await generateJwt(loggedTeacher)
            //Responder (dar acceso)
            return res.send(
                {
                    message: `Welcome professor ${teacher.name}`,
                    loggedTeacher,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })
    }
}


export const updateTeacher = async (req, res) => { //Usuarios logeado
    try {
        //Obtener id del token
        let { _id } = req.teacher

        //Obtener el id del usuario a actualizar
        let { id } = req.params

        //Obtener datos que vamos a actualizar
        let data = req.body

        //Validando que no actualice a otro teacher o que solo actualice el propio
        if (id != _id) {
            return res.status(400).send({ message: 'You only can update your information.' })
        } else if (data.role == 'TEACHER_ROLE') {
            return res.status(400).send({ message: 'You cannot update a teacher' })
        }



        //Validar si trae datos a actualizar
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have sumbmitted some data that cannot be updated or missing data' })
        //Validar si tiene permisos (tokenización) X Hoy no lo vemos X
        //Actualizamos en la BD
        let updatedTeacher = await Teacher.findOneAndUpdate(
            { _id: id },
            data, //Datos que actualizaremos
            { new: true } //Objeto de la BD ya actualizado
        )
        //Validar si se actualizó
        if (!updatedTeacher) return res.status(401).send({ message: 'User not found and not updated' })
        //Responder con el dato actualizado
        return res.send({ message: 'Updated user', updatedTeacher })
    } catch (err) {
        console.error(err)
        if (err.keyValue.username) return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` })
        return res.status(500).send({ message: 'Error updating teacher' })
    }
}

export const deleteT = async (req, res) => {
    try {
        //Obtener el id
        let { id } = req.params

        //Obtener el id del token
        let { _id } = req.teacher

        //Validar que sea el profe
        if (id != _id) {
            return res.status(400).send({ message: 'You only can delete your information.' })
        }

        //Eliminar (deleteOne (Solo elimina y no devuelve el documento) / findOneAndDelete (Devuelve el documento eliminado))
        let deletedTeacher = await Teacher.findOneAndDelete({ _id: id })
        //Verificar que se eliminó
        if (!deletedTeacher) return res.status(404).send({ message: 'Teacher not found and not deleted' })
        //Responder
        return res.send({ message: `Account with username ${deletedTeacher.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}