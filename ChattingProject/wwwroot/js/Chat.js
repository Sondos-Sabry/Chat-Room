document.addEventListener('DOMContentLoaded', function () {
    var userName = prompt('Please Enter Your Name :)');

    var messageInput = document.getElementById('messageInp');

    var groupNameInput = document.getElementById('groupNameInp');

    var messageToGroupInput = document.getElementById('messageToGroupInp');

    messageInput.focus();

    //build connection 
    var proxyConnection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

    proxyConnection.start().then(function () {
        document.getElementById('sendMessageBtn').addEventListener('click', function (e) {
            e.preventDefault();
            proxyConnection.invoke("Send", userName, messageInput.value);
        });

        document.getElementById('joinGroupBtn').addEventListener('click', function (e) {
            e.preventDefault();
            proxyConnection.invoke("JoinGroup", groupNameInput.value, userName);
        });

        document.getElementById('sendMessageToGroupBtn').addEventListener('click', function (e) {
            e.preventDefault();
            proxyConnection.invoke("SendMessageToGroup", groupNameInput.value, userName, messageToGroupInput.value);
        });

    }).catch(function (error) {
        console.log(error);
    });

    //Receive Message
    proxyConnection.on("ReceiveMessage", function (userName, message) {
        var listElement = document.createElement('li');
        listElement.className = "out"; // Set the class name for the list item

        // Construct the inner HTML string
        listElement.innerHTML = `
        <div class="chat-img">
            <img alt="Avatar" src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg">
        </div>
        <div class="chat-body">
            <div class="chat-message">
                <span> ${message}</span><br>        
            </div>
        </div>`;

        document.getElementById("conversation").appendChild(listElement);
    });

    proxyConnection.on("NewMemberJoin", function (userName, groupName) {
        var listElement = document.createElement('li');
        listElement.className = "out";
        listElement.innerHTML = `
        <div class="chat-img">
            <img alt="Avatar" src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg">
        </div>
        <div class="chat-body">
            <div class="chat-message">
                <span><strong>${userName}</strong> has joined <strong>${groupName}</strong></span>
            </div>
        </div>
    `;
        document.getElementById("groupConversationUL").appendChild(listElement);
    });

    proxyConnection.on("ReceiveMessageFromGroup", function (sender, message) {
        var listElement = document.createElement('li');
        listElement.className = "out";
        listElement.innerHTML = `
        <div class="chat-img">
            <img alt="Avatar" src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg">
        </div>
        <div class="chat-body">
            <div class="chat-message">
                <span><strong>${sender}:</strong> ${message}</span>
            </div>
        </div>
    `;
        document.getElementById("groupConversationUL").appendChild(listElement);
    });



})