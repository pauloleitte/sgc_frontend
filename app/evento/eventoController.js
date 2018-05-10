(function () {
  angular.module('SGC').controller('eventoCtrl', [
    '$http',
    'msgs',
    'tabs',
    '$location',
    eventoController
  ])
  function eventoController($http, msgs, tabs, $location) {
    const vm = this
    const url = 'http://localhost:5000/api/evento'
	const url_heroku = 'https://sgc-backend.herokuapp.com/api/evento'
	const url_heroku_congregacao = 'https://sgc-backend.herokuapp.com/api/congregacao'


    vm.listaDeSexos = ["Masculino", "Feminino"]

    vm.listaDeTipos = ["Congresso", "Culto Com as Irmãs", "Culto com os Jovens", "Culto com as Criaças", "Santa Ceia"]

    vm.Congregacaos = [{}]

    vm.getCongregacao = function () {
      $http.get(`${url_heroku_congregacao}`).then(function (response) {
        vm.Congregacaos = response.data
      }).catch(function (res) {
        console.log(res.data.errors)
      })
    }

    vm.refresh = function () {
      const page = parseInt($location.search().page) || 1
      const url_pages = `${url_heroku}?skip=${(page - 1) * 10}&limit=10`
      $http.get(url_pages).then(function (response) {
        vm.getCongregacao()
        vm.Evento = { participantes: [{}] }
        vm.Eventos = response.data
      })
      $http.get(`${url_heroku}/count`).then(function (resp) {
        vm.pages = Math.ceil(resp.data.value / 10)
        tabs.show(vm, { tabList: true, tabCreate: true })
      })
    }

    vm.create = function () {
      $http.post(url_heroku, vm.Evento).then(function (response) {
        vm.Evento = { participantes: [{}] }
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.showTabUpdate = function (Evento) {
      vm.Evento = Evento
      console.log(Evento)
      tabs.show(vm, { tabUpdate: true })
    }
    vm.showTabDelete = function (Evento) {
      vm.Evento = Evento
      tabs.show(vm, { tabDelete: true })
    }

    vm.delete = function () {
      const deleteUrl = `${url_heroku}/${vm.Evento._id}`
      $http.delete(deleteUrl, vm.Evento).then(function (response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }
    vm.update = function () {
      const updateUrl = `${url_heroku}/${vm.Evento._id}`
      $http.put(updateUrl, vm.Evento).then(function (response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }

    var initParcipantes = function () {

      if (!vm.Evento.participantes || !vm.Evento.participantes.length) {
        vm.Evento.participantes = []
        vm.Evento.participantes.push({})
      }
    }
    vm.addPartipante = function (index) {
      vm.Evento.participantes.splice(index + 1, 0, { nome: null, sexo: null, idade: null })
    }
    vm.clonePartipante = function (index, { nome, sexo, idade }) {
      vm.Evento.participantes.splice(index + 1, 0, { nome, sexo, idade })
      initParcipantes()
    }
    vm.deletePartipante = function (index) {
      if (vm.Evento.participantes.length > 1) {
        vm.Evento.participantes.splice(index, 1)
        initParcipantes()
      }

    }
    vm.cancel = function () {
      tabs.show(vm, { tabList: true, tabCreate: true })
      vm.Evento = {}
      initParcipantes()
    }

    vm.refresh()
  }
})()