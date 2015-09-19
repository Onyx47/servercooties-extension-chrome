chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
    chrome.tabs.create( { "url": "https://servercooties.com" } );
  });
});

function updateIcon(data) {
    for(i = 0; i < data.summary.length; ++i) {
        if(data.summary[i].name == "overall") {
            status = data.summary[i].response;
            break;
        }
    };

    chrome.browserAction.setIcon({
        path : {
            '19': 'images/' + status.toLowerCase() + '19.png',
            '38': 'images/' + status.toLowerCase() + '38.png'
        }
    });
}

var socket = io.connect("https://servercooties.com");

socket.on('connected', function(time) {
    var status = null;

    socket.emit('getdata', function (err, data) {
        updateIcon(data);

        socket.on('summary', function (summary) {
            chrome.browserAction.getBadgeText({}, function(result) {
                updateIcon(summary);
            });
        });
    });
});