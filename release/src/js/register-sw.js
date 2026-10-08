// register-sw.js
navigator.serviceWorker.register('sw.js', {
    type: 'module'
})
.then(reg => console.log('Service Worker Registered'))
.catch(err => console.log('Registration failed', err));