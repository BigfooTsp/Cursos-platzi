
const VIDEO_API = 'https://yts.am/api/v2/list_movies.json?' // https://yts.am/api/v2/list_movies.json?sort=seeds&limit=15
const genres = ['comedy', 'sci-fy', 'horror', 'action', 'drama']
const USER_API = 'https://randomuser.me/api/'
const $moviesSection = document.getElementsByClassName('movies-section')
const $movieList = document.getElementsByClassName('movies-list')
const $movieBox = document.getElementsByClassName('movie-box')
const $searchBox = document.getElementsByClassName('buscador')
const $modal = document.getElementsByClassName('modal')
const $miPlaylist = document.getElementsByClassName('miPlaylist-list')
const $friend = document.getElementsByClassName('friend-container')

async function loadLists() {
    // Muestra las listas de peliculas
    async function createCache(genre) {
        // Descarga las listas de la API y las guarda en localStorage
        const response = await fetch(`${VIDEO_API}genre=${genre}`)
        const {data: {movies: data}} = await response.json()
        window.localStorage.setItem(genre, JSON.stringify(data)) // solo guarda texto
    }
    async function createList(genre) {
        // Crea las listas en localStorage si no lo están ya y devuelve su valor en JSON
        let cacheList = window.localStorage.getItem(genre)
        if (!cacheList) { 
            await createCache(genre)
        }
        cacheList = window.localStorage.getItem(genre)
        return JSON.parse(cacheList)
    }

    function ListTemplate(cacheList, genre) {
        // Devuelve el template HTML del contenedor de la lista.
        return `<div class="movies-list" id='movie-list-${genre}'>
                    <h1>${genre}</h1>
                    <div class="movie-box-container">
                        ${cacheList}
                    </div>
                </div>`
    }
    function MovieTemplate(movie, genre) {
        // Devuelve el template HTML con el contenedor de la película.
        return `<div class="movie-box" data-id=${movie.id} data-genre=${genre}>
                    <figure class="movie-image-container">
                        <img src="${movie.medium_cover_image}" alt="">
                    </figure>
                    <p class="movie-title">${movie.title}</p>
                </div>`
    }
    async function getTemplate(genre) {
        // Devuelve el template del género completo en texto
        let cacheList = await createList(genre) // Obtiene el JSON con los datos del género.
        let HTMLString = ''
        
        cacheList.forEach(movie => {
            let HTMLMovieItem = MovieTemplate(movie, genre)
            HTMLString += HTMLMovieItem
        });
        return ListTemplate(HTMLString, genre)
    }

    // Procesando las listas ... No puede ser en un bucle :(
    let HTMLTemplate = ``
    HTMLTemplate += await getTemplate('comedy')
    HTMLTemplate += await getTemplate('sci-fy')
    HTMLTemplate += await getTemplate('horror')
    HTMLTemplate += await getTemplate('action')
    HTMLTemplate += await getTemplate('drama')
    // Pegando html
    $moviesSection[0].innerHTML = HTMLTemplate
    // Mostrando con animación fade-in
    const imageList = Array.from($moviesSection[0].querySelectorAll('img'))
    imageList.forEach(image => {
        image.addEventListener('load', event => {
            event.srcElement.classList.add('fadeIn')
        })
    })
}


window.localStorage.clear()
loadLists()
