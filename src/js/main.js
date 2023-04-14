// declaring bool variables
let channel_busy = false;
let cleartosend = true;
let allowed = true;
let ctschecked = false;
let noderts = false;
let userrts = false;
let collisionoccurred=false;

// declaring the time interval variables
let interframespace = 5000;
let tempinterframespace = 5000;
let shortinterframespace = 4000;
let tempshortinterframespace = 4000;
let traveltime = 6000;
let temptraveltime = 6000;
let backofftime = 6;
let tempbackofftime = 6000;


// this string variable stores the history log
let text="";

let k = 0;
let rand=0

// storing the elements (accessing by their id)
const out1 = document.getElementById("channel1");
const out2 = document.getElementById("ifstime");
const out3 = document.getElementById("histo");
const out4 = document.getElementById("status");


// clock
// --------------------------------------------------------------------------------------------
function refreshTime() {
  const timeDisplay = document.getElementById("time");
  const dateString = new Date().toLocaleTimeString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;

  // denoting the channel status in real time
  if (channel_busy)
  {
    out1.style.backgroundColor="red";
  }
  else
  {
    out1.style.backgroundColor="rgb(37, 181, 37)"; 
  }
}
setInterval(refreshTime, 1000);
// --------------------------------------------------------------------------------------------

// displaying the current action in the status box and adding it into the log 
function display(obj1, msg) {


  if (msg != "" && msg!="5" && msg!="4"  && msg!="3"  && msg!="2"  && msg!="1" && msg!="6") {
    
    const dateString = new Date().toLocaleTimeString();
    const formattedString = dateString.replace(", ", " - ");
    
    
    text+=(formattedString+" "+msg+"<br>");
  }
  out3.innerHTML = text;
  obj1.innerHTML = msg;
}


// bot code 
// ============================================================================
function clear() {
  channel_busy = false;
  cleartosend = true;
  allowed = true;
  k = 0;

  setTimeout(function () {
    channelcheck();
  }, (Math.random() * 10000));
}

function sendFrame() {
  channel_busy = true;
  setTimeout(function () {
    clear();
  }, 2 * traveltime);
}

function rtsbot() {
  if (userrts) {
    // collision
    userrts = false;
    k += 1;
    setTimeout(function () {
      botsend();
    }, rand * traveltime);
  } else if (cleartosend) {
    noderts = false;
    allowed = false;
    cleartosend = false;
    setTimeout(function () {
      sendFrame();
    }, 1000);
  }
}

var message = document.getElementById("message");
document.getElementById("myButton").addEventListener("click", function() {
  if (k==message.value)
  {
    alert("Correct !")
  }
  else
  {
    alert("Wrong !");
  }

});

function rtswait() {
  noderts=true;
  rand = Math.random * 2 ** k;
  setTimeout(function () {
    rtsbot();
  }, shortinterframespace);
}

function botsend() {
  setTimeout(function () {
    rtswait();
  }, interframespace);
}
function channelcheck() {
  k = 0;
  if (!channel_busy && allowed) {
    botsend();
  } else {
    setTimeout(function () {
      channelcheck();
    }, 2 * traveltime);
  }
}
channelcheck();

// ===================================================================

// user
// ======================================================================

let backoffrand;

let channelstatuschecked=false;
let ifswaitchecked=false;

function normalcolor()
{
  out1.style.backgroundColor="yellow"

}

function channelstatus() {
  channelstatuschecked=true;
  if (channel_busy) {

    out1.style.backgroundColor="red";

    display(out1,"Channel Busy");
    setTimeout(function () {
      display(out1, "");
    }, 2000);

    setTimeout(function () {
      normalcolor();
    }, 2000);


  } else {

    out1.style.backgroundColor="rgb(37, 181, 37)";

    display(out1, "Channel Free");
    setTimeout(function () {
      display(out1, "");
    }, 2000);

    setTimeout(function () {
      normalcolor();
    }, 2000);


  }
}

function collisioncolornormal()
{
  out4.style.backgroundColor="yellow"
}



function iscts() {
  display(out2, "");
  if (noderts) {
    noderts = false;
    // alert("Collision");
    collisionoccurred=true;
    out4.style.backgroundColor="red"
    display(out4, " Collision Occurred!");
    setTimeout(function () {
      display(out4, "");
    }, 2000);
    setTimeout(function () {
      collisioncolornormal();
    }, 2000);
    return;
  }
  if (cleartosend) {
    ctschecked = true;
    allowed = false;
    cleartosend = false;
    display(out2, "Clear To Send");
    setTimeout(function () {
      display(out2, "");
    }, 2000);
  } else {
    display(out2, "Not Clear To Send");
    setTimeout(function () {
      display(out2, "");
    }, 2000);
  }
}

function sendrts() {

  if (!ifswaitchecked)
  {
    alert("First Wait for IFS( inter frame space time)");
  }
  else
  {
  userrts = true;
  backoffrand=Math.random * 2 ** k
  waitsifs();
  setTimeout(function () {
    iscts();
  }, shortinterframespace + 500);
  }
}

function startbackoff()
{
  if (!collisionoccurred)
  {
    alert('Collision has not happened yet');
  }
  else
  {
  collisionoccurred=false;
  tempbackofftime=backofftime*(2**k)
  tempbackofftime=((Math.random() * tempbackofftime));
  tempbackofftime=Math.round(tempbackofftime)
  backoff()
  }
}

function backoff() {
  display(out2, tempbackofftime);
  tempbackofftime=tempbackofftime-1;
  if (tempbackofftime >= 0) {
    setTimeout(function () {
      backoff();
    }, 1000);
  } else {
    display(out2, "Back off over");
    tempbackofftime = backofftime;
    setTimeout(function () {
      display(out2, "");
    }, 1000);
  }
}


function waitifs() {
  if (!channelstatuschecked)
  {
    alert("Channel Status not checked !");
  }
  else
  {

  ifswaitchecked=true;
  display(out2, tempinterframespace / 1000);
  tempinterframespace = tempinterframespace - 1000;
  if (tempinterframespace >= 0) {
    setTimeout(function () {
      waitifs();
    }, 1000);
  } else {
    display(out2, "IFS over");
    tempinterframespace = interframespace;
    setTimeout(function () {
      display(out2, "");
    }, 1000);
  }
  }
}

function waitsifs() {
  display(out2, tempshortinterframespace / 1000);
  tempshortinterframespace = tempshortinterframespace - 1000;
  if (tempshortinterframespace >= 0) {
    setTimeout(function () {
      waitsifs();
    }, 1000);
  } else {
    display(out2, "SIFS over");
    tempshortinterframespace = shortinterframespace;
    setTimeout(function () {
      display(out2, "");
    }, 1500);
  }
}

function sendframe() {
  
  if (!ctschecked && temptraveltime == traveltime) {
    alert("First get Clear to Send from node");
    return;
  }
  // if (channel_busy) {
  //   alert("Collision");
  //   channel_busy = false;
  //   cleartosend = true;
  //   allowed = true;
  // }
  ctschecked = false;
  channel_busy = true;

  // display(out12,"");

  temptraveltime = temptraveltime - 1000;
  if (temptraveltime >= 0) {
    display(out2, "Sending Frame");

    setTimeout(function () {
      sendframe();
    }, 1000);
  } else {
    display(out2, "");

    temptraveltime = traveltime;
    display(out2, "Waiting for acknowledgement");
    setTimeout(function () {
      sendackno();
    }, traveltime);
  }
}

function sendackno() {

  channelstatuschecked=false;
  ifswaitchecked=false;

  channel_busy = false;
  allowed = true;
  cleartosend = true;
  
  display(out2, "Acknowledgement Recieved !");
  setTimeout(function () {
    clear();
  },1000);
  setTimeout(function () {
    display(out2, "");
  }, 1500);
}
