import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
interface TaskCalendarProps {
  projectId: string;
}
interface Task extends Tables<'project_tasks'> {}
const TaskCalendar = ({
  projectId
}: TaskCalendarProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const loadTasks = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('project_tasks').select('*').eq('project_id', projectId).order('task_date', {
        ascending: true
      });
      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTasks();
  }, [projectId]);
  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const {
        error
      } = await supabase.from('project_tasks').insert({
        project_id: projectId,
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        task_date: selectedDate.toISOString().split('T')[0],
        start_time: newTask.start_time || null,
        end_time: newTask.end_time || null,
        status: newTask.status
      });
      if (error) throw error;
      toast({
        title: "Task created",
        description: "Your task has been added to the calendar."
      });
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'pending'
      });
      setShowCreateDialog(false);
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title.trim()) return;
    try {
      const {
        error
      } = await supabase.from('project_tasks').update({
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        start_time: newTask.start_time || null,
        end_time: newTask.end_time || null,
        status: newTask.status
      }).eq('id', editingTask.id);
      if (error) throw error;
      toast({
        title: "Task updated",
        description: "Your changes have been saved."
      });
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'pending'
      });
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      const {
        error
      } = await supabase.from('project_tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast({
        title: "Task deleted",
        description: "The task has been removed."
      });
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      start_time: task.start_time || '',
      end_time: task.end_time || '',
      status: task.status || 'pending'
    });
  };
  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'pending'
    });
  };
  const selectedDateTasks = tasks.filter(task => task.task_date === selectedDate.toISOString().split('T')[0]);
  const datesWithTasks = new Set(tasks.map(task => task.task_date));
  const statusColors = {
    pending: 'bg-yellow-600',
    'in-progress': 'bg-blue-600',
    completed: 'bg-green-600',
    cancelled: 'bg-gray-600'
  };
  if (loading) {
    return <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading calendar...</div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Task Calendar</h2>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} modifiers={{
            hasTask: date => datesWithTasks.has(date.toISOString().split('T')[0])
          }} modifiersStyles={{
            hasTask: {
              backgroundColor: '#1e40af',
              color: 'white'
            }
          }} className="rounded-md border border-gray-700 mx-[80px]" />
          </CardContent>
        </Card>

        {/* Selected Date Tasks */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? <p className="text-gray-400 text-center py-8">
                No tasks scheduled for this date.
              </p> : <div className="space-y-3">
                {selectedDateTasks.map(task => <div key={task.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[task.status as keyof typeof statusColors]} text-white`}>
                          {task.status}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(task)} className="text-gray-400 hover:text-white">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {task.description && <p className="text-gray-300 text-sm mb-2">{task.description}</p>}
                    
                    {(task.start_time || task.end_time) && <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="h-3 w-3" />
                        {task.start_time && task.end_time ? <span>{task.start_time} - {task.end_time}</span> : task.start_time ? <span>Starts at {task.start_time}</span> : <span>Ends at {task.end_time}</span>}
                      </div>}
                  </div>)}
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Task Dialog */}
      <Dialog open={showCreateDialog || !!editingTask} onOpenChange={closeDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Title</label>
              <Input value={newTask.title} onChange={e => setNewTask({
              ...newTask,
              title: e.target.value
            })} className="bg-gray-800 border-gray-700 text-white" placeholder="Task title" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description</label>
              <Textarea value={newTask.description} onChange={e => setNewTask({
              ...newTask,
              description: e.target.value
            })} className="bg-gray-800 border-gray-700 text-white" placeholder="Task description (optional)" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Start Time</label>
                <Input type="time" value={newTask.start_time} onChange={e => setNewTask({
                ...newTask,
                start_time: e.target.value
              })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">End Time</label>
                <Input type="time" value={newTask.end_time} onChange={e => setNewTask({
                ...newTask,
                end_time: e.target.value
              })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog} className="border-gray-700 text-gray-300">
                Cancel
              </Button>
              <Button onClick={editingTask ? handleUpdateTask : handleCreateTask} className="bg-blue-600 hover:bg-blue-700">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default TaskCalendar;