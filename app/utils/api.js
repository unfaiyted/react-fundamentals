
// deal with rate limiting with api key
// add if rate limiting issues..
const id = "737aa6f73426cec2945a";
const sec = "59b2b18ab7b6716d66a7f4a898f780fd5b808ab5";
const params = `?client_id=${id}&client_secret=${sec}`;



async function getProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}${params}`);
    return response.json();
}

async function getRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
    return response.json();

}

function getStarCount(repos) {
    return repos.reduce((count, {stargazers_count}) => (count + stargazers_count), 0)
}

function calculateScore({followers}, repos) {
    return (followers * 3) + getStarCount(repos);
}


function handleError(error) {
    console.warn(error);
    return null;
}


// When both have returned with data
async function getUserData(player) {
    const [profile, repos] = await Promise.all([
        getProfile(player),
        getRepos(player)
    ]);

    return({
            profile,
            score: calculateScore(profile, repos)
        });
}

function sortPlayers(players) {
    return players.sort((a,b) => (b.score - a.score));
}

export async function battle (players) {
        //Returns a new array of all the requests
        // profile and score from the user data request
        const results = await Promise.all(players.map(getUserData))
            .catch(handleError);

        return results === null ? results : sortPlayers(results);

}

export async function fetchPopularRepos (language) {
        const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:
            ${language}&sort=stars&order=desc&type=Repositories`);

        const response =  await fetch(encodedURI)
            .catch(handleError);

        const repos = await response.json();

            return repos.items;



    }


