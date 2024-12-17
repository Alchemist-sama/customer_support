document.getElementById('supportForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    description: document.getElementById('description').value,
    status: 'Open', // Initial status
  };

  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json(); // Get the created ticket data
      alert(`Ticket submitted successfully! Ticket ID: ${data.id}`);
      document.getElementById('supportForm').reset(); // Reset the form after submission
    } else {
      alert('Failed to submit ticket.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error submitting ticket.');
  }
});
