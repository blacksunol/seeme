angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    coordinates: function(Coordinates) {
                        return Coordinates.getCoordinates();
                    }
                }
            })
            .when("/new/coordinate", {
                controller: "NewCoordinateController",
                templateUrl: "coordinate-form.html"
            })
            .when("/coordinate/:coordinateId", {
                controller: "EditCoordinateController",
                templateUrl: "coordinate.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Coordinates", function($http) {
        this.getCoordinates = function() {
            return $http.get("/coordinates").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding coordinates.");
                });
        }
        this.createCoordinate = function(coordinate) {
            return $http.post("/coordinates", coordinate).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating coordinate.");
                });
        }
        this.getCoordinate = function(coordinateId) {
            var url = "/coordinates/" + coordinateId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this coordinate.");
                });
        }
        this.editCoordinate = function(coordinate) {
            var url = "/coordinates/" + coordinate._id;
            console.log(coordinate._id);
            return $http.put(url, coordinate).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this coordinate.");
                    console.log(response);
                });
        }
        this.deleteCoordinate = function(coordinateId) {
            var url = "/coordinates/" + coordinateId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this coordinate.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(coordinates, $scope) {
        $scope.coordinates = coordinates.data;
    })
    .controller("NewCoordinateController", function($scope, $location, Coordinates) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveCoordinate = function(coordinate) {
            Coordinates.createCoordinate(coordinate).then(function(doc) {
                var coordinateUrl = "/coordinate/" + doc.data._id;
                $location.path(coordinateUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditCoordinateController", function($scope, $routeParams, Coordinates) {
        Coordinates.getCoordinate($routeParams.coordinateId).then(function(doc) {
            $scope.coordinate = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.coordinateFormUrl = "coordinate-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.coordinateFormUrl = "";
        }

        $scope.saveCoordinate = function(coordinate) {
            Coordinates.editCoordinate(coordinate);
            $scope.editMode = false;
            $scope.coordinateFormUrl = "";
        }

        $scope.deleteCoordinate = function(coordinateId) {
            Coordinates.deleteCoordinate(coordinateId);
        }
    });
