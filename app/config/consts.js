angular.module('SGC').constant('consts', {
  appName: 'SGC - Sistema de Gerenciamento Congregacional',
  version: '1.0',
  apiUrl: 'https://sgc-backend.herokuapp.com/api/',
  userKey: '_sgc_app_user'
}).run(['$rootScope', 'consts', function ($rootScope, consts) {
  $rootScope.consts = consts
}])
