var axios = require('axios');

// deal with rate limiting with api key
// add if rate limiting issues..
var id = "737aa6f73426cec2945a";
var sec = "59b2b18ab7b6716d66a7f4a898f780fd5b808ab5";
var params = "?client_id=" + id + "&client_secret=" + sec;


function getProfile(username) {
    return axios.get('https://api.gethub.com/users/' + username + params)
        .then(function (user) {
            //formats data before passing it back to the function
           return user.data;
        });
}

function getRepos(username) {
    return axios.get('https://api.gethub.com/users/' + username + '/repos ' + params +
    '&per_page=100')

}

function getStarCount(repos) {
    return repos.data.reduce(function(count, repo) {
        return count + repo.stargazers_count;
    }, 0)
}

function calculateScore(profile, repos) {
    var followers = profile.followers;
    var totalStars = getStarCount(repos);

    return (followers * 3) + totalStars;
}


function handleError(error) {
    console.warn(error);
    return null;
}


// When both have returned with data
function getUserData(player) {
    return axios.all([
        getProfile(player),
        getRepos(player)
    ]).then(function(data) {
        var profile = data[0];
        var repos = data[1];

        return {
            profile: profile,
            score: calculateScore(profile, repos)
        }

    })
}

function sortPlayers(players) {
    return players.sort(function(a,b) {
        return b.score - a.score;
    });
}

module.exports = {
    battle: function(players) {
        //Returns a new array of all the requests
        // profile and score from the user data request
        return axios.all(players.map(getUserData))
            .then(sortPlayers)
            .catch(handleError);
    },
    fetchPopularRepos: function(language)
    {
        var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+
            language + '&sort=stars&order=desc&type=Repositories');

        return axios.get(encodedURI)
            .then(function(response) {
            return response.data.items;
        });
    }
};


