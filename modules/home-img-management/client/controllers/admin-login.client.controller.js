angular.module('home')
    .controller('AdminLoginController', function ($scope, $state, $http) {
        $scope.admin = {};
        $scope.errorMessage = "";

        $scope.login = function () {
            if (!$scope.admin.password) {
                $scope.errorMessage = "Please enter a password!";
                return;
            }

            var data = { password: $scope.admin.password };

            console.log("🔹 Sending login request with password:", data.password); // ✅ Debug log

            $http.post('/api/admin-login', data).then(
                function (response) {
                    localStorage.setItem('isAdmin', 'true'); 
                    $state.go('data-management'); 
                },
                function (error) {
                    $scope.errorMessage = "Incorrect password. Try again!";
                    
                }
            );
        };
    });
