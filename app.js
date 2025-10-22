// Backend API URL (I'll need to change this after deploying backend)
const API_URL = 'https://qgs00ow4ck8880osks0oo0so.hosting.codeyourfuture.io';

// Fetching and displayng all quotes when page loads
async function fetchQuotes() {
  try {
    const response = await fetch(`${API_URL}/quotes`);
    const quotes = await response.json();
    displayQuotes(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    document.getElementById('quotesList').innerHTML = 
      '<p>Could not load quotes. Is the backend running?</p>';
  }
}

// Displaying quotes on the page
function displayQuotes(quotes) {
  const quotesList = document.getElementById('quotesList');
  
  if (quotes.length === 0) {
    quotesList.innerHTML = '<p>No quotes yet. Add the first one!</p>';
    return;
  }
  
  quotesList.innerHTML = quotes.map(quote => `
    <div class="quote-card">
      <div class="quote-text">"${escapeHtml(quote.text)}"</div>
      <div class="quote-author">— ${escapeHtml(quote.author)}</div>
    </div>
  `).join('');
}

// Adding a new quote
document.getElementById('quoteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = document.getElementById('quoteText').value.trim();
  const author = document.getElementById('quoteAuthor').value.trim();
  
  if (!text || !author) {
    alert('Please fill in both fields!');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, author })
    });
    
    if (response.ok) {
      // Clears form
      document.getElementById('quoteText').value = '';
      document.getElementById('quoteAuthor').value = '';
      // Refreshes quotes list
      fetchQuotes();
    } else {
      alert('Failed to add quote');
    }
  } catch (error) {
    console.error('Error adding quote:', error);
    alert('Error adding quote. Is the backend running?');
  }
});

// Security check : Escape HTML to prevent XSS attacks (Daniel's slack)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Loading quotes when page loads
fetchQuotes();
