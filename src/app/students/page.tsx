'use client';

import Layout from '@/components/Layout';
import { mockUsers, mockCourses, mockStudentProgress } from '@/lib/mockData';
import { Users, Mail, GraduationCap } from 'lucide-react';

export default function StudentsPage() {
  const students = mockUsers.filter(u => u.role === 'student').map(s => {
    const enrolledCourses = mockCourses.filter(c => c.students.includes(s.id));
    const progress = mockStudentProgress.filter(p => p.studentId === s.id);
    const avgCompletion = progress.length ? Math.round(progress.reduce((sum, p) => sum + (p.assignmentsCompleted / p.totalAssignments) * 100, 0) / progress.length) : 0;
    return { ...s, enrolledCourses, avgCompletion };
  });

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
                {students.map(s => (
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
