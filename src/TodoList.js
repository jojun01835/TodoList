import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import firestore from "./firebase";
import { BiCheckCircle, BiCircle, BiExclamationTriangle } from "react-icons/bi";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [priority, setPriority] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(firestore, "Todos"), orderBy("createdAt", "asc")), (snapshot) => {
      const updatedTodos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(updatedTodos);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    try {
      // Firestore에 새 Todo 추가
      await addDoc(collection(firestore, "Todos"), {
        content: newTodo,
        completed: false,
        priority: priority,
        createdAt: serverTimestamp(),
      });

      setNewTodo("");
      setPriority(null);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleEditTodo = async (id, newContent) => {
    try {
      const todoRef = doc(firestore, "Todos", id);
      await updateDoc(todoRef, { content: newContent });
      setEditingTodo(null); // 수정 완료 후 수정 상태 해제
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCompleteTodo = async (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);

    const todoRef = doc(firestore, "Todos", id);
    await updateDoc(todoRef, {
      completed: !todos.find((todo) => todo.id === id)?.completed || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null); // 취소 버튼을 누르면 수정 상태 해제
  };

  const handleDeleteTodo = async (id) => {
    // Firestore에서 해당 Todo 항목을 삭제합니다.
    try {
      await deleteDoc(doc(firestore, "Todos", id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handlePriorityClick = (clickedPriority) => {
    setPriority((prevPriority) => (prevPriority === clickedPriority ? null : clickedPriority));
  };

  return (
    <div>
      <div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {editingTodo === todo.id ? (
                // 수정 중인 할일 항목이면 입력 폼을 보여줌
                <div>
                  <input type="text" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                  <button onClick={() => handleEditTodo(todo.id, editedContent)}>수정 확인</button>
                  <button onClick={() => handleCancelEdit()}>취소</button>
                </div>
              ) : (
                // 수정 중이 아닌 할일 항목은 내용과 수정 버튼을 보여줌
                <div>
                  <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.content}</span>
                  <button onClick={() => setEditingTodo(todo.id)}>수정</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
                  <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
                    <div
                      style={{
                        color: todo.priority === "낮음" ? "green" : "gray",
                        cursor: "pointer",
                        marginRight: "1rem",
                        border: todo.priority === "낮음" ? "2px solid green" : "none",
                        borderRadius: "50%",
                        padding: "5px",
                      }}
                      onClick={() => handlePriorityClick("낮음")}
                    >
                      ●
                    </div>
                    <div
                      style={{
                        color: todo.priority === "보통" ? "yellow" : "gray",
                        cursor: "pointer",
                        marginRight: "1rem",
                        border: todo.priority === "보통" ? "2px solid yellow" : "none",
                        borderRadius: "50%",
                        padding: "5px",
                      }}
                      onClick={() => handlePriorityClick("보통")}
                    >
                      ●
                    </div>
                    <div
                      style={{
                        color: todo.priority === "높음" ? "red" : "gray",
                        cursor: "pointer",
                        marginRight: "1rem",
                        border: todo.priority === "높음" ? "2px solid red" : "none",
                        borderRadius: "50%",
                        padding: "5px",
                      }}
                      onClick={() => handlePriorityClick("높음")}
                    >
                      ●
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default TodoList;
