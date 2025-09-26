'use client';

import Layout from '@/components/Layout';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';
import { mockUsers, mockCourses, mockStudentProgress, mockSubmissions, mockAssignments } from '@/lib/mockData';
import { getProgressColor, formatShortDate } from '@/lib/utils';

export default function ProgressPage() {
  const students = mockUsers.filter(u => u.role === 'student');

  // Enhanced progress data with additional calculations
  const enhancedProgress = mockStudentProgress.map(progress => {
    const student = mockUsers.find(u => u.id === progress.studentId);
    const course = mockCourses.find(c => c.id === progress.courseId);
    const studentSubmissions = mockSubmissions.filter(s => s.studentId === progress.studentId);
    const courseAssignments = mockAssignments.filter(a => a.courseId === progress.courseId);
    
    const completionRate = (progress.assignmentsCompleted / progress.totalAssignments) * 100;
    const onTimeSubmissions = studentSubmissions.filter(s => s.status !== 'tarde' && s.status !== 'late').length;
    const onTimeRate = studentSubmissions.length > 0 ? (onTimeSubmissions / studentSubmissions.length) * 100 : 0;
    
    return {
      ...progress,
      student,
      course,
      completionRate,
      onTimeRate,
      status: completionRate >= 80 ? 'excellent' : completionRate >= 60 ? 'good' : 'needs_attention'
    };
  });

  // Group by student for consolidated view
  const studentSummary = students.map(student => {
    const studentProgressData = enhancedProgress.filter(p => p.studentId === student.id);
    const totalCourses = studentProgressData.length;
    const avgCompletion = totalCourses > 0 
      ? studentProgressData.reduce((sum, p) => sum + p.completionRate, 0) / totalCourses 
      : 0;
    const avgAttendance = totalCourses > 0 
      ? studentProgressData.reduce((sum, p) => sum + p.attendanceRate, 0) / totalCourses 
      : 0;
    const avgGrade = totalCourses > 0 
      ? studentProgressData.reduce((sum, p) => sum + p.averageGrade, 0) / totalCourses 
      : 0;

    return {
      student,
      totalCourses,
      avgCompletion,
      avgAttendance,
      avgGrade,
      courses: studentProgressData,
      status: avgCompletion >= 80 ? 'excellent' : avgCompletion >= 60 ? 'good' : 'needs_attention'
    };
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Progreso</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vista consolidada del avance por estudiante y curso
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rendimiento Excelente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {studentSummary.filter(s => s.status === 'excellent').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rendimiento Bueno
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {studentSummary.filter(s => s.status === 'good').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Necesita Atención
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {studentSummary.filter(s => s.status === 'needs_attention').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Promedio General
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(studentSummary.reduce((sum, s) => sum + s.avgCompletion, 0) / studentSummary.length)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Progreso por Estudiante
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cursos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asistencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentSummary.map((summary) => (
                    <tr key={summary.student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={summary.student.avatar}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {summary.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {summary.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {summary.totalCourses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${summary.avgCompletion}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(summary.avgCompletion)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {Math.round(summary.avgAttendance)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {summary.avgGrade > 0 ? Math.round(summary.avgGrade) : '-'}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          summary.status === 'excellent' 
                            ? 'bg-green-100 text-green-800'
                            : summary.status === 'good'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {summary.status === 'excellent' 
                            ? 'Excelente'
                            : summary.status === 'good'
                            ? 'Bueno'
                            : 'Atención'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Progress by Course */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Progreso Detallado por Curso
            </h3>
            <div className="space-y-6">
              {mockCourses.map((course) => {
                const courseProgress = enhancedProgress.filter(p => p.courseId === course.id);
                const teacher = mockUsers.find(u => u.id === course.teacherId);
                
                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">Profesor: {teacher?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {courseProgress.length} estudiantes
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {courseProgress.map((progress) => (
                        <div key={progress.studentId} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {progress.student?.name}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              progress.status === 'excellent' 
                                ? 'bg-green-100 text-green-800'
                                : progress.status === 'good'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(progress.completionRate)}%
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>Tareas:</span>
                              <span>{progress.assignmentsCompleted}/{progress.totalAssignments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Asistencia:</span>
                              <span>{progress.attendanceRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Promedio:</span>
                              <span>{progress.averageGrade > 0 ? Math.round(progress.averageGrade) : '-'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
