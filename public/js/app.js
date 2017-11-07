angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    songs: function(Songs) {
                        return Songs.getSongs();
                    }
                }
            })
            .when("/new/song", {
                controller: "NewSongController",
                templateUrl: "song-form.html"
            })
            .when("/song/:songId", {
                controller: "EditSongController",
                templateUrl: "song.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Songs", function($http) {
        this.getSongs = function() {
            return $http.get("/songs").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding songs.");
                });
        }
        this.createSong = function(song) {
            return $http.post("/songs", song).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating song.");
                });
        }
        this.getSong = function(songId) {
            var url = "/songs/" + songId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this song.");
                });
        }
        this.editSong = function(song) {
            var url = "/songs/" + song._id;
            console.log(song._id);
            return $http.put(url, song).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this song.");
                    console.log(response);
                });
        }
        this.deleteSong = function(songId) {
            var url = "/songs/" + songId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this song.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(songs, $scope) {
        $scope.songs = songs.data;
    })
    .controller("NewSongController", function($scope, $location, Songs) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveSong = function(song) {
            Songs.createSong(song).then(function(doc) {
                var songUrl = "/song/" + doc.data._id;
                $location.path(songUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditSongController", function($scope, $routeParams, Songs) {
        Songs.getSong($routeParams.songId).then(function(doc) {
            $scope.song = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.songFormUrl = "song-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.songFormUrl = "";
        }

        $scope.saveSong = function(song) {
            Songs.editSong(song);
            $scope.editMode = false;
            $scope.songFormUrl = "";
        }

        $scope.deleteSong = function(songId) {
            Songs.deleteSong(songId);
        }
    });
