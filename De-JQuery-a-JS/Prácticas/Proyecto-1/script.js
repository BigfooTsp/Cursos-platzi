
const $miPlaylist = document.getElementsByClassName('miPlaylist-list')

async function callAPI(params) {                        // STUB Gestiona llamada a API externa y guarda en localStorage
    try {
        const VIDEO_API = 'https://yts.am/api/v2/list_movies.json?'
        const resp= await fetch(`${VIDEO_API}${params}`)
        const miJson = await resp.json()

        if (miJson.data.movie_count) {
            const {data: {movies: data}} = miJson
            data.forEach(movie => {
                const title = movie.title
                window.localStorage.setItem(title, JSON.stringify(movie)) // NOTE solo guarda texto   
            }) 
            return data
        } 
    } catch (error) {
        console.log('callAPI function error', error)
    }
}   

async function loadLists() {                            // SECTION Carga las listas
    function ListTemplate(cacheList, genre) {           // NOTE Devuelve el template HTML del contenedor de la lista.
        return `<div class="movies-list"'>
                    <h1>${genre}</h1>
                    <div class="movie-box-container">
                        ${cacheList}
                    </div>
                </div>`
    }
    function MovieTemplate(movie, genre) {              // NOTE Devuelve el template HTML con el contenedor de la película.
        return `<div class="movie-box" data-id=${movie.id} data-genre="${genre}" data-title="${movie.title}">
                    <figure class="movie-image-container">
                        <img src="${movie.medium_cover_image}" alt="">
                    </figure>
                    <p class="movie-title">${movie.title}</p>
                </div>`
    }
    async function getTemplate(genre) {                 // NOTE Realiza consulta y evuelve el template del género completo en texto
        let cacheList = await callAPI(`genre=${genre}`) // NOTE Obtiene el JSON con los datos del género.
        let HTMLString = ''
        cacheList.forEach(movie => {
            let HTMLMovieItem = MovieTemplate(movie, genre)
            HTMLString += HTMLMovieItem
        });
        return ListTemplate(HTMLString, genre)
    }

    Procesando_Listas: {                                // NOTE Procesando las listas ... No puede ser en un bucle del array genres:(
        const $moviesSection = document.getElementsByClassName('movies-section')
        let HTMLTemplate = ``                               
        HTMLTemplate += await getTemplate('comedy')
        HTMLTemplate += await getTemplate('sci-fy')
        HTMLTemplate += await getTemplate('horror')
        HTMLTemplate += await getTemplate('action')
        HTMLTemplate += await getTemplate('drama')
        
        $moviesSection[0].innerHTML = HTMLTemplate          // STUB Pegando html
        const imageList = Array.from($moviesSection[0].querySelectorAll('img'))    // STUB Mostrando con animación fade-in
        imageList.forEach(image => {
            image.addEventListener('load', event => {       // STUB Listener
                event.srcElement.classList.add('fadeIn')
            })
            let container = image.parentElement.parentElement
            container.addEventListener('click', manageSearch)
        })
    }
}                                                       //!SECTION 

async function loadFriends() {                          // SECTION Cargando amigos desde API 'random user'
    async function callUserAPI(results=1) {  
        const USER_API = `https://randomuser.me/api/?results=${results}`
        let call = await fetch(USER_API)
        const miJSON = await call.json()
        return miJSON.results
    }

    function templateFriend(friend) {
        return `<div class="friend-container">
                <figure class="friend-image-container">
                    <img src="${friend.picture.thumbnail}" width="50" alt="" class="friend-image">
                </figure>
                <p class="friend-name">${friend.name.first} ${friend.name.last}</p>
                </div>`
    }
    function templateFriendContainer(friends) {          // NOTE  
        let htmlstr = ''
        friends.forEach(friend => {
            friendTemplate = templateFriend(friend)
            htmlstr += friendTemplate
        });
        return `<h4 class="friendsPlaylists-title">Friends Playlists</h4>
                ${htmlstr}`
    }

    function pasteUser(user) {
        const $userName = document.getElementById("user-name")
        const $userImage = document.getElementById("user-image")
        const image= user[0].picture.thumbnail
        const nick = user[0].name.first
        $userName.innerHTML = nick
        $userImage.setAttribute('src', image)
    }
    Gestionando_FrienList: {
        const $friendsList= document.getElementById("friends-list")
        const friends = await callUserAPI(4)
        const template = templateFriendContainer(friends)
        $friendsList.innerHTML = template

        const userRequest = await callUserAPI()
        const user = await userRequest
        pasteUser(user)
    }
}                                   

async function manageSearch(event) {                    // SECTION Activa y gestiona búsqueda
    function modalTemplate(movie) {                     // NOTE Crea el template con la información de la película
        return `<h2 class="title">${movie.title}</h2>
                <figure class = 'image'>
                    <img src="${movie.medium_cover_image}" alt="">
                </figure>
                <p class="description">${movie.description_full}</p>
                <button id='modal-close-Button' type="">Cerrar</button>`
    }
    function modalNotFound() {                          // NOTE Crea el template con el mensaje de no encontrado.
        return `<h2 class="title">Película no encontrada</h2>
                <figure class = 'image'>
                    <img src="images/notFound.png" alt="">
                </figure>
                <button id='modal-close-Button' type="">Cerrar</button>`
    }
    
    async function searchMovie(searchString) {          // NOTE Devuelve el template tras la búsqueda externa    
        let template = window.localStorage.getItem(searchString)    // STUB Comprueba en cache
        let data

        if (template) {
            template = JSON.parse(template)
            return modalTemplate(template)
        } else {
            data = await callAPI(`limit=1&query_term='${searchString}'`)
            if(data) {
                return modalTemplate(data[0])
            } 
        }
        return modalNotFound()
    }
    
    function showModal(template) {                      // NOTE Muestra el resultado de la búsqueda
        const $modal = document.getElementById('modal')
        Configurando_y_mostrando_modal: {
            $modal.classList.replace('no-modal','modal')// STUB Mostrando con animación fade-in
            $modal.innerHTML = template
            const image = $modal.querySelectorAll('img')
            image[0].addEventListener('load', event => {
                event.srcElement.classList.add('fadeIn')
            })
        }
        Boton_cerrar: {
            const $closeButton = document.getElementById('modal-close-Button')  // STUB Activa boton de cierre del modal
            $closeButton.addEventListener('click', ()=>{   // NOTE 'click' listener
                $modal.innerHTML = ""
                $modal.classList.replace('modal', 'no-modal')
            })
        }
    }

    event.preventDefault()
    let searchString       
    
    if (event.type === 'submit') {
        const $buscador = event.target                   // NOTE const searchMovie = this.value (Pero me decido por otra forma)
        const data = new FormData($buscador)             // STUB FormData, Se podría hacer también con qweryselector.contentBox
        searchString = data.get('name')
    } else if (event.type === 'click') {
        searchString = event.target.parentElement.parentElement.dataset.title
    }

    let template = await searchMovie(searchString)
    showModal(template)                                 // NOTE Muestra el modal con el resultado
}                                                       //!SECTION 


Cargando_script: {                                      // NOTE Cargando Script
    async function load() {
        window.localStorage.clear()
        await loadFriends()
        await loadLists()

        const $buscador = document.getElementById("buscadorForm")
        $buscador.addEventListener('submit', manageSearch)
    }

    window.addEventListener('load', load, false)
}
