'use client';

import Layout from '@/components/Layout';
import AuthWrapper from '@/components/AuthWrapper';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllCoursesWithData, calculateStudentProgress, generateNotifications } from '@/lib/data-service';
import { Course, Assignment, Submission, User, StudentProgress, Notification } from '@/types';
import { getProgressColor, formatShortDate } from '@/lib/utils';
import { useRole } from '@/context/role-context';

export default function Dashboard() {
  const { role } = useRole();
  const [data, setData] = useState<{
    courses: Course[];
    assignments: Assignment[];
    submissions: Submission[];
    students: User[];
    progress: StudentProgress[];
    notifications: Notification[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const classroomData = await fetchAllCoursesWithData();
        const progress = calculateStudentProgress(
          classroomData.courses,
          classroomData.assignments,
          classroomData.submissions
        );
        const notifications = generateNotifications(
          classroomData.assignments,
          classroomData.submissions,
          classroomData.students
        );

        setData({
          ...classroomData,
          progress,
          notifications,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <AuthWrapper>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </Layout>
      </AuthWrapper>
    );
  }

  if (error) {
    return (
      <AuthWrapper>
        <Layout>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </AuthWrapper>
    );
  }

  if (!data) return null;

  // Calculate dashboard stats
  const totalStudents = data.students.length;
  const totalCourses = data.courses.length;
  const totalSubmissions = data.submissions.length;
  const pendingSubmissions = data.submissions.filter(s => s.status === 'asignado' || s.status === 'sin_entregar').length;
  const unreadNotifications = data.notifications.filter(n => !n.read).length;

  // Get recent activity
  const recentSubmissions = data.submissions
    .filter(s => s.submittedAt)
    .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())
    .slice(0, 5);

  // Get students with low progress
  const studentsAtRisk = data.progress
    .filter(p => p.attendanceRate < 70 || (p.assignmentsCompleted / p.totalAssignments) < 0.5)
    .slice(0, 3);

  return (
    <AuthWrapper>
      <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {role === 'coordinator' ? 'Dashboard de Coordinación' : 
             role === 'teacher' ? 'Dashboard del Profesor' : 
             'Mi Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {role === 'coordinator' ? 'Vista general de todas las células y estudiantes' :
             role === 'teacher' ? 'Seguimiento de tu célula asignada' :
             'Tu progreso y actividades'}
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
                  const student = data.students.find(u => u.id === submission.studentId);
                  const assignment = data.assignments.find(a => a.id === submission.assignmentId);
                  
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
                  const student = data.students.find(u => u.id === progress.studentId);
                  const course = data.courses.find(c => c.id === progress.courseId);
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
              {data.courses.map((course) => {
                const teacher = data.students.find(u => u.id === course.teacherId);
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
    </AuthWrapper>
  );
}
