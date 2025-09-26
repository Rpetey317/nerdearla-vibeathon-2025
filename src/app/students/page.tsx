'use client';

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { getUsersByRole, fetchAllCoursesWithData, calculateStudentProgress, isUsingMocks } from '@/lib/data-service-enhanced';
import { Users, Mail, GraduationCap } from 'lucide-react';
import { User, Course, StudentProgress } from '@/types';

interface EnhancedStudent extends User {
  progress: (StudentProgress & { courseName: string })[];
  enrolledCourses: (StudentProgress & { courseName: string })[];
  avgCompletion: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const studentsData = getUsersByRole('student');
        const data = await fetchAllCoursesWithData();
        const progressData = calculateStudentProgress(data.courses, data.assignments, data.submissions);
        
        setStudents(studentsData);
        setCourses(data.courses);
        setProgress(progressData);
      } catch (error) {
        console.error('Error loading students:', error);
        setStudents([]);
        setCourses([]);
        setProgress([]);
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

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
            <p className="mt-1 text-sm text-gray-500">Lista de estudiantes y su progreso académico</p>
          </div>
          
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isUsingMocks() 
                ? 'Los datos de demostración no están disponibles.' 
                : 'Conecta tu cuenta de Google Classroom para ver los estudiantes.'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const studentsWithProgress: EnhancedStudent[] = students.map(student => {
    const studentProgress = progress.filter(p => p.studentId === student.id);
    const coursesWithProgress = studentProgress.map(p => {
      const course = courses.find(c => c.id === p.courseId);
      return { ...p, courseName: course?.name || 'Curso desconocido' };
    });
    
    // Calculate average completion rate for this student
    const avgCompletion = coursesWithProgress.length > 0 
      ? coursesWithProgress.reduce((sum, p) => sum + (p.assignmentsCompleted / p.totalAssignments) * 100, 0) / coursesWithProgress.length 
      : 0;
    
    return { 
      ...student, 
      progress: coursesWithProgress,
      enrolledCourses: coursesWithProgress,
      avgCompletion: Math.round(avgCompletion)
    };
  });

  const overallAvgCompletion = studentsWithProgress.length > 0 
    ? studentsWithProgress.reduce((sum, s) => sum + s.avgCompletion, 0) / studentsWithProgress.length 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
            <p className="mt-1 text-sm text-gray-500">Listado de estudiantes y su progreso general</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumno</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsWithProgress.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={s.avatar} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" /> {s.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" /> {s.enrolledCourses.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-40 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${s.avgCompletion}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-900">{s.avgCompletion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
