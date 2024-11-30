import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { TodoReducer } from "./reducer/todoCase";
import { CheckCircle, Edit, Trash2, XCircle } from "lucide-react";

function App() {
  const [newTodo, setNewTodo] = useState("");

  const [todos, dispatch] = useReducer(TodoReducer, []);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      dispatch({ type: "ADD_TODO", payload: newTodo });
      setNewTodo("");
    }
  }, [newTodo]);

  const todoStats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      pending: todos.filter((todo) => !todo.completed).length,
    };
  }, [todos]);

  const useEditTodo = () => {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const startEditing = (todo) => {
      setEditingId(todo.id);
      setEditText(todo.text);
    };

    const saveEdit = () => {
      if (editText.trim()) {
        dispatch({
          type: "EDIT_TODO",
          payload: { id: editingId, text: editText },
        });
        setEditingId(null);
      }
    };

    return {
      editText,
      editingId,
      setEditText,
      startEditing,
      saveEdit,
    };
  };

  const {
    editText,
    editingId,
    setEditText,
    startEditing,
    setEditingId,
    saveEdit,
  } = useEditTodo();

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-2xl font-bold text-center">Todo List App</h1>

      {/* Input Todo */}
      <div className="flex mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tambahkan todo baru"
        />
        <button
          onClick={addTodo}
          className="p-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
        >
          Tambah
        </button>
      </div>

      {/* Statistik Todo */}
      <div className="mb-4 text-center">
        <p>Total: {todoStats.total}</p>
        <p>Selesai: {todoStats.completed}</p>
        <p>Pending: {todoStats.pending}</p>
      </div>

      {/* Daftar Todo */}
      <div>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-2 border-b last:border-b-0"
          >
            {editingId === todo.id ? (
              <div className="flex w-full">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow p-1 mr-2 border rounded"
                />
                <button
                  onClick={saveEdit}
                  className="mr-2 text-green-500 hover:text-green-600"
                >
                  <CheckCircle />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  <XCircle />
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={() =>
                    dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                  }
                  className={`flex-grow cursor-pointer ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <div>
                  <button
                    onClick={() => startEditing(todo)}
                    className="mr-2 text-blue-500 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_TODO", payload: todo.id })
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
