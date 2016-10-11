define(["application"], function(app) {
    app.register.directive("dragDrop", ["$rootScope", 
        function($rootScope) {
            return {
                restrict:   'A',
                link: function(scope, element, attrs) {

                    // Prototype to check whether class exists
                    Element.prototype.hasClassName = function(name) {
                      return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
                    };

                    // Prototype to add new class
                    Element.prototype.addClassName = function(name) {
                      if (!this.hasClassName(name)) {
                        this.className = this.className ? [this.className, name].join(' ') : name;
                      }
                    };

                    // Prototype to remove class
                    Element.prototype.removeClassName = function(name) {
                      if (this.hasClassName(name)) {
                        var c = this.className;
                        this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
                      }
                    };

                    // drag end event
                    var _dragEnd = function(e) {
                        this.style.opacity = '1';
                        this.removeClassName("moving");
                        this.removeClassName("over");
                    };


                    // drag enter event
                    var _dragEnter = function(e){
                        this.addClassName("over");  
                    };

                    // drag leave event
                    var _dragLeave = function(e){
                        this.removeClassName("over");
                    };

                    // Drag Start event
                    var _dragStart = function(e) {
                        angular.element('.cricle').removeClass('searched-emp');
                        $rootScope.$emit('dragStart');
                        _sourceElm = null;
                        angular.element('.tooltip-wrapper, .filter-panel-wrapper').css({
                            "display": 'none'
                        });
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('employeeRow', this.dataset.employeeRow);
                        e.dataTransfer.setData('table', this.dataset.row);
                        e.dataTransfer.setData('empId', angular.element(this).scope().emp.eId);
                        this.addClassName('moving');
                        _sourceElm = this;
                        this.style.opacity = '0.5';
                    };

                    // Drag over event
                    var _dragOver = function(e, data) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Allows us to drop.
                        }
                        e.dataTransfer.dropEffect = 'move';

                        return false;
                    };

                    // Drop event
                    var _drop = function(e) {
                        var oDrag = {};
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }

                        if (_sourceElm != this) {
                            _sourceElm.dataset.row = angular.copy(this.dataset.row);
                            _sourceElm.dataset.employeeRow = angular.copy(this.dataset.employeeRow);
                            angular.element(_sourceElm).scope().emp.eId = angular.copy(angular.element(this).scope().emp.eId);

                            this.dataset.row = angular.copy(e.dataTransfer.getData('table'));
                            this.dataset.employeeRow = angular.copy(e.dataTransfer.getData('employeeRow'));
                            angular.element(this).scope().emp.eId = angular.copy(e.dataTransfer.getData('empId'));
                        }
                        this.removeClassName("over");
                        scope.$evalAsync();
                        oDrag = {
                            "source": _sourceElm,
                            "dest": this
                        };

                        $rootScope.$emit("dragEnd", oDrag);
                        return false;
                    };

                    // Attach dragNdrop events
                    element[0].setAttribute("draggable", true);
                    element[0].addEventListener('dragstart', _dragStart, false);
                    element[0].addEventListener('dragenter', _dragEnter, false);
                    element[0].addEventListener('dragover', _dragOver, false);
                    element[0].addEventListener('dragleave', _dragLeave, false);
                    element[0].addEventListener('drop', _drop, false);
                    element[0].addEventListener('dragend', _dragEnd, false);

                }
            };

        }
    ]);
});