
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, CheckSquare, Clock, Users, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  related: string;
  status: "To Do" | "In Progress" | "Completed";
};

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Meeting" | "Call" | "Follow-up" | "Demo";
  with: string;
};

const TasksAndCalendar = () => {
  const { toast } = useToast();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    dueDate: "",
    priority: "Medium",
    related: "",
    status: "To Do",
  });

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    date: "",
    time: "",
    type: "Meeting",
    with: "",
  });

  // Mock data for tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Follow up with City General Hospital",
      dueDate: "2023-12-05",
      priority: "High",
      related: "Lead: City General Hospital",
      status: "To Do",
    },
    {
      id: "task-2",
      title: "Prepare proposal for LifeCare Medical Center",
      dueDate: "2023-12-07",
      priority: "Medium",
      related: "Opportunity: LifeCare Medical Center",
      status: "In Progress",
    },
    {
      id: "task-3",
      title: "Review quarterly targets",
      dueDate: "2023-12-10",
      priority: "Medium",
      related: "Internal",
      status: "To Do",
    },
  ]);

  // Mock data for calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "event-1",
      title: "Presentation Meeting",
      date: "2023-12-05",
      time: "10:00 AM",
      type: "Meeting",
      with: "City General Hospital",
    },
    {
      id: "event-2",
      title: "Product Demo",
      date: "2023-12-07",
      time: "2:30 PM",
      type: "Demo",
      with: "Wellness Hospital",
    },
    {
      id: "event-3",
      title: "Follow-up Call",
      date: "2023-12-09",
      time: "11:15 AM",
      type: "Call",
      with: "Medicare Clinic",
    },
  ]);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || "",
      dueDate: newTask.dueDate || "",
      priority: newTask.priority as "High" | "Medium" | "Low" || "Medium",
      related: newTask.related || "",
      status: newTask.status as "To Do" | "In Progress" | "Completed" || "To Do",
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      dueDate: "",
      priority: "Medium",
      related: "",
      status: "To Do",
    });
    setIsAddTaskOpen(false);

    toast({
      title: "Task Added",
      description: "Your new task has been added successfully.",
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const event: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      type: newEvent.type as "Meeting" | "Call" | "Follow-up" | "Demo" || "Meeting",
      with: newEvent.with || "",
    };

    setEvents([event, ...events]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "Meeting",
      with: "",
    });
    setIsAddEventOpen(false);

    toast({
      title: "Event Added",
      description: "Your new calendar event has been added successfully.",
    });
  };

  const getTaskPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{priority}</Badge>;
      case "Medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{priority}</Badge>;
      case "Low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getEventTypeBadge = (type: "Meeting" | "Call" | "Follow-up" | "Demo") => {
    switch (type) {
      case "Meeting":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">{type}</Badge>;
      case "Call":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{type}</Badge>;
      case "Follow-up":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{type}</Badge>;
      case "Demo":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks & Calendar</h2>
          <p className="text-muted-foreground">
            Manage your tasks, appointments, and schedule
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Calendar Event</DialogTitle>
                <DialogDescription>
                  Schedule a new meeting, call, or other event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({...newEvent, type: value as any})}
                  >
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                      <SelectItem value="Call">Call</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-with">With</Label>
                  <Input
                    id="event-with"
                    value={newEvent.with}
                    onChange={(e) => setNewEvent({...newEvent, with: e.target.value})}
                    placeholder="Enter person or organization"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to track your work.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({...newTask, priority: value as any})}
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-related">Related To</Label>
                  <Input
                    id="task-related"
                    value={newTask.related}
                    onChange={(e) => setNewTask({...newTask, related: e.target.value})}
                    placeholder="Enter related lead, opportunity, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Overview</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
              <CardDescription>Manage your ongoing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {getTaskPriorityBadge(task.priority)}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        {task.related && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{task.related}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={task.status === "Completed" ? "default" : 
                              task.status === "In Progress" ? "secondary" : "outline"}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No tasks found. Create a new task to get started.
                  </p>
                )}
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="mt-2">
                    View All Tasks
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 border-b pb-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        {getEventTypeBadge(event.type)}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                          {event.with && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>with {event.with}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No events scheduled. Add an event to your calendar.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border rounded-md p-4">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Full calendar view coming soon</p>
                    <Button variant="outline" className="mt-4">Open Full Calendar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksAndCalendar;
