angular.module('SGC').config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('dashboard', {
      url: "/dashboard",
      templateUrl: "dashboard/dashboard.html"
    }).state('congregacao', {
      url: "/Congregacao?page",
      templateUrl: "congregacao/tabs.html"
    }).state('pessoa',{
      url: "/Pessoa?page",
      templateUrl: "Pessoa/tabs.html"
    }).state('departamento',{
      url: "/Departamento?page",
      templateUrl: "departamento/tabs.html"
    }).state('auth',{
      url: "/Auth",
      templateUrl: "/auth.html"
    }).state('evento',{
      url: "/Evento?page",
      templateUrl: "evento/tabs.html"
    })
    $httpProvider.interceptors.push('handleResponseError')
}]).run([
  '$rootScope',
  '$http',
  '$location',
  '$window',
  'auth',
  function ($rootScope, $http, $location, $window, auth) {
    validateUser()
    $rootScope.$on('$locationChangeStart', () => validateUser())

    function validateUser() {
      const user = auth.getUser()
      const authPage = '/auth.html'
      const isAuthPage = $window.location.href.includes(authPage)

      if (!user && !isAuthPage) {
        $window.location.href = authPage
      } else if (user && !user.isValid) {
            user.isValid = true
            $http.defaults.headers.common.Authorization = user.token
            isAuthPage ? $window.location.href = '/' : $location.path('/dashboard')
          }
      }
    }
])
