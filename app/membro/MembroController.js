(function () {
  angular.module('SGC').controller('membroCtrl', [
    '$http',
    '$location',
    'msgs',
    'tabs',
    '$filter',
    membroController
  ])
  function membroController($http, $location, msgs, tabs, $filter) {
    const vm = this
    const url = 'http://localhost:5000/api/membro'
	const url_heroku = 'https://morning-lowlands-15369.herokuapp.com/api/membro'

    vm.listaDeSexos = ["Masculino", "Feminino"]

    vm.listaDeTipos = ["Visitante", "Membro"]

    vm.listaDeEstadoCivis = ["Solteiro", "Casado", "Viuvo", "Divorciado"]

    vm.refresh = function () {
      const page = parseInt($location.search().page) || 1
      const url_pages = `${url_heroku}?skip=${(page - 1) * 10}&limit=10`
      $http.get(url_pages).then(function (response) {
        vm.Membro = { dizimos: [{}] }
        vm.Membros = response.data
        vm.calculateValues()
        $http.get(`${url_heroku}/count`).then(function (resp) {
          vm.pages = Math.ceil(resp.data.value / 10)
          tabs.show(vm, { tabList: true, tabCreate: true })
        })
      })
    }
    vm.create = function () {
      $http.post(url_heroku, vm.Membro).then(function (response) {
        vm.Membro = { dizimos: [{}] }
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (response) {
        msgs.addError(response.data.errors)
      })
    }
    vm.update = function () {
      vm.calculateValues()
      const updateUrl = `${url_heroku}/${vm.Membro._id}`
      $http.put(updateUrl, vm.Membro).then(function (response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }
    vm.delete = function () {
      const deleteUrl = `${url_heroku}/${vm.Membro._id}`
      $http.delete(deleteUrl, vm.Membro).then(function (response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
    }
    vm.showTabUpdate = function (Membro) {
      vm.Membro = Membro
      vm.calculateValues()
      tabs.show(vm, { tabUpdate: true })
    }
    vm.showTabDelete = function (Membro) {
      vm.Membro = Membro
      vm.calculateValues()
      tabs.show(vm, { tabDelete: true })
    }
    var initDizimos = function () {

      if (!vm.Membro.dizimos || !vm.Membro.dizimos.length) {
        vm.Membro.dizimos = []
        vm.Membro.dizimos.push({})
      }

      vm.calculateValues()
    }
    vm.addDizimo = function (index) {
      vm.Membro.dizimos.splice(index + 1, 0, { valor: null, data_pagamento: null })
    }
    vm.cloneDizimo = function (index, { valor, data_pagamento, }) {
      vm.Membro.dizimos.splice(index + 1, 0, { valor, data_pagamento })
      initDizimos()
    }
    vm.deleteDizimo = function (index) {
      if (vm.Membro.dizimos.length > 1) {
        vm.Membro.dizimos.splice(index, 1)
        initDizimos()
      }

    }
    vm.cancel = function () {
      tabs.show(vm, { tabList: true, tabCreate: true })
      vm.Membro = {}
      initDizimos()
    }
    vm.calculateValues = function () {
      vm.dizimo = 0
      if (vm.Membro) {
        vm.Membro.dizimos.forEach(function ({ valor }) {
          vm.dizimo += !valor || isNaN(valor) ? 0 : parseFloat(valor)
        })
      }


    }
    vm.getCep = function (cep) {

      var result = cep
      result = result.replace("-", "");
      const viacep = "http://viacep.com.br/ws/" + result + "/json/"

      $http.get(viacep).then(function (response) {

        if (!("erro" in response.data)) {
          //vm.Membro.cep = response.data.cep
          vm.Membro.rua = response.data.logradouro
          vm.Membro.bairro = response.data.bairro
          vm.Membro.estado = response.data.uf
          vm.Membro.cidade = response.data.localidade

        } //end if.
        else {
          //CEP pesquisado não foi encontrado.
          msgs.addError("CEP não foi encontrado!")
          vm.Membro = {}
        }

      }).catch(function (response) {
        msgs.addError(response.data.error)
        vm.Membro = {}
      })
    }
    vm.refresh()
  }
})()
