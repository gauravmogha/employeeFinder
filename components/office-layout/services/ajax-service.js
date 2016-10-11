define([], function () {
    return angular.module('ajaxService', []).service("ajaxService", ["$http",
        function ($http) {

            this.get = function (obj) {
                return $http({
                    method: "get",
                    url: obj.url + "?r="+Math.random(),
                    params: obj.data
                });
            }
        }

    ]);
});