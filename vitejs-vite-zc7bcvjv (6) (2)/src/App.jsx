import { useState, useRef, useEffect, useCallback } from "react";
const C={
  cream:"#FDFDE8",dot:"#4DAADF",dotDk:"#2A8EC4",
  purple:"#C47FD5",purpleDk:"#9B5AB0",purpleLt:"#EDD6F5",
  pink:"#E879A0",pinkDk:"#C0527A",pinkLt:"#FBCFE8",
  text:"#1A0A30",textLt:"#4A2A6A",white:"#FFF",card:"#FFFEF0",
  pill:"rgba(255,254,240,0.97)",toast:"rgba(45,15,80,0.95)",
  busy:"#FF7675",busyLt:"#FFE0E0",
};

const POLKA={
  background:C.cream,
  backgroundImage:[
    `radial-gradient(circle,${C.dot}BB 8px,transparent 8px)`,
    `radial-gradient(circle,${C.dotDk}55 5px,transparent 5px)`,
  ].join(","),
  backgroundSize:"52px 52px,52px 52px",
  backgroundPosition:"0 0,26px 26px",
};

const MOODS=[
  {id:"happy",        label:"Happy",        emoji:"😊",color:"#FFD93D"},
  {id:"busy",         label:"Busy",         emoji:"🏃",color:"#FF9F43"},
  {id:"affectionate", label:"Affectionate", emoji:"🥰",color:"#FF6B9D"},
  {id:"tired",        label:"Tired",        emoji:"😴",color:"#A29BFE"},
  {id:"sad",          label:"Sad",          emoji:"😢",color:"#74B9FF"},
  {id:"hungry",       label:"Hungry",       emoji:"🍽️",color:"#FDCB6E"},
  {id:"normal1",      label:"Normal",       emoji:"🙂",color:"#B8E994"},
  {id:"normal2",      label:"Chill",        emoji:"😌",color:"#55EFC4"},
  {id:"activity",     label:"Active",       emoji:"⚡",color:"#FD79A8"},
  {id:"angry",        label:"Angry",        emoji:"😤",color:"#FF7675"},
  {id:"extra",        label:"Grossed Out",  emoji:"🤢",color:"#BADC58"},
];

const MOOD_IMAGES={
  Wendy:{
    happy:      "/mood/wendy_happy.png",
    busy:       "/mood/wendy_busy.png",
    affectionate:"/mood/wendy_affection.png",
    tired:      "/mood/wendy_tired.png",
    sad:        "/mood/wendy_sad.png",
    hungry:     "/mood/wendy_hungry.png",
    normal1:    "/mood/wendy_normal_1.png",
    normal2:    "/mood/wendy_normal_2.png",
    activity:   "/mood/wendy_activity.png",
    angry:      "/mood/wendy_angry.png",
    extra:      "/mood/wendy_grossed_out.png",
  },
  Son:{
    happy:      "/mood/son_happy.png",
    busy:       "/mood/son_busy.png",
    affectionate:"/mood/son_affection.png",
    tired:      "/mood/son_tired.png",
    sad:        "/mood/son_sad.png",
    hungry:     "/mood/son_hungry.png",
    normal1:    "/mood/son_normal_1.png",
    normal2:    "/mood/son_normal_2.png",
    activity:   "/mood/son_activity.png",
    angry:      "/mood/son_angry.png",
    extra:      "/mood/son_ew.png",
  },
};

const STICKERS=["🌸","⭐","🦋","🌈","🍭","💫","🎀","🌺","🍀","💝","🎈","🌙","☀️","🦄","🍩","🌻","🎵","🌊","🦊","🐱"];
const REACTIONS=["❤️","😂","😮","😢","👎","👍","🫩","🥰","🤢","😭","💀","🤨"];
const NOTE_COLORS=["#FFF9C4","#FCE4EC","#E8F5E9","#E3F2FD","#F3E5F5"];
const NC_NAMES=["Yellow","Pink","Green","Blue","Lavender"];
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function SakuraPetal({x,y,size=18,rotate=0,opacity=0.55}){
  const r=size;
  return(
    <g transform={`translate(${x},${y}) rotate(${rotate})`} opacity={opacity}>
      {[0,72,144,216,288].map((a,i)=>(
        <ellipse key={i} cx={0} cy={-r*.62} rx={r*.36} ry={r*.62}
          fill={i%2===0?"#F9B8CC":"#F9C9D8"} transform={`rotate(${a})`}/>
      ))}
      <circle cx="0" cy="0" r={r*.16} fill="#FADADD"/>
      <circle cx="0" cy="0" r={r*.07} fill="#FFB7C5"/>
    </g>
  );
}
const SK=[
  {x:14,y:32,size:17,rotate:10,opacity:.5},{x:340,y:18,size:22,rotate:-18,opacity:.45},
  {x:58,y:95,size:13,rotate:38,opacity:.42},{x:348,y:80,size:15,rotate:-8,opacity:.5},
  {x:6,y:190,size:19,rotate:52,opacity:.38},{x:356,y:168,size:17,rotate:-42,opacity:.44},
  {x:22,y:285,size:15,rotate:22,opacity:.46},{x:344,y:260,size:21,rotate:12,opacity:.38},
  {x:10,y:375,size:17,rotate:-18,opacity:.41},{x:352,y:350,size:15,rotate:32,opacity:.5},
  {x:165,y:6,size:15,rotate:6,opacity:.36},{x:225,y:10,size:11,rotate:-32,opacity:.41},
];
function SakuraLayer(){
  return(
    <svg style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}
      viewBox="0 0 380 520" preserveAspectRatio="xMidYMid slice">
      {SK.map((s,i)=><SakuraPetal key={i} {...s}/>)}
    </svg>
  );
}

function PageBg({children,style={}}){
  return(
    <div style={{...POLKA,minHeight:"100%",position:"relative",...style}}>
      <SakuraLayer/>
      <div style={{position:"relative",zIndex:2,paddingBottom:24}}>{children}</div>
    </div>
  );
}

function Toast({toasts,onUndo}){
  return(
    <div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",
      zIndex:500,width:"calc(100% - 28px)",maxWidth:440,pointerEvents:"none",
      display:"flex",flexDirection:"column",gap:6}}>
      {toasts.map(t=>(
        <div key={t.id} onClick={t.undoCb?()=>onUndo(t):undefined}
          style={{background:C.toast,color:"#fff",borderRadius:14,padding:"11px 16px",
            fontFamily:"'Fredoka One',cursive",fontSize:14,
            boxShadow:"0 4px 20px rgba(0,0,0,.35)",border:`1.5px solid ${C.purple}`,
            animation:"toastIn .3s cubic-bezier(.36,.07,.19,.97)",
            opacity:t.fading?0:1,transition:"opacity .5s",
            display:"flex",alignItems:"center",gap:8,
            pointerEvents:t.undoCb?"all":"none",cursor:t.undoCb?"pointer":"default"}}>
          <span style={{fontSize:20}}>{t.icon||"🌸"}</span>
          <span style={{flex:1}}>{t.msg}</span>
          {t.undoCb&&<span style={{background:C.purple,borderRadius:50,padding:"3px 12px",
            fontSize:12,border:"1.5px solid #fff",flexShrink:0}}>Undo</span>}
        </div>
      ))}
    </div>
  );
}

function Btn({children,onClick,style={},small,variant="purple",disabled}){
  const [b,setB]=useState(false);
  const v=variant==="pink"?{bg:C.pink,bdr:C.pinkDk,txt:C.white}
         :variant==="ghost"?{bg:C.pill,bdr:C.purple,txt:C.purpleDk}
         :variant==="red"?{bg:"#FF7675",bdr:"#c0392b",txt:C.white}
         :variant==="busy"?{bg:C.busy,bdr:"#c0392b",txt:C.white}
         :{bg:C.purple,bdr:C.purpleDk,txt:C.white};
  const tap=e=>{
    if(disabled)return;
    setB(true);setTimeout(()=>setB(false),300);
    onClick&&onClick(e);
  };
  return(
    <button onClick={tap} disabled={disabled} style={{
      background:v.bg,color:v.txt,border:`2.5px solid ${v.bdr}`,
      borderRadius:50,padding:small?"7px 16px":"11px 26px",
      fontFamily:"'Fredoka One',cursive",fontSize:small?13:15,
      cursor:disabled?"not-allowed":"pointer",
      boxShadow:`3px 3px 0 ${v.bdr}`,
      transform:b?"scale(0.84) rotate(-2deg)":"scale(1) rotate(0deg)",
      transition:"transform .18s cubic-bezier(.36,.07,.19,.97)",
      opacity:disabled?.5:1,display:"inline-flex",alignItems:"center",gap:6,
      WebkitTapHighlightColor:"transparent",userSelect:"none",...style}}>
    {children}
    </button>
  );
}
function BD({children,onClick,style={}}){
  const [b,setB]=useState(false);
  return(
    <div onClick={()=>{setB(true);setTimeout(()=>setB(false),260);onClick&&onClick();}}
      style={{cursor:"pointer",transform:b?"scale(0.88)":"scale(1)",
        transition:"transform .18s cubic-bezier(.36,.07,.19,.97)",...style}}>
      {children}
    </div>
  );
}
function IBtn({children,onClick,style={}}){
  const [b,setB]=useState(false);
  return(
    <button onClick={()=>{setB(true);setTimeout(()=>setB(false),280);onClick&&onClick();}}
      style={{background:C.purpleLt,border:`2px solid ${C.purple}`,borderRadius:"50%",
        width:38,height:38,cursor:"pointer",fontSize:18,
        display:"flex",alignItems:"center",justifyContent:"center",
        transform:b?"scale(0.82)":"scale(1)",
        transition:"transform .18s cubic-bezier(.36,.07,.19,.97)",
        boxShadow:`2px 2px 0 ${C.purpleDk}`,WebkitTapHighlightColor:"transparent",...style}}>
      {children}
    </button>
  );
}
function Card({children,style={},onClick}){
  return(
    <div onClick={onClick} style={{background:C.card,borderRadius:22,
      border:`3px solid ${C.purple}`,padding:16,
      boxShadow:`5px 5px 0 ${C.purpleDk}`,position:"relative",...style}}>
      {children}
    </div>
  );
}
function MoodChip({moodId,size="sm"}){
  const m=MOODS.find(x=>x.id===moodId);if(!m)return null;
  return(
    <span style={{background:m.color+"55",border:`2px solid ${m.color}`,borderRadius:50,
      padding:size==="lg"?"5px 14px":"3px 10px",fontSize:size==="lg"?14:12,
      fontFamily:"'Fredoka One',cursive",color:C.text,
      display:"inline-flex",alignItems:"center",gap:4}}>
      {m.emoji} {m.label}
    </span>
  );
}

function QuickReact({onReact}){
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("pointerdown",h);
    return()=>document.removeEventListener("pointerdown",h);
  },[]);
  return(
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <Btn small variant="ghost" onClick={()=>setOpen(o=>!o)}>⚡ React</Btn>
      {open&&(
        <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",
          background:C.card,border:`2px solid ${C.purple}`,borderRadius:14,
          padding:"8px 10px",boxShadow:`3px 3px 0 ${C.purpleDk}`,
          display:"flex",gap:6,flexWrap:"wrap",zIndex:80,minWidth:190}}>
          {REACTIONS.map(r=>(
            <BD key={r} onClick={()=>{onReact(r);setOpen(false);}}
              style={{fontSize:22,padding:"2px 4px",borderRadius:8,
                background:C.purpleLt,border:`1px solid ${C.purple}`}}>
              {r}
            </BD>
          ))}
        </div>
      )}
    </div>
  );
}

const IMG_FRAME=186;
function MoodCard({person,moodId,isMe,onChangeMood,onSendNote,reactions,onReact}){
  const mood=MOODS.find(m=>m.id===moodId)||MOODS[0];
  const imgSrc=MOOD_IMAGES[person]?.[moodId]||"";
  const [imgErr,setImgErr]=useState(false);
  return(
    <Card style={{textAlign:"center",padding:"14px 10px",flex:"1 1 0",minWidth:145,maxWidth:230}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:11,color:C.purpleDk,marginBottom:6,
        textTransform:"uppercase",letterSpacing:.6,background:C.purpleLt,
        borderRadius:50,padding:"2px 10px",display:"inline-block"}}>
        Current Mood:
      </div>
      <div style={{width:IMG_FRAME,height:IMG_FRAME,margin:"0 auto 10px",borderRadius:20,
        border:`3px solid ${mood.color}`,background:mood.color+"33",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:72,boxShadow:`4px 4px 0 ${C.purpleDk}`,overflow:"hidden"}}>
        {imgSrc&&!imgErr
          ?<img src={imgSrc} alt={mood.label}
              onError={()=>setImgErr(true)}
              style={{width:"100%",height:"100%",objectFit:"contain"}}/>
          :<span style={{lineHeight:1}}>{mood.emoji}</span>}
      </div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:C.text,marginBottom:6}}>{person}</div>
      <MoodChip moodId={moodId} size="lg"/>
      {reactions&&Object.keys(reactions).length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:6}}>
          {Object.entries(reactions).filter(([,c])=>c>0).map(([r,c])=>(
            <BD key={r} onClick={()=>onReact&&onReact(r,-1)}
              style={{fontSize:13,background:C.purpleLt,borderRadius:50,
                padding:"2px 8px",border:`1.5px solid ${C.purple}`,
                fontFamily:"'Fredoka One',cursive",color:C.text,
                display:"flex",alignItems:"center",gap:3}}>
              {r}<span style={{fontSize:11}}>{c}</span>
            </BD>
          ))}
        </div>
      )}
      <div style={{marginTop:10,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
        {isMe&&<Btn small onClick={onChangeMood}>✏️ Change Mood</Btn>}
        {!isMe&&onSendNote&&<Btn small variant="pink" onClick={onSendNote}>📝 Send Note</Btn>}
        {!isMe&&onReact&&<QuickReact onReact={r=>onReact(r,1)}/>}
      </div>
    </Card>
  );
}

function MoodPicker({person,current,onPick,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.44)",zIndex:90,
      overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{minHeight:"100%",display:"flex",alignItems:"center",
        justifyContent:"center",padding:"20px 14px 80px"}}>
        <Card onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:380}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:C.purpleDk,marginBottom:14}}>
            How are you feeling, {person}? 💭
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {MOODS.map(m=>(
              <BD key={m.id} onClick={()=>{onPick(m.id);onClose();}}
                style={{display:"flex",alignItems:"center",gap:8,
                  background:current===m.id?m.color+"55":C.cream,
                  border:`2.5px solid ${current===m.id?C.purpleDk:m.color}`,
                  borderRadius:14,padding:"10px 12px",
                  fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.text,
                  boxShadow:current===m.id?`2px 2px 0 ${C.purpleDk}`:"none"}}>
                {MOOD_IMAGES[person]?.[m.id]
                  ?<img src={MOOD_IMAGES[person][m.id]} style={{width:32,height:32,objectFit:"contain",borderRadius:6}} onError={e=>{e.target.style.display="none";}}/>
                  :<span style={{fontSize:26}}>{m.emoji}</span>}
                {m.label}
              </BD>
            ))}
          </div>
          <div style={{marginTop:14}}><Btn small variant="ghost" onClick={onClose}>Cancel</Btn></div>
        </Card>
      </div>
    </div>
  );
}

function StickerPopup({onPickSticker,onPickMood,person,label="🎀 Stickers"}){
  const [open,setOpen]=useState(false);
  const [tab,setTab]=useState("stickers"); // "stickers" | "moods"
  const ref=useRef();

  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("pointerdown",h);
    return()=>document.removeEventListener("pointerdown",h);
  },[]);

  return(
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <Btn small variant="ghost" onClick={()=>setOpen(o=>!o)}>{label}</Btn>
      {open&&(
        <div style={{
          position:"absolute",
          // Open vertically downward, aligned left of button
          top:"110%",left:0,
          background:C.card,
          border:`2px solid ${C.purple}`,
          borderRadius:16,
          padding:10,
          boxShadow:`4px 4px 0 ${C.purpleDk}`,
          zIndex:200,
          width:220,
          maxHeight:320,
          overflowY:"auto",
          WebkitOverflowScrolling:"touch",
        }}>
          {/* Tab row */}
          <div style={{display:"flex",gap:6,marginBottom:8}}>
            {["stickers","moods"].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{flex:1,background:tab===t?C.purple:C.purpleLt,
                  color:tab===t?C.white:C.purpleDk,
                  border:`1.5px solid ${C.purple}`,borderRadius:50,
                  fontFamily:"'Fredoka One',cursive",fontSize:12,
                  padding:"4px 0",cursor:"pointer"}}>
                {t==="stickers"?"🎀 Stickers":"😊 Moods"}
              </button>
            ))}
          </div>

          {tab==="stickers"&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {STICKERS.map(s=>(
                <BD key={s} onClick={()=>{onPickSticker(s);setOpen(false);}}
                  style={{fontSize:24,padding:"3px 4px",borderRadius:8,
                    background:C.purpleLt,border:`1px solid ${C.purple}`}}>
                  {s}
                </BD>
              ))}
            </div>
          )}

          {tab==="moods"&&(
            <div>
              {["Wendy","Son"].map(p=>(
                <div key={p} style={{marginBottom:8}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:11,
                    color:C.pinkDk,marginBottom:5}}>{p}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
                    {MOODS.map(m=>{
                      const src=MOOD_IMAGES[p][m.id]||"";
                      return(
                        <BD key={m.id} title={`${p}: ${m.label}`}
                          onClick={()=>{onPickMood({src,emoji:m.emoji,label:`${p} – ${m.label}`});setOpen(false);}}
                          style={{borderRadius:8,border:`1.5px solid ${m.color}`,
                            background:m.color+"33",
                            display:"flex",flexDirection:"column",alignItems:"center",
                            justifyContent:"center",padding:2,aspectRatio:"1",overflow:"hidden"}}>
                          {src
                            ?<img src={src} style={{width:"80%",height:"80%",objectFit:"contain"}}
                                onError={e=>{e.target.style.display="none";}}/>
                            :<span style={{fontSize:18}}>{m.emoji}</span>}
                          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:7,
                            color:C.text,textAlign:"center",lineHeight:1}}>{m.label}</div>
                        </BD>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────
function StickyComposer({to,onSend,onClose,sendLabel="Send 💌",compact=false}){
  const [color,setColor]=useState(NOTE_COLORS[0]);
  const [text,setText]=useState("");
  const [placed,setPlaced]=useState([]);
  const noteRef=useRef();
  const fileRef=useRef();

//notes
  const addSticker=(content)=>{
    if(!noteRef.current)return;
    const h=noteRef.current.offsetHeight||200;
    const w=noteRef.current.offsetWidth||300;
    const x=20+Math.random()*(w-80);
    const y=20+Math.random()*(h-60);
    setPlaced(p=>[...p,{id:Date.now(),type:"sticker",content,x,y}]);
  };

  const addMoodImg=({src,emoji,label})=>{
    if(!noteRef.current)return;
    const h=noteRef.current.offsetHeight||200;
    const w=noteRef.current.offsetWidth||300;
    const x=20+Math.random()*(w-80);
    const y=20+Math.random()*(h-80);
    setPlaced(p=>[...p,{id:Date.now(),type:"mood_img",content:src,emoji,label,x,y,w:64,h:64}]);
  };

  const handleImageFile=file=>{
    if(!file||!file.type.startsWith("image/"))return;
    setPlaced(p=>[...p,{id:Date.now(),type:"image",content:URL.createObjectURL(file),x:20,y:90,w:90,h:90}]);
  };
  const handlePaste=e=>{
    const items=e.clipboardData?.items;if(!items)return;
    for(const it of items){if(it.type.startsWith("image/")){handleImageFile(it.getAsFile());break;}}
  };

  const send=()=>{
    if(!text.trim()&&placed.length===0)return;
    onSend({color,text,placed});
  };

  return(
    <>
      {/* Colour picker */}
      <div style={{marginBottom:12}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:13,color:C.purple,marginBottom:6}}>Note colour</div>
        <div style={{display:"flex",gap:10}}>
          {NOTE_COLORS.map((nc,i)=>(
            <BD key={nc} onClick={()=>setColor(nc)} title={NC_NAMES[i]}
              style={{width:34,height:34,borderRadius:"50%",background:nc,flexShrink:0,
                border:color===nc?`3px solid ${C.purpleDk}`:`2px solid ${C.purple}`,
                boxShadow:color===nc?`2px 2px 0 ${C.purpleDk}`:"none",
                transform:color===nc?"scale(1.18)":"scale(1)"}}/>
          ))}
        </div>
      </div>

      {/* Note canvas */}
      <div ref={noteRef} onPaste={handlePaste}
        style={{background:color,borderRadius:14,
          minHeight:compact?160:220,padding:14,
          border:`2.5px solid ${C.purpleDk}`,marginBottom:10,position:"relative",
          boxShadow:"3px 5px 0 #bbb"}}>
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder={to?`Write something for ${to}... 💕`:"Write your message..."}
          rows={compact?4:6}
          style={{width:"100%",background:"transparent",border:"none",outline:"none",
            resize:"none",fontFamily:"'Nunito',sans-serif",fontSize:15,color:C.text,
            boxSizing:"border-box",lineHeight:1.6,minHeight:compact?80:110}}/>
        {placed.map(p=>(
          <div key={p.id} title="Tap to remove"
            onClick={()=>setPlaced(ps=>ps.filter(x=>x.id!==p.id))}
            style={{position:"absolute",left:p.x,top:p.y,cursor:"pointer",
              ...(p.type==="sticker"?{}:{width:p.w,height:p.h})}}>
            {p.type==="sticker"&&<span style={{fontSize:32,userSelect:"none"}}>{p.content}</span>}
            {(p.type==="image"||p.type==="mood_img")&&(
              p.content
                ?<img src={p.content} style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:8,border:`2px solid ${C.purple}`}}/>
                :<span style={{fontSize:32}}>{p.emoji}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{fontSize:11,color:C.textLt,marginBottom:10,fontFamily:"'Nunito',sans-serif"}}>
        Tap a placed item to remove it
      </div>

      {/* ── Sticker popup (whichdrag tray) ── */}
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <StickerPopup
          onPickSticker={addSticker}
          onPickMood={addMoodImg}
          label="🎀 Add Sticker"
        />
        <div style={{fontSize:11,color:C.textLt,fontFamily:"'Nunito',sans-serif"}}>
          Tap a sticker to place it on the note
        </div>
      </div>

      {/* Camera roll */}
      <div style={{marginBottom:14}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:13,color:C.purple,marginBottom:6}}>📸 Add image</div>
        <Btn small variant="ghost" onClick={()=>fileRef.current.click()}>📷 Camera Roll</Btn>
        <div style={{fontSize:11,color:C.textLt,marginTop:4,fontFamily:"'Nunito',sans-serif"}}>
          Or paste with Ctrl/Cmd+V anywhere on the note
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment"
          style={{display:"none"}} onChange={e=>handleImageFile(e.target.files[0])}/>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingTop:4}}>
        <Btn variant="pink" onClick={send}>{sendLabel}</Btn>
        {onClose&&<Btn variant="ghost" onClick={onClose}>Cancel</Btn>}
      </div>
    </>
  );
}

// ──Sticky note ─────────────────────────────────────────────────────
function StickyNoteModal({from,to,onSend,onClose}){
  const handleSend=({color,text,placed})=>{onSend({color,text,placed});onClose();};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.46)",zIndex:95,
      overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{minHeight:"100%",display:"flex",alignItems:"flex-start",
        justifyContent:"center",padding:"20px 14px 100px"}}>
        <Card onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:430}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:C.purpleDk,marginBottom:12}}>
            📝 Send Note to {to}
          </div>
          <StickyComposer to={to} onSend={handleSend} onClose={onClose}/>
        </Card>
      </div>
    </div>
  );
}

// ── profile user select ───────────────────────────────────────────────────────────
function UserSelectPage({onSelect}){
  return(
    <PageBg style={{minHeight:"100vh"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",minHeight:"100vh",padding:"24px 16px"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:40,color:C.purpleDk,
          textAlign:"center",background:C.pill,borderRadius:16,padding:"6px 24px",
          border:`2px solid ${C.purple}`,boxShadow:`2px 2px 0 ${C.purpleDk}`,marginBottom:8}}>
          🌸 Planner
        </div>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:700,color:C.textLt,
          textAlign:"center",background:C.pill,borderRadius:10,padding:"3px 14px",marginBottom:32}}>
          Who are you today?
        </div>
        <div style={{display:"flex",gap:22,justifyContent:"center",flexWrap:"wrap"}}>
          {["Wendy","Son"].map(name=>(
            <Card key={name} style={{textAlign:"center",padding:"28px 20px",minWidth:145}}>
              <div style={{width:IMG_FRAME,height:IMG_FRAME,borderRadius:"50%",margin:"0 auto 12px",
                border:`3px solid ${C.purple}`,background:C.purpleLt,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:72}}>
                {name==="Wendy"?"👩":"🧑"}
              </div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,marginBottom:12}}>{name}</div>
              <Btn small onClick={()=>onSelect(name)}>Pick me! ✨</Btn>
            </Card>
          ))}
        </div>
      </div>
    </PageBg>
  );
}

// ── intro────────────────────────────────────────────────────────────
function IntroPage({user,onDone}){
  const steps=[
    {icon:"📅",title:"Your Calendar",desc:"Click on any day to see events either of you booked together, add new ones, or mark yourself Busy/Free quickly."},
    {icon:"🔒",title:"Private Events",desc:"Toggle 'Make Private' when adding. The other person only sees 'Busy'. No details needed."},
    {icon:"🟥",title:"Quick Busy",desc:"Inside any day popup, tap the 🔴 Mark Busy to block off the whole day with one tap. Tap ✅ Mark Free to clear it."},
    {icon:"🤝",title:"Plan Together",desc:"Tap 'Plan Together' on any event to send an RSVP. They accept or decline and you both get notified."},
    {icon:"📝",title:"Notifications",desc:"Send full sticky notes! Pick a colour, write a message, tap the sticker button to add emojis or chibi drawings."},
    {icon:"😊",title:"Mood Cards",desc:"Your mood sits above the calendar. Tap Change Mood to update. Tap ⚡ to react on the other person's card."},
    {icon:"🖼️",title:"Gallery",desc:"Upload photos to share, just between you two. Your own personalised memory book! React with emojis, add stickers and delete with undo."},
  ];
  return(
    <PageBg style={{minHeight:"100vh"}}>
      <div style={{maxWidth:460,margin:"0 auto",padding:"32px 16px"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:28,color:C.purpleDk,
          textAlign:"center",background:C.pill,borderRadius:14,padding:"6px 20px",
          border:`2px solid ${C.purple}`,marginBottom:8}}>
          Hey {user}! 👋
        </div>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:700,color:C.textLt,
          textAlign:"center",marginBottom:20,marginTop:6,
          background:C.pill,borderRadius:10,padding:"3px 14px"}}>
          Here's how everything works
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {steps.map((s,i)=>(
            <Card key={i} style={{display:"flex",alignItems:"flex-start",gap:13,padding:"13px 14px"}}>
              <span style={{fontSize:26,flexShrink:0}}>{s.icon}</span>
              <div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:C.text}}>{s.title}</div>
                <div style={{fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:13,color:C.textLt,lineHeight:1.5}}>{s.desc}</div>
              </div>
            </Card>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:24}}>
          <Btn onClick={onDone} style={{fontSize:18,padding:"12px 40px"}}>Let's go!</Btn>
        </div>
      </div>
    </PageBg>
  );
}

// ── Calendar ─────────────────────────────────────────────────────────
function CalendarPage({user,otherUser,events,setEvents,moods,setMoods,moodReactions,setMoodReactions,setNotifications,pushToast}){
  const today=new Date();
  const [yr,setYr]=useState(today.getFullYear());
  const [mo,setMo]=useState(today.getMonth());
  const [modalDay,setModalDay]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [planTarget,setPlanTarget]=useState(null);
  const [showMoodPicker,setShowMoodPicker]=useState(false);
  const [showNoteModal,setShowNoteModal]=useState(false);
  const [newEv,setNewEv]=useState({title:"",time:"",food:"",activity:"",mood:"",notes:"",sticker:"",reminder:"",isPrivate:false});

  const days=new Date(yr,mo+1,0).getDate();
  const firstDay=new Date(yr,mo,1).getDay();
  const evOf=d=>events.filter(e=>e.day===d&&e.month===mo&&e.year===yr);
  const busyOf=d=>events.find(e=>e.day===d&&e.month===mo&&e.year===yr&&e.isBusy&&e.owner===user);

  const notify=(to,msg,type,extra={})=>setNotifications(n=>[{
    id:Date.now()+(Math.random()*99|0),type,from:user,to,...extra,msg,
    time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),read:false},...n]);

  const saveEvent=()=>{
    if(!newEv.title.trim())return;
    const ev={...newEv,day:modalDay||today.getDate(),month:mo,year:yr,id:Date.now(),owner:user};
    setEvents(p=>[...p,ev]);
    const label=ev.isPrivate?"a private event":`"${ev.title}"`;
    notify(otherUser,`${user} added ${label} on ${MONTHS[mo]} ${ev.day}`,"calendar_change");
    pushToast(`✅ Event saved!`,user,"✅");
    pushToast(`📅 ${user} added ${label} on ${MONTHS[mo]} ${ev.day}`,otherUser,"📅");
    setNewEv({title:"",time:"",food:"",activity:"",mood:"",notes:"",sticker:"",reminder:"",isPrivate:false});
    setShowAdd(false);
  };

  const toggleBusy=d=>{
    const ex=busyOf(d);
    if(ex){
      setEvents(es=>es.filter(e=>e.id!==ex.id));
      pushToast(`✅ Marked free on ${MONTHS[mo]} ${d}`,user,"✅");
    } else {
      const ev={id:Date.now(),isBusy:true,title:"Busy",day:d,month:mo,year:yr,owner:user,isPrivate:false,sticker:"🔴"};
      setEvents(p=>[...p,ev]);
      notify(otherUser,`${user} is busy on ${MONTHS[mo]} ${d}`,"calendar_change");
      pushToast(`🔴 Marked busy on ${MONTHS[mo]} ${d}`,user,"🔴");
      pushToast(`🔴 ${user} is busy on ${MONTHS[mo]} ${d}`,otherUser,"🔴");
    }
    setModalDay(null);
  };

  const sendRSVP=ev=>{
    notify(otherUser,`${user} invited you to "${ev.title}"`,"rsvp_request",
      {eventId:ev.id,eventTitle:ev.title,answered:false});
    setEvents(evs=>evs.map(e=>e.id===ev.id?{...e,owner:"both"}:e));
    pushToast(`📨 RSVP sent to ${otherUser}!`,user,"📨");
    pushToast(`🤝 ${user} invited you to "${ev.title}"`,otherUser,"🤝");
    setPlanTarget(null);setModalDay(null);
  };

  const sendNote=({color,text,placed})=>{
    notify(otherUser,`${user} sent you a note!`,"sticky_note",{noteColor:color,noteText:text,notePlaced:placed});
    pushToast(`✅ Note sent to ${otherUser}!`,user,"✅");
    pushToast(`📝 ${user} sent you a note!`,otherUser,"📝");
  };

  const changeMood=m=>{
    setMoods(ms=>({...ms,[user]:m}));
    const label=MOODS.find(x=>x.id===m)?.label||m;
    notify(otherUser,`${user} is now feeling ${label}`,"mood_change",{newMood:m,moodLabel:label});
    pushToast(`😊 Mood updated to ${label}!`,user,"😊");
    pushToast(`${user} is now feeling ${label}`,otherUser,MOODS.find(x=>x.id===m)?.emoji||"😊");
    setShowMoodPicker(false);
  };

  const reactMood=(person,emoji,delta)=>setMoodReactions(r=>{
    const cur={...(r[person]||{})};
    cur[emoji]=Math.max(0,(cur[emoji]||0)+delta);
    if(!cur[emoji])delete cur[emoji];
    return {...r,[person]:cur};
  });

  const display=ev=>ev.isPrivate&&ev.owner!==user
    ?{...ev,title:"🔒 Busy",sticker:"",food:"",activity:"",notes:""}:ev;

  return(
    <PageBg>
      {/* Mood cards */}
      <div style={{display:"flex",gap:12,padding:"16px 10px 8px",justifyContent:"center"}}>
        <MoodCard person={user} moodId={moods[user]} isMe
          onChangeMood={()=>setShowMoodPicker(true)}
          reactions={moodReactions[user]} onReact={(r,d)=>reactMood(user,r,d)}/>
        <MoodCard person={otherUser} moodId={moods[otherUser]} isMe={false}
          onSendNote={()=>setShowNoteModal(true)}
          reactions={moodReactions[otherUser]} onReact={(r,d)=>reactMood(otherUser,r,d)}/>
      </div>

      {/* Month nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px 4px"}}>
        <IBtn onClick={()=>mo===0?(setMo(11),setYr(y=>y-1)):setMo(m=>m-1)}>‹</IBtn>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,
          background:C.pill,borderRadius:12,padding:"3px 18px",border:`1.5px solid ${C.purple}`}}>
          {MONTHS[mo]} {yr}
        </div>
        <IBtn onClick={()=>mo===11?(setMo(0),setYr(y=>y+1)):setMo(m=>m+1)}>›</IBtn>
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",gap:8,padding:"6px 12px 10px"}}>
        <Btn small onClick={()=>{setModalDay(today.getDate());setShowAdd(true);}}>+ Add Event</Btn>
      </div>

      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 8px",gap:2,marginBottom:3}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} style={{textAlign:"center",fontFamily:"'Fredoka One',cursive",fontSize:11,
            color:C.purpleDk,background:C.pill,borderRadius:6,padding:"3px 0",fontWeight:"bold"}}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 8px 16px",gap:3}}>
        {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(days).fill(null).map((_,i)=>{
          const d=i+1;
          const de=evOf(d);
          const isBusy=!!busyOf(d);
          const isToday=d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
          return(
            <BD key={d} onClick={()=>setModalDay(d)}
              style={{minHeight:56,borderRadius:12,
                background:isBusy?C.busyLt:isToday?C.purpleLt:"rgba(255,255,240,.85)",
                border:isBusy?`2px solid ${C.busy}`:isToday?`2px solid ${C.purple}`:`1.5px solid rgba(196,127,213,.28)`,
                padding:"4px 3px",boxShadow:isToday?`2px 2px 0 ${C.purpleDk}`:"none"}}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:13,
                color:isBusy?C.busy:isToday?C.purpleDk:C.text,fontWeight:"bold"}}>{d}</div>
              {isBusy&&<div style={{fontSize:9,background:C.busy,color:"#fff",borderRadius:4,
                padding:"1px 3px",marginTop:2}}>Busy</div>}
              {de.filter(ev=>!ev.isBusy).slice(0,isBusy?1:2).map(ev=>{
                const dv=display(ev);
                return(
                  <div key={ev.id} style={{fontSize:9,
                    background:ev.owner==="both"?C.pink:ev.isPrivate?"#999":C.purple,
                    color:"#fff",borderRadius:4,padding:"1px 3px",marginTop:2,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {dv.sticker}{dv.title}
                  </div>
                );
              })}
              {de.length>2&&<div style={{fontSize:9,color:C.purpleDk}}>+{de.length-2}</div>}
            </BD>
          );
        })}
      </div>

      {/* Day detail bottom sheet */}
      {modalDay&&!showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:50,
          display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setModalDay(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,
            borderRadius:"22px 22px 0 0",border:`3px solid ${C.purple}`,
            padding:"20px 16px 32px",width:"100%",maxWidth:480,
            maxHeight:"75vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:C.text}}>
                {MONTHS[mo]} {modalDay} 📅
              </div>
              <Btn small variant={busyOf(modalDay)?"ghost":"busy"}
                onClick={()=>toggleBusy(modalDay)}>
                {busyOf(modalDay)?"✅ Mark Free":"🔴 Mark Busy"}
              </Btn>
            </div>
            {busyOf(modalDay)&&(
              <div style={{background:C.busyLt,borderRadius:12,padding:"8px 14px",marginBottom:10,
                border:`1.5px solid ${C.busy}`,fontFamily:"'Fredoka One',cursive",fontSize:14,color:C.busy}}>
                🔴 You've marked yourself busy this day
              </div>
            )}
            {evOf(modalDay).filter(e=>!e.isBusy).length===0&&!busyOf(modalDay)&&(
              <div style={{color:C.textLt,fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:14,marginBottom:10}}>
                No events yet!
              </div>
            )}
            {evOf(modalDay).filter(e=>!e.isBusy).map(ev=>{
              const dv=display(ev);
              return(
                <div key={ev.id} style={{background:C.purpleLt,borderRadius:12,
                  padding:"10px 14px",marginBottom:10,border:`1.5px solid ${C.purple}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.text,flex:1}}>
                      {dv.sticker} {dv.title}{ev.time?` · ${ev.time}`:""}
                    </div>
                    {ev.isPrivate&&ev.owner===user&&<span style={{fontSize:11,background:"#888",color:"#fff",borderRadius:8,padding:"2px 7px",fontFamily:"'Fredoka One',cursive"}}>🔒</span>}
                    {ev.owner==="both"&&<span style={{fontSize:11,color:C.pinkDk,fontFamily:"'Fredoka One',cursive"}}>🤝</span>}
                  </div>
                  {(ev.owner===user||ev.owner==="both")&&<>
                    {ev.food&&<div style={{fontSize:12,color:C.textLt,fontWeight:600}}>🍽 {ev.food}</div>}
                    {ev.activity&&<div style={{fontSize:12,color:C.textLt,fontWeight:600}}>🎯 {ev.activity}</div>}
                    {ev.notes&&<div style={{fontSize:12,color:C.textLt,fontStyle:"italic",fontWeight:600}}>📝 {ev.notes}</div>}
                  </>}
                  <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                    {ev.owner!=="both"&&ev.owner===user&&(
                      <Btn small variant="pink" onClick={()=>setPlanTarget(ev)}>🤝 Plan Together</Btn>
                    )}
                    {ev.owner===user&&(
                      <Btn small variant="red" onClick={()=>setEvents(es=>es.filter(e=>e.id!==ev.id))}>🗑 Delete</Btn>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={{borderTop:`2px dashed ${C.purple}`,paddingTop:12,marginTop:8,
              display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn small onClick={()=>setShowAdd(true)}>+ Add Event</Btn>
              <Btn small variant="ghost" onClick={()=>setModalDay(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Add Event overlay */}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:60,
          overflowY:"auto",WebkitOverflowScrolling:"touch"}}
          onClick={()=>setShowAdd(false)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:C.card,borderRadius:"22px 22px 0 0",
              border:`3px solid ${C.purple}`,
              padding:"24px 18px 60px",
              width:"100%",maxWidth:480,margin:"30vh auto 0"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:C.text,marginBottom:14}}>
              Add Event — {MONTHS[mo]} {modalDay||today.getDate()} ✨
            </div>
            {[["Title","title","text","📌 Event name"],["Time","time","time",""],
              ["Activity","activity","text","🎯 Activity"],
              ["Food","food","text","🍽 Food / snacks"],
              ["Notes","notes","text","📝 Notes"]].map(([lbl,key,type,ph])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{fontSize:12,fontFamily:"'Fredoka One',cursive",color:C.purpleDk,marginBottom:3}}>{lbl}</div>
                <input type={type} placeholder={ph} value={newEv[key]}
                  onChange={e=>setNewEv(n=>({...n,[key]:e.target.value}))}
                  style={{width:"100%",borderRadius:10,border:`2px solid ${C.purple}`,
                    padding:"9px 12px",fontFamily:"'Nunito',sans-serif",fontWeight:600,
                    fontSize:13,background:C.cream,color:C.text,boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <BD onClick={()=>setNewEv(n=>({...n,isPrivate:!n.isPrivate}))}
                style={{width:46,height:28,borderRadius:50,flexShrink:0,position:"relative",
                  background:newEv.isPrivate?C.purple:"#ccc"}}>
                <span style={{position:"absolute",top:3,left:newEv.isPrivate?20:3,
                  width:22,height:22,borderRadius:"50%",background:"white",
                  transition:"left .2s",display:"block"}}/>
              </BD>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:C.text}}>
                🔒 Private — {otherUser} sees "Busy" only
              </span>
            </div>
            {/* Sticker picker for events — uses popup too */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontFamily:"'Fredoka One',cursive",color:C.purpleDk,marginBottom:6}}>Sticker</div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <StickerPopup
                  onPickSticker={s=>setNewEv(n=>({...n,sticker:n.sticker===s?"":s}))}
                  onPickMood={({emoji})=>setNewEv(n=>({...n,sticker:emoji}))}
                  label={newEv.sticker?`${newEv.sticker} Change`:"🎀 Pick Sticker"}
                />
                {newEv.sticker&&(
                  <BD onClick={()=>setNewEv(n=>({...n,sticker:""}))}
                    style={{fontSize:11,color:C.textLt,background:C.purpleLt,
                      borderRadius:50,padding:"3px 10px",border:`1px solid ${C.purple}`,
                      fontFamily:"'Fredoka One',cursive"}}>✕ Clear</BD>
                )}
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontFamily:"'Fredoka One',cursive",color:C.purpleDk,marginBottom:4}}>⏰ Reminder</div>
              <input type="datetime-local" value={newEv.reminder}
                onChange={e=>setNewEv(n=>({...n,reminder:e.target.value}))}
                style={{borderRadius:10,border:`2px solid ${C.purple}`,padding:"9px 12px",
                  fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:13,
                  background:C.cream,color:C.text,maxWidth:"100%",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn onClick={saveEvent}>Save 💾</Btn>
              <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Plan Together */}
      {planTarget&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.42)",zIndex:70,
          display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <Card style={{width:"100%",maxWidth:370}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:C.pink,marginBottom:10}}>🤝 Plan Together!</div>
            <div style={{background:C.purpleLt,borderRadius:12,padding:"10px 14px",marginBottom:12}}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.text}}>{planTarget.sticker} {planTarget.title}</div>
              {planTarget.time&&<div style={{fontSize:12,color:C.textLt,fontWeight:600}}>🕐 {planTarget.time}</div>}
            </div>
            <div style={{fontSize:13,color:C.textLt,marginBottom:14,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
              {otherUser} will get an RSVP and you'll both be notified of their response.
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn variant="pink" onClick={()=>sendRSVP(planTarget)}>Send RSVP</Btn>
              <Btn variant="ghost" onClick={()=>setPlanTarget(null)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}

      {showMoodPicker&&<MoodPicker person={user} current={moods[user]} onPick={changeMood} onClose={()=>setShowMoodPicker(false)}/>}
      {showNoteModal&&<StickyNoteModal from={user} to={otherUser} onSend={sendNote} onClose={()=>setShowNoteModal(false)}/>}
    </PageBg>
  );
}

// ──Notifs────────────────────────────────────────────────────
function NotificationsPage({user,otherUser,notifications,setNotifications,events,setEvents,pushToast}){
  const [remTime,setRemTime]=useState("");

  const handleSend=({color,text,placed})=>{
    if(!text.trim()&&placed.length===0)return;
    setNotifications(n=>[{id:Date.now(),type:"sticky_note",from:user,to:otherUser,
      noteColor:color,noteText:text,notePlaced:placed,
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      reminder:remTime,read:false},...n]);
    pushToast(`✅ Sent!`,user,"✅");
    pushToast(`📝 ${user} sent you a note!`,otherUser,"📝");
    setRemTime("");
  };

  const answerRSVP=(notif,accepted)=>{
    setNotifications(ns=>ns.map(n=>n.id===notif.id?{...n,answered:true,accepted}:n));
    setNotifications(ns=>[{id:Date.now(),type:"rsvp_response",from:user,to:notif.from,
      eventTitle:notif.eventTitle,accepted,
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),read:false},...ns]);
    pushToast(`✅ Response sent!`,user,"✅");
    pushToast(`${user} ${accepted?"accepted ✅":"declined ❌"} "${notif.eventTitle}"`,notif.from,accepted?"✅":"❌");
    if(!accepted)setEvents(evs=>evs.map(e=>e.id===notif.eventId?{...e,owner:notif.from}:e));
  };

  const del=id=>setNotifications(ns=>ns.filter(n=>n.id!==id));
  const myNotifs=notifications.filter(n=>n.to===user);
  const meta={
    rsvp_request:{icon:"🤝",label:"Plan invite"},
    rsvp_response:{icon:"✅",label:"RSVP"},
    sticky_note:{icon:"📝",label:"Note"},
    calendar_change:{icon:"📅",label:"Calendar"},
    mood_change:{icon:"😊",label:"Mood"},
    message:{icon:"💬",label:"Message"},
  };

  return(
    <PageBg>
      <div style={{padding:"20px 16px"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,marginBottom:16,
          background:C.pill,borderRadius:12,padding:"4px 16px",display:"inline-block",
          border:`1.5px solid ${C.purple}`}}>🔔 Notifications</div>

        <Card style={{marginBottom:16}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.purpleDk,marginBottom:12}}>
            Send to {otherUser}
          </div>
          <StickyComposer to={otherUser} onSend={handleSend} sendLabel="Send 💌" compact/>
          <div style={{marginTop:10}}>
            <div style={{fontSize:12,fontFamily:"'Fredoka One',cursive",color:C.purpleDk,marginBottom:3}}>⏰ Remind at (optional)</div>
            <input type="datetime-local" value={remTime} onChange={e=>setRemTime(e.target.value)}
              style={{borderRadius:10,border:`2px solid ${C.purple}`,padding:"6px 11px",
                fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:12,
                background:C.cream,color:C.text}}/>
          </div>
        </Card>

        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.text,marginBottom:10,
          background:C.pill,borderRadius:8,padding:"2px 12px",display:"inline-block"}}>Inbox</div>
        {myNotifs.length===0&&(
          <div style={{color:C.textLt,fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:14}}>Nothing yet! 🌸</div>
        )}
        {myNotifs.map(n=>{
          const m=meta[n.type]||{icon:"💬",label:"Message"};
          return(
            <div key={n.id} style={{
              background:n.type==="sticky_note"?n.noteColor||"#FFF9C4"
                :n.type==="rsvp_request"?C.pinkLt
                :n.type==="calendar_change"?"#E8F5E9"
                :n.type==="mood_change"?MOODS.find(x=>x.id===n.newMood)?.color+"33"||C.purpleLt
                :C.purpleLt,
              borderRadius:14,padding:"10px 13px",marginBottom:10,
              border:`2px solid ${n.type==="sticky_note"?C.purpleDk:n.type==="rsvp_request"?C.pink:C.purple}`,
              boxShadow:n.type==="sticky_note"?"3px 5px 0 #bbb":"none",
              position:"relative"}}>
              <BD onClick={()=>del(n.id)}
                style={{position:"absolute",top:8,right:10,fontSize:14,color:C.textLt,
                  padding:"2px 7px",background:"rgba(255,255,255,.75)",borderRadius:50,
                  border:`1px solid ${C.purple}`,fontFamily:"'Fredoka One',cursive"}}>✕</BD>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,paddingRight:28}}>
                <span style={{fontSize:16}}>{m.icon}</span>
                <span style={{fontFamily:"'Fredoka One',cursive",fontSize:13,color:C.purpleDk}}>{m.label} · {n.from}</span>
                <span style={{fontSize:11,color:C.textLt,fontFamily:"'Nunito',sans-serif",marginLeft:"auto"}}>{n.time}</span>
              </div>
              {(n.type==="sticky_note"||n.type==="message")&&<>
                {(n.noteText||n.text)&&<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,color:C.text,whiteSpace:"pre-wrap"}}>{n.noteText||n.text}</div>}
                {n.notePlaced&&n.notePlaced.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                    {n.notePlaced.filter(p=>p.type==="sticker").map((p,i)=>(
                      <span key={i} style={{fontSize:24}}>{p.content}</span>
                    ))}
                    {n.notePlaced.filter(p=>p.type==="image"||p.type==="mood_img").map((p,i)=>(
                      p.content
                        ?<img key={i} src={p.content} style={{width:52,height:52,objectFit:"contain",borderRadius:8,border:`2px solid ${C.purple}`}}/>
                        :<span key={i} style={{fontSize:24}}>{p.emoji}</span>
                    ))}
                  </div>
                )}
                {n.reminder&&<div style={{fontSize:11,color:C.textLt,marginTop:4}}>⏰ {new Date(n.reminder).toLocaleString()}</div>}
              </>}
              {n.type==="calendar_change"&&<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{n.msg}</div>}
              {n.type==="mood_change"&&<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{n.from} is now feeling {MOODS.find(x=>x.id===n.newMood)?.emoji} <b>{n.moodLabel}</b></div>}
              {n.type==="rsvp_request"&&!n.answered&&<>
                <div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,color:C.text,marginBottom:8}}>{n.from} invited you to: <b>{n.eventTitle}</b></div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Btn small variant="pink" onClick={()=>answerRSVP(n,true)}>✅ Accept</Btn>
                  <Btn small variant="ghost" onClick={()=>answerRSVP(n,false)}>❌ Decline</Btn>
                </div>
              </>}
              {n.type==="rsvp_request"&&n.answered&&<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,color:C.textLt}}>You {n.accepted?"accepted ✅":"declined ❌"}: <b>{n.eventTitle}</b></div>}
              {n.type==="rsvp_response"&&<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,color:C.text}}>{n.from} {n.accepted?"accepted ✅":"declined ❌"} your invite to <b>{n.eventTitle}</b></div>}
            </div>
          );
        })}
      </div>
    </PageBg>
  );
}

// ──Gallery──────────────────────────────────────────────────────────────
function GalleryPage({user,pushToast}){
  const [photos,setPhotos]=useState([
    {id:1,url:"https://picsum.photos/seed/fam1/600/400",caption:"Family day 🌸",reactions:{},sticker:"🌈"},
    {id:2,url:"https://picsum.photos/seed/fam2/600/400",caption:"Movie night 🍿",reactions:{},sticker:"⭐"},
    {id:3,url:"https://picsum.photos/seed/fam3/600/400",caption:"Breakfast ☀️",reactions:{},sticker:"🌻"},
  ]);
  const [selected,setSelected]=useState(null);
  const fileRef=useRef();

  const addPhotos=files=>Array.from(files).forEach(file=>{
    setPhotos(ps=>[...ps,{id:Date.now()+(Math.random()*99|0),
      url:URL.createObjectURL(file),
      caption:file.name.replace(/\.[^.]+$/,""),reactions:{},sticker:""}]);
  });

  const deletePhoto=(id,restore)=>{
    if(restore){setPhotos(ps=>[...ps,restore]);return;}
    const ph=photos.find(p=>p.id===id);if(!ph)return;
    setPhotos(ps=>ps.filter(p=>p.id!==id));
    setSelected(null);
    pushToast("🗑 Photo deleted — tap to undo","__undo__","🗑",()=>deletePhoto(null,ph));
  };

  const toggleReaction=(photoId,emoji)=>{
    setPhotos(ps=>ps.map(p=>{
      if(p.id!==photoId)return p;
      const r={...p.reactions};
      if(r[emoji])delete r[emoji];else r[emoji]=1;
      return {...p,reactions:r};
    }));
    setSelected(s=>{
      if(!s||s.id!==photoId)return s;
      const r={...s.reactions};
      if(r[emoji])delete r[emoji];else r[emoji]=1;
      return {...s,reactions:r};
    });
  };

  return(
    <PageBg>
      <div style={{padding:"20px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,
            background:C.pill,borderRadius:12,padding:"4px 16px",border:`1.5px solid ${C.purple}`}}>
            🖼️ Gallery
          </div>
          <Btn small variant="pink" onClick={()=>fileRef.current.click()}>+ Add Photo</Btn>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple
            style={{display:"none"}} onChange={e=>addPhotos(e.target.files)}/>
        </div>
        {photos.length===0&&(
          <div style={{textAlign:"center",padding:50,color:C.textLt,
            fontFamily:"'Fredoka One',cursive",fontSize:16}}>No photos yet! Tap + Add Photo 🌸</div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {photos.map(p=>(
            <Card key={p.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{position:"relative"}}>
                <img src={p.url} alt={p.caption} onClick={()=>setSelected(p)}
                  style={{width:"100%",display:"block",borderRadius:"19px 19px 0 0",
                    maxHeight:300,objectFit:"cover",cursor:"pointer"}}/>
                <BD onClick={()=>deletePhoto(p.id)}
                  style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,.9)",
                    borderRadius:50,padding:"4px 12px",fontSize:12,fontFamily:"'Fredoka One',cursive",
                    color:C.pinkDk,border:`1.5px solid ${C.pink}`,boxShadow:`1px 1px 0 ${C.pinkDk}`}}>
                  🗑
                </BD>
                {p.sticker&&<div style={{position:"absolute",bottom:8,left:12,fontSize:28}}>{p.sticker}</div>}
              </div>
              <div style={{padding:"10px 14px 14px"}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:C.text,marginBottom:8}}>{p.caption}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {REACTIONS.map(e=>{
                    const active=!!p.reactions[e];
                    return(
                      <BD key={e} onClick={()=>toggleReaction(p.id,e)}
                        style={{fontSize:18,padding:"3px 8px",borderRadius:10,
                          background:active?C.purpleDk:C.purpleLt,
                          border:`1.5px solid ${active?C.purpleDk:C.purple}`,
                          color:active?C.white:C.text,
                          display:"inline-flex",alignItems:"center",gap:3}}>
                        <span>{e}</span>
                        {active&&<span style={{fontSize:11,fontFamily:"'Fredoka One',cursive"}}>1</span>}
                      </BD>
                    );
                  })}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <StickerPopup
                    onPickSticker={s=>setPhotos(ps=>ps.map(x=>x.id===p.id?{...x,sticker:x.sticker===s?"":s}:x))}
                    onPickMood={({emoji})=>setPhotos(ps=>ps.map(x=>x.id===p.id?{...x,sticker:emoji}:x))}
                    label={p.sticker?`${p.sticker} Sticker`:"🎀 Sticker"}
                  />
                  {p.sticker&&<span style={{fontSize:11,color:C.textLt,fontFamily:"'Fredoka One',cursive"}}>active: {p.sticker}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
        {selected&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:80,overflowY:"auto"}}
            onClick={()=>setSelected(null)}>
            <div onClick={e=>e.stopPropagation()}
              style={{minHeight:"100%",display:"flex",alignItems:"center",
                justifyContent:"center",padding:"20px 14px 40px"}}>
              <div style={{width:"100%",maxWidth:440}}>
                <img src={selected.url} alt={selected.caption}
                  style={{width:"100%",borderRadius:18,marginBottom:12,
                    maxHeight:"60vh",objectFit:"contain"}}/>
                <Card style={{padding:"12px 14px"}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:C.text,marginBottom:8}}>
                    {selected.sticker} {selected.caption}
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                    {REACTIONS.map(e=>{
                      const active=!!selected.reactions[e];
                      return(
                        <BD key={e} onClick={()=>toggleReaction(selected.id,e)}
                          style={{fontSize:22,padding:"4px 10px",borderRadius:10,
                            background:active?C.purpleDk:C.purpleLt,
                            border:`1.5px solid ${active?C.purpleDk:C.purple}`,
                            color:active?C.white:C.text,
                            display:"inline-flex",alignItems:"center",gap:3}}>
                          <span>{e}</span>
                          {active&&<span style={{fontSize:11,fontFamily:"'Fredoka One',cursive"}}>✓</span>}
                        </BD>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Btn small variant="red" onClick={()=>deletePhoto(selected.id)}>🗑 Delete</Btn>
                    <Btn small variant="ghost" onClick={()=>setSelected(null)}>Close</Btn>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageBg>
  );
}

// ──Profile ──────────────────────────────────────────────────────────────
function ProfilePage({user,moods,setMoods,moodReactions,setMoodReactions,setNotifications,pushToast,onSwitchUser}){
  const [showPicker,setShowPicker]=useState(false);
  const [showNote,setShowNote]=useState(false);
  const otherUser=user==="Wendy"?"Son":"Wendy";

  const changeMood=m=>{
    setMoods(ms=>({...ms,[user]:m}));
    const label=MOODS.find(x=>x.id===m)?.label||m;
    setNotifications(n=>[{id:Date.now(),type:"mood_change",from:user,to:otherUser,
      newMood:m,moodLabel:label,
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),read:false},...n]);
    pushToast(`😊 Mood updated to ${label}!`,user,"😊");
    pushToast(`${user} is now feeling ${label}`,otherUser,MOODS.find(x=>x.id===m)?.emoji||"😊");
    setShowPicker(false);
  };

  const sendNote=({color,text,placed})=>{
    setNotifications(n=>[{id:Date.now(),type:"sticky_note",from:user,to:otherUser,
      noteColor:color,noteText:text,notePlaced:placed,
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),read:false},...n]);
    pushToast(`✅ Note sent to ${otherUser}!`,user,"✅");
    pushToast(`📝 ${user} sent you a note!`,otherUser,"📝");
  };

  const reactMood=(person,emoji,delta)=>setMoodReactions(r=>{
    const cur={...(r[person]||{})};
    cur[emoji]=Math.max(0,(cur[emoji]||0)+delta);
    if(!cur[emoji])delete cur[emoji];
    return {...r,[person]:cur};
  });

  return(
    <PageBg>
      <div style={{padding:"20px 16px"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,marginBottom:16,
          background:C.pill,borderRadius:12,padding:"4px 16px",display:"inline-block",
          border:`1.5px solid ${C.purple}`}}>👤 Profile</div>
        <div style={{display:"flex",gap:12,marginBottom:18,justifyContent:"center",flexWrap:"wrap"}}>
          <MoodCard person={user} moodId={moods[user]} isMe onChangeMood={()=>setShowPicker(true)}
            reactions={moodReactions[user]} onReact={(r,d)=>reactMood(user,r,d)}/>
          <MoodCard person={otherUser} moodId={moods[otherUser]} isMe={false}
            onSendNote={()=>setShowNote(true)}
            reactions={moodReactions[otherUser]} onReact={(r,d)=>reactMood(otherUser,r,d)}/>
        </div>
        <Btn variant="pink" onClick={onSwitchUser}>🔄 Switch User</Btn>
        {showPicker&&<MoodPicker person={user} current={moods[user]} onPick={changeMood} onClose={()=>setShowPicker(false)}/>}
        {showNote&&<StickyNoteModal from={user} to={otherUser} onSend={sendNote} onClose={()=>setShowNote(false)}/>}
      </div>
    </PageBg>
  );
}

// ── Root ────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("select");
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("calendar");
  const [events,setEvents]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const [moods,setMoods]=useState({Wendy:"happy",Son:"normal1"});
  const [moodReactions,setMoodReactions]=useState({Wendy:{},Son:{}});
  const [toasts,setToasts]=useState([]);
  const userRef=useRef(user);
  useEffect(()=>{userRef.current=user;},[user]);

  const pushToast=useCallback((msg,targetUser,icon,undoCb)=>{
    const showFor=targetUser==="__undo__"?userRef.current:targetUser;
    if(userRef.current!==showFor)return;
    const id=Date.now()+(Math.random()*99|0);
    setToasts(t=>[...t,{id,msg,icon:icon||"🌸",fading:false,undoCb}]);
    setTimeout(()=>setToasts(t=>t.map(x=>x.id===id?{...x,fading:true}:x)),3500);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4100);
  },[]);

  const handleUndo=useCallback(t=>{t.undoCb&&t.undoCb();setToasts(ts=>ts.filter(x=>x.id!==t.id));},[]);

  const otherUser=user==="Wendy"?"Son":"Wendy";
  const badge=notifications.filter(n=>n.to===user&&!n.read).length;

  if(screen==="select") return <UserSelectPage onSelect={name=>{userRef.current=name;setUser(name);setScreen("intro");}}/>;
  if(screen==="intro")  return <IntroPage user={user} onDone={()=>setScreen("main")}/>;

  const TABS=[
    {id:"calendar",icon:"📅",label:"Calendar"},
    {id:"notifications",icon:"🔔",label:"Notify",badge},
    {id:"gallery",icon:"🖼️",label:"Gallery"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];

  return(
    <div style={{maxWidth:480,margin:"0 auto",display:"flex",
      flexDirection:"column",minHeight:"100vh",position:"relative"}}>
      <Toast toasts={toasts} onUndo={handleUndo}/>

      {/* Header */}
      <div style={{...POLKA,backgroundSize:"38px 38px,38px 38px",
        borderBottom:`3px solid ${C.purple}`,padding:"11px 16px 10px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"sticky",top:0,zIndex:42,flexShrink:0}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.text,
          background:C.pill,borderRadius:12,padding:"4px 16px",
          border:`2px solid ${C.purple}`,boxShadow:`2px 2px 0 ${C.purpleDk}`}}>
          🌸 Planner
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <MoodChip moodId={moods[user]} size="lg"/>
          <IBtn onClick={()=>setTab("profile")}
            style={{fontSize:22,background:C.purpleLt,border:`2.5px solid ${C.purple}`,
              boxShadow:`2px 2px 0 ${C.purpleDk}`}}>
            {user==="Wendy"?"👩":"🧑"}
          </IBtn>
        </div>
      </div>

      <div style={{flex:1}}>
        {tab==="calendar"&&<CalendarPage user={user} otherUser={otherUser}
          events={events} setEvents={setEvents} moods={moods} setMoods={setMoods}
          moodReactions={moodReactions} setMoodReactions={setMoodReactions}
          setNotifications={setNotifications} pushToast={pushToast}/>}
        {tab==="notifications"&&<NotificationsPage user={user} otherUser={otherUser}
          notifications={notifications} setNotifications={setNotifications}
          events={events} setEvents={setEvents} pushToast={pushToast}/>}
        {tab==="gallery"&&<GalleryPage user={user} pushToast={pushToast}/>}
        {tab==="profile"&&<ProfilePage user={user} moods={moods} setMoods={setMoods}
          moodReactions={moodReactions} setMoodReactions={setMoodReactions}
          setNotifications={setNotifications} pushToast={pushToast}
          onSwitchUser={()=>{setScreen("select");setUser(null);setTab("calendar");}}/>}
      </div>

      {/* Bottom Nav */}
      <div style={{background:C.card,borderTop:`3px solid ${C.purple}`,
        display:"flex",justifyContent:"space-around",
        padding:"8px 0 14px",position:"sticky",bottom:0,zIndex:42,flexShrink:0}}>
        {TABS.map(t=>(
          <BD key={t.id} onClick={()=>setTab(t.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",
              gap:2,padding:"4px 10px",position:"relative"}}>
            <span style={{fontSize:22}}>{t.icon}</span>
            {t.badge>0&&<span style={{position:"absolute",top:0,right:4,
              background:C.pink,color:"#fff",borderRadius:"50%",
              width:17,height:17,fontSize:10,display:"flex",alignItems:"center",
              justifyContent:"center",fontFamily:"'Fredoka One',cursive",
              border:"2px solid #fff"}}>{t.badge}</span>}
            <span style={{fontSize:10,fontFamily:"'Fredoka One',cursive",
              color:tab===t.id?C.purpleDk:C.textLt,
              borderBottom:tab===t.id?`2.5px solid ${C.purple}`:"2.5px solid transparent"}}>
              {t.label}
            </span>
          </BD>
        ))}
      </div>

      <style>{`
        @keyframes toastIn{
          from{transform:translateY(-16px) scale(.96);opacity:0}
          to{transform:translateY(0) scale(1);opacity:1}
        }
        *{-webkit-tap-highlight-color:transparent}
      `}</style>
    </div>
  );
}