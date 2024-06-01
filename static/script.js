function init(){
    var socket = io('http://127.0.0.1:65432');

    socket.on('connect', function() {
        // document.getElementById('cardDetected').innerHTML = "Connected"
        // alert('Connected to server');
        socket.emit('join', {room: 'room1'});  // Join the specific room
    });

    socket.on('card_detected', function(data) {
        // alert('Card detected with UID: ' + data.uid);
        // document.getElementById('cardDetected').innerHTML = cards[data.uid]
        // console.log(data.uid)
        setContent(data.uid)
    });
    
    socket.on('card_removed', function() {
        // alert('Card removed');
        // document.getElementById('cardDetected').innerHTML = "Card Removed"
        
    });

    socket.on('disconnect', function() {
        // alert('Disconnected from server');
    });
}

function showSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.width = "300px";
}

function hideSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.width = "0px";
}

function setContent(UUID){
    document.getElementById('sidebar').innerHTML = contents[UUID]['sidebar'];
    document.getElementById('content').innerHTML = contents[UUID]['content'];
    showSidebar();
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