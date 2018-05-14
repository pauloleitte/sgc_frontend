angular
  .module("SGC")
  .controller("DashboardCtrl", ["$http", DashboardController]);

function DashboardController($http) {
  const vm = this;
   vm.valor1 = 50;
   vm.valor2 = 50;
   vm.valor3 = 50;

  vm.getdashboardCongregacao = function() {
    const url_heroku =
      "https://sgc-backend.herokuapp.com/api/congregacao/count";
    $http.get(url_heroku).then(function(response) {
      var valor = response.data.value;
      vm.congregacao = valor;
    });
  };
  vm.getdashboardMembro = function() {
    const url = "https://sgc-backend.herokuapp.com/api/membro/count";
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
    const url = "https://sgc-backend.herokuapp.com/api/MembroSummary";
    $http.get(url).then(function(response) {
      var valor = response.data.dizimo;
      vm.dizimo = valor;
    });
  };

  vm.getdashboardCongregacao();
  vm.getdashboardMembro();
  vm.getdashboardEvento();
  vm.getdashboardDizimo();
  vm.labels = ["Membros", "Congregações", "Eventos"];
  vm.data = [vm.valor1, vm.valor2, vm.valor3];
  vm.colors = ["#d33724", "#00c0ef", "#f39c12 "];
}
