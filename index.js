var app = require('express')();
var express = require('express'); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var past_positions = "";

var max_users = 32; 
var user_array = []; 
for(var i = 0; i < max_users; i++) user_array[i] = "null";

app.use("/", express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	socket.on('my_name_is', function(msg) {

		//Server hello to client
		console.log("hello, " + msg);
		
		//Finding open user number for client 
		var open_user_number = -1; 

		for(var i = 0; i < max_users; i++){
			if(user_array[i] == "null") open_user_number = i; 
		}

		if(open_user_number == -1)console.log("server full");

		io.emit("user_number",msg + ":" + open_user_number);

	});

	socket.on('disconnect', function() {
		console.log("user disconnected");
	});

	socket.on('position', function(msg){
		user_array[msg.split(":")[0]] = msg;
		var positions;  
		for(var i = 0; i < max_users; i++)positions += user_array[i] + ";";

		io.emit('position', positions);
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});