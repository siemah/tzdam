export default ( url, data = {}) => (
    fetch(url + '/auth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default'
    })
    .then( res => res.json() )
)