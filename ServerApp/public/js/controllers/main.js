angular.module('WebFeedbackController', [])
	.controller('mainController', function($scope, $http, ProjectService, FeedbackService) {
		$scope.addProjectClick = false, $scope.projectFormError = false, $scope.hideWhole = false;
		$scope.companyID = window.companyID;

		ProjectService.get($scope.companyID).success(function(data) {
				$scope.allProjects = data;
			});

		$scope.addProject = function() {
			$scope.addProjectClick = true, $scope.projectFormError = false;
			$scope.Projects = [];
			$scope.Projects.push({'name': '', 'companyID': ''});
		}
		$scope.idBind = function(id, index) {
			$scope.Projects[index].companyID = id;
		}
		$scope.createProject = function() {
			var project = $scope.Projects[0];
			if(project.name == "") {
				$scope.projectFormError = true;
			} else {
				ProjectService.create(project).success(function(data) {
						$scope.Projects = [];
						$scope.addProjectClick = false;
						$scope.allProjects = data;
					});
			}
		},
		$scope.ViewProject = function(id){
			FeedbackService.get(id).success(function(data) {
				$scope.hideWhole = true;
				$scope.FeedbackData = data;
			});
		}

		$scope.backbutton = function() {
			$scope.hideWhole = false;
		}
	});