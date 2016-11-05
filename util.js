const authPath = require('./config/auth0');
const request = require('request');

const getUserAccessKeys = function(userId) { 
    let oAuthUrl = `https://${authPath.AUTH0_DOMAIN}/oauth/token`;

    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            url: oAuthUrl,
            headers: { 'content-type': 'application/json' },
            body: `{
                "client_id":"${authPath.AUTH0_CLIENT_ID}",
                "client_secret":"${authPath.AUTH0_CLIENT_SECRET}",
                "audience":"https://${authPath.AUTH0_DOMAIN}/api/v2/",
                "grant_type":"client_credentials"
            }` 
        },(error,response,body) => {
            if(error) {
                console.log("oAuth error", error);
                reject(error);
            }
            let accessToken = JSON.parse(body).access_token;

            request({
                method: 'GET',
                url:`https://${authPath.AUTH0_DOMAIN}/api/v2/users/${userId}`,
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }, (err, response) => {
                if(err){
                    console.log("error", err);
                    reject(err);
                } 
                let fbAccessKey = JSON.parse(response.body).identities[0].access_token;
                console.log("==== facebook acess key ==>", fbAccessKey);
                resolve(JSON.parse(response.body).identities);
            });
        });
    });	
};

const getFaceBookPosts = function(fbAccessKey) {

    request({
        method: 'GET',
        url: 'https://graph.facebook.com/v2.8/me/posts?access_token=' + fbAccessKey,
    }, (err,response,body) => {
        if(err){
            console.log("fb error", err);
        }
        console.log("posts from facebook api ====>", body);
    }); 
} 



module.exports = {
    getUserAccessKeys: getUserAccessKeys,
    getFaceBookPosts: getFaceBookPosts
};