
import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if(task.trim()) {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.slice();
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <input 
        type="text" 
        value={task} 
        onChange={(e) => setTask(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={addTask}>Add</button>
      <h3>Here are what you going to do.</h3>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {t}
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
