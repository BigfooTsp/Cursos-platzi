
const VIDEO_API = 'https://yts.am/api/v2/list_movies.json?' // NOTE https://yts.am/api/v2/list_movies.json?sort=seeds&limit=15
const USER_API = 'https://randomuser.me/api/'
const $miPlaylist = document.getElementsByClassName('miPlaylist-list')
const $friendsList= document.getElementsByClassName('friend-container')
const $buscador = document.getElementsByClassName('buscadorForm')

async function loadLists() {                            // SECTION ()=> Carga las listas
    const $moviesSection = document.getElementsByClassName('movies-section')
    
    async function createCache(genre) {                 // NOTE (str)=> Descarga las listas de la API y las guarda en localStorage
        const response = await fetch(`${VIDEO_API}genre=${genre}`)
        const {data: {movies: data}} = await response.json()
        window.localStorage.setItem(genre, JSON.stringify(data)) // solo guarda texto
    }
    async function createList(genre) {                  // NOTE (str)=> Crea las listas en localStorage si no lo están ya y devuelve su valor en JSON
        let cacheList = window.localStorage.getItem(genre)
        if (!cacheList) { 
            await createCache(genre)
        }
        cacheList = window.localStorage.getItem(genre)
        return JSON.parse(cacheList)
    }                                                   // TODO [ ] El evento click de una película se crea y gestiona al crearlo
    function ListTemplate(cacheList, genre) {           // NOTE (JSON, str)=> Devuelve el template HTML del contenedor de la lista.
        return `<div class="movies-list"'>
                    <h1>${genre}</h1>
                    <div class="movie-box-container">
                        ${cacheList}
                    </div>
                </div>`
    }
    function MovieTemplate(movie, genre) {              // NOTE (JSON, str)=> Devuelve el template HTML con el contenedor de la película.
        return `<div class="movie-box" data-id=${movie.id} data-genre=${genre} data-title=${movie.title}>
                    <figure class="movie-image-container">
                        <img src="${movie.medium_cover_image}" alt="">
                    </figure>
                    <p class="movie-title">${movie.title}</p>
                </div>`
    }
    async function getTemplate(genre) {                 // NOTE (str)=> Devuelve el template del género completo en texto
        let cacheList = await createList(genre)         // Obtiene el JSON con los datos del género.
        let HTMLString = ''
        
        cacheList.forEach(movie => {
            let HTMLMovieItem = MovieTemplate(movie, genre)
            HTMLString += HTMLMovieItem
        });
        return ListTemplate(HTMLString, genre)
    }
    
    let HTMLTemplate = ``                               // NOTE Procesando las listas ... No puede ser en un bucle del array genres:(
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
    })
} // !SECTION 


async function manageSearch() {                          // SECTION ()=> Activa y gestiona búsqueda
    function modalTemplate(movie) {                     // NOTE (JSON)=> Crea el template con la información de la película
        return `<h2 class="title">${movie.title}</h2>
        <figure class = 'image'>
        <img src="${movie.medium_cover_image}" alt="">
        </figure>
        <p class="description">${movie.description_full}</p>
        <button id='modal-close-Button' type="">Cerrar</button>`
    }
    
    function modalNotFound() {                          // NOTE ()=> Crea el template con el mensaje de no encontrado.
        return `<h2 class="title">Película no encontrada</h2>
        <figure class = 'image'>
        <img src="images/notFound.png" alt="">
        </figure>
        <button id='modal-close-Button' type="">Cerrar</button>`
    }
    
    function seeInLists(searchString){                  // NOTE (str)=> Devuelve el template si está en la lista o no
        const $movieArray = querySelectorAll('.movie-box')
        
        $movieArray.forEach($movieBox => {              // NOTE ForEach(HTML)=> Si la búsqueda está en lista, obtiene JSON de localStorage, devuelve template
            let movieTitle = $movieBox.dataset.title
            let movieGenre = $movieBox.dataset.genre
            if (movieTitle == searchString) {
                let genreJSON = JSON.parse(window.localStorage.getItem(movieGenre))
                genreJSON.forEach(movie => {
                    if(movie.title = searchString) {
                        return ModalTemplate(movie)
                    }
                })
            }
        })
    } 
    
    async function searchMovie(searchString) {          // NOTE (str)=> Devuelve el template tras la búsqueda externa    
        console.log ('Iniciando búsqueda') ////////////////
        debugger //////////////////////
        const response= await fetch(`${VIDEO_API}limit=1&query_term=${searchString}`)
        const {movie: {movies: data}} = await response.json()
        if (movie) {
            return modalTemplate(movie)
        }else{
            return modalNotFound()  
        }
    }
    
    function showModal(template) {                      // NOTE (HTMLstr)=> Muestra el resultado de la búsqueda
        console.log('Mostrando modal') /////////////////
        $modal[0].innerHTML = template                  // Pegando html
        $modal.classList.replace('no-modal','modal')    // NOTE Mostrando con animación fade-in
        const imageList = Array.from($modal[0].querySelectorAll('img'))
        image.addEventListener('load', event => {       // STUB LISTENER
            event.srcElement.classList.add('fadeIn')
        })
        
        const $closeButton = getElementsById('modal-close-Button')  // STUB Activa boton de cierre del modal
        $closeButton.addEventListener('submit', ()=>{   // STUB LISTENER
            delete $modal[0]
            $modal.classList.replace('modal', 'no-modal')
        })
    }

    event.preventDefault()                              // STUB Anula comportamiento por defecto del evento

    const $modal = document.getElementById('modal')
    const data = new FormData($buscador[0])             // STUB FormData, Se podría hacer también con qweryselector.contentBox
    const searchString = data.get('name')               // STUB Obtiene el texto en la caja del formulario
    let template = seeInLists(searchString)             // NOTE INICIO. Obtiene JSON de la película buscada
    if (! template) {
        template = await searchMovie(searchString) 
    }
    showModal(template)                                 // NOTE Muestra el modal con el resultado
} 

//!SECTION /////////////////////////////
// SECTION LOOP PRINCIPAL  /////////////
////////////////////////////////////////
async function load() {
    window.localStorage.clear()
    await loadLists()
    $buscador[0].addEventListener('change', manageSearch)
}

window.addEventListener('DOMContentLoaded', load)


// TODO [ ] La forma de obtener los elementos por clases me obliga a tener que wspecificar su índice [0] para usarlos, con getElementById no pasaría creo
