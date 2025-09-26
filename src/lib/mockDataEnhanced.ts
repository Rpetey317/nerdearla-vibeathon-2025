import { User, Course, Assignment, Submission, StudentProgress, Notification, Cell, CellMetrics } from '@/types';

// Enhanced mock data for Semillero Digital demo
export const mockUsersEnhanced: User[] = [
  // Coordinators
  {
    id: 'coord-1',
    email: 'coordinador@semillerodigital.org',
    name: 'Dr. Patricia Rodríguez',
    role: 'coordinator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },

  // Teachers (Profesores de Práctica)
  {
    id: 'teacher-1',
    email: 'maria.garcia@semillerodigital.org',
    name: 'Prof. María García',
    role: 'teacher',
    cellId: 'cell-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'teacher-2',
    email: 'juan.perez@semillerodigital.org',
    name: 'Prof. Juan Pérez',
    role: 'teacher',
    cellId: 'cell-2',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'teacher-3',
    email: 'ana.lopez@semillerodigital.org',
    name: 'Prof. Ana López',
    role: 'teacher',
    cellId: 'cell-3',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: 'teacher-4',
    email: 'carlos.ruiz@semillerodigital.org',
    name: 'Prof. Carlos Ruiz',
    role: 'teacher',
    cellId: 'cell-4',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },

  // Students - Célula A (E-commerce)
  {
    id: 'student-1',
    email: 'ana.martinez@estudiante.com',
    name: 'Ana Martínez',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-2',
    email: 'carlos.lopez@estudiante.com',
    name: 'Carlos López',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-3',
    email: 'maria.gonzalez@estudiante.com',
    name: 'María González',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-4',
    email: 'juan.perez.est@estudiante.com',
    name: 'Juan Pérez',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-5',
    email: 'sofia.rodriguez@estudiante.com',
    name: 'Sofía Rodríguez',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-6',
    email: 'diego.fernandez@estudiante.com',
    name: 'Diego Fernández',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-7',
    email: 'lucia.torres@estudiante.com',
    name: 'Lucía Torres',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },
  {
    id: 'student-8',
    email: 'miguel.santos@estudiante.com',
    name: 'Miguel Santos',
    role: 'student',
    assignedTeacherId: 'teacher-1',
    cellId: 'cell-1'
  },

  // Students - Célula B (E-commerce)
  {
    id: 'student-9',
    email: 'valentina.morales@estudiante.com',
    name: 'Valentina Morales',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-10',
    email: 'sebastian.herrera@estudiante.com',
    name: 'Sebastián Herrera',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-11',
    email: 'camila.vargas@estudiante.com',
    name: 'Camila Vargas',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-12',
    email: 'andres.castillo@estudiante.com',
    name: 'Andrés Castillo',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-13',
    email: 'isabella.jimenez@estudiante.com',
    name: 'Isabella Jiménez',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-14',
    email: 'nicolas.mendoza@estudiante.com',
    name: 'Nicolás Mendoza',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-15',
    email: 'gabriela.ortiz@estudiante.com',
    name: 'Gabriela Ortiz',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },
  {
    id: 'student-16',
    email: 'felipe.ramos@estudiante.com',
    name: 'Felipe Ramos',
    role: 'student',
    assignedTeacherId: 'teacher-2',
    cellId: 'cell-2'
  },

  // Students - Célula C (Data Analytics) - Lower performing
  {
    id: 'student-17',
    email: 'daniela.cruz@estudiante.com',
    name: 'Daniela Cruz',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-18',
    email: 'alejandro.silva@estudiante.com',
    name: 'Alejandro Silva',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-19',
    email: 'natalia.reyes@estudiante.com',
    name: 'Natalia Reyes',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-20',
    email: 'ricardo.moreno@estudiante.com',
    name: 'Ricardo Moreno',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-21',
    email: 'paola.gutierrez@estudiante.com',
    name: 'Paola Gutiérrez',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-22',
    email: 'oscar.delgado@estudiante.com',
    name: 'Óscar Delgado',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },
  {
    id: 'student-23',
    email: 'andrea.vega@estudiante.com',
    name: 'Andrea Vega',
    role: 'student',
    assignedTeacherId: 'teacher-3',
    cellId: 'cell-3'
  },

  // Students - Célula D (Data Analytics)
  {
    id: 'student-24',
    email: 'mateo.aguilar@estudiante.com',
    name: 'Mateo Aguilar',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-25',
    email: 'valeria.paredes@estudiante.com',
    name: 'Valeria Paredes',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-26',
    email: 'emilio.navarro@estudiante.com',
    name: 'Emilio Navarro',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-27',
    email: 'mariana.campos@estudiante.com',
    name: 'Mariana Campos',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-28',
    email: 'joaquin.rojas@estudiante.com',
    name: 'Joaquín Rojas',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-29',
    email: 'carolina.medina@estudiante.com',
    name: 'Carolina Medina',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-30',
    email: 'fernando.luna@estudiante.com',
    name: 'Fernando Luna',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  },
  {
    id: 'student-31',
    email: 'alejandra.soto@estudiante.com',
    name: 'Alejandra Soto',
    role: 'student',
    assignedTeacherId: 'teacher-4',
    cellId: 'cell-4'
  }
];

export const mockCoursesEnhanced: Course[] = [
  {
    id: 'course-1',
    name: 'E-commerce y Marketing Digital',
    description: 'Curso completo de comercio electrónico y estrategias de marketing digital para emprendedores',
    teacherId: 'coord-1',
    students: mockUsersEnhanced.filter(u => u.cellId === 'cell-1' || u.cellId === 'cell-2').map(u => u.id),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'course-2',
    name: 'Data Analytics y Business Intelligence',
    description: 'Análisis de datos, visualización y toma de decisiones basada en datos',
    teacherId: 'coord-1',
    students: mockUsersEnhanced.filter(u => u.cellId === 'cell-3' || u.cellId === 'cell-4').map(u => u.id),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
];

export const mockCellsEnhanced: Cell[] = [
  {
    id: 'cell-1',
    name: 'Célula A - E-commerce',
    teacherId: 'teacher-1',
    courseId: 'course-1',
    studentIds: mockUsersEnhanced.filter(u => u.cellId === 'cell-1').map(u => u.id),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cell-2',
    name: 'Célula B - E-commerce',
    teacherId: 'teacher-2',
    courseId: 'course-1',
    studentIds: mockUsersEnhanced.filter(u => u.cellId === 'cell-2').map(u => u.id),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cell-3',
    name: 'Célula C - Data Analytics',
    teacherId: 'teacher-3',
    courseId: 'course-2',
    studentIds: mockUsersEnhanced.filter(u => u.cellId === 'cell-3').map(u => u.id),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cell-4',
    name: 'Célula D - Data Analytics',
    teacherId: 'teacher-4',
    courseId: 'course-2',
    studentIds: mockUsersEnhanced.filter(u => u.cellId === 'cell-4').map(u => u.id),
    createdAt: new Date('2024-01-01')
  }
];

export const mockAssignmentsEnhanced: Assignment[] = [
  // E-commerce assignments
  {
    id: 'assign-1',
    courseId: 'course-1',
    title: 'Landing Page Design',
    description: 'Crear una landing page efectiva para un producto digital',
    dueDate: new Date('2024-01-15'),
    maxPoints: 10,
    createdAt: new Date('2024-01-08')
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    title: 'SEO Optimization',
    description: 'Optimizar contenido web para motores de búsqueda',
    dueDate: new Date('2024-01-22'),
    maxPoints: 10,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'assign-3',
    courseId: 'course-1',
    title: 'Social Media Strategy',
    description: 'Desarrollar estrategia integral de redes sociales',
    dueDate: new Date('2024-01-29'),
    maxPoints: 10,
    createdAt: new Date('2024-01-22')
  },

  // Data Analytics assignments
  {
    id: 'assign-4',
    courseId: 'course-2',
    title: 'Data Visualization Dashboard',
    description: 'Crear dashboard interactivo con Power BI o Tableau',
    dueDate: new Date('2024-01-18'),
    maxPoints: 10,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'assign-5',
    courseId: 'course-2',
    title: 'SQL Query Optimization',
    description: 'Optimizar consultas SQL para análisis de datos',
    dueDate: new Date('2024-01-25'),
    maxPoints: 10,
    createdAt: new Date('2024-01-18')
  },
  {
    id: 'assign-6',
    courseId: 'course-2',
    title: 'Predictive Analytics Model',
    description: 'Desarrollar modelo predictivo usando Python/R',
    dueDate: new Date('2024-02-01'),
    maxPoints: 10,
    createdAt: new Date('2024-01-25')
  }
];

// Generate realistic submissions with varied performance per cell

// Helper function to generate submissions
const generateSubmissions = () => {
  const submissions: Submission[] = [];
  const students = mockUsersEnhanced.filter(u => u.role === 'student');
  
  students.forEach(student => {
    const courseId = student.cellId?.includes('cell-1') || student.cellId?.includes('cell-2') ? 'course-1' : 'course-2';
    const assignments = mockAssignmentsEnhanced.filter(a => a.courseId === courseId);
    
    assignments.forEach((assignment, index) => {
      let status: Submission['status'];
      let grade: number | undefined;
      let submittedAt: Date | undefined;
      
      // Cell-specific performance patterns
      if (student.cellId === 'cell-1') {
        // High performing cell
        if (index === 0) { status = 'evaluado'; grade = Math.floor(Math.random() * 3) + 8; submittedAt = new Date('2024-01-14'); }
        else if (index === 1) { status = 'entregado'; submittedAt = new Date('2024-01-21'); }
        else { status = 'asignado'; }
      } else if (student.cellId === 'cell-2') {
        // Very high performing cell
        if (index === 0) { status = 'evaluado'; grade = Math.floor(Math.random() * 2) + 9; submittedAt = new Date('2024-01-13'); }
        else if (index === 1) { status = 'evaluado'; grade = Math.floor(Math.random() * 2) + 8; submittedAt = new Date('2024-01-20'); }
        else { status = 'entregado'; submittedAt = new Date('2024-01-28'); }
      } else if (student.cellId === 'cell-3') {
        // Lower performing cell (needs attention)
        if (index === 0) { status = Math.random() > 0.3 ? 'evaluado' : 'tarde'; grade = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 6 : undefined; submittedAt = Math.random() > 0.3 ? new Date('2024-01-17') : new Date('2024-01-20'); }
        else if (index === 1) { status = Math.random() > 0.4 ? 'borrador' : 'sin_entregar'; }
        else { status = 'asignado'; }
      } else if (student.cellId === 'cell-4') {
        // Good performing cell
        if (index === 0) { status = 'evaluado'; grade = Math.floor(Math.random() * 3) + 7; submittedAt = new Date('2024-01-16'); }
        else if (index === 1) { status = Math.random() > 0.2 ? 'entregado' : 'tarde'; submittedAt = new Date('2024-01-24'); }
        else { status = 'borrador'; }
      }
      
      submissions.push({
        id: `sub-${student.id}-${assignment.id}`,
        assignmentId: assignment.id,
        studentId: student.id,
        submittedAt,
        grade,
        status: status!,
        cellId: student.cellId,
        feedback: grade ? `Buen trabajo. ${grade >= 8 ? 'Excelente comprensión de los conceptos.' : 'Hay aspectos que mejorar.'}` : undefined
      });
    });
  });
  
  return submissions;
};

export const mockSubmissionsEnhanced: Submission[] = generateSubmissions();

// Generate student progress based on submissions
export const mockStudentProgressEnhanced: StudentProgress[] = mockUsersEnhanced
  .filter(u => u.role === 'student')
  .map(student => {
    const studentSubmissions = mockSubmissionsEnhanced.filter(s => s.studentId === student.id);
    const courseId = student.cellId?.includes('cell-1') || student.cellId?.includes('cell-2') ? 'course-1' : 'course-2';
    const totalAssignments = mockAssignmentsEnhanced.filter(a => a.courseId === courseId).length;
    const completedAssignments = studentSubmissions.filter(s => s.status === 'evaluado' || s.status === 'entregado').length;
    const gradedSubmissions = studentSubmissions.filter(s => s.grade !== undefined);
    const averageGrade = gradedSubmissions.length > 0 
      ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length 
      : 0;
    
    // Cell-specific attendance patterns
    let attendanceRate: number;
    if (student.cellId === 'cell-1' || student.cellId === 'cell-2') attendanceRate = Math.random() * 15 + 85; // 85-100%
    else if (student.cellId === 'cell-3') attendanceRate = Math.random() * 25 + 65; // 65-90%
    else attendanceRate = Math.random() * 20 + 75; // 75-95%
    
    return {
      studentId: student.id,
      courseId,
      assignmentsCompleted: completedAssignments,
      totalAssignments,
      averageGrade,
      attendanceRate,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last week
      cellId: student.cellId
    };
  });

export const mockNotificationsEnhanced: Notification[] = [
  {
    id: 'notif-1',
    userId: 'teacher-1',
    title: 'Entregas Tardías en tu Célula',
    message: '2 estudiantes tienen entregas tardías esta semana. Revisa el progreso de Carlos López y Juan Pérez.',
    type: 'late_delivery',
    read: false,
    createdAt: new Date('2024-01-20T09:00:00')
  },
  {
    id: 'notif-2',
    userId: 'coord-1',
    title: 'Célula C Requiere Atención',
    message: 'La Célula C - Data Analytics tiene un 69% de completado. Considera programar sesión de apoyo.',
    type: 'cell_alert',
    read: false,
    createdAt: new Date('2024-01-19T14:30:00')
  },
  {
    id: 'notif-3',
    userId: 'teacher-2',
    title: 'Excelente Rendimiento',
    message: 'Tu Célula B tiene el mejor promedio del curso con 9.1/10. ¡Felicitaciones!',
    type: 'announcement',
    read: true,
    createdAt: new Date('2024-01-18T16:45:00')
  },
  {
    id: 'notif-4',
    userId: 'teacher-3',
    title: 'Tareas por Revisar',
    message: '4 estudiantes entregaron "Data Visualization Dashboard". Pendiente de calificación.',
    type: 'assignment',
    read: false,
    createdAt: new Date('2024-01-17T11:20:00')
  },
  {
    id: 'notif-5',
    userId: 'student-1',
    title: 'Nueva Tarea Asignada',
    message: 'Se asignó "Social Media Strategy" con fecha límite 29 de enero.',
    type: 'assignment',
    read: true,
    createdAt: new Date('2024-01-22T10:00:00')
  },
  {
    id: 'notif-6',
    userId: 'student-3',
    title: 'Calificación Recibida',
    message: 'Recibiste 10/10 en "Landing Page Design". ¡Excelente trabajo!',
    type: 'grade',
    read: false,
    createdAt: new Date('2024-01-16T15:30:00')
  }
];
