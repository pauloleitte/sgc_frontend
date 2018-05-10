(function () {

    angular.module('SGC').factory('auth', [
        '$http',
        AuthFactory
    ])

    function AuthFactory($http) {

        let user = null
        const url_api = 'http://localhost:3003/api'
		const url_api_heroku = 'https://sgc-backend.herokuapp.com/api'

        function getUser() {
            if (!user) {
                user = JSON.parse(localStorage.getItem('user'))
            }
            return user
        }

        function signup(user, callback) {
            submit('signup', user, callback)
        }

        function login(user, callback) {
            submit('login', user, callback)
        }

        function submit(url, user, callback) {
            $http.post(`${url_api_heroku}/${url}`, user)
                .then(resp => {
                    localStorage.setItem('user', JSON.stringify(resp.data))
                    if (callback) callback(null, resp.data)
                }).catch(function (resp) {
                    if (callback) callback(resp.data.errors, null)
                })
        }

        function logout(callback) {
            user = null
            localStorage.removeItem('user')
            if (callback) callback(null)
        }
        
        return { signup, login, logout, getUser }
    }

})()