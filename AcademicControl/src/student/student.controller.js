'use strict'

import Student from './student.model.js'
import Course from '../course/course.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    return res.send('Hello World')
}


//LOGIN

export const login = async (req, res) => {
    try {
        //Capturar la información (body)
        let { username, password } = req.body
        //Validar que el usuario existe
        let student = await Student.findOne({ username }) //username: 'jchitay'
        //Verifico que la contraseña coincida
        if (student && await checkPassword(password, student.password)) {
            let loggedStudent = {
                uid: student._id,
                username: student.username,
                name: student.name,
                role: student.role
            }
            let token = await generateJwt(loggedStudent)
            //Responder (dar acceso)
            return res.send(
                {
                    message: `Welcome ${student.name}`,
                    loggedStudent,
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


export const registerEst = async (req, res) => {
    try {
        //Información del estudiante
        let data = req.body
        //Encriptamos contraseña
        data.password = await encrypt(data.password) //12345678
        //Asignamos el rol por defecto de estudiante
        data.role = 'STUDENT_ROLE'


        //Creación del estudiante
        let student = new Student(data)

        //Verificamos que no este ya asignado a alguno de los cursos
        if (student.courses.length == 2) {
            if (
                student.courses[0]._id.equals(student.courses[1]._id)
            ) {
                return res.status(400).send({ message: 'You cannot register a student that is already assigned to this course.' });
            }
        } else if (student.courses.length == 3) {
            if (
                student.courses[0]._id.equals(student.courses[1]._id) ||
                student.courses[1]._id.equals(student.courses[2]._id) ||
                student.courses[2]._id.equals(student.courses[0]._id)
            ) {
                return res.status(400).send({ message: 'You cannot register a student that is already assigned to this course.' });
            }
        }


        //Verificamos que el estudiante no pueda asignarse a más de 3 cursos

        if (student.courses.length > 3) {
            return res.status(400).send({ message: 'You cannot register more than 3 courses' })
        }
        //Guardamos el estudiante
        await student.save()
        return res.status(200).send({ message: 'Student registered successfully.' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}



export const getCourses = async (req, res) => {
    try {
        //Obtenemos el id del estudiante
        let { username } = req.body
        //id del token
        let { _id } = req.student

        // Encuentra el estudiante y popula los datos de cursos
        const student = await Student.findOne({ username }).populate({
            path: 'courses',
            model: 'course', // Nombre del modelo referenciado
        });

        if (!student) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        //Validación para obtener mis courses
        if(student.id != _id) return res.status(401).send({message: 'You cannot get the course of another people.'})
        // Obtenemos el array de cursos del estudiante
        const array = student.courses;

        // Iteramos sobre el array y obtenemos todos los datos de cada curso
        for (let i = 0; i < array.length; i++) {
            const courseId = array[i]._id;
            const course = await Course.findOne({ _id: courseId });

            // Verificamos si se encontró el curso
            if (course) {
                // Reemplazamos el objeto del array con todos los datos del curso
                array[i] = course.toObject();
            }
        }

        // Mostramos los cursos que tiene el estudiante en su array y los datos completos del curso
        return res.send(array);


    } catch (err) {

        console.error(err);
        return res.status(500).send({ message: 'Error getting your courses.' })

    }
}


export const updateEst = async (req, res) => {
    try {
        //Capturamos id a actualizar
        let { id } = req.params
        //Capturamos la data
        let data = req.body

        //Capturando id de token
        let { _id } = req.student

        //Verificamos que el estudiante no pueda eliminar otro estudiante
        if (_id != id) return res.status(400).send({ message: 'You cannot update another student, only your profile.' })


        //Validamos que vengan datos 
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing' })
        //Actualizamos
        let updatedStudent = await Student.updateOne(
            { _id: id },
            data,
            { new: true }
        )
        //Validamos la actualización
        if (!updatedStudent) return res.status(400).send({ message: 'Student not found.' })
        return res.status(200).send({ message: 'Student updated successfully.' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating student' })
    }
}


export const deleteEst = async (req, res) => {
    try {
        //Obtener el id
        let { id } = req.params

        //Capturando id de token
        let { _id } = req.student
        //Validar si está logeado y es el mismo
        if (_id != id) return res.status(400).send({ message: 'You cannot delete another student, only your profile.' })
        //Eliminar (deleteOne (Solo elimina y no devuelve el documento) / findOneAndDelete (Devuelve el documento eliminado))
        let deletedStudent = await Student.findByIdAndDelete(id)
        //Verificar que se eliminó
        if (!deletedStudent) return res.status(404).send({ message: 'Account not found and not deleted' })
        //Responder
        return res.send({ message: `Account with username ${deletedStudent.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}




