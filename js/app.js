

var typewatch = function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
}();

function getRepos() {
    const url = 'https://api.github.com/users/'
    const username = document.getElementById('search-bar-input').value
    const extUrl = '/repos'

    if (username !== '') {
        typewatch(() => {
            // Whatever you want to trigger paste it here.
            const fetchRepos = () => {
                axios.get(url + username + extUrl)
                    .then(response => {
                        data = JSON.parse(response.request.response)
                        arr = []
                        stringList = ''
                        data.forEach(el => {
                            arr.push({ 'name': el.name, 'html_url': el.html_url })
                            stringList += `<li><i class="fas fa-folder me-3"></i><a href="${el.html_url}">${el.name}</a></li>`
                        });

                        DOMToggleLoadingSpinner('list-spinner')
                        DOMAddListRepos(stringList)
                    })
                    .catch(error => console.error(error));
            }
            fetchRepos()
        }, 2000);
    }
}

function getProfile() {
    const url = 'https://api.github.com/users/'
    const username = document.getElementById('search-bar-input').value

    if (username !== '') {
        DOMToggleLoadingSpinner('btn-spinner')
        DOMToggleLoadingSpinner('btn-search')
        DOMToggleLoadingSpinner('list-spinner')
        typewatch(() => {
            // Whatever you want to trigger paste it here.
            const fetchUsers = () => {
                axios.get(url + username)
                    .then(response => {
                        data = JSON.parse(response.request.response)
                        DOMChangePFP(data.avatar_url)
                        DOMChangeUsername(data.login)
                        DOMChangeFollowersCount(data.followers)
                        DOMChangeUserLink(data.html_url)

                        DOMToggleLoadingSpinner('btn-spinner')
                        DOMToggleLoadingSpinner('btn-search')
                    })
                    .catch(error => console.error(error));
            }

            fetchUsers()
            getRepos()
        }, 2000);
    }

}

function loadPhrase() {
    const fetchPhrase = () => {
        axios.get('https://api.github.com/zen')
            .then(response => {
                DOMChangePhrase(response.data)
            })
            .catch(error => console.error(error));
    }

    fetchPhrase()

}

function DOMAddListRepos(stringList) {
    document.getElementById("list-repos").innerHTML = stringList;
}

function DOMChangePhrase(phrase) {
    document.getElementById("phrase").innerText = phrase;
}

function DOMChangeFollowersCount(followers) {
    document.getElementById("followers-count").innerText = followers;
}

function DOMChangePFP(link) {
    src = document.getElementById('profile-image').setAttribute('src', link)
}

function DOMChangeUsername(username) {
    document.getElementById("username").innerText = username;
}

function DOMChangeUserLink(usernameLink) {
    document.getElementById("username").setAttribute('href', usernameLink);
}

function DOMToggleLoadingSpinner(id) {
    document.getElementById(id).classList.toggle('d-none')
}

function eventNameChanger() {
    // Make sure this code gets executed after the DOM is loaded.
    document.querySelector("#search-bar-input").addEventListener("keyup", event => {
        if (event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#search-bar-input").click(getProfile()); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    });
}

window.onload = () => {
    //console.log('page loaded')
    //loadPhrase()
    eventNameChanger()
}