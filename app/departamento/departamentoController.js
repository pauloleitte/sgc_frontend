(function () {
  angular.module('SGC').controller('departamentoCtrl', [
    '$http',
    'msgs',
    'tabs',
    '$location',
    departamentoController
  ])
  function departamentoController($http, msgs, tabs, $location) {
    const vm = this
    const url = 'http://localhost:5000/api/departamento'
	const url_heroku = 'https://sgc-backend.herokuapp.com/api/departamento'

    vm.refresh = function () {
      const page = parseInt($location.search().page) || 1
      const url_page = `${url_heroku}?skip=${(page - 1) * 10}&limit=10`
      $http.get(url_page).then(function (response) {
        vm.Departamento = {}
        vm.Departamentos = response.data
      })
      $http.get(`${url_heroku}/count`).then(function (resp) {
        vm.pages = Math.ceil(resp.data.value / 10)
        tabs.show(vm, { tabList: true, tabCreate: true })
      })
    }

    vm.create = function () {
      $http.post(url_heroku, vm.Departamento).then(function (response) {
        vm.Departamento = {}
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.showTabUpdate = function (Departamento) {
      vm.Departamento = Departamento
      tabs.show(vm, { tabUpdate: true })
    }
    vm.showTabDelete = function (Departamento) {
      vm.Departamento = Departamento
      tabs.show(vm, { tabDelete: true })
    }

    vm.delete = function () {
      const deleteUrl = `${url_heroku}/${vm.Departamento._id}`
      $http.delete(deleteUrl, vm.Departamento).then(function (response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }
    vm.update = function () {
      const updateUrl = `${url_heroku}/${vm.Departamento._id}`
      $http.put(updateUrl, vm.Departamento).then(function (responde) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }

    vm.refresh()
  }
})()