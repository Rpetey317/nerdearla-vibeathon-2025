'use client';

import Layout from '@/components/Layout';
import { BookOpen, Users, Calendar, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllCoursesWithData, getAllUsers, isUsingMocks } from '@/lib/data-service-enhanced';
import { formatShortDate } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { Course, Assignment, User } from '@/types';

export default function CoursesPage() {
  const { role } = useRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllCoursesWithData();
        const allUsers = getAllUsers();
        setCourses(data.courses);
        setAssignments(data.assignments);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
        setAssignments([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Show empty state if no courses
  if (courses.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
              <p className="mt-1 text-sm text-gray-500">Lista de cursos activos y próximas entregas</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isUsingMocks() 
                ? 'Los datos de demostración no están disponibles.' 
                : 'Conecta tu cuenta de Google Classroom para ver los cursos.'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const enhanced = courses.map(c => {
    const teacher = users.find(u => u.id === c.teacherId);
    const courseAssignments = assignments.filter(a => a.courseId === c.id);
    return { ...c, teacher, assignments: courseAssignments };
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
            <p className="mt-1 text-sm text-gray-500">Lista de cursos activos y próximas entregas</p>
          </div>
          {(role === 'teacher' || role === 'coordinator') && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
              <PlusCircle className="h-5 w-5 mr-2" />
              Nuevo curso
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enhanced.map(course => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">Prof. {course.teacher?.name}</p>
                </div>
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{course.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" /> {course.students.length} estudiantes
                </div>
                <div className="text-xs text-gray-500">Actualizado {formatShortDate(course.updatedAt)}</div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Próximas entregas</h4>
                <div className="space-y-2">
                  {course.assignments.slice(0,2).map(a => (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{a.title}</span>
                      <span className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" /> {formatShortDate(a.dueDate)}
                      </span>
                    </div>
                  ))}
                  {course.assignments.length === 0 && (
                    <p className="text-sm text-gray-500">Sin tareas próximas</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
