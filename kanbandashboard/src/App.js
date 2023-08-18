import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const priorityLevels = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const groupAndSortTickets = () => {
    let groupedTickets = {};

    if (groupingOption === 'status') {
      groupedTickets = groupByStatus(tickets);
    } else if (groupingOption === 'user') {
      groupedTickets = groupByUser(tickets);
    } else if (groupingOption === 'priority') {
      groupedTickets = groupByPriority(tickets);
    }

    return sortTickets(groupedTickets);
  };

  const groupByStatus = (tickets) => {
    const grouped = {};

    tickets.forEach((ticket) => {
      const status = ticket.status;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(ticket);
    });

    return grouped;
  };

  const groupByUser = (tickets) => {
    const grouped = {};

    tickets.forEach((ticket) => {
      const user = ticket.user;
      if (!grouped[user]) {
        grouped[user] = [];
      }
      grouped[user].push(ticket);
    });

    return grouped;
  };

  const groupByPriority = (tickets) => {
    const grouped = {};

    tickets.forEach((ticket) => {
      const priority = ticket.priority;
      if (!grouped[priority]) {
        grouped[priority] = [];
      }
      grouped[priority].push(ticket);
    });

    return grouped;
  };

  const sortTickets = (groupedTickets) => {
    const sorted = {};

    for (const group in groupedTickets) {
      sorted[group] = groupedTickets[group].sort((a, b) => {
        if (sortingOption === 'priority') {
          return b.priority - a.priority;
        } else if (sortingOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    }

    return sorted;
  };

  const renderTicketCards = () => {
    const groupedAndSortedTickets = groupAndSortTickets();

    return Object.keys(groupedAndSortedTickets).map((group) => (
      <div className="group" key={group}>
        <h2>{group}</h2>
        {groupedAndSortedTickets[group].map((ticket) => (
          <div className="ticket-card" key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p>Status: {ticket.status}</p>
            <p>User: {ticket.user}</p>
            <p>Priority: {priorityLevels[ticket.priority]}</p>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kanban Board</h1>
        <div className="options">
          <button onClick={() => setGroupingOption('status')}>Group by Status</button>
          <button onClick={() => setGroupingOption('user')}>Group by User</button>
          <button onClick={() => setGroupingOption('priority')}>Group by Priority</button>
          <select value={sortingOption} onChange={(e) => setSortingOption(e.target.value)}>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
        <div className="board">
          {renderTicketCards()}
        </div>
      </header>
    </div>
  );
}

export default App;
