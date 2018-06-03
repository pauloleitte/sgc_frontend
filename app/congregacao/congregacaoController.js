(function() {
  angular
    .module("SGC")
    .controller("congregacaoCtrl", [
      "$http",
      "msgs",
      "tabs",
      "$location",
      congregacaoController
    ]);
  function congregacaoController($http, msgs, tabs, $location) {
    const vm = this;
    const url = "http://localhost:5000/api/congregacao";
    const url_heroku = "https://sgc-backend.herokuapp.com/api/congregacao";

    vm.listaDeMinisterios = ["Brás", "Belém", "Madureira"];

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1;
      const url_page = `${url_heroku}?skip=${(page - 1) * 10}&limit=10`;
      $http.get(url_page).then(function(response) {
        vm.Congregacao = {};
        vm.Congregacaos = response.data;
      });
      $http.get(`${url_heroku}/count`).then(function(resp) {
        vm.pages = Math.ceil(resp.data.value / 10);
        tabs.show(vm, { tabList: true, tabCreate: true });
      });
    };

    vm.getCep = function(cep) {
      var result = cep;
      result = result.replace("-", "");
      console.log(result);
      const viacep = "https://viacep.com.br/ws/" + result + "/json/";

      $http
        .get(viacep)
        .then(function(response) {
          if (!("erro" in response.data)) {
            //vm.Membro.cep = response.data.cep
            vm.Congregacao.rua = response.data.logradouro;
            vm.Congregacao.bairro = response.data.bairro;
            vm.Congregacao.estado = response.data.uf;
            vm.Congregacao.cidade = response.data.localidade;
          } //end if.
          else {
            //CEP pesquisado não foi encontrado.
            msgs.addError("CEP não foi encontrado!");
            vm.Congregacao = {};
          }
        })
        .catch(function(response) {
          msgs.addError(response.data.error);
          vm.Congregacao = {};
        });
    };

    vm.create = function() {
      $http
        .post(url_heroku, vm.Congregacao)
        .then(function(response) {
          vm.Congregacao = {};
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.showTabUpdate = function(Congregacao) {
      vm.Congregacao = Congregacao;
      tabs.show(vm, { tabUpdate: true });
    };
    vm.showTabDelete = function(Congregacao) {
      vm.Congregacao = Congregacao;
      tabs.show(vm, { tabDelete: true });
    };

    vm.delete = function() {
      const deleteUrl = `${url_heroku}/${vm.Congregacao._id}`;
      $http
        .delete(deleteUrl, vm.Congregacao)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(resp) {
          msgs.addError(resp.data);
        });
    };
    vm.update = function() {
      const updateUrl = `${url_heroku}/${vm.Congregacao._id}`;
      $http
        .put(updateUrl, vm.Congregacao)
        .then(function(responde) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso");
        })
        .catch(function(resp) {
          msgs.addError(resp.data);
        });
    };

    vm.refresh();
  }
})();
