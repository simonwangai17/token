// Sample Token Data
const tokens = [
  { name: "Token A", payout: 10, duration: "Now", interval: 0, grabbed: false, countdown: 0 },
  { name: "Token B", payout: 15, duration: "4 hrs", interval: 4 * 3600, grabbed: false, countdown: 4 * 3600 },
  { name: "Token C", payout: 20, duration: "4 hrs", interval: 4 * 3600, grabbed: false, countdown: 4 * 3600 },
  { name: "Token D", payout: 25, duration: "4 hrs", interval: 4 * 3600, grabbed: false, countdown: 4 * 3600 },
  { name: "Token E", payout: 50, duration: "12 hrs", interval: 12 * 3600, grabbed: false, countdown: 12 * 3600 },
  { name: "Token F", payout: 30, duration: "4 hrs", interval: 4 * 3600, grabbed: false, countdown: 4 * 3600 }
];

// Initialize tokens on page load
function initializeTokens() {
  const table = document.getElementById('tokensTable');
  table.innerHTML = '';
  tokens.forEach((token, index) => {
    const isAvailable = token.countdown === 0 && !token.grabbed;
    const countdownText = token.countdown > 0 ? formatTime(token.countdown) : (isAvailable ? "Available" : "Unavailable");
    const isButtonDisabled = !isAvailable; // Disable button if unavailable or grabbed
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${token.name}</td>
      <td>Ksh ${token.payout}</td>
      <td>${countdownText}</td>
      <td>
        <button class="grab-button ${token.grabbed ? "grabbed" : ""}" 
          ${isButtonDisabled ? "disabled" : ""} onclick="openGrabModal(${index})">
          ${token.grabbed ? "Grabbed" : "Grab"}
        </button>
      </td>`;
    table.appendChild(row);
  });
}

// Format time for countdown display
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Open Grab Modal
function openGrabModal(tokenIndex) {
  const token = tokens[tokenIndex];
  document.getElementById('tokenName').textContent = token.name;
  document.getElementById('tokenPayout').textContent = token.payout;
  document.getElementById('tokenDuration').textContent = token.duration;
  document.getElementById('grabbingStep').style.display = 'block';
  document.getElementById('formStep').style.display = 'none';
  document.getElementById('grabModal').style.display = 'flex';
}

// Close Modal
function closeModal() {
  document.getElementById('grabModal').style.display = 'none';
}

// Grab Token Action
function grabToken() {
  const tokenIndex = tokens.findIndex(token => !token.grabbed && token.countdown === 0);
  if (tokenIndex > -1) {
    const token = tokens[tokenIndex];
    token.grabbed = true;
    initializeTokens();

    // Move to the form step
    document.getElementById('grabbingStep').style.display = 'none';
    document.getElementById('formStep').style.display = 'block';
  }
}

// Finish Grabbing (Proceed to next token after form)
function finishGrabbing() {
  const tokenIndex = tokens.findIndex(token => token.grabbed && token.countdown === 0);
  if (tokenIndex > -1 && tokenIndex < tokens.length - 1) {
    const nextToken = tokens[tokenIndex + 1];
    nextToken.countdown = nextToken.interval; // Start the countdown for the next token
  }

  closeModal(); // Close the modal
  initializeTokens(); // Refresh the tokens table
}

// Countdown Timer
setInterval(() => {
  tokens.forEach(token => {
    if (token.countdown > 0) {
      token.countdown--;
    }
  });
  initializeTokens();
}, 1000);

// Initialize tokens when page loads
initializeTokens();
