
// Toggle theme selector dropdown display
function toggleThemeSelector() {
    const themeSelectorContainer = document.getElementById("themeSelectorContainer");
    if (themeSelectorContainer.style.display === "none") {
      themeSelectorContainer.style.display = "block";
    } else {
      themeSelectorContainer.style.display = "none";
    }
  }
  
  // Change the theme of the calculator based on dropdown selection
  function changeTheme() {
    const theme = document.getElementById("themeSelector").value;
    const calculator = document.querySelector(".calculator");
    calculator.classList = "calculator"; // Reset the classes
    calculator.classList.add(theme); // Add the selected theme class
  }

// This function is responsible for appending values (numbers/operators) to the display.
function appendValue(value) {
    const result = document.getElementById("result");
    // Append English numerals, as the calculation will be done using these numerals.
    result.value += value;
  }
  
  // Clear the display.
  function clearResult() {
    document.getElementById("result").value = "";
  }
  
  // Delete the last character from the display.
  function deleteValue() {
    const result = document.getElementById("result");
    result.value = result.value.slice(0, -1);
  }
  
  // Compute the current expression and display the result.
  function calculate() {
    const result = document.getElementById("result");
    try {
      // Evaluate the expression using English numerals.
      let evalResult = eval(result.value);
      // Convert the result to Geez numerals.
      result.value = englishToGeezNumber(evalResult.toString());
    } catch (e) {
      result.value = "ስህተት"; // Error in Amharic
    }
  }

  function englishToGeezNumber(number) {
    // Object mapping English numbers to Geez numbers
    const geezNumbers = {
      '0': '', '1': '\u1369', '2': '\u136A', '3': '\u136B', '4': '\u136C',
      '5': '\u136D', '6': '\u136E', '7': '\u136F', '8': '\u1370', '9': '\u1371'
    };
    
    // Object mapping tens places to Geez numbers
    const tens = {
      '10': '\u1372', '20': '\u1373', '30': '\u1374', '40': '\u1375',
      '50': '\u1376', '60': '\u1377', '70': '\u1378', '80': '\u1379', '90': '\u137A'
    };
    
    // Initialize result variable to an empty string
    let result = '';
    
    // Convert input number to an integer
    let num = parseInt(number);
    // If the input number is greater than or equal to 100, add the corresponding geez number for the hundreds place
    if (num >= 100) {
      let hundreds = Math.floor(num / 100);
      result += geezNumbers[hundreds] + '፻'; // add the hundred symbol
      num %= 100; // remove the hundreds place from the input number
    }
    // If the input number is greater than or equal to 10, add the corresponding geez number for the tens place
    if (num >= 10) {
      let tensPlace = Math.floor(num / 10) * 10;
      result += tens[tensPlace.toString()];
      num %= 10; // remove the tens place from the input number
    }
    // If the input number is greater than 0, add the corresponding geez number for the ones place
    if (num > 0) {
      result += geezNumbers[num.toString()];
    }
    // Return the final result
    return result;
  }
// Call the updateTime function once at the beginning to set the initial time display.

function updateTime() {
    // Get the container element with id 'time'
    const container = document.getElementById('time');
    const calculateKen = document.getElementById("ken");
    
     var EthioTimeInGeez = new Date().toLocaleString("en-US", {timeZone: "Africa/Addis_Ababa" });
    
    // Create a new Date object for the current time
    const now = new Date(EthioTimeInGeez);
    
    // Get the hours from the Date object and add 1 (to adjust for Ethiopian time)
    let hours = now.getHours() - 6;
    
    // Set a default time period of "AM" and a Geez number of 0
    let timePeriod = "AM";
    let timeRange;
  
    // If the hours are greater than or equal to 12, subtract 12 and set the time period to "PM"
    if (hours >= 12) {
      hours -= 12;
      timePeriod = "PM";
    }
  
    // If the hours are 0, set them to 12
    if (hours <= 0) {
      hours+= 12;
    }
    // Set the Geez number based on the hours
    if ((hours >= 12 || hours < 6) && timePeriod == 'AM') {
      timeRange = "ነግህ";
    } else if ((hours >= 6 || hours < 12) && timePeriod == 'AM') {
      timeRange = "ሌሊት";
    } else if ((hours >= 12 || hours < 6) && timePeriod == 'PM') {
      timeRange = "ምሲት";
    } else if ((hours >= 6 || hours < 12) && timePeriod == 'PM') {
      timeRange = "መአልት";
    }
  
    // Get the minutes from the Date object
    let minutes = now.getMinutes();
    
    // If the minutes are less than 10, add a leading 0
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    // Get the seconds from the Date object
    let seconds = now.getSeconds();
    
    // If the seconds are less than 10, add a leading 0
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let day = now.getDay();
    let ken = 'ሰኞ';
    if(day == 0)
      ken = 'እሁድ';
    if (day == 1) {
      ken ='ሰኑይ';
    }
    else if (day == 2) {
      ken ='ሠሉስ';
    }
    else if (day == 3) {
      ken = 'ረቡዕ';
    }
    else if (day == 4) {
      ken  ='ሐሙስ';
    }
    else if (day == 5) {
      ken ='አርብ';
    }
    else if(day == 6) { 
      ken  = 'ቀዳሚ';
    }
    // Convert the English time to Geez numbers and format the time string
    const time = englishToGeezNumber(hours) + ":" + englishToGeezNumber(minutes) + ":" + englishToGeezNumber(seconds) + " " + timeRange;   
    // Set the text content of the container element to the formatted time string
    container.textContent = time;
    calculateKen.textContent = ken
  }
setInterval(updateTime, 1000);
updateTime();
  