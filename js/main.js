// List of game board spaces on the Monopoly board.
const spaces = [
  "Go",
  "Baltic",
  "Comm Chest #1",
  "Mediterranean",
  "Income Tax",
  "Reading RR",
  "Oriental ave",
  "Chance #1",
  "Vermont Ave",
  "Connecticut Ave",
  "Jail",
  "St. Charles Place",
  "Electric company",
  "States Ave",
  "Virginia Ave",
  "Pennsylvania RR",
  "St.James Pl",
  "Comm Chest #2",
  "Tennessee Ave",
  "New York Ave",
  "Free Parking",
  "Kentucky Ave",
  "Chance #2",
  "Indiana Ave",
  "Illinois Ave",
  "B&O RR",
  "Atlantic ave",
  "Ventnor Ave",
  "Water Works",
  "Marvin Gardens",
  "Go to Jail",
  "Pacific Ave",
  "North Carolina Ave",
  "Comm. Chest #3",
  "Pennsylvania Ave",
  "Short Line RR",
  "Chance #3",
  "Park Place",
  "Luxury Tax",
  "Boardwalk"
];

// Community chest cards with descriptions and actions.
const communityChestCards = [
  {description: "Advance to Go (Collect $200)", action: "move", destination: "Go"},
  {description: "Bank error in your favor. Collect $200", action: "collect", amount: 200,},
  {description: "Doctor’s fee. Pay $50", action: "fee", amount: -50 },
  {description: "From sale of stock you get $50", action: "collect", amount: 50 },
  {description: "Get Out of Jail Free", action: "getOutOfJailFreeCard" },
  {description: "Go to Jail. Go directly to jail, do not pass Go, do not collect $200", action: "goToJail" },
  {description: "Holiday fund matures. Receive $100", action: "collect", amount: 100},
  {description: "Income tax refund. Collect $20", action: "collect", amount: 20},
  {description: "It is your birthday. Collect $10 from every player", action: "collect", amount: 10},
  {description: "Life insurance matures. Collect $100", action: "collect", amount: 100},
  {description: "Pay hospital fees of $100", action: "fee", amount: -100 },
  {description: "Pay school fees of $50", action: "fee", amount: -50 },
  {description: "Receive $25 consultancy fee", action: "collect", amount: 25 },
  {description: "You are assessed for street repair. $40 per house. $115 per hotel", action: "fee", amount: -115},
  {description: "You have won second prize in a beauty contest. Collect $10", action: "collect", amount: 10 },
  { description: "You inherit $100", action: "collect", amount: 100 }
];

// Chance cards and their effects. 
const chanceCards = [
  {
    description: "Advance to Boardwalk",
    action: "move",
    destination: "Boardwalk",
  },
  {
    description: "Advance to Go (Collect $200)",
    action: "move",
    destination: "Go",
  },
  {
    description: "Advance to Illinois Avenue. If you pass Go, collect $200",
    action: "move",
    destination: "Illinois Ave",
  },
  {
    description: "Advance to St. Charles Place. If you pass Go, collect $200",
    action: "move",
    destination: "St. Charles Place",
  },
  {
    description: "Advance to the nearest Railroad",
    action: "moveNearest",
    type: "railroad",
  },
  {
    description: "Advance token to nearest Utility. ",
    action: "moveNearest",
    type: "utility",
  },
  {
    description: "Bank pays you dividend of $50",
    action: "collect",
    amount: 50,
  },
  { description: "Get Out of Jail Free", action: "getOutOfJailFreeCard" },
  { description: "Go Back 3 Spaces", action: "moveBack", spaces: 3 },
  {
    description:
      "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200",
    action: "goToJail",
  },
  {
    description:
      "Make general repairs on all your property. For each house pay $25. For each hotel pay $100",
    action: "fee",
    amount: -100,
  },
  { description: "Speeding fine $15", action: "fee", amount: -15 },
  {
    description:
      "Take a trip to Reading Railroad. If you pass Go, collect $200",
    action: "move",
    destination: "Reading RR",
  },
  {
    description:
      "You have been elected Chairman of the Board. Pay each player $50",
    action: "fee",
    amount: -50,
  },
  {
    description: "Your building loan matures. Collect $150",
    action: "collect",
    amount: 150,
  }
];

// function to shuffle any deck: chance or community chest
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // swap the elements 
  }
}

// shuffle the decks
shuffle(communityChestCards);
shuffle(chanceCards);

// Simulate rolling two six-sided dice
function rollDice() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return {
    sum: die1 + die2, // Sum of the two die
    isDouble: die1 === die2, // True if both dice have the same value
  };
}

// this class is to keep track of each player's state such as their position on the board and whether they are in jail
class Player {
  constructor() {
    this.position = 0; // Start at Go
    this.isInJail = false; // Not in jail initially
    this.doublesCount = 0; // No doubles rolled initially
    this.jailTurns = 0; // N/A initially
    this.getOutOfJailFreeCard = false; // Does not have a 'Get Out of Jail free card
  }

  // MOve the player around the board by  a certain number of spaces
  move(spaces) {
    this.position = (this.position + spaces) % 40; // 40 spaces on a Monopoly board
  }

  // send the player directly to jail
  goToJail() {
    this.position = spaces.indexOf("Jail");
    this.isInJail = true;
    this.doublesCount = 0; // Reset doubles count when going to jail
  }
}

// function to run a game simulation w/ specific strategy and number of turns
// this functions handles different strategies, and updates positions based on dice
//rolls
function simulateGame(strategy, turns) {
  const player = new Player();
  const landCounts = new Array(spaces.length).fill(0);

    for (let i = 0; i < turns; i++) {
        if (player.inJail) {
            handleJail(player, strategy); 
        } else {
            const roll = rollDice();
            if (roll.isDouble) player.doublesCount++;
            if (player.doublesCount === 3) {
                player.goToJail();
            } else {
                player.move(roll.sum);
                landCounts[player.position]++;
                player.doublesCount = 0; 
            }
        } 
    }
     return landCounts.map(count => (count / turns) * 100); 
}

function findNearest(player, type) {
    const utilities = [spaces.indexOf("Electric Company"), spaces.indexOf("Water Works" )];
}

// Function to handle jail scenarios based on the chosen strategy
// Player can try to get out of jail using different strategies - paying a fine or rolling doubles
function handleJail(player, strategy) {
  if (player.getOutOfJailFreeCard) {
    player.isInJail = false;
    player.getOutOfJailFreeCard = false;
    console.log("Used Get Out of Jail Free Card");
    return;
  }
  if (strategy === "A") {
    player.inJail = false;
    console.log("Paid find to get out of jail");
  } else if (strategy === "B") {
    if (!tryToRollDoubles(player)) {
      player.jailTurns++;
      if (player.jailTurns >= 3) {
        player.inJail = false;
        player.jailTurns = 0;
        console.log("Paid find on fourth turn to get out of jail");
      }
    } else {
      player.inJail = false;
      player.jailTurns = 0;
      console.log("Rolled doubles to get out of jail");
    }
  }
}

// Utility function to simulate attempt at rolling doubles to get out of jail.
function tryToRollDoubles(player) {
    // attempts to roll doubles three times; returns true if successful
  for (let i = 0; i < 3; i++) {
    const roll = rollDice();
    if (roll.isDouble) {
      return true;
    }
  }
  return false;
}

// event listener to star the simulation process when the 'run' button is clicked 
document.getElementById("runGame").addEventListener("click", () => {
    // Runs multiple simulations based on different strategies and collects data
  const allData = []; // store results from all simulations
  const turnMilestones = [1000, 10000, 100000, 1000000];
  const strategies = ['A', 'B'];

  strategies.forEach(strategy => {
    turnMilestones.forEach(turns => {
        for (let i =0; i < 10; i++) {
            const results = simulateGame(strategy, turns);
            const data = results.map((percent, index) => {
                return { count: Math.round((percent / 100) * turns), percent: percent };
            });
            allData.push({ data: data, turns: turns, strategy: strategy });
        }
    });
  });
  displayAllResults(allData); // Function to display results on the page

});

// Function to display the simulation results and format it.
function displayAllResults(allData) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = '';  // clear previous results

    allData.forEach(result => {
        const title = document.createElement('h2');
        title.textContent = `Strategy ${result.strategy} Simulation for ${result.turns} turns`;
        resultsElement.appendChild(title);

        const table = createTableElement(result.data, result.turns);
        resultsElement.appendChild(table);
    });
}

// Helper function to create table elements for displaying the results
function createTableElement(data, turns) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Property</th><th>Count</th><th>%</th>';

    data.forEach((item, index) => {
        const row = table.insertRow();
        row.insertCell().textContent = spaces[index];
        row.insertCell().textContent = item.count;
        row.insertCell().textContent = item.percent.toFixed(2) + '%';
    });
    return table;
}
