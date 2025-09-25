'use client';

import Layout from '@/components/Layout';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { mockUsers, mockCourses, mockStudentProgress, mockSubmissions, mockNotifications } from '@/lib/mockData';
import { getProgressColor, formatShortDate } from '@/lib/utils';

export default function Dashboard() {
  // Calculate dashboard stats
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalCourses = mockCourses.length;
  const totalSubmissions = mockSubmissions.length;
  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending').length;
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  // Get recent activity
  const recentSubmissions = mockSubmissions
    .filter(s => s.submittedAt)
    .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())
    .slice(0, 5);

  // Get students with low progress
  const studentsAtRisk = mockStudentProgress
    .filter(p => p.attendanceRate < 70 || (p.assignmentsCompleted / p.totalAssignments) < 0.5)
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Principal</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general del progreso de estudiantes y actividades
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Estudiantes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{totalStudents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Cursos Activos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{totalCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Entregas Pendientes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{pendingSubmissions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Notificaciones
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{unreadNotifications}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {recentSubmissions.map((submission) => {
                  const student = mockUsers.find(u => u.id === submission.studentId);
                  const assignment = mockSubmissions.find(s => s.id === submission.id);
                  
                  return (
                    <div key={submission.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{student?.name}</span> entregó una tarea
                        </p>
                        <p className="text-sm text-gray-500">
                          {submission.submittedAt && formatShortDate(submission.submittedAt)}
                        </p>
                      </div>
                      {submission.grade && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {submission.grade}/100
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Students at Risk */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Estudiantes en Riesgo
              </h3>
              <div className="space-y-4">
                {studentsAtRisk.map((progress) => {
                  const student = mockUsers.find(u => u.id === progress.studentId);
                  const course = mockCourses.find(c => c.id === progress.courseId);
                  const completionRate = (progress.assignmentsCompleted / progress.totalAssignments) * 100;
                  
                  return (
                    <div key={`${progress.studentId}-${progress.courseId}`} className="border-l-4 border-red-400 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                          <p className="text-sm text-gray-500">{course?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-600">
                            {Math.round(completionRate)}% completado
                          </p>
                          <p className="text-sm text-red-600">
                            {progress.attendanceRate}% asistencia
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumen de Cursos
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockCourses.map((course) => {
                const teacher = mockUsers.find(u => u.id === course.teacherId);
                const studentsInCourse = course.students.length;
                
                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">Prof. {teacher?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{studentsInCourse}</p>
                        <p className="text-sm text-gray-500">estudiantes</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progreso general</span>
                        <span className="font-medium text-gray-900">75%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
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
