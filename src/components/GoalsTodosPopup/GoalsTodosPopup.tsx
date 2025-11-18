'use client';

import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface GoalsTodosPopupProps {
  onClose: () => void;
}

export default function GoalsTodosPopup({ onClose }: GoalsTodosPopupProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Do 30 minutes of ear training', completed: false },
    { id: 2, text: 'Practice songwriting for 1 hour', completed: false },
    { id: 3, text: 'Do metronome training', completed: false },
  ]);

  const handleTodoToggle = (todoId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const remainingTodos = todos.filter((todo) => !todo.completed);

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="goals-todos-popup">
        <div className="popup-header">
          <h2>Goals and To-dos</h2>
          <div className="close-icon" onClick={onClose}>
            X
          </div>
        </div>
        <div className="todos-list">
          {remainingTodos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleTodoToggle(todo.id)}
              />
              <label className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
