let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let score = JSON.parse(localStorage.getItem("score")) || 0;
let streak = JSON.parse(localStorage.getItem("streak")) || 0;
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

updateUI();
renderTasks();

function saveData(){
localStorage.setItem("tasks",JSON.stringify(tasks));
localStorage.setItem("score",score);
localStorage.setItem("streak",streak);
localStorage.setItem("achievements",JSON.stringify(achievements));
}

function addTask(){

let text = document.getElementById("task").value.trim();
let time = document.getElementById("time").value.trim();
let error = document.getElementById("errorMsg");

if(text === "" || time === ""){
    error.innerText = "⚠ All fields are required";
    return;
}

if(parseInt(time) <= 0){
    error.innerText = "⚠ Time must be greater than 0";
    return;
}

error.innerText = "";

let task = {
    text: text,
    time: parseInt(time),
    created: Date.now()
};

tasks.push(task);

document.getElementById("task").value = "";
document.getElementById("time").value = "";

saveData();
renderTasks();
}

function renderTasks(){

let list=document.getElementById("taskList");
list.innerHTML="";

tasks.forEach((task,index)=>{

let li=document.createElement("li");

let timer=document.createElement("span");
timer.className="timer";

li.innerHTML=`${task.text}`;

let completeBtn=document.createElement("button");
completeBtn.innerText="Complete";

completeBtn.onclick=()=>completeTask(index);

let failBtn=document.createElement("button");
failBtn.innerText="Miss";

failBtn.onclick=()=>failTask(index);

li.appendChild(timer);
li.appendChild(completeBtn);
li.appendChild(failBtn);

list.appendChild(li);

startTimer(timer,task);
});
}

function startTimer(timer,task){

setInterval(()=>{

let elapsed=(Date.now()-task.created)/60000;
let remaining=Math.max(0,task.time-elapsed);

timer.innerText="⏱ "+remaining.toFixed(1)+"m";

},1000);

}

function completeTask(index){

let task=tasks[index];

let elapsed=(Date.now()-task.created)/60000;

let xp=0;

if(elapsed<=task.time){
xp=10;
streak++;
}
else{
xp=5;
}

score+=xp;

showXP("+"+xp+" XP");

checkAchievements();

tasks.splice(index,1);

saveData();
updateUI();
renderTasks();
}

function failTask(index){

score-=5;
streak=0;

tasks.splice(index,1);

saveData();
updateUI();
renderTasks();
}

function updateUI(){

document.getElementById("score").innerText=score;
document.getElementById("streak").innerText=streak;

let level=getLevel(score);

document.getElementById("level").innerText=level;

updateProgress();

renderAchievements();
}

function getLevel(score){

if(score<50)return "Beginner";
if(score<150)return "Focused";
if(score<300)return "Productivity Beast";

return "Ultra Discipline";
}

function updateProgress(){

let percent=(score%100);

document.getElementById("progressBar").style.width=percent+"%";
}

function checkAchievements(){

if(score>=50 && !achievements.includes("First 50 XP")){
achievements.push("First 50 XP");
}

if(streak>=5 && !achievements.includes("5 Day Streak")){
achievements.push("5 Day Streak");
}

}

function renderAchievements(){

let list=document.getElementById("achievements");

list.innerHTML="";

achievements.forEach(a=>{
let li=document.createElement("li");
li.innerText=a;
list.appendChild(li);
});

}

function showXP(text){

let popup=document.getElementById("xpPopup");

popup.innerText=text;

popup.style.opacity=1;
popup.style.transform="translateY(0px)";

setTimeout(()=>{
popup.style.opacity=0;
popup.style.transform="translateY(-20px)";
},1500);

}
