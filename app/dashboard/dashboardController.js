angular
  .module("SGC")
  .controller("DashboardCtrl", ["$http", "consts", DashboardController]);

function DashboardController($http) {
  const vm = this;
  const url_heroku = "https://sgc-backend.herokuapp.com/api/";
  vm.getdashboardCongregacao = function() {
    $http.get(`${url_heroku}congregacao/count`).then(function(response) {
      var valor = response.data.value;
      vm.congregacao = valor;
    });
  };
  vm.getdashboardMembro = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/pessoa/count";
    $http.get(`${url_heroku}pessoa/count`).then(function(response) {
      var valor = response.data.value;
      vm.membro = valor;
    });
  };

  vm.getdashboardEvento = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/evento/count";
    $http.get(`${url_heroku}evento/count`).then(function(response) {
      var valor = response.data.value;
      vm.evento = valor;
    });
  };

  vm.getdashboardDizimo = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/PessoaSummary";
    $http.get(`${url_heroku}PessoaSummary`).then(function(response) {
      var valor = response.data.dizimo;
      vm.dizimo = valor;
    });
  };

  vm.getchartCongregacao = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/CongregacaoByMinisterio";
    $http
      .post(`${url_heroku}CongregacaoByMinisterio`, { ministerio: "Belém" })
      .then(function(response) {
        var valorBelem = response.data.count;
        vm.data_congregacao.push(valorBelem);
      });
    $http
      .post(`${url_heroku}CongregacaoByMinisterio`, { ministerio: "Brás" })
      .then(function(response) {
        var valorBras = response.data.count;
        vm.data_congregacao.push(valorBras);
      });
    $http
      .post(`${url_heroku}CongregacaoByMinisterio`, { ministerio: "Madureira" })
      .then(function(response) {
        var valorMadureira = response.data.count;
        vm.data_congregacao.push(valorMadureira);
      });
  };

  vm.getchartEvento = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/EventoByTipo";
    $http
      .post(`${url_heroku}EventoByTipo`, { tipo: "Congresso" })
      .then(function(response) {
        var valorCongresso = response.data.count;
        vm.data_evento.push(valorCongresso);
      });
    $http
      .post(`${url_heroku}EventoByTipo`, { tipo: "Culto" })
      .then(function(response) {
        var valorCulto = response.data.count;
        vm.data_evento.push(valorCulto);
      });
    $http
      .post(`${url_heroku}EventoByTipo`, { tipo: "Oração" })
      .then(function(response) {
        var valorOracao = response.data.count;
        vm.data_evento.push(valorOracao);
      });
  };

  vm.getchartMembro = function() {
    //const url = "https://sgc-backend.herokuapp.com/api/PessoaBytype";
    $http
      .post(`${url_heroku}PessoaBytype`, { tipo: "Membro" })
      .then(function(response) {
        var valorMembro = response.data.count;
        vm.data_pessoa.push(valorMembro);
      });
    $http
      .post(`${url_heroku}PessoaBytype`, { tipo: "Visitante" })
      .then(function(response) {
        var valorVisitante = response.data.count;
        vm.data_pessoa.push(valorVisitante);
      });
  };

  vm.getdashboardCongregacao();
  vm.getdashboardMembro();
  vm.getdashboardEvento();
  vm.getdashboardDizimo();
  vm.getchartCongregacao();
  vm.getchartEvento();
  vm.getchartMembro();

  vm.data_pessoa = [];
  vm.data_congregacao = [];
  vm.data_evento = [];
  vm.labels_congregacao = ["Belém", "Brás", "Madureira"];
  vm.labels_evento = ["Congresso", "Culto", "Oração"];
  vm.labels_membro = ["Membro", "Visitante"];
  vm.colors = ["#d33724", "#00c0ef", "#f39c12 "];
}
