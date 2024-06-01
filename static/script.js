function init(){
    var cards = {
        "D307451C":"White Card",
        "D34FE60C":"Blue Card",
    }
    var socket = io('http://127.0.0.1:65432');

    socket.on('connect', function() {
        document.getElementById('cardDetected').innerHTML = "Connected"
        // alert('Connected to server');
        socket.emit('join', {room: 'room1'});  // Join the specific room
    });

    socket.on('card_detected', function(data) {
        // alert('Card detected with UID: ' + data.uid);
        // document.getElementById('cardDetected').innerHTML = cards[data.uid]
        setContent(data.uid)
    });
    
    socket.on('card_removed', function() {
        // alert('Card removed');
        document.getElementById('cardDetected').innerHTML = "Card Removed"
        
    });

    socket.on('disconnect', function() {
        // alert('Disconnected from server');
    });
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "250px";
    } else {
        sidebar.style.width = "0px";
    }
}

function setContent(UUID){
    document.getElementById('sidebar').innerHTML = contents[UUID]['sidebar']
    document.getElementById('content').innerHTML = contents[UUID]['content']
}

let contents = {
    "D307451C":{
        "sidebar":`
        <div class="sidebar-content">
            <img src="/static/image.jpeg" alt="Image 1">
            <p>WHITE CARD</p>
        </div>
        `,
        "content":`
            <div class="content">
            <h1>Main Content</h1>
            <div class="image-grid">
            <img src="/static/image.jpeg" alt="Image 1">
            <img src="/static/image.jpeg" alt="Image 1">
            </div>
            <p>Some additional text goes here. This can be a description or any other content you want to display.</p>
        </div>
        `
    },
    "D34FE60C":{
        "sidebar":`
        <div class="sidebar-content">
            <img src="/static/image.jpeg" alt="Image 1">
            <p>BLUE CARD</p>
        </div>
        `,
        "content":`
            <div class="content">
            <h1>Main Content</h1>
            <div class="image-grid">
            <img src="/static/image.jpeg" alt="Image 1">
            <img src="/static/image.jpeg" alt="Image 1">
            </div>
            <p>Some additional text goes here. This can be a description or any other content you want to display.</p>
        </div>
        `
    },
}

init()