(function() {
  angular
    .module("SGC")
    .controller("pessoaCtrl", [
      "$http",
      "$location",
      "msgs",
      "tabs",
      "$filter",
      pessoaController
    ]);
  function pessoaController($http, $location, msgs, tabs, $filter) {
    const vm = this;
    const url = "http://localhost:4000/api/pessoa";
    const url_heroku = "https://sgc-backend.herokuapp.com/api/pessoa";

    vm.listaDeSexos = ["Masculino", "Feminino"];

    vm.listaDeTipos = ["Visitante", "Membro"];

    vm.listaDeEstadoCivis = ["Solteiro", "Casado", "Viuvo", "Divorciado"];

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1;
      const url_pages = `${url_heroku}?skip=${(page - 1) * 10}&limit=10`;
      $http.get(url_pages).then(function(response) {
        vm.Pessoa = { dizimos: [{}] };
        vm.Pessoas = response.data;
        vm.calculateValues();
        $http.get(`${url_heroku}/count`).then(function(resp) {
          vm.pages = Math.ceil(resp.data.value / 10);
          tabs.show(vm, { tabList: true, tabCreate: true });
        });
      });
    };
    vm.create = function() {
      $http
        .post(url_heroku, vm.Pessoa)
        .then(function(response) {
          vm.Pessoa = { dizimos: [{}] };
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };
    vm.update = function() {
      vm.calculateValues();
      const updateUrl = `${url_heroku}/${vm.Pessoa._id}`;
      $http
        .put(updateUrl, vm.Pessoa)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso");
        })
        .catch(function(resp) {
          msgs.addError(resp.data);
        });
    };
    vm.delete = function() {
      const deleteUrl = `${url_heroku}/${vm.Pessoa._id}`;
      $http
        .delete(deleteUrl, vm.Pessoa)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(resp) {
          msgs.addError(resp.data);
        });
    };
    vm.showTabUpdate = function(Pessoa) {
      vm.Pessoa = Pessoa;
      vm.calculateValues();
      tabs.show(vm, { tabUpdate: true });
    };
    vm.showTabDelete = function(Pessoa) {
      vm.Pessoa = Pessoa;
      vm.calculateValues();
      tabs.show(vm, { tabDelete: true });
    };
    var initDizimos = function() {
      if (!vm.Pessoa.dizimos || !vm.Pessoa.dizimos.length) {
        vm.Pessoa.dizimos = [];
        vm.Pessoa.dizimos.push({});
      }

      vm.calculateValues();
    };
    vm.addDizimo = function(index) {
      vm.Pessoa.dizimos.splice(index + 1, 0, {
        valor: null,
        data_pagamento: null
      });
    };
    vm.cloneDizimo = function(index, { valor, data_pagamento }) {
      vm.Pessoa.dizimos.splice(index + 1, 0, { valor, data_pagamento });
      initDizimos();
    };
    vm.deleteDizimo = function(index) {
      if (vm.Pessoa.dizimos.length > 1) {
        vm.Pessoa.dizimos.splice(index, 1);
        initDizimos();
      }
    };
    vm.cancel = function() {
      tabs.show(vm, { tabList: true, tabCreate: true });
      vm.Pessoa = {};
      initDizimos();
    };
    vm.calculateValues = function() {
      vm.dizimo = 0;
      if (vm.Pessoa) {
        vm.Pessoa.dizimos.forEach(function({ valor }) {
          vm.dizimo += !valor || isNaN(valor) ? 0 : parseFloat(valor);
        });
      }
    };
    vm.getCep = function(cep) {
      var result = cep;
      result = result.replace("-", "");
      const viacep = "https://viacep.com.br/ws/" + result + "/json/";
      $http
        .get(viacep)
        .then(function(response) {
          if (!("erro" in response.data)) {
            vm.Pessoa.rua = response.data.logradouro;
            vm.Pessoa.bairro = response.data.bairro;
            vm.Pessoa.estado = response.data.uf;
            vm.Pessoa.cidade = response.data.localidade;
          } 
          else {
            msgs.addError("CEP não foi encontrado!");
          }
        })
        .catch(function(response) {
          msgs.addError(response.data.error);
        });
    };
    vm.refresh();
  }
})();
