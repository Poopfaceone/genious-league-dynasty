// Create a new file called poll.js
document.addEventListener('DOMContentLoaded', function() {
    const pollForm = document.getElementById('poll-form');
    const voteMessage = document.getElementById('vote-message');
    
    // Check if user has already voted
    const hasVoted = localStorage.getItem('hasVoted');
    if (hasVoted) {
        voteMessage.textContent = `You have already voted as "${localStorage.getItem('voterName')}". Thank you for your input!`;
        pollForm.querySelector('button').disabled = true;
    }
    
    // Load and display current results immediately
    updateResults();
    
    pollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const voterName = document.getElementById('voter-name').value.trim();
        if (!voterName) {
            voteMessage.textContent = 'Please enter your name to vote.';
            return;
        }
        
        const selectedOption = document.querySelector('input[name="poll-option"]:checked');
        if (!selectedOption) {
            voteMessage.textContent = 'Please select an option to vote.';
            return;
        }
        
        // Get the current votes from localStorage or initialize
        let votes = JSON.parse(localStorage.getItem('pollVotes')) || {
            option1: 0,
            option2: 0,
            option3: 0,
            option4: 0,
            option5: 0,
            voters: []
        };
        
        // Check if the voter has already voted by name
        if (votes.voters.includes(voterName)) {
            voteMessage.textContent = 'You have already voted with this name.';
            return;
        }
        
        // Add vote
        votes[selectedOption.value]++;
        votes.voters.push(voterName);
        
        // Save votes to localStorage
        localStorage.setItem('pollVotes', JSON.stringify(votes));
        localStorage.setItem('hasVoted', 'true');
        localStorage.setItem('voterName', voterName);
        
        // Show success message
        voteMessage.textContent = 'Thank you for your vote!';
        
        // Update results
        updateResults();
        
        // Disable form
        pollForm.querySelector('button').disabled = true;
    });
    
    function updateResults() {
        const votes = JSON.parse(localStorage.getItem('pollVotes')) || {
            option1: 0,
            option2: 0,
            option3: 0,
            option4: 0,
            option5: 0,
            voters: []
        };
        
        const totalVotes = votes.option1 + votes.option2 + votes.option3 + votes.option4 + votes.option5;
        
        // Update the DOM with current results
        for (let i = 1; i <= 5; i++) {
            const option = `option${i}`;
            const percent = totalVotes > 0 ? Math.round((votes[option] / totalVotes) * 100) : 0;
            
            document.getElementById(`${option}-bar`).style.width = `${percent}%`;
            document.getElementById(`${option}-percent`).textContent = `${percent}%`;
            document.getElementById(`${option}-votes`).textContent = `${votes[option]} vote${votes[option] !== 1 ? 's' : ''}`;
        }
        
        document.getElementById('total-votes').textContent = `Total votes: ${totalVotes}`;
        
        // Update voters list
        const votersList = document.getElementById('voters');
        votersList.innerHTML = '';
        votes.voters.forEach(voter => {
            const li = document.createElement('li');
            li.textContent = voter;
            votersList.appendChild(li);
        });
    }
});