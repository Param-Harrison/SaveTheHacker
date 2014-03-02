angular.module('WebFeedbackService', [])
	.factory('ProjectService', function($http) {
		return {
			get : function(id) {
				return $http.get('/api/projects/'+ id +'');
			},
			create : function(Data) {
				return $http.post('/api/projects', Data);
			}
		}
	}).factory('FeedbackService', function($http) {
		return {
			get : function(id) {
				return $http.get('/api/feedback/'+ id +'');
			}
		}
	});