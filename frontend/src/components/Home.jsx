import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/todo/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.todos);
        setTodos(response.data.todos);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/create",
        {
          text: newTodo,
          complited: false,
        },
        {
          withCredentials: true,
        },
      );
      setTodos([...todos, response.data.newTodo]);
      setNewTodo("");
    } catch (error) {
      console.log(error);
      setError("Failed to create todos");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `http://localhost:4001/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          withCredentials: true,
        },
      );
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      console.log(error);
      setError("Failed to find todo status");
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to delete todo");
    }
  };
  const navigateTo = useNavigate();
  const logout = async () => {
    try {
      await axios.get("http://localhost:4001/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Todo App
        </h1>

        {/* Add Todo */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={todoCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* Todo List */}

        {loading ? (
          <div className="text-center justify-center">
            <span className="textgray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo, index) => (
              <li
                key={todo._id || index}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoStatus(todo._id)}
                    className="mr-2"
                  />
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-800 font-semibold"
                        : ""
                    } `}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => todoDelete(todo._id)}
                  className="text-red-500 hover:text-red-800 duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            {remainingTodos} remaining todos
          </p>

          <button
            onClick={() => logout()}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
 


}

export default Home;
