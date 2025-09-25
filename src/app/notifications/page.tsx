'use client';

import Layout from '@/components/Layout';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BookOpen,
  Calendar,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { mockNotifications, mockUsers, mockCourses } from '@/lib/mockData';
import { formatShortDate } from '@/lib/utils';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'assignment' | 'grade' | 'announcement'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced notifications with user and course data
  const enhancedNotifications = mockNotifications.map(notification => {
    const user = mockUsers.find(u => u.id === notification.userId);
    return {
      ...notification,
      user
    };
  });

  // Filter notifications
  const filteredNotifications = enhancedNotifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      notification.type === filter;
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'grade':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'announcement':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'Tarea';
      case 'grade':
        return 'Calificación';
      case 'announcement':
        return 'Anuncio';
      case 'reminder':
        return 'Recordatorio';
      default:
        return 'Notificación';
    }
  };

  // Statistics
  const totalNotifications = enhancedNotifications.length;
  const unreadCount = enhancedNotifications.filter(n => !n.read).length;
  const todayCount = enhancedNotifications.filter(n => {
    const today = new Date();
    const notificationDate = new Date(n.createdAt);
    return notificationDate.toDateString() === today.toDateString();
  }).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Centro de comunicaciones y alertas importantes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Notificaciones
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{totalNotifications}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sin Leer
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{unreadCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Hoy
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{todayCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="sm:w-48">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">Todas</option>
                  <option value="unread">Sin leer</option>
                  <option value="assignment">Tareas</option>
                  <option value="grade">Calificaciones</option>
                  <option value="announcement">Anuncios</option>
                  <option value="reminder">Recordatorios</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notificaciones Recientes
            </h3>
            
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 'No tienes notificaciones en este momento.' : 'No hay notificaciones que coincidan con el filtro seleccionado.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      notification.read 
                        ? 'border-gray-200 bg-white' 
                        : 'border-primary-200 bg-primary-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {getTypeLabel(notification.type)}
                            </span>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                Nuevo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {formatShortDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              className="h-6 w-6 rounded-full"
                              src={notification.user?.avatar}
                              alt=""
                            />
                            <span className="text-sm text-gray-500">
                              Para: {notification.user?.name}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <button className="text-sm text-primary-600 hover:text-primary-500">
                                Marcar como leída
                              </button>
                            )}
                            <button className="text-sm text-gray-600 hover:text-gray-500">
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Marcar todas como leídas
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Bell className="h-5 w-5 mr-2 text-blue-500" />
                Configurar alertas
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                Enviar anuncio
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                Filtros avanzados
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
