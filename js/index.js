var board_colour = "green";
var tablet_colour = ["red", "blue", "green", "purple", "orange"];

//"https://shashi-79.github.io/snake-ladder_game";


var places = new Array(100);
var tablet_pos;
var tablet_el;
var total_player;
var player_dice_;
var tablet_image="00";
var tablet_image_arr;
var board_ba_im;

var s_run= new Audio("https://shashi-79.github.io/snake-ladder_game/sound/run.mp3");
var s_back= new Audio("https://shashi-79.github.io/snake-ladder_game/sound/back.mp3");
s_back.loop=true;
var s_win= new Audio("https://shashi-79.github.io/snake-ladder_game/sound/win.mp3");
var s_snake= new Audio("https://shashi-79.github.io/snake-ladder_game/sound/snake.mp3");
var s_ladder= new Audio("https://shashi-79.github.io/snake-ladder_game/sound/ladder.mp3");
var board_no_=2;


function manage_size() {
  // body...
  var w=window.innerWidth;
  var h=window.innerHeight;
  if((w&&h)>0){
    if (w>h) {
      w=h;
      document.getElementById("players_dice").style.setProperty('top','8px');
      document.getElementById("players_dice").style.setProperty('left',h+15+'px');
    }else{
      h=w;
      document.getElementById("players_dice").style.setProperty('top',h+15+'px');
      document.getElementById("players_dice").style.setProperty('left','10px');
    }

  document.getElementById("board").style.height=h+"px";
  document.getElementById("board").style.width=w+"px";
  }
  
}




var s_l = new Array();
var sn_la;

Jsontablet();

async function Jsons_l(i) {
  await fetch("https://shashi-79.github.io/snake-ladder_game/board/"+i+"/s_l.json").then(function(response) {
    response.text().then(function(text) {
      s_l[i] = JSON.parse(text);
    });
  });
}

async function Jsontablet() {
  // body...
  await fetch("https://shashi-79.github.io/snake-ladder_game/image/svg_tablet.json").then(function(response) {

    response.text().then(function(text) {
      tablet_image_arr = JSON.parse(text);
    });
  });

}

function pageload() {

manage_size();
window.addEventListener("resize",manage_size);
Jsontablet().then(function(){
  
  for (var i = 0; i < tablet_image_arr.length; i++) {
    var tablet_preview = document.createElement("DIV");
    tablet_preview.className="svg";
    tablet_preview.innerHTML = tablet_image_arr[i];
    document.getElementById("tablet_ui").appendChild(tablet_preview);
    tablet_preview.addEventListener("click", function() {
      tablet_image = this.innerHTML;
    });
  }
});
  //
  for (var i = 0; i < board_no_; i++) {
    Jsons_l(i);
    var board_preview = new Image();
    board_preview.src = 'https://shashi-79.github.io/snake-ladder_game/board/'+i+'/board.jpg';
    board_preview.style.height = window.screen.width/2+"px";
    board_preview.style.width = window.screen.width/2+"px";
    board_preview.value = i;
    board_preview.addEventListener("click", function() {
      document.getElementById("board").style.backgroundImage = 'url('+this.src+')';
      board_ba_im=true;
      sn_la = s_l[this.value];
    });
    document.getElementById("board_ui").append(board_preview);
  }
}

function start() {
  // start with all setup
  total_player = document.getElementById("players").value;
  if (total_player > 0 && total_player < 10&& tablet_image!="00"  &&board_ba_im) {
    board_ba_im=false;
    player_dice_ = new Array(total_player);
    tablet_pos = new Array(total_player);
    tablet_el = new Array(total_player);
    document.getElementById("start").style.visibility = "hidden";
    setup();
    s_back.play();
  }
}

function restart() {
  //start game with last setup
  board_ba_im=true;
  document.getElementById("board").innerHTML = "";
  start();
  document.getElementById("restart").style.visibility = "hidden";
}

function startre() {
  //start setup at start
  document.getElementById("restart").style.visibility = "hidden";
  document.getElementById("start").style.visibility = "visible";
  document.getElementById("board").innerHTML = "";
  document.getElementById("board").style.backgroundImage = "";
}

function setup() {
  // create and set all place  into element
  for (var i = 0; i < 100; i++) {
    places[i] = document.createElement("DIV");
    document.getElementById("board").append(places[i]);
  //  places[i].innerHTML = coordinate_value(i);
  }


  //for each player create and set tablet and their dice
  for (var i = 0; i < total_player; i++) {
    //at start tablet position at be1
    tablet_pos[i] = 1;
    //create and set the ui of  dice for each player
    player_dice_[i] = document.createElement("BUTTON");
    document.getElementById("players_dice").append(player_dice_[i]);
    player_dice_[i].className = "dice";
    player_dice_[i].innerHTML="0";
    //addEventListener in dices of each player
    player_dice_[i].addEventListener("click", function() {
      //after touch the dice check player Number to play
      for (var j = 0; j < player_dice_.length; j++) {
        if (this == player_dice_[j]) {
          play(j);
          break;
        }
      }
    });

    //create and set the tablet for each player in board of snake ladder
    tablet_el[i] = document.createElement("DIV");
    document.getElementById("board").append(tablet_el[i]);
    //set svg image in innerHTML of tablet_el
    tablet_el[i].innerHTML = tablet_image;
    //set height width and position nature in css
    tablet_el[i].style.setProperty('position','absolute');
    tablet_el[i].style.setProperty('opacity','0.85');
    tablet_el[i].style.setProperty('height',
      places[i].getBoundingClientRect().height+"px");
    tablet_el[i].style.setProperty('width',
      places[i].getBoundingClientRect().width+"px");
  }

//udate tablet at start game
  update_tablet_pos();
}

var chance = 0;

function play(player) {
  if (player == chance) {
    chance = (chance+1)%total_player;

    var dice_no = parseInt((Math.random(1)*100%6)+1);

    player_dice_[player].innerHTML = dice_no;

    if (tablet_pos[player]+dice_no < 101) {
      run(player, dice_no);
    }

  }

}

function run(player, run_) {
  //run(forward) the tablet of given player
  for (i = 1; i <= run_; i++) {
    //after 100 millisec tablet forward one
    setTimeout(function(player) {

      //forwarding the tablet of player
      tablet_pos[player] += 1;

      update_tablet_pos();
      s_run.play();
      //check given player os winner
      if (tablet_pos[player] == 100) {
        //after win
        document.getElementById("restart").style.visibility = "visible";
        chance=0;
        document.getElementById("players_dice").innerHTML="";
      
        s_win.play()
        s_back.loop=false;
        alert("Win"+player+"player \n restart");
      }
    },
      100*i,
      player);
  }
  //after tablet runs check snake eat Or ladder climb
  setTimeout(snake_ladder,
    150*run_,
    player);

}

function snake_ladder(player) {
  // snake eat the tablet of player
  for (var i = 0; i < sn_la.snake.length; i++) {

    //check current coordinate is equal to snake mouth coordinate
    if (sn_la.snake[i][0] == tablet_pos[player]) {
      //eats by snake
      s_snake.play();
      for (var j = 1; j < sn_la.snake[i].length; j++) {

        tablet_pos[player] = sn_la.snake[i][j];
        update_tablet_pos();
      }
    }
  }


  // player's tablet ride up by ladder
  for (var i = 0; i < sn_la.ladder.length; i++) {
    //check current coordinate is equal to ladder foot coordinate
    if (sn_la.ladder[i][0] == tablet_pos[player]) {
      //climb on ladder
      s_ladder.play();
      for (var j = 1; j < sn_la.ladder[i].length; j++) {

        tablet_pos[player] = sn_la.ladder[i][j];
        update_tablet_pos();
      }
    }
  }

}

function update_tablet_pos() {
  // update/refresh all tablet of player

  for (var j = 0; j < tablet_pos.length; j++) {

    tablet_el[j].style.top = (((document.getElementById("board").getBoundingClientRect().height/10)*(parseInt(value_coordinate(tablet_pos[j])/10))-2)+"px");
    tablet_el[j].style.left = ((document.getElementById("board").getBoundingClientRect().width/10)*(parseInt(value_coordinate(tablet_pos[j])%10))+j*2+"px");
  }
}

var coordinate_value = function(i) {
  // change entered coordinate into value of series according to snake board
  if (parseInt((i/10)%2)) {
    i = (100-((10*parseInt(i/10))+(9 - parseInt(i%10))));
  } else {
    i = 100-i;
  }
  return i;
}

var value_coordinate = function(m) {
  // snake board no. series changed into coordinate system
  m = 100-m;
  if ((parseInt(m/10)%2)) {
    m = (parseInt(m/10)*10)+(10-parseInt(m%10))-1;
  }
  return m;
}
