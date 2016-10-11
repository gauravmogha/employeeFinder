define(["application"], function(app) {
    //return angular.module('popoverDirective', [])
    app.register.directive("tooltip", [
        function() {
            return {
                restrict:  'A',
                scope: {
                    tooltipData: "="
                },
                transclude: true,
                templateUrl: "components/office-layout/templates/tooltip.tmpl.html",
                link: function(scope, element, attrs) {
                    element.on("click", ".cricle", function(event) {
                        var _posLeft, _posTop,
                        tableIndex = parseInt(this.dataset.row, 10);
                        empIndex = parseInt(this.dataset.employeeRow, 10);

                        scope.jsonData = scope.tooltipData[tableIndex].employees[empIndex];

                        scope.tooltipVisible = scope.jsonData.eId ? true : false;

                        _posLeft = $(this).offset().left + 50;
                        _posTop = $(this).offset().top - 20;

                        _elmHeight = $(this).height();
                        angular.element('.tooltip-wrapper').css({
                            "left": _posLeft,
                            "top": _posTop,
                            "display": 'block'
                        });
                        // reload the digest cycle to set left or top position              
                        scope.$evalAsync();
                        event.stopImmediatePropagation();
                    });                   
                }
            };

        }
    ]);
});