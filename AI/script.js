$(document).ready(function() {

    $('#query').on('keydown', function(e) {
        if (e.keyCode == 13) { // Enter key
            e.preventDefault();
            let question = $(this).val();
            displayUserMessage(question);
            fetchAnswer(question);
            $(this).val(""); // Clear input
        }
    });

    function displayUserMessage(message) {
        $('#chatbox').append('<div class="message user">' + message + '</div>');
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
    }

    function displayBotMessage(message) {
        $('#chatbox').append('<div class="message bot">' + message + '</div>');
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
    }

    function fetchAnswer(question) {
        // Start with Wikipedia by default
        fetchWikipediaTitle(question);
        fetchRestCountry(question);
    }

    function fetchWikipediaTitle(query) {
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php",
            data: {
                action: "query",
                list: "search",
                srsearch: query,
                format: "json"
            },
            dataType: 'jsonp',
            success: function(response) {
                if (response.query.search.length > 0) {
                    let mostRelevantTitle = response.query.search[0].title;
                    fetchWikipediaSummary(mostRelevantTitle);
                } else {
                    // If Wikipedia has no relevant info, fetch a quote for fun
                    fetchQuote();
                }
            }
        });
    }

    function fetchWikipediaSummary(title) {
        $.ajax({
            url: `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            success: function(response) {
                displayBotMessage(response.extract);
            }
        });
    }

    function fetchQuote() {
        $.ajax({
            url: `https://api.quotable.io/random`,
            success: function(response) {
                displayBotMessage(`"${response.content}" - ${response.author}`);
            }
        });
    }




    function fetchRestCountry(query) {
        $.ajax({
            url: "https://restcountries.com/v3.1/name/",
            data: {
                action: "query",
                list: "search",
                srsearch: query,
                format: "json"
            },
            dataType: 'jsonp',
            success: function(response) {
                if (response.query.search.length > 0) {
                    let mostRelevantTitle = response.query.search[0].title;
                    fetchRestCountrySummary(mostRelevantTitle);
                } else {
                    // If Wikipedia has no relevant info, fetch a quote for fun
                    fetchQuote();
                }
            }
        });
    }

    function fetchRestCountrySummary(title) {
        $.ajax({
            url: `https://restcountries.com/v3.1/name/${encodeURIComponent(title)}`,
            success: function(response) {
                displayBotMessage(response.extract);
            }
        });
    }

    function fetchQuote() {
        $.ajax({
            url: `https://api.quotable.io/random`,
            success: function(response) {
                displayBotMessage(`"${response.content}" - ${response.author}`);
            }
        });
    }

    function fetchGithubUser(query) {
        // Simple regex to extract potential usernames. This is very basic and can be improved.
        const usernameRegex = /github user ([a-zA-Z0-9_-]+)/i;
        const match = query.match(usernameRegex);
    
        if (match && match[1]) {
            const username = match[1];
            $.ajax({
                url: `https://api.github.com/users/${username}`,
                success: function(response) {
                    displayBotMessage(`GitHub user: ${response.login} \n- Name: ${response.name || 'N/A'} \n- Bio: ${response.bio || 'N/A'} \n- Public Repos: ${response.public_repos} \n- Followers: ${response.followers} \n- Following: ${response.following} \n[Link to Profile](${response.html_url})`);
                },
                error: function() {
                    displayBotMessage(`Sorry, I couldn't find details for the GitHub user: ${username}.`);
                }
            });
        } else {
            // If not a GitHub user question, search somewhere else (e.g. Wikipedia or other APIs)
            fetchWikipediaTitle(query);
        }
    }
    
    function fetchAnswer(question) {
        if (question.toLowerCase().includes("github user")) {
            fetchGithubUser(question);
        } else {
            // Other fetch functions like Wikipedia or any other data source.
            fetchWikipediaTitle(question);
        }
    }
    
    function evaluateMathExpression(query) {
        try {
            const result = math.evaluate(query);
            displayBotMessage(`Result: ${result}`);
        } catch (error) {
            displayBotMessage("Sorry, I couldn't evaluate the mathematical expression.");
        }
    }
    
    function fetchAnswer(question) {
        if (question.toLowerCase().includes("calculate") || question.match(/[+\-*/%^]/)) {
            evaluateMathExpression(question);
        } else if (question.toLowerCase().includes("github user")) {
            fetchGithubUser(question);
        } else {
            // Other fetch functions like Wikipedia or any other data source.
            fetchWikipediaTitle(question);
        }
    }

    // Add more fetch functions for other sources as required

    // Clear button
    $('#clearChat').click(function() {
        if (confirm('Are you sure you want to clear the chat?')) {
            $('#chatbox').empty();
        }
    });

});