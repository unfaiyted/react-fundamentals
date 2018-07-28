import axios from 'axios'

// deal with rate limiting with api key
// add if rate limiting issues..
const id = "737aa6f73426cec2945a";
const sec = "59b2b18ab7b6716d66a7f4a898f780fd5b808ab5";
const params = `?client_id=${id}&client_secret=${sec}`;



function getProfile(username) {
    return axios.get(`https://api.github.com/users/${username}${params}`)
        .then(({ data }) => data);
}

function getRepos(username) {
    return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)

}

function getStarCount(repos) {
    return repos.data.reduce((count, {stargazers_count}) => (count + stargazers_count), 0)
}

function calculateScore({followers}, repos) {
    return (followers * 3) + getStarCount(repos);
}


function handleError(error) {
    console.warn(error);
    return null;
}


// When both have returned with data
function getUserData(player) {
    return Promise.all([
        getProfile(player),
        getRepos(player)
    ]).then(([profile, repos]) => ({
            profile,
            score: calculateScore(profile, repos)
        }))
}

function sortPlayers(players) {
    return players.sort((a,b) => (b.score - a.score));
}

export function battle (players) {
        //Returns a new array of all the requests
        // profile and score from the user data request
        return Promise.all(players.map(getUserData))
            .then(sortPlayers)
            .catch(handleError);
}

export function fetchPopularRepos (language) {
        const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:
            ${language}&sort=stars&order=desc&type=Repositories`);

        return axios.get(encodedURI).then(({ data }) => data.items );
    }


