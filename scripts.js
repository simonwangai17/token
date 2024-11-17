// Sample Token Data
const tokens = [
  { name: "Jamii Agencies", payout: 10, duration: "Now", interval: 0, grabbed: false, countdown: 0 },
  { name: "Capital Investor", payout: 25, duration: "4 hrs", interval: 4 * 3600, grabbed: false, countdown: 4 * 3600 },
  { name: "Surveys", payout: 20, duration: "6 hrs", interval: 6 * 3600, grabbed: false, countdown: 6 * 3600 },
  { name: "Safaricom", payout: 20, duration: "8 hrs", interval: 8 * 3600, grabbed: false, countdown: 8 * 3600 },
  { name: "Faiba", payout: 50, duration: "12 hrs", interval: 12 * 3600, grabbed: false, countdown: 12 * 3600 },
  { name: "Refferal Payout", payout: 80, duration: "15 hrs", interval: 15 * 3600, grabbed: false, countdown: 15 * 3600 }
];
// save tokens to localstorage
function saveTokens() {
  localStorage.setItem('tokens', JSON.stringify(tokens));
}
//load tokens from localstorage
function loadTokens () {
  const savedTokens = localStorage.getItem('tokens');
  if (savedTokens) {
    const parsedTokens = JSON.parse(savedTokens);
    parsedTokens.forEach((token, index)  => {
      tokens[index].grabbed = token.grabbed;
      tokens[index],countdown = token.countdown;
    })
  }
}
// Initialize tokens on page load
function initializeTokens() {
  loadTokens(); //load saved state

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
  saveTokens(); //save the updated state
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
