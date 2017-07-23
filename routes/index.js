var request = require('request');
var MICROSOFT_API_KEY = 'YOUR_API_KEY';
exports.zenbot = function(req, res) {
    var buf = new Buffer(req.body.base64, 'base64')
    var options = {
        method: 'POST',
        url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect',
        qs: {
            returnFaceId: 'true',
            returnFaceLandmarks: 'false'
        },
        headers: {
            'ocp-apim-subscription-key': MICROSOFT_API_KEY,
            'content-type': 'application/octet-stream'
        },
        body: buf
    };

    request(options, function(error, response, body) {
        if (error) {
            res.send("-1");
            console.log(error);
        }
        var result = JSON.parse(body);
        var verify = false;
        console.log(result.length + " face(s)")
        if (result.length == 0) { // No Face
            res.send("2");
        }
        else {
            recursiveRequest(result, 0, res);
        }
    });
}

function recursiveRequest(arr, index, res) {
    if (!arr[index]) { //no more faces (all previous faces are not master)
        res.send("0");
        return;
    }
    console.log(arr[index])
    var options = {
        method: 'POST',
        url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/verify',
        headers: {
            'content-type': 'application/json',
            'ocp-apim-subscription-key': MICROSOFT_API_KEY
        },
        body: '{\'faceId\':\'' + arr[index].faceId + '\',\'personGroupId\':\'1\',\'personId\':\'f6a156eb-de26-4ffc-82ba-b74c5364a687\'}'
    };
    request(options, function(error, response, body) {
        console.log(arr[index].faceId, body)
        if (error) {
            res.send("-1");
            console.log(error);
            return;
        }
        var isIdentical = JSON.parse(body).isIdentical
        if (isIdentical) { //master
            res.send("1");
            return;
        }
        else { //guest, verify next face
            recursiveRequest(arr, index + 1, res);
        }
    });
}
