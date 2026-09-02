const $=s=>document.querySelector(s);
const modal=$("#modal"), game=$("#game");
let score=+localStorage.getItem("pvScore")||0, games=+localStorage.getItem("pvGames")||0, best=+localStorage.getItem("pvBest")||0;
function stats(){ $("#score").textContent=score;$("#games").textContent=games;$("#best").textContent=best; }
function addScore(n){score+=n;best=Math.max(best,score);games++;localStorage.setItem("pvScore",score);localStorage.setItem("pvGames",games);localStorage.setItem("pvBest",best);stats()}
stats();

document.querySelectorAll(".game-card").forEach(b=>b.onclick=()=>{modal.classList.remove("hidden"); ({memory:memory,number:number,word:word,lights:lights}[b.dataset.game])()});
$("#close").onclick=()=>modal.classList.add("hidden");
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};

function shell(title,desc){game.innerHTML=`<h2 class="game-title">${title}</h2><p class="game-info">${desc}</p><div class="game-area" id="area"></div>`;return $("#area")}

function memory(){
 const a=shell("🧠 Memory Match","Cari semua pasangan kartu.");
 const emojis=["🍎","🚀","🌙","🐱","🍕","🌈","⚽","🎧"], deck=[...emojis,...emojis].sort(()=>Math.random()-.5);
 let open=[],matched=0,moves=0;
 const grid=document.createElement("div");grid.className="memory-grid";a.append(grid);
 deck.forEach((x,i)=>{const c=document.createElement("button");c.className="card";c.textContent=x;c.onclick=()=>{if(open.length===2||c.classList.contains("flipped"))return;c.classList.add("flipped");open.push({c,x});moves++;if(open.length===2){if(open[0].x===open[1].x){open.forEach(o=>o.c.classList.add("matched"));matched+=2;open=[];if(matched===deck.length){msg.textContent=`🎉 Selesai dalam ${moves} langkah!`;addScore(Math.max(10,100-moves*3))}}else setTimeout(()=>{open.forEach(o=>o.c.classList.remove("flipped"));open=[]},600)}};grid.append(c)});
 const msg=document.createElement("div");msg.className="win";a.append(msg)
}

function number(){
 const a=shell("🔢 Number Merge","Klik dua angka berurutan untuk menjumlahkannya. Capai 64!");
 let nums=[2,2,4,8,16,2,4,8,2,4,8,16,2,4,2,8], selected=[];
 const grid=document.createElement("div");grid.className="number-grid";a.append(grid);
 const target=document.createElement("div");target.className="target";target.textContent="Target: 64";a.prepend(target);
 function render(){grid.innerHTML="";nums.forEach((n,i)=>{let b=document.createElement("button");b.className="num";b.textContent=n;b.onclick=()=>{selected.push(i);b.style.outline="3px solid #b9f27c";if(selected.length===2){let [x,y]=selected;if(Math.abs(x-y)===1&&nums[x]===nums[y]){nums[x]*=2;nums[y]=null;nums=nums.filter(Boolean);if(nums.includes(64)){target.textContent="🎉 Target tercapai!";addScore(150)}selected=[];render()}else{selected=[];render()}}};grid.append(b)})} render();
}

function word(){
 const words=["JAVASCRIPT","PUZZLE","GALAXY","COMPUTER","MOUNTAIN","RAINBOW","KEYBOARD","ADVENTURE"];
 const answer=words[Math.floor(Math.random()*words.length)], shuffled=answer.split("").sort(()=>Math.random()-.5).join("");
 const a=shell("🔤 Word Scramble","Susun kembali huruf acak menjadi kata yang benar.");
 a.innerHTML+=`<div class="word">${shuffled}</div><input id="guess" placeholder="Tulis jawaban..."><button class="action" id="check">CHECK</button><div id="msg"></div>`;
 $("#check").onclick=()=>{let g=$("#guess").value.trim().toUpperCase(),m=$("#msg");if(g===answer){m.textContent="🎉 Benar! +75";m.className="win";addScore(75)}else{m.textContent="Belum tepat 😆 Coba lagi!"}};
}

function lights(){
 const a=shell("💡 Lights Out","Matikan semua lampu. Setiap klik mengubah lampu di sekitarnya.");
 const grid=document.createElement("div");grid.className="lights-grid";a.append(grid);
 let board=Array.from({length:25},()=>Math.random()>.5), moves=0;
 function toggle(i){if(i<0||i>=25)return;board[i]=!board[i]}
 function click(i){[i,i-1,i+1,i-5,i+5].forEach(j=>{if(Math.abs(j%5-i%5)>1)return;toggle(j)});moves++;render();if(!board.some(Boolean)){a.insertAdjacentHTML("beforeend",`<div class="win">🎉 Semua lampu mati dalam ${moves} langkah!</div>`);addScore(Math.max(20,120-moves*2))}}
 function render(){grid.innerHTML="";board.forEach((on,i)=>{let b=document.createElement("button");b.className="light"+(on?" on":"");b.onclick=()=>click(i);grid.append(b)})}render();
}
