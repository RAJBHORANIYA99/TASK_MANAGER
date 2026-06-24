import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaSignOutAlt,
  FaPlus,
  FaCheck,
  FaCalendarAlt,
  FaTag,
  FaSearch,
  FaTasks,
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSortAmountDown,
  FaCheckCircle,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL 

function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [_token, setToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Auth Form State
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Tasks State
  const [Todos, setTodos] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Task Form State
  const [Todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Work");
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Load User from LocalStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // Fetch tasks when user logs in
  useEffect(() => {
    if (user) {
      handleDisplay();
    } else {
      setTodos([]);
    }
  }, [user]);

  // Auth Actions
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || (isRegistering && !authUsername)) {
      toast.error("Please fill in all fields");
      return;
    }

    setAuthLoading(true);
    try {
      const endpoint = isRegistering ? "/users/register" : "/users/login";
      const payload = isRegistering
        ? { username: authUsername, email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword };

      const response = await axios.post(`${API_BASE}${endpoint}`, payload);
      const { token: userToken, ...userData } = response.data;

      // Save token & user
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

      setToken(userToken);
      setUser(userData);
      toast.success(isRegistering ? "Registered successfully!" : "Logged in successfully!");
      
      // Clear forms
      setAuthUsername("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  // Task Actions
  const handleDisplay = async () => {
    setTasksLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/tasks/`);
      setTodos(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error(error.response?.data?.msg || "Failed to load tasks");
      }
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!Todo.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      const payload = {
        name: Todo,
        description,
        priority,
        dueDate: dueDate || undefined,
        category,
      };

      if (currentEditId) {
        // Update task
        await axios.patch(`${API_BASE}/tasks/${currentEditId}`, payload);
        toast.success("Task updated successfully");
        setCurrentEditId(null);
      } else {
        // Create task
        await axios.post(`${API_BASE}/tasks/`, payload);
        toast.success("Task added successfully");
      }

      // Reset form
      setTodo("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory("Work");
      setIsFormOpen(false);
      
      handleDisplay();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      handleDisplay();
      toast.success("Task deleted successfully");
      if (currentEditId === id) {
        // Reset editor if editing the deleted task
        setCurrentEditId(null);
        setTodo("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setCategory("Work");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to delete task");
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API_BASE}/tasks/${id}/toggle`);
      handleDisplay();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Update failed");
    }
  };

  const startEdit = (todo) => {
    setCurrentEditId(todo._id);
    setTodo(todo.name);
    setDescription(todo.description || "");
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "");
    setCategory(todo.category || "Work");
    setIsFormOpen(true);
    
    // Smooth scroll to form on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Loaded task details into form", { duration: 1000 });
  };

  const cancelEdit = () => {
    setCurrentEditId(null);
    setTodo("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setCategory("Work");
    setIsFormOpen(false);
  };

  // Helper calculations
  const totalTasks = Todos.length;
  const completedTasks = Todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = Todos.filter((t) => t.priority === "high" && !t.completed).length;
  
  // Calculate Overdue Tasks
  const overdueTasks = Todos.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(t.dueDate) < today;
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Extract unique categories dynamically from tasks list
  const uniqueCategories = ["all", ...new Set(Todos.map((t) => t.category).filter(Boolean))];

  // Filtering and Sorting logic
  const filteredTasks = Todos.filter((task) => {
    // Search filter
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "completed"
        ? task.completed
        : !task.completed;

    // Priority filter
    const matchesPriority =
      filterPriority === "all" ? true : task.priority === filterPriority;

    // Category filter
    const matchesCategory =
      filterCategory === "all" ? true : task.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col antialiased">
      <Toaster position="top-right" />

      {/* 1. AUTHENTICATION VIEW */}
      {!user ? (
        <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
            
            {/* Header decor */}
            <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-8 text-center relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-lg"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-4 blur-lg"></div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center justify-center gap-3">
                <FaTasks className="text-indigo-200" /> TaskFlow
              </h1>
              <p className="text-indigo-100 text-sm">
                {isRegistering ? "Create an account to start tracking" : "Sign in to manage your productivity"}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-8 space-y-6">
              
              {/* Username field (register only) */}
              {isRegistering && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      required
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="johndoe"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
              >
                {authLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isRegistering ? (
                  "Create Free Account"
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Toggle views */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* 2. MAIN APPLICATION WORKSPACE */
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
          
          {/* Main Top Nav */}
          <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/30">
                <FaTasks className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">TaskFlow</h1>
                <p className="text-xs text-slate-400">Welcome back, <span className="text-indigo-400 font-semibold">{user.username}</span>!</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FaPlus /> {currentEditId ? "Editing Task" : "New Task"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-slate-950 border border-slate-800 hover:border-rose-500 hover:text-rose-400 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer text-slate-400"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </header>

          {/* Stats Section & Progress Bar */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-lg flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              <span className="text-3xl font-extrabold text-white">{totalTasks}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-lg flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
              <span className="text-3xl font-extrabold text-indigo-400">{pendingTasks}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-lg flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</span>
              <span className="text-3xl font-extrabold text-rose-400">{highPriorityTasks}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-lg flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue</span>
              <span className="text-3xl font-extrabold text-amber-400">{overdueTasks}</span>
            </div>
          </section>

          {/* Productivity Target Indicator (Progress bar) */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                <FaCheckCircle /> Progress Indicator
              </div>
              <span className="text-sm font-bold text-slate-300">{completionRate}% Completed</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Task Form: Create / Edit (Collapsible / Dynamic Drawer) */}
            <aside className={`lg:col-span-4 transition-all duration-300 ${isFormOpen ? "block" : "hidden lg:block"}`}>
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {currentEditId ? "Edit Task" : "Create Task"}
                  </h2>
                  {currentEditId && (
                    <button
                      onClick={cancelEdit}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddOrUpdate} className="space-y-4">
                  
                  {/* Task Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Title *</label>
                    <input
                      type="text"
                      required
                      value={Todo}
                      onChange={(e) => setTodo(e.target.value)}
                      placeholder="e.g. Finish the project report"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                    />
                  </div>

                  {/* Task Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. This task involves..."
                      rows="3"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
                    ></textarea>
                  </div>

                  {/* Priority Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold capitalize border transition-all ${
                            priority === p
                              ? p === "high"
                                ? "bg-rose-500/20 text-rose-400 border-rose-500"
                                : p === "medium"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500"
                                : "bg-teal-500/20 text-teal-400 border-teal-500"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date & Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaCalendarAlt /> Due Date
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaTag /> Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Work, Personal, etc."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {currentEditId ? "Update Task Details" : "Save New Task"}
                  </button>
                </form>
              </div>
            </aside>

            {/* Task List Workspace */}
            <main className="lg:col-span-8 space-y-6">
              
              {/* Filters Panel */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
                
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by title or description..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>

                {/* Filtering controls grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  
                  {/* Status Filter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaFilter /> Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-300 focus:outline-none transition-all text-xs"
                    >
                      <option value="all">All Tasks</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaFilter /> Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-300 focus:outline-none transition-all text-xs"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low Only</option>
                      <option value="medium">Medium Only</option>
                      <option value="high">High Only</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaFilter /> Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-300 focus:outline-none transition-all text-xs capitalize"
                    >
                      {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sorting Filter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaSortAmountDown /> Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-300 focus:outline-none transition-all text-xs"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority Order</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                
                {tasksLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 bg-slate-900/20 border border-slate-800 rounded-2xl">
                    <div className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-500 text-sm">Loading your workspace...</span>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="py-16 text-center bg-slate-900/20 border border-slate-800/80 rounded-2xl shadow-inner text-slate-500 space-y-2">
                    <p className="text-lg font-medium">No tasks match your filters</p>
                    <p className="text-sm text-slate-600">Try adjusting your filters or add a new task to get started!</p>
                  </div>
                ) : (
                  filteredTasks.map((todo) => {
                    const isOverdue =
                      !todo.completed &&
                      todo.dueDate &&
                      new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0);

                    return (
                      <div
                        key={todo._id}
                        className={`group flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 border hover:bg-slate-900/60 p-5 rounded-2xl gap-4 transition-all duration-300 shadow-sm ${
                          todo.completed
                            ? "border-slate-800/60 opacity-60"
                            : "border-slate-800 hover:border-slate-700"
                        } ${
                          todo.priority === "high" && !todo.completed
                            ? "border-l-4 border-l-rose-500"
                            : todo.priority === "medium" && !todo.completed
                            ? "border-l-4 border-l-amber-500"
                            : todo.priority === "low" && !todo.completed
                            ? "border-l-4 border-l-teal-500"
                            : ""
                        }`}
                      >
                        <div className="flex gap-4 items-start w-full">
                          
                          {/* Checkbox */}
                          <div className="pt-1.5 flex items-center justify-center">
                            <label className="relative flex items-center justify-center cursor-pointer">
                              <input
                                name={todo._id}
                                onChange={() => handleToggle(todo._id)}
                                type="checkbox"
                                checked={todo.completed}
                                className="sr-only"
                              />
                              <div
                                className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                                  todo.completed
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "border-slate-700 group-hover:border-indigo-500 bg-slate-950"
                                }`}
                              >
                                {todo.completed && <FaCheck className="text-white text-xs" />}
                              </div>
                            </label>
                          </div>

                          {/* Task Info details */}
                          <div className="space-y-1 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`font-bold text-lg sm:text-xl tracking-tight leading-snug break-words ${
                                  todo.completed ? "line-through text-slate-500" : "text-slate-100"
                                }`}
                              >
                                {todo.name}
                              </span>

                              {/* Badges row */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Priority badge */}
                                <span
                                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                    todo.priority === "high"
                                      ? "text-rose-400 bg-rose-950/40 border-rose-800/40"
                                      : todo.priority === "medium"
                                      ? "text-amber-400 bg-amber-950/40 border-amber-800/40"
                                      : "text-teal-400 bg-teal-950/40 border-teal-800/40"
                                  }`}
                                >
                                  {todo.priority}
                                </span>

                                {/* Category badge */}
                                {todo.category && (
                                  <span className="text-[10px] font-extrabold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <FaTag className="text-[8px]" /> {todo.category}
                                  </span>
                                )}

                                {/* Due Date badge */}
                                {todo.dueDate && (
                                  <span
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                                      todo.completed
                                        ? "text-slate-500 bg-slate-950 border-slate-800"
                                        : isOverdue
                                        ? "text-rose-400 bg-rose-950/50 border-rose-900/50 animate-pulse"
                                        : "text-slate-300 bg-slate-950 border-slate-800"
                                    }`}
                                  >
                                    <FaCalendarAlt className="text-[8px]" />
                                    {new Date(todo.dueDate).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                    {isOverdue && " (Overdue)"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Description text */}
                            {todo.description && (
                              <p
                                className={`text-sm break-words max-w-2xl ${
                                  todo.completed ? "text-slate-600" : "text-slate-400"
                                }`}
                              >
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex self-end md:self-center gap-2 pl-10 md:pl-0">
                          <button
                            onClick={() => startEdit(todo)}
                            className="bg-slate-950 border border-slate-800 hover:border-amber-500 hover:text-amber-400 p-2.5 text-base text-slate-400 rounded-xl transition-all hover:scale-105 cursor-pointer"
                            title="Edit task properties"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(todo._id)}
                            className="bg-slate-950 border border-slate-800 hover:border-rose-500 hover:text-rose-400 p-2.5 text-base text-slate-400 rounded-xl transition-all hover:scale-105 cursor-pointer"
                            title="Delete task"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
