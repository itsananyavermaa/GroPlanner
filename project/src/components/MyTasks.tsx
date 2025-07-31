import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, Circle  } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import TaskModal from './TaskModal';
import { supabase } from '../supabaseClient';
import { Task } from '../contexts/AppContext';

const MyTasks: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'created'>('priority');
  
  // const fetchTasks = async () => {
      
  //     const {data: { session },} = await supabase.auth.getSession();
  //      const userId = session?.user.id;

  //     const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);;

  //     if (error) {
  //       console.error('Error fetching tasks:', error.message);
  //       return;
  //     }
  //     else {
  //       console.log('Tasks from Supabase:', data); 
  //       dispatch({ type: 'SET_TASKS', payload: data });
  //     }
  //   };
  
  // useEffect(() => {
  //   console.log('Fetching tasks...');
  //     fetchTasks();
  // }, []);

  const filteredTasks = state.tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSaveTask = async (task: Task) => {
  if (editingTask) {
    // UPDATE logic
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', task.id)
      .select();

    if (error) {
      console.error('Error updating task:', error.message);
      return;
    }

    dispatch({ type: 'UPDATE_TASK', payload: data[0] });
  } else {
    // ADD logic
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;

    if (!uid) {
      console.error('User not logged in.');
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: uid }])
      .select();

    if (error) {
      console.error('Error adding task:', error.message);
      return;
    }

    dispatch({ type: 'ADD_TASK', payload: data[0] });
    console.log('Added task:', data[0]);
  }

  setEditingTask(undefined);
  setIsModalOpen(false);
};



  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error.message);
    return;
  }

  dispatch({
    type: 'DELETE_TASK',
    payload: taskId,
  });
};

  
  const handleToggleComplete = async (task: Task) => {
  const updatedStatus = !task.completed;

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: updatedStatus })
    .eq('id', task.id)
    .select();

  if (error) {
    console.error('Error updating task:', error.message);
    return;
  }

  if (data && data.length > 0) {
    // Dispatch updated task to context
    dispatch({
      type: 'UPDATE_TASK',
      payload: data[0], // Supabase returns an array, so take the first task
    });
  }
};


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  return (
  <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="mb-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-gray-600">Manage your tasks and stay organized</p>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'deadline' | 'created')}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="deadline">Sort by Deadline</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </div>
    </div>

    {/* Task Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 ${
            task.completed ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <button
              onClick={() => handleToggleComplete(task)}
              className="flex items-center gap-2 group"
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              )}
            </button>

            <div className="flex gap-1">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className={`font-medium mb-2 ${
            task.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-900'
          }`}>
            {task.title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-700'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {task.priority}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {task.category}
            </span>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Duration: {task.duration} minutes</p>
            {task.deadline && (
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>

    {sortedTasks.length === 0 && (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <p className="text-gray-600 text-lg">
          {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
        </p>
        <p className="text-gray-400 mt-2">
          {filter === 'all' ? 'Add your first task to get started!' : 'Try changing the filter.'}
        </p>
      </div>
    )}

    <TaskModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onSave={handleSaveTask}
      task={editingTask}
    />
  </div>
);

};

export default MyTasks;