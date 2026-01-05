let time=0, timer, lastSecondPlayed=null, timePerQuestion=15;

const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
let audioUnlocked=false;

function unlockAudio(){ if(!audioUnlocked) audioCtx.resume().then(()=>{audioUnlocked=true}); }

function playTick(frequency=1000,duration=0.3,volume=0.3){
  unlockAudio();
  const oscillator=audioCtx.createOscillator();
  const gainNode=audioCtx.createGain();
  oscillator.type="sine"; oscillator.frequency.value=frequency; gainNode.gain.value=volume;
  oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
  oscillator.start(); oscillator.stop(audioCtx.currentTime+duration);
}

function startTimer(callbackOnEnd){
  clearInterval(timer);
  const tick=50; let gradientPos=0;
  timer=setInterval(()=>{
    time-=tick/1000;
    const currentSecond=Math.ceil(time);
    if(currentSecond<=5 && currentSecond>0 && currentSecond!==lastSecondPlayed){
      playTick();
      lastSecondPlayed=currentSecond;
    }
    if(time<=0){ clearInterval(timer); callbackOnEnd(); return; }
    gradientPos+=2; updateTimeBar(gradientPos);
  },tick);
}

function updateTimeBar(gradientPos=0){
  const bar=document.getElementById("tiempo-barra");
  const widthPercent=(time/timePerQuestion)*100;
  bar.style.width=widthPercent+"%";
  let colorStart,colorEnd;
  if(widthPercent>60){ colorStart="lime"; colorEnd="#00ffcc"; bar.classList.remove("time-warning"); }
  else if(widthPercent>30){ colorStart="yellow"; colorEnd="#ffcc00"; bar.classList.remove("time-warning"); }
  else{ colorStart="red"; colorEnd="#ff4444"; bar.classList.add("time-warning"); }
  bar.style.background=`linear-gradient(90deg, ${colorStart} ${gradientPos}%, ${colorEnd} ${gradientPos+40}%)`;
  bar.innerText=Math.ceil(time)+"s";
  bar.style.fontWeight="bold";
}

document.addEventListener("click",unlockAudio,{once:true});
