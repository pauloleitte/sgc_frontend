angular
  .module("SGC")
  .controller("DashboardCtrl", ["$http", DashboardController]);

function DashboardController($http) {
  const vm = this;
  vm.getdashboardCongregacao = function() {
    const url_heroku = "https://sgc-backend.herokuapp.com/api/congregacao/count";
    $http.get(url_heroku).then(function(response) {
      var valor = response.data.value;
      vm.congregacao = valor;
    });
  };
  vm.getdashboardMembro = function() {
    const url = "https://sgc-backend.herokuapp.com/api/pessoa/count";
    $http.get(url).then(function(response) {
      var valor = response.data.value;
      vm.membro = valor;
    });
  };

  vm.getdashboardEvento = function() {
    const url = "https://sgc-backend.herokuapp.com/api/evento/count";
    $http.get(url).then(function(response) {
      var valor = response.data.value;
      vm.evento = valor;
    });
  };

  vm.getdashboardDizimo = function() {
    const url = "https://sgc-backend.herokuapp.com/api/PessoaSummary";
    $http.get(url).then(function(response) {
      var valor = response.data.dizimo;
      vm.dizimo = valor;
    });
  };

  vm.getchartCongregacao = function(){
    const url = "https://sgc-backend.herokuapp.com/api/CongregacaoByMinisterio";
    $http.post(url,{ministerio: "Belém"}).then(function(response){
      var valorBelem = response.data.count;
      vm.data_congregacao.push(valorBelem);
    })
    $http.post(url,{ministerio: "Brás"}).then(function(response){
      var valorBras = response.data.count;
      vm.data_congregacao.push(valorBras);
    })
    $http.post(url,{ministerio: "Madureira"}).then(function(response){
      var valorMadureira = response.data.count;
      vm.data_congregacao.push(valorMadureira);
    })
  }

  vm.getchartEvento = function(){
    const url = "https://sgc-backend.herokuapp.com/api/EventoByTipo";
    $http.post(url,{tipo: "Congresso"}).then(function(response){
      var valorCongresso = response.data.count;
      vm.data_evento.push(valorCongresso)
    })
    $http.post(url,{tipo: "Oração"}).then(function(response){
      var valorOracao = response.data.count;
      vm.data_evento.push(valorOracao)
    })
    $http.post(url,{tipo: "Culto"}).then(function(response){
      var valorCulto = response.data.count;
      vm.data_evento.push(valorCulto)
    })
  }

  vm.getchartMembro = function(){
    const url = "https://sgc-backend.herokuapp.com/api/PessoaBytype";
    $http.post(url,{tipo: "Visitante"}).then(function(response){
      var valorVisitante = response.data.count
      vm.data_pessoa.push(valorVisitante)
    })
    $http.post(url,{tipo: "Membro"}).then(function(response){
      var valorMembro = response.data.count;
      vm.data_pessoa.push(valorMembro)
    })
    
  }

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
  vm.labels_congregacao = ["Belém","Brás","Madureira"];
  vm.labels_evento = ["Congresso","Culto","Oração"];
  vm.labels_membro = ["Membro","Visitante"];
  vm.colors = ["#d33724", "#00c0ef", "#f39c12 "];
}
