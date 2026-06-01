import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/tasks';
import { Navbar } from '../components/Navbar';
import { useToast, ToastContainer } from '../components/Toast';
import type { Task, TaskFormData } from '../types';
import { Plus, Edit2, Trash2, X, Filter } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-orange-100 text-orange-800',
  HIGH: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
  });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadTasks();
  }, [filterStatus, filterPriority]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const response = isAdmin
        ? await taskApi.getAllTasks(params)
        : await taskApi.getMyTasks(params);
      setTasks(response.data);
    } catch {
      addToast('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, formData);
        addToast('Task updated successfully', 'success');
      } else {
        await taskApi.createTask(formData);
        addToast('Task created successfully', 'success');
      }
      resetForm();
      loadTasks();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      addToast(err.response?.data?.message || 'Failed to save task', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.deleteTask(id);
      addToast('Task deleted successfully', 'success');
      loadTasks();
    } catch {
      addToast('Failed to delete task', 'error');
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'PENDING', priority: 'MEDIUM' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'All Tasks (Admin)' : 'My Tasks'}
            </h1>
            <p className="text-gray-500 mt-1">Manage and track your tasks</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={resetForm}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    placeholder="Task description (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskFormData['status'] })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
            <p className="text-gray-500">Create your first task to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      {isAdmin && task.user && (
                        <span className="text-indigo-600 font-medium">
                          {task.user.name} ({task.user.email})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}