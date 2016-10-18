angular.module('config.service', ['app.config'])
	.factory('configService', function(env, config) {
		return {
			getConfigValue: function(name) {
				return config[env][name];
			},
			getEnvConfig: function() {
				return config[env];
			},
		
			getFullServiceUrl: function(uri) {
				if (uri.indexOf('/') != 0) {
					uri = '/' + uri;
				}
				return this.getEnvConfig().apiURL + uri;
			},
		
		};
	});