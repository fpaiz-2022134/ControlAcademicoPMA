'use strict'

import Course from './course.model.js'
import Teacher from '../teacher/teacher.model.js'
import Student from '../student/student.model.js'

import { checkUpdate } from '../utils/validator.js'
import jwt from 'jsonwebtoken'
export const test = (req, res)=>{
    return res.send('Hello World')
}

//Default course


export const defaultCourse = async (nameC, descriptionC, durationC) =>{
    try {
        const courseFound = await Course.findOne({name: 'DEFAULT'})
        const teacherFound = await Teacher.findOne({role: 'TEACHER_ROLE'})

        if(!courseFound){ //If teacher is not found we're gonna create it!
            
            const data = {
                name: nameC,
                description: descriptionC,
                duration: durationC,
                teacher: teacherFound._id
            }
            const course = new Course(data)
            await course.save()
            return console.log('Default course has been created.')

        } else {
            return console.log('A course already exists')
        }
    } catch (err) {
        console.error(err)
    }
}

defaultCourse('DEFAULT', 'Curso sin asignación', 'Sin tiempo de duración') 


export const addCourse = async(req, res)=>{
    try {
        //Capturamos info
        let data = req.body
        //Instancia del model
        let course = new Course(data)
        //Guardamos info
        await course.save()
        //Respuesta
        return res.send({message: 'Registered successfully'})
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

// Actualizar
export const updateCourse = async(req, res)=>{
    try {
        //Id del profesor
        let { _id } = req.teacher
        console.log(_id)
        //Obtener id del curso
        let { id } = req.params
        //Buscamos el curso por el id 
        let course = await Course.findById(id)
        console.log(course.teacher)
        //Validamos si el profesor del curso es el mismo que el teacher
        if(_id.toString() != course.teacher.toString()) return res.status(400).send({message: 'You cannot update the course because you are not the teacher.'})

        //Obtenemos datos de actualización
        let data = req.body
        //Validamos si trae datos para actualizar
        let updateCourse = checkUpdate(data, id)
        if(!updateCourse) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing'})
        //Actualizamos
        let updatedCourse = await Course.findOneAndUpdate(
            {_id:id},
            data,
            {new:true}
        )

        //Validamos la actualización
        if(!updatedCourse) return res.status(404).send({message: 'Course not found'})
        //Respuesta
        return res.send({message: 'Course updated successfully', updatedCourse})

    } catch (err) {
         console.error(err)
         return res.status(500).send({message: 'Error updating course'})
    }

}


export const getTeacherCourses = async(req, res) =>{
    try {
      //Obtenemos el id del profe
      let {teacher} = req.body
    /*  // Obtenemos el ID del profesor
    const teacher = await Teacher.findById({ id });
    console.log(teacher)
    if (!teacher) {
      return res.status(404).send({ message: 'Teacher not found.' });
    } */


      //Retornar todos los cursos donde este el teacher
      let courses = await Course.find({teacher})
      //Retornamos los cursos
      return res.send(courses)

        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting your courses.' })
    }
}

export const deleteCourse = async(req, res) =>{

    try {

    //Id del profesor
    let {_id} = req.teacher
    //Obtener id del curso
    let { id } = req.params
    //Buscamos el curso por el id 
    let course = await Course.findById(id)
    if (!course) {
        return res.status(404).send({ message: 'Course not found.' });
      }
    //Validamos si el profesor del curso es el mismo que el teacher
    if(_id.toString() != course.teacher.toString()) return res.status(400).send({message: 'You cannot update the course because you are not the teacher.'})

    //Desasignar el curso en el estudiante siendo el curso un array
    await Student.updateMany({courses: id}, {$pull: {courses: id}})
     
     //Eliminamos el curso
     await Course.findByIdAndDelete({_id: id})
     //Respuesta
     return res.send({message: 'Course deleted successfully'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting course'})
    }
}