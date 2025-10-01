import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [Todo, setTodo] = useState("");
  const [Todos, setTodos] = useState([]);

  useEffect(() => {
    handleDisplay();
  }, []);

  const handleAdd = async () => {
    if (!Todo.trim()) {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tasks/", {
        name: Todo,
        completed: false,
      });
      setTodo("");
      handleDisplay();
      toast.success("Task added successfully", {
        duration: 1500,
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.response.data.msg);

    }
  };

  const handleDisplay = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/");
      setTodos(response.data);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      handleDisplay();
      toast.success("Task deleted successfully", {
        duration: 1500,
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/toggle`);
      handleDisplay();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Update failed");
    }
  };

  const handleEdit = async (id) => {
    const t = Todos.find((i) => i._id === id);
    setTodo(t.name);
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      handleDisplay();
      toast.success("Task ready to edit", {
        duration: 1500,
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || "Edit failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        <h1 className="font-extrabold text-center text-3xl sm:text-4xl md:text-5xl text-green-800">
          Task Manager
        </h1>
        <div className="flex flex-col gap-4 my-8">
          <h2 className="font-semibold text-xl sm:text-2xl text-green-700">
            Add a Task
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              onChange={(e) => setTodo(e.target.value)}
              value={Todo}
              className="w-full rounded-xl px-5 py-3 border border-green-400 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-lg"
              placeholder="What do you need to do?"
            />
            <button
              type="submit"
              onClick={handleAdd}
              className="bg-green-600 w-full sm:w-auto rounded-xl hover:bg-green-700 px-6 py-3 text-base font-bold text-white transform hover:scale-105 transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>
        <hr className="my-6 border-green-300" />
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
          Your Todos
        </h2>
        <div className="mt-6 space-y-4">
          {Todos.length === 0 && (
            <div className="m-5 text-center text-gray-500">
              No Todos to display. Add one above!
            </div>
          )}
          {Todos.map((todo) => (
            <div
              key={todo._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-green-50 hover:bg-green-100 border border-green-300 p-4 rounded-xl shadow-sm gap-3 sm:gap-5 transition-all duration-300"
            >
              <div className="flex gap-4 items-center w-full">
                <input
                  name={todo._id}
                  onChange={() => handleToggle(todo._id)}
                  type="checkbox"
                  checked={todo.completed}
                  className="h-5 w-5 text-green-600 border-green-400 focus:ring-green-500 cursor-pointer"
                />
                <div
                  className={`${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-green-900"
                  } font-medium text-lg sm:text-xl`}
                >
                  {todo.name}
                </div>
              </div>
              <div className="flex self-end sm:self-center gap-2">
                <button
                  onClick={() => handleEdit(todo._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 p-2 text-lg font-bold text-white rounded-lg transform hover:scale-110 transition-all duration-200"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="bg-red-500 hover:bg-red-600 p-2 text-lg font-bold text-white rounded-lg transform hover:scale-110 transition-all duration-200"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
