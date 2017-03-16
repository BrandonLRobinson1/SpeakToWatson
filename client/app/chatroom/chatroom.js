//$( document ).ready(function() {


var chatroom = angular.module('argue.chatroom', [
  'luegg.directives' // scroll-glue directive: https://github.com/Luegg/angularjs-scroll-glue
  //npm installed module and put as a dependency here.
  //its script tag is in the index.html.
  //for all other dependencies, need to npm install, add here, add in index.html 
]);


var socket = io('/chatroom');
var lobbySocket = io('/lobby');
///////////////////////////////////////////////////////////
// Chatroom Controller
///////////////////////////////////////////////////////////
chatroom.controller('chatroomController', function($scope, $location, $http, Chatroom) {
  Chatroom.validateUser(function(result) {
    
    console.log(result, ' result');

    $scope.myuser = result.data;
  }).then(function() {
    if ($scope.myuser !== '') {

      //ADDED A GRAB CHATROOM FUNCTION IN SERVICES
      // $scope.data = {roomTracker: []};
      // Chatroom.grabChatrooms(function(rooms){
      //   rooms.forEach(function(roomData) {
      //     var room = roomData.room_name;
      //     var roomUsers = 0;
      //     if (roomData.first_user !== null) {
      //       roomUsers++;
      //     }
      //     if (roomData.second_user !== null) {
      //       roomUsers++;
      //     }
      //     $scope.data.roomTracker.push({
      //       room: roomUsers
      //     });
      //   });
      // })
      // .then(function() {
      $scope.roomName = Chatroom.currRoom;

      Chatroom.getOpponentName($scope.myuser, $scope.roomName, function(opponent) {
        // if (!opponent) {
        //   $('.messageList').append($('<li id="chatNotifications">').text('You are the first to enter the arena.'));
        //   $scope.opponent = null;
        // } else {
        //   $('.messageList').append($('<li id="chatNotifications">').text('Your opponent is ' + opponent));
        //   $scope.opponent = opponent;
        // }
      });

      setTimeout(function() {
        Chatroom.getSessionName($scope.roomName, function(session) {
          console.log(session, "SESSION");
          if (!session) {
            $scope.session = null;
            console.log('No session yet.');
          } else {
            $scope.session = session;
            console.log('The session is: ', session);
          }
        });
      }, 1000);











    //   //$(document).ready(function(){
    //   $('.comment').emoticonize({
    //           //delay: 800,
    //     //animate: false
    //     //exclude: 'pre, code, .no-emoticons'
    //   //});
    // })
    //   $('.comment').emoticonize();
    //   console.log(  $('.comment') );









      // Set focus to input text field so user doesn't need to click on it to type
      $('.messageTextBox').focus();

      // Set default oppenent is typing message to not show
      $('.userIsTyping').hide();

      ///////////////////////////////////////////////////////////
      // Socket.io event listeners
      ///////////////////////////////////////////////////////////
      // Remove all listeners on socket
      socket.removeAllListeners();

      // Listen for when opponent enters the room
      socket.on('opponent enter', function(username){
        $('.messageList').append($('<li class="chatNotifications">').text(username + ' has entered the arena.'));
        $scope.opponent = username;
        Chatroom.createSession($scope.roomName, function(session) {
          $scope.session = session;
          console.log('The new session is: ', session);
        });
      });
      socket.on('opponent leave', function(username){
        $('.messageList').append($('<li class="chatNotifications">').text(username + ' has left the arena.'));
        $scope.glued = true; // Scroll the screen if messages overflow
        $scope.opponent = '';
        $scope.session = null;
        console.log('The session is now :', $scope.session);
      });
      // Listens for a new message from the server
      socket.on('posted message', function(msg){

        $('.messageList').append($('<li>').text(msg));
        $scope.glued = true; // Scroll the screen if messages overflow (NOT WORKING!!!)
      });

      // Listens for another user is typing
      socket.on('typing message', function(username, msg) {
        // var opponentTyping = username + ' is typing...'; // Better UI
        var opponentTyping = username + ': ' + msg; // SHOWS FULL CAPACITY OF WEB SOCKETS!!!
        var element = '<div class="userIsTyping chatNotifications">' + opponentTyping + '</div>';
        if (msg !== '') {
          $('.userIsTyping').replaceWith(element);
          $('.userIsTyping').show();
        }
        if (msg === '') {
          $('.userIsTyping').hide();
        }

        // setTimeout(function() {
        //   $('.userIsTyping').hide();
        // }, 3000);
      });
      ///////////////////////////////////////////////////////////
      $scope.enterRoom = function() {
        socket.emit('enter', $scope.myuser, $scope.roomName);
      };
      $scope.enterRoom();

      $scope.leaveRoom = function() {
        // Update db for user leaving chatroom
        Chatroom.leaveChatroom(function() { lobbySocket.emit('user leaves room');});
        Chatroom.endSession($scope.roomName);

        socket.emit('leave', $scope.myuser, $scope.roomName);
        $location.path('/token');
      };

//**********
      var roomname = $scope.roomName;
      var context = {};
      $scope.postMessage = function() {
        // Emit a socket event to send the message with the username and text
        var concatMessage = $scope.myuser + ': ' + $scope.userMessage;
        socket.emit('chat message', $scope.myuser, $scope.userMessage, $scope.roomName); // This is a socket, not post request
        socket.emit('typing', $scope.myuser, $scope.userMessage, $scope.roomName);

        // Post requst to server to write to messages table ***************************************************************
        Chatroom.postMessage($scope.userMessage, $scope.myuser, $scope.opponent, $scope.roomName, $scope.session);

        // Clear message text box
        $('.messageList').append($('<li>').text(concatMessage).attr("class", "user"));
        $('.messageTextBox').val('');

        $scope.glued = true; // Scroll the screen if messages overflow
        
        console.log(  $scope.myuser, $scope.userMessage, $scope.roomName, "Watson" )
        return $http({
          method: 'POST',
          url: '/watson',
          data: JSON.stringify({
            text: $scope.userMessage,
            user: $scope.myuser,
            chatRoom: $scope.roomName,
            context: context,
            opponent: "Watson"
           })
          }).then( ( response )=> {
           // console.log('expect this to be watson response: ',response.data.output.text[0])
          //cconsole.log(response , ' to equal response');
            
            context = response.data.context;
          
          Chatroom.postMessage(response.data.output.text.join(''), "Watson", $scope.myuser, $scope.roomName, $scope.session);


          var concatMessage = "Watson : " + "Watson message";
          $('.messageList').append($('<li>').text( "Watson : " + response.data.output.text.join('') ).attr("class", "watson") );

        } );

        $scope.userMessage = '';
      };
//****


      let backGround = [
      // {
      //   image: "https://content.nike.com/content/dam/one-nike/en_us/season-2014-fl/Shop/Running/nike-running-mens-gearup-p3-fst-1600x937.jpg.transform/full-screen/nike-running-mens-gearup-p3-fst-1600x937.jpg"
      // },
      // {
      //   image: "http://pnge.org/wp-content/uploads/2016/11/1480488435_281_background-image.jpg"
      // },
      {
        image: "http://pnge.org/wp-content/uploads/2016/11/1480488438_654_background-image.jpg"
      },
      {
        image: "http://pnge.org/wp-content/uploads/2016/11/1480488440_18_background-image.jpg"
      }
      // ,
      // {
      //   image: "http://pnge.org/wp-content/uploads/2016/11/1480488435_281_background-image.jpg"
      // }
      ];

      // backGround[randomIndex].image

      let random = function() {
        randomIndex = Math.floor((Math.random() * backGround.length - 1) + 1);
        return randomIndex;
      }

      $scope.changeBackGround1 = function() {
        $('body').css("background-image", `url(${backGround[random()].image})`);
      };


      $scope.showTyping = function() {
        socket.emit('typing', $scope.myuser, $scope.userMessage, $scope.roomName);
      };

      // })
    } else {
      $location.path('/login');
    }
  });

});

//});