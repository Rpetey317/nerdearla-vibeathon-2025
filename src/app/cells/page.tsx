'use client';

import Layout from '@/components/Layout';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { getStatusColor, getStatusLabel, getProgressColor } from '@/lib/utils';

// Mock data for cells (this would come from API)
const mockCells = [
  {
    id: 'cell-1',
    name: 'Célula A - E-commerce',
    teacherName: 'Prof. María García',
    courseId: 'course-1',
    totalStudents: 8,
    totalDeliveries: 24,
    lateDeliveries: 3,
    pendingAssignments: 5,
    averageGrade: 8.2,
    completionRate: 87.5
  },
  {
    id: 'cell-2',
    name: 'Célula B - E-commerce',
    teacherName: 'Prof. Juan Pérez',
    courseId: 'course-1',
    totalStudents: 8,
    totalDeliveries: 22,
    lateDeliveries: 1,
    pendingAssignments: 2,
    averageGrade: 9.1,
    completionRate: 95.8
  },
  {
    id: 'cell-3',
    name: 'Célula C - Data Analytics',
    teacherName: 'Prof. Ana López',
    courseId: 'course-2',
    totalStudents: 7,
    totalDeliveries: 18,
    lateDeliveries: 6,
    pendingAssignments: 8,
    averageGrade: 7.3,
    completionRate: 69.2
  },
  {
    id: 'cell-4',
    name: 'Célula D - Data Analytics',
    teacherName: 'Prof. Carlos Ruiz',
    courseId: 'course-2',
    totalStudents: 8,
    totalDeliveries: 20,
    lateDeliveries: 2,
    pendingAssignments: 4,
    averageGrade: 8.7,
    completionRate: 83.3
  }
];

export default function CellsPage() {
  // Calculate overall metrics
  const totalStudents = mockCells.reduce((sum, cell) => sum + cell.totalStudents, 0);
  const totalDeliveries = mockCells.reduce((sum, cell) => sum + cell.totalDeliveries, 0);
  const totalLateDeliveries = mockCells.reduce((sum, cell) => sum + cell.lateDeliveries, 0);
  const totalPendingAssignments = mockCells.reduce((sum, cell) => sum + cell.pendingAssignments, 0);
  const averageCompletionRate = mockCells.reduce((sum, cell) => sum + cell.completionRate, 0) / mockCells.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Células</h1>
          <p className="mt-2 text-gray-600">
            Vista general del rendimiento por células y profesores de práctica
          </p>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entregas</p>
                <p className="text-2xl font-bold text-gray-900">{totalDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregas Tardías</p>
                <p className="text-2xl font-bold text-gray-900">{totalLateDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{totalPendingAssignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Completado</p>
                <p className="text-2xl font-bold text-gray-900">{averageCompletionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cells Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCells.map((cell) => (
            <div key={cell.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cell.name}</h3>
                  <p className="text-sm text-gray-600">{cell.teacherName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(cell.completionRate)}`}>
                  {cell.completionRate.toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{cell.totalStudents}</p>
                  <p className="text-xs text-gray-600">Estudiantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{cell.totalDeliveries}</p>
                  <p className="text-xs text-gray-600">Entregas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{cell.lateDeliveries}</p>
                  <p className="text-xs text-gray-600">Tardías</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{cell.pendingAssignments}</p>
                  <p className="text-xs text-gray-600">Pendientes</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Promedio de Calificaciones</span>
                  <span className="font-semibold text-gray-900">{cell.averageGrade.toFixed(1)}/10</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(cell.averageGrade / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver Detalle →
                </button>
                {cell.completionRate < 75 && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Requiere Atención</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-lg font-semibold text-green-600">Células Destacadas</span>
              </div>
              <p className="text-sm text-gray-600">
                {mockCells.filter(c => c.completionRate >= 90).length} células con +90% completado
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="text-lg font-semibold text-yellow-600">En Progreso</span>
              </div>
              <p className="text-sm text-gray-600">
                {mockCells.filter(c => c.completionRate >= 75 && c.completionRate < 90).length} células entre 75-90%
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-lg font-semibold text-red-600">Requieren Apoyo</span>
              </div>
              <p className="text-sm text-gray-600">
                {mockCells.filter(c => c.completionRate < 75).length} células necesitan seguimiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
