importScripts ('js/sw-Utils.js');


const STATIC_CACHE      ='static-v2';
const DYNAMIC_CACHE     ='dynamic-v1';
const INMUTABLE_CACHE   ='inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-Utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'



];

// Install: Crea los caches e instala los archivos.
self.addEventListener('install', e => {
        const cacheStatic = caches.open ( STATIC_CACHE ) 
        .then(cache => {
                cache.addAll( APP_SHELL );
        });


        const cacheInmutable = caches.open ( INMUTABLE_CACHE ) 
        .then(cache => {
                cache.addAll( APP_SHELL_INMUTABLE );
        });

        e.waitUntil (Promise.all ([cacheInmutable, cacheStatic]) );

});

// Activate: Si hay actualizaciones en el cache estatico borra los que quedan en desuso.
self.addEventListener('activate', e => {
        const respuesta = caches.keys().then(keys => {
            keys.forEach( key => {
                if ( key !== STATIC_CACHE && key.includes('static')){
                    return caches.delete(key);
                }
            });
        });
    e.waitUntil( respuesta );
});

self.addEventListener('fetch', e =>{

    // consulto si esxiste en el cache el objeto de la request
    const respuesta = caches.match ( e.request )

    .then( res => {
        // Si hubo respuesta 
        if ( res ){
            // vuelve la respuesta
            return res;

        } else {
            // al usar fuentes de google, al estar invocandolas lo que se hace ásar un 
            return fetch(e.request)
            .then( newRes =>{
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);


            });
        }


    });

    e.respondWith ( respuesta  );


});