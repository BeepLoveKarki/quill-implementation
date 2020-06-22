angular.module("reg").controller("LoginCtrl", [
  "$scope",
  "$http",
  "$state",
  "settings",
  "Utils",
  "AuthService",
  function ($scope, $http, $state, settings, Utils, AuthService) {
    // Is registration open?
    var Settings = settings.data;
    $scope.regIsOpen = Utils.isRegOpen(Settings);

    // Start state for login
    $scope.loginState = "login";
    $scope.showLoginButton = true;

    function onSuccess() {
      $state.go("app.dashboard");
    }

    function onError(data) {
      $scope.error = data.message;
    }

    function resetError() {
      $scope.error = null;
    }

    $scope.login = function () {
      resetError();
      AuthService.loginWithPassword($scope.email, $scope.password, onSuccess, onError);
    };

    $scope.register = function () {
      resetError();
      $scope.showLoginButton = false;
      AuthService.register($scope.email, $scope.password, onSuccess, onError);
    };

    $scope.setLoginState = function (state) {
      $scope.loginState = state;
    };

    $scope.sendResetEmail = function () {
      var email = $scope.email;
      AuthService.sendResetEmail(email);
      swal("Don't sweat!", "An email should be sent to you shortly.", "success");
    };
  },
]);