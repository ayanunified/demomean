angular.module('app.config', []).constant('env', 'development')
    .value('config', {

        development: {
            apiURL: 'http://uiplonline.com/tripoasia/master/admin', // Set your base path here
            siteurl: '',
            mobileWeburl: '',
            serverURL: "http://uiplonline.com:4000/", // this is the api base url
            // OauthUrl: 'https://epic-staging.easyparksystem.net/epic-rest/oauth/token',
            // username: 'nevaventures',
            // password: 'm3AeSvqdF9xa',
        }
    });
