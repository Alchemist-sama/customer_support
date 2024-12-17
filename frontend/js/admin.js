const hardcodedUsername = "admin";
const hardcodedPassword = "password";

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === hardcodedUsername && password === hardcodedPassword) {
    // alert('Login successful!');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadTickets(); // Load tickets after login
  } else {
    alert('Invalid credentials!');
  }
});

// Function to load tickets from the backend and display them
async function loadTickets() {
  try {
    const response = await fetch('api/tickets/admin/tickets');
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const tickets = await response.json();
    const tableBody = document.querySelector('#ticketsTable tbody');
    tableBody.innerHTML = ''; // Clear the table before populating

    tickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticket.ticketId}</td>
        <td>${ticket.name}</td>
        <td>${ticket.email}</td>
        <td>${ticket.phone}</td>
        <td>${ticket.description}</td>
        <td>${ticket.status}</td>
        <td>
          <select data-id="${ticket.ticketId}" onchange="updateStatus(this)">
            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading tickets:', err.message);
    alert('Failed to load tickets');
  }
}

// Function to update ticket status when the select box changes
async function updateStatus(select) {
  const ticketId = select.getAttribute('data-id');
  const newStatus = select.value;

  try {
    const response = await fetch(`/api/admin/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      alert('Status updated successfully!');
    } else {
      const errorData = await response.json();
      alert(`Failed to update status: ${errorData.error}`);
    }
  } catch (err) {
    console.error('Error updating status:', err);
    alert('Error updating status');
  }
}
