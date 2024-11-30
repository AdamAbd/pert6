import { useState } from "react";

export const useEditTodo = (dispatch) => {
    const [editingId, setEditingId] = useState(0);
    const [editText, setEditText] = useState('');

    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    const saveEdit = () => {
        if (editText.trim()) {
            dispatch({
                type: "EDIT_TODO",
                payload: { id: editingId, text: editText }
            });

            setEditingId(null)
        }
    }

    return { editingId, setEditingId, editText, setEditText, startEditing, saveEdit };
}