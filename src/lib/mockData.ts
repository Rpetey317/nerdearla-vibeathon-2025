import { User, Course, Assignment, Submission, Attendance, Notification, StudentProgress } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'maria.gonzalez@semillero.org',
    name: 'María González',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'carlos.rodriguez@semillero.org',
    name: 'Carlos Rodríguez',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'ana.martinez@semillero.org',
    name: 'Ana Martínez',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    email: 'lucia.fernandez@semillero.org',
    name: 'Lucía Fernández',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '5',
    email: 'diego.lopez@semillero.org',
    name: 'Diego López',
    role: 'coordinator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '6',
    email: 'sofia.torres@semillero.org',
    name: 'Sofía Torres',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Desarrollo Web Frontend',
    description: 'Aprende HTML, CSS, JavaScript y React para crear sitios web modernos',
    teacherId: '3',
    students: ['1', '2', '4', '6'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '2',
    name: 'Marketing Digital',
    description: 'Estrategias de marketing digital, redes sociales y publicidad online',
    teacherId: '3',
    students: ['1', '4', '6'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-09-18')
  },
  {
    id: '3',
    name: 'Diseño UX/UI',
    description: 'Principios de diseño de experiencia de usuario e interfaces',
    teacherId: '3',
    students: ['2', '4'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-09-15')
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Proyecto Final - Sitio Web Personal',
    description: 'Crear un sitio web personal usando HTML, CSS y JavaScript',
    dueDate: new Date('2024-10-15'),
    maxPoints: 100,
    createdAt: new Date('2024-09-01')
  },
  {
    id: '2',
    courseId: '1',
    title: 'Ejercicio React - Lista de Tareas',
    description: 'Implementar una aplicación de lista de tareas usando React',
    dueDate: new Date('2024-09-30'),
    maxPoints: 80,
    createdAt: new Date('2024-09-15')
  },
  {
    id: '3',
    courseId: '2',
    title: 'Campaña de Marketing Digital',
    description: 'Diseñar una campaña completa de marketing digital para un producto',
    dueDate: new Date('2024-10-05'),
    maxPoints: 90,
    createdAt: new Date('2024-09-10')
  },
  {
    id: '4',
    courseId: '3',
    title: 'Prototipo de App Móvil',
    description: 'Crear un prototipo de alta fidelidad para una aplicación móvil',
    dueDate: new Date('2024-10-20'),
    maxPoints: 95,
    createdAt: new Date('2024-09-05')
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentId: '1',
    submittedAt: new Date('2024-09-28'),
    grade: 85,
    status: 'evaluado',
    feedback: 'Excelente trabajo en el diseño, mejorar la funcionalidad JavaScript'
  },
  {
    id: '2',
    assignmentId: '1',
    studentId: '2',
    status: 'entregado'
  },
  {
    id: '3',
    assignmentId: '2',
    studentId: '1',
    submittedAt: new Date('2024-09-29'),
    grade: 92,
    status: 'evaluado',
    feedback: 'Muy bien implementado, código limpio y funcional'
  },
  {
    id: '4',
    assignmentId: '2',
    studentId: '4',
    submittedAt: new Date('2024-10-01'),
    status: 'tarde'
  },
  {
    id: '5',
    assignmentId: '3',
    studentId: '1',
    submittedAt: new Date('2024-09-25'),
    grade: 88,
    status: 'evaluado'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    courseId: '1',
    studentId: '1',
    date: new Date('2024-09-20'),
    status: 'present'
  },
  {
    id: '2',
    courseId: '1',
    studentId: '2',
    date: new Date('2024-09-20'),
    status: 'absent'
  },
  {
    id: '3',
    courseId: '1',
    studentId: '4',
    date: new Date('2024-09-20'),
    status: 'present'
  },
  {
    id: '4',
    courseId: '1',
    studentId: '1',
    date: new Date('2024-09-18'),
    status: 'late'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Nueva tarea asignada',
    message: 'Se ha asignado una nueva tarea en Desarrollo Web Frontend',
    type: 'assignment',
    read: false,
    createdAt: new Date('2024-09-24')
  },
  {
    id: '2',
    userId: '1',
    title: 'Calificación disponible',
    message: 'Tu proyecto ha sido calificado: 85/100',
    type: 'grade',
    read: true,
    createdAt: new Date('2024-09-23')
  },
  {
    id: '3',
    userId: '2',
    title: 'Recordatorio de entrega',
    message: 'La tarea "Lista de Tareas React" vence mañana',
    type: 'reminder',
    read: false,
    createdAt: new Date('2024-09-24')
  }
];

export const mockStudentProgress: StudentProgress[] = [
  {
    studentId: '1',
    courseId: '1',
    assignmentsCompleted: 2,
    totalAssignments: 3,
    averageGrade: 88.5,
    attendanceRate: 85,
    lastActivity: new Date('2024-09-24')
  },
  {
    studentId: '2',
    courseId: '1',
    assignmentsCompleted: 0,
    totalAssignments: 3,
    averageGrade: 0,
    attendanceRate: 60,
    lastActivity: new Date('2024-09-15')
  },
  {
    studentId: '4',
    courseId: '1',
    assignmentsCompleted: 1,
    totalAssignments: 3,
    averageGrade: 75,
    attendanceRate: 90,
    lastActivity: new Date('2024-09-22')
  },
  {
    studentId: '1',
    courseId: '2',
    assignmentsCompleted: 1,
    totalAssignments: 2,
    averageGrade: 88,
    attendanceRate: 95,
    lastActivity: new Date('2024-09-23')
  }
];
