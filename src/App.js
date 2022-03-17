import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/ostoslista/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('')

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
  });
  }, [])
  
  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description:item, amount:amount });
    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setItem('');
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
    })
  }

  return (
    <div className="container">
      <form onSubmit={save}>
        <label>New item</label>
        <input value={item} placeholder='Add new item' onChange={e => setItem(e.target.value)} />
        <label>Amount</label>
        <input type="number" min="1" value={amount} placeholder='Insert amount' onChange={e => setAmount(e.target.value)} />
        <button>Save</button>
      </form>
      <ul>
        {items?.map(item => (
          <li key={item.id}>
            <span>{item.description}</span> Amount: {item.amount} &nbsp;
            <a href="#" className="delete" onClick={() => remove(item.id)}>
            Delete
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
