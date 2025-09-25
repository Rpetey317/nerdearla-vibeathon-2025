'use client';

import Layout from '@/components/Layout';
import { mockStudentProgress, mockSubmissions, mockAssignments, mockAttendance, mockCourses } from '@/lib/mockData';
import { BarChart3, Activity, PieChart, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function MetricsPage() {
  const totalStudentsTracked = new Set(mockStudentProgress.map(p => p.studentId)).size;
  const avgCompletion = Math.round(
    mockStudentProgress.reduce((sum, p) => sum + (p.assignmentsCompleted / p.totalAssignments) * 100, 0) / mockStudentProgress.length
  );
  const avgAttendance = Math.round(
    mockStudentProgress.reduce((sum, p) => sum + p.attendanceRate, 0) / mockStudentProgress.length
  );
  const graded = mockSubmissions.filter(s => s.status === 'graded').length;
  const submitted = mockSubmissions.filter(s => s.status === 'submitted').length;
  const late = mockSubmissions.filter(s => s.status === 'late').length;
  const pending = mockSubmissions.filter(s => s.status === 'pending').length;

  const courseAgg = mockCourses.map(c => {
    const progress = mockStudentProgress.filter(p => p.courseId === c.id);
    const completion = progress.length ? Math.round(progress.reduce((sum, p) => sum + (p.assignmentsCompleted / p.totalAssignments) * 100, 0) / progress.length) : 0;
    const attendance = progress.length ? Math.round(progress.reduce((sum, p) => sum + p.attendanceRate, 0) / progress.length) : 0;
    return { id: c.id, name: c.name, completion, attendance };
  });

  const total = graded + submitted + late + pending || 1;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Métricas y Reportes</h1>
          <p className="mt-1 text-sm text-gray-500">KPIs clave de participación y rendimiento</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estudiantes (seguimiento)</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudentsTracked}</p>
              </div>
              <Activity className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completado promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{avgCompletion}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Asistencia promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{avgAttendance}%</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Entregas (totales)</p>
                <p className="text-2xl font-semibold text-gray-900">{total}</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Submission Breakdown */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Entregas</h3>
          <div className="space-y-2">
            {[{label:'Calificadas', value: graded, color:'bg-green-600'}, {label:'Entregadas', value: submitted, color:'bg-blue-600'}, {label:'Tarde', value: late, color:'bg-yellow-500'}, {label:'Pendientes', value: pending, color:'bg-gray-400'}].map((row) => (
              <div key={row.label} className="flex items-center">
                <div className="w-32 text-sm text-gray-600">{row.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div className={`${row.color} h-2 rounded-full`} style={{ width: `${Math.round((row.value/(total||1))*100)}%` }}></div>
                </div>
                <div className="w-12 text-right text-sm text-gray-700">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Benchmarks */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Benchmarks por Curso</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courseAgg.map(c => (
              <div key={c.id} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Completado</span><span>{c.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${c.completion}%` }} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Asistencia</span><span>{c.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${c.attendance}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
