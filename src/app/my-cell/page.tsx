'use client';

import Layout from '@/components/Layout';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTeacherCell, isUsingMocks } from '@/lib/data-service-enhanced';
import { getStatusColor, getStatusLabel, formatShortDate } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { TeacherCell, CellStudent, StudentAssignment } from '@/types';

// Mock data for teacher's assigned cell
const mockTeacherCell: TeacherCell = {
  id: 'cell-teacher-1',
  name: 'Célula A - E-commerce',
  teacherName: 'Prof. María García',
  courseId: 'course-1',
  courseName: 'E-commerce y Marketing Digital',
  students: [
    {
      id: 'student-1',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      assignments: [
        { id: 'assign-1', title: 'Landing Page Design', status: 'evaluado', grade: 9, dueDate: new Date('2024-01-15') },
        { id: 'assign-2', title: 'SEO Optimization', status: 'entregado', grade: null, dueDate: new Date('2024-01-20') },
        { id: 'assign-3', title: 'Social Media Strategy', status: 'asignado', grade: null, dueDate: new Date('2024-01-25') }
      ],
      completionRate: 85,
      averageGrade: 8.5,
      lastActivity: new Date('2024-01-18')
    },
    {
      id: 'student-2',
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      assignments: [
        { id: 'assign-1', title: 'Landing Page Design', status: 'evaluado', grade: 7, dueDate: new Date('2024-01-15') },
        { id: 'assign-2', title: 'SEO Optimization', status: 'tarde', grade: null, dueDate: new Date('2024-01-20') },
        { id: 'assign-3', title: 'Social Media Strategy', status: 'borrador', grade: null, dueDate: new Date('2024-01-25') }
      ],
      completionRate: 60,
      averageGrade: 7.0,
      lastActivity: new Date('2024-01-16')
    },
    {
      id: 'student-3',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      assignments: [
        { id: 'assign-1', title: 'Landing Page Design', status: 'evaluado', grade: 10, dueDate: new Date('2024-01-15') },
        { id: 'assign-2', title: 'SEO Optimization', status: 'evaluado', grade: 9, dueDate: new Date('2024-01-20') },
        { id: 'assign-3', title: 'Social Media Strategy', status: 'entregado', grade: null, dueDate: new Date('2024-01-25') }
      ],
      completionRate: 95,
      averageGrade: 9.5,
      lastActivity: new Date('2024-01-19')
    },
    {
      id: 'student-4',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      assignments: [
        { id: 'assign-1', title: 'Landing Page Design', status: 'evaluado', grade: 8, dueDate: new Date('2024-01-15') },
        { id: 'assign-2', title: 'SEO Optimization', status: 'sin_entregar', grade: null, dueDate: new Date('2024-01-20') },
        { id: 'assign-3', title: 'Social Media Strategy', status: 'asignado', grade: null, dueDate: new Date('2024-01-25') }
      ],
      completionRate: 45,
      averageGrade: 8.0,
      lastActivity: new Date('2024-01-14')
    }
  ]
};

export default function MyCellPage() {
  const { role } = useRole();
  const [cellData, setCellData] = useState<TeacherCell | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCellData() {
      try {
        // In a real app, you'd get the current teacher's ID from session
        const teacherId = 'teacher-1'; // This would come from authentication
        const data = getTeacherCell(teacherId);
        setCellData(data);
      } catch (error) {
        console.error('Error loading cell data:', error);
        setCellData(null);
      } finally {
        setLoading(false);
      }
    }
    loadCellData();
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

  if (!cellData) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mi Célula</h1>
            <p className="mt-2 text-gray-600">
              Gestión de estudiantes asignados
            </p>
          </div>
          
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay célula asignada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isUsingMocks() 
                ? 'Los datos de demostración no están disponibles.' 
                : 'No tienes estudiantes asignados o no hay conexión con Google Classroom.'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const { students } = cellData;
  
  // Calculate cell metrics
  const totalAssignments = students[0]?.assignments.length || 0;
  const totalSubmissions = students.reduce((sum: number, student: CellStudent) => 
    sum + student.assignments.filter((a: StudentAssignment) => a.status === 'entregado' || a.status === 'evaluado').length, 0
  );
  const lateSubmissions = students.reduce((sum: number, student: CellStudent) => 
    sum + student.assignments.filter((a: StudentAssignment) => a.status === 'tarde').length, 0
  );
  const pendingReviews = students.reduce((sum: number, student: CellStudent) => 
    sum + student.assignments.filter((a: StudentAssignment) => a.status === 'entregado').length, 0
  );
  const averageCellGrade = students.reduce((sum: number, student: CellStudent) => sum + student.averageGrade, 0) / students.length;

  // Identify students needing attention
  const studentsNeedingAttention = students.filter((s: CellStudent) => s.completionRate < 70 || s.averageGrade < 7);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{cellData.name}</h1>
          <p className="mt-2 text-gray-600">
            {cellData.courseName} • {students.length} estudiantes asignados
          </p>
        </div>

        {/* Cell Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregas Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregas Tardías</p>
                <p className="text-2xl font-bold text-gray-900">{lateSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Por Revisar</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Célula</p>
                <p className="text-2xl font-bold text-gray-900">{averageCellGrade.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Needing Attention */}
        {studentsNeedingAttention.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">Estudiantes que Requieren Atención</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentsNeedingAttention.map((student: CellStudent) => (
                <div key={student.id} className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">
                    Completado: {student.completionRate}% • Promedio: {student.averageGrade}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Mis Estudiantes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado de Tareas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student: CellStudent) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.completionRate >= 80 ? 'bg-green-600' : 
                              student.completionRate >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${student.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {student.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        student.averageGrade >= 8 ? 'text-green-600' : 
                        student.averageGrade >= 7 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.averageGrade.toFixed(1)}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatShortDate(student.lastActivity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {student.assignments.map((assignment: StudentAssignment, index: number) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status).replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[1]}`}
                            title={`${assignment.title}: ${getStatusLabel(assignment.status)}`}
                          ></div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver Detalle
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Contactar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Status Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Tareas por Estudiante</h3>
          <div className="space-y-4">
            {students.map((student: CellStudent) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <span className="text-sm text-gray-500">
                    {student.assignments.filter((a: StudentAssignment) => a.status === 'evaluado').length}/{student.assignments.length} evaluadas
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {student.assignments.map((assignment: StudentAssignment) => (
                    <div key={assignment.id} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-900">{assignment.title}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusLabel(assignment.status)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Vence: {formatShortDate(assignment.dueDate)}</span>
                        {assignment.grade && (
                          <span className="font-medium">Nota: {assignment.grade}/10</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
