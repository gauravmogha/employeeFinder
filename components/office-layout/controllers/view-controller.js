'use strict';
define(['application'], function(app) {
    app.register.controller('viewController', ["$rootScope", "$scope", "ajaxService", "$timeout",
        function($rootScope, $scope, ajaxService, $timeout) {
            var selectedFilter = {},
                aEmployee = [], 
                oResponse;

            $scope.searchedEmp = [];
            $scope.openFilterPanel = false;

            // Search Employee, when user click on Search button after typing in Search Type
            $scope.searchEmployee = function(event, sEmployee){
                if((event.keyCode === 13 || event ==='search') && sEmployee){
                    $scope.searchedEmp = [];
                    aEmployee.forEach(function(item, index){
                        if(item.eName.toLowerCase() === sEmployee.toLowerCase()){
                            $scope.searchedEmp.push(item.eId);
                            $timeout(function() {
                                angular.element('.searched-emp').trigger('click');
                            }, 100);
                        }
                    });
                }
            }

            // Remove Duplicates from an array, array can be of number/object
            var removeDuplicates = function(arr, isObjectArray, objectDistinctVal){
                var oItems = {}, aRemoveDups = [], key;
                arr.forEach(function(item, index){
                    if(!isObjectArray){
                        oItems[item] = !oItems.hasOwnProperty(item) ? 1 : oItems[item] + 1;
                    }else{
                        oItems[item[objectDistinctVal]] = item;
                    }
                });

                for(key in oItems){
                    if(!isObjectArray){
                        aRemoveDups.push(key);
                    }else{
                        aRemoveDups.push(angular.copy(oItems[key]));
                    } 
                }  
                return aRemoveDups;
            };

            // Uncheck checkbox when user click on uncheck Team/Job Title Category
            var removeCheckedItem = function(arr, value){
                arr.forEach(function(item, index){
                    if(item.check){
                        item.check = false;
                        $scope.selectedFilters(false, item[value]);
                    }
                });
            };

            // Filters Employees when user select category filters of Team/Job Title
            $scope.selectedFilters = function(isChecked, value){
                var filteredEmp = [];
                selectedFilter[value] = isChecked ? 1 : 0;
                aEmployee.forEach(function(item, index){
                    if(selectedFilter[item.eTeam] ||  selectedFilter[item.eDes]){
                        filteredEmp.push(item.eId);
                    }
                });
                $scope.searchedEmp = filteredEmp;

            };

            // To find distinct value of Job Title and Team, then add in filter panel
            var createFilterData = function(oResponse){
                var aJobTitle = [],
                aTeam = [];

                oResponse.forEach(function(table ,index){

                    table.employees.forEach(function(employee, empIndex){
                        employee.eTeam ? aTeam.push(angular.copy({'team': employee.eTeam})): "";
                        employee.eDes ? aJobTitle.push(angular.copy({'desc': employee.eDes})): "";
                        employee.eId ? aEmployee.push(angular.copy(employee)): "";
                    });
                });

                $scope.filters = {};
                $scope.filters.team = removeDuplicates(aTeam, true, 'team');
                $scope.filters.jobTitle = removeDuplicates(aJobTitle, true, 'desc');

                $scope.$watch('filters.teamFilter', function(newVal){
                    if(!newVal){
                        removeCheckedItem($scope.filters.team, 'team');
                    }
                });

                $scope.$watch('filters.descFilter', function(newVal){
                    if(!newVal){
                        removeCheckedItem($scope.filters.jobTitle, 'desc');
                    }
                });
            };

            
            // Catch a event, when Drag ends and update the text below the table
            var unbindDragEnd = $rootScope.$on('dragEnd', function(event, data){
                $scope.dragEnd = true;
                $scope.tableX = parseInt(data.dest.dataset.row, 10) + 1;
                $scope.tableY = parseInt(data.source.dataset.row, 10) + 1;
                $scope.employeeShifted = oResponse[$scope.tableX-1].employees[parseInt(data.source.dataset.employeeRow, 10)].eName;                
            });

            // Remove selected user when Drag starts
            var removeSelectedClass = $rootScope.$on('dragStart', function(){
                $scope.searchedEmp = [];
                $scope.filters.teamFilter = false;
                $scope.filters.descFilter = false;
               
            });

            // Send ajax request on page load and fetch user related data
            var init = (function(){
                 ajaxService.get({
                    url: "data/employee.json"
                }).then(function(response) {
                    oResponse = response.data;
                    $scope.vc.tables = oResponse;
                    createFilterData(oResponse);
                });
            })();
        }
    ])
});