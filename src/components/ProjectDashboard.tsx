
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { Calendar, ClipboardList, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Calendar as CustomCalendar } from '@/components/ui/calendar-custom';

interface ProjectDashboardProps {
  projectId: string;
  project: Tables<'projects'>;
}

const ProjectDashboard = ({ projectId, project }: ProjectDashboardProps) => {
  // Placeholder data - in a real implementation, this would be fetched from the database
  const stats = {
    totalTasks: 24,
    completedTasks: 15,
    upcomingDeadlines: 3,
    overdueTasks: 1,
    activityByDay: [5, 3, 8, 4, 7, 2, 1] // Last 7 days activity
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Project Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
            <p className="text-xs text-gray-400">
              {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% complete
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-gray-400">Within next 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.overdueTasks}</div>
            <p className="text-xs text-gray-400">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckSquare size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Task "Add login page" completed</p>
                  <p className="text-xs text-gray-400">Today at 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <ClipboardList size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">New task "Fix navbar visibility" added</p>
                  <p className="text-xs text-gray-400">Yesterday at 2:15 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Clock size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Deadline updated for "Release v1.0"</p>
                  <p className="text-xs text-gray-400">June 5, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
