const products=[
 {id:1,name:"Audemar Piguet 41",category:"classic",desc:"Automático · Aço 316L",price:219,images:["imagens/audemarpiguetfrente.jpg", "imagens/audemarpiguetlado.jpg", "imagens/audemarpiguetbaixo.jpg"]},
 {id:2,name:"Swarovsky Hiperbola Colar ",category:"colares",desc:"Cronógrafo · Cerâmica",price:26,images:["imagens/colarmoca.jpg","imagens/colarunico.jpg", "imagens/colarproximo.jpg"]},
 {id:3,name:"Swarovsky Brinco Mola Matrix",category:"colares",desc:"Automático · Couro italiano",price:25,images:["imagens/brincomoca.jpg", "imagens/brincotras.jpg", "imagens/brincounico.jpg"]},
{id:10,name:"Rolex Day-Date",category:"limited",desc:"Edição limitada · 18K",price:12900,images:["imagens/rolexazulfrente.jpg", "imagens/rolexazullado.jpg", "imagens/rolexazuldeitado.jpg"]},
 {id:4,name:"Aureum Grand Édition",category:"limited",desc:"Edição limitada · 18K",price:12900,images:["imagens/relogio-aureum-grand.png"]},
 {id:5,name:"Riviera Sport",category:"sport",desc:"Automático · Titânio",price:7350,images:["imagens/relogio-riviera.png"]},
 {id:6,name:"Minimal 36",category:"classic",desc:"Quartzo suíço · Aço",price:3100,images:["imagens/relogio-minimal.jpg"]},
 {id:7,name:"Luna Édition",category:"limited",desc:"Edição limitada · Diamantes",price:15800,images:["imagens/relogio-luna.jpg"]},
 {id:8,name:"Aureum Diver",category:"sport",desc:"Automático · 300M",price:8100,images:["imagens/relogio-aureum-diver.jpg"]},
 {id:9,name:"Rolex ",category:"colares",desc:"Automático · 300M",price:8100,images:["imagens/datejustfrente.jpg", "imagens/datejustlado.jpg", "imagens/datejustdeitado.jpg"]}
];
let cart=[];
let activeImgIndex=0;
const productsEl=document.querySelector("#products");
const euro=n=>new Intl.NumberFormat("pt-PT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

function renderProducts(filter="all"){
 productsEl.innerHTML=products.filter(p=>filter==="all"||p.category===filter).map(p=>{
  const cover=p.images&&p.images[0];
  return `
 <article class="product" data-id="${p.id}">
  <div class="product-img">${cover?`<img src="${cover}" alt="${p.name}" loading="lazy">`:""}${p.category==="limited"?'<span class="badge">LIMITED</span>':""}</div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><p class="price">${euro(p.price)}</p></div>
 </article>`;
 }).join("");
}

function renderCart(){
 const el=document.querySelector("#cartItems");
 if(!cart.length){el.innerHTML='<p class="empty">O seu saco está vazio.</p>';}
 else el.innerHTML=cart.map((i,idx)=>`<div class="cart-row"><div class="cart-thumb">${i.images&&i.images[0]?`<img src="${i.images[0]}" alt="${i.name}">`:""}</div><div><h4>${i.name}</h4><p>${euro(i.price)}</p></div><button class="remove" data-remove="${idx}">×</button></div>`).join("");
 document.querySelector("#cartCount").textContent=cart.length;
 document.querySelector("#cartTotal").textContent=euro(cart.reduce((s,i)=>s+i.price,0));
}

function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#overlay").classList.add("show")}
function closeCart(){document.querySelector("#cart").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}

function setMainImage(p,idx){
 activeImgIndex=idx;
 document.querySelector("#pquickMainImg").src=p.images[idx];
 document.querySelectorAll("#pquickThumbs .pquick-thumb").forEach((t,i)=>t.classList.toggle("active",i===idx));
}

function openQuickView(id){
 const p=products.find(x=>x.id==id);
 if(!p)return;
 document.querySelector("#pquick").dataset.id=p.id;
 document.querySelector("#pquickName").textContent=p.name;
 document.querySelector("#pquickDesc").textContent=p.desc;
 document.querySelector("#pquickPrice").textContent=euro(p.price);
 const imgs=p.images&&p.images.length?p.images:[];
 document.querySelector("#pquickThumbs").innerHTML=imgs.map((src,i)=>`<button class="pquick-thumb${i===0?" active":""}" data-idx="${i}"><img src="${src}" alt="${p.name} - foto ${i+1}"></button>`).join("");
 if(imgs.length){document.querySelector("#pquickMainImg").src=imgs[0];activeImgIndex=0;}
 document.querySelector("#pquickNav").style.display=imgs.length>1?"flex":"none";
 document.querySelector("#pquick").classList.add("open");
 document.querySelector("#overlay").classList.add("show");
}
function closeQuickView(){document.querySelector("#pquick").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}

function stepImage(dir){
 const p=products.find(x=>x.id==document.querySelector("#pquick").dataset.id);
 if(!p||!p.images||!p.images.length)return;
 const next=(activeImgIndex+dir+p.images.length)%p.images.length;
 setMainImage(p,next);
}

productsEl.addEventListener("click",e=>{const card=e.target.closest(".product");if(!card)return;openQuickView(card.dataset.id)});

document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)}));

document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=()=>{closeCart();closeQuickView();closeAccount();closeCheckout()};

document.querySelector("#cartItems").addEventListener("click",e=>{const idx=e.target.dataset.remove;if(idx===undefined)return;cart=cart.filter((_,i)=>i!==Number(idx));renderCart()});

document.querySelector("#pquickClose").onclick=closeQuickView;
document.querySelector("#pquickThumbs").addEventListener("click",e=>{
 const btn=e.target.closest(".pquick-thumb");if(!btn)return;
 const p=products.find(x=>x.id==document.querySelector("#pquick").dataset.id);
 setMainImage(p,Number(btn.dataset.idx));
});
document.querySelector("#pquickPrev").onclick=()=>stepImage(-1);
document.querySelector("#pquickNext").onclick=()=>stepImage(1);
document.querySelector("#pquickAdd").onclick=()=>{
 const user=window.netlifyIdentity&&netlifyIdentity.currentUser();
 if(!user){
  closeQuickView();
  document.querySelector("#profileMsg")&&(document.querySelector("#profileMsg").textContent="");
  alert("Precisas de ter conta e sessão iniciada para adicionar produtos ao carrinho.");
  window.netlifyIdentity&&netlifyIdentity.open("login");
  return;
 }
 const p=products.find(x=>x.id==document.querySelector("#pquick").dataset.id);
 if(!p)return;
 cart.push(p);renderCart();closeQuickView();openCart();
};

document.querySelector("#checkout").onclick=openCheckout;
document.querySelector("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.querySelector("#newsletterMsg").textContent="Obrigado — está na lista privada.";e.target.reset()});

/* ---------- Conta / Login (Netlify Identity) ---------- */
function openAccount(){document.querySelector("#accountPanel").classList.add("open");document.querySelector("#overlay").classList.add("show")}
function closeAccount(){document.querySelector("#accountPanel").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}

function fillProfileForm(user){
 const d=(user&&user.user_metadata)||{};
 document.querySelector("#pf-name").value=d.full_name||"";
 document.querySelector("#pf-phone").value=d.phone||"";
 document.querySelector("#pf-address").value=d.address||"";
 document.querySelector("#pf-zip").value=d.zip||"";
 document.querySelector("#pf-city").value=d.city||"";
 document.querySelector("#pf-country").value=d.country||"";
}

function updateAuthUI(user){
 const btn=document.querySelector("#accountBtn");
 if(user){
  const firstName=(user.user_metadata&&user.user_metadata.full_name)?user.user_metadata.full_name.split(" ")[0]:user.email.split("@")[0];
  btn.textContent=firstName;
  document.querySelector("#accountEmail").textContent=user.email;
  fillProfileForm(user);
 }else{
  btn.textContent="Entrar";
 }
}

if(window.netlifyIdentity){
 netlifyIdentity.on("init",user=>updateAuthUI(user));
 netlifyIdentity.on("login",user=>{updateAuthUI(user);netlifyIdentity.close();openAccount()});
 netlifyIdentity.on("logout",()=>{updateAuthUI(null);closeAccount()});
 netlifyIdentity.init();
}

document.querySelector("#accountBtn").addEventListener("click",()=>{
 if(!window.netlifyIdentity){alert("O login só funciona depois de o site estar publicado no Netlify com a Identity ativada.");return}
 const user=netlifyIdentity.currentUser();
 if(user){openAccount()}else{netlifyIdentity.open()}
});

document.querySelector("#closeAccount").onclick=closeAccount;
document.querySelector("#logoutBtn").onclick=()=>window.netlifyIdentity&&netlifyIdentity.logout();

document.querySelector("#profileForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const identity=window.netlifyIdentity;
 const user=identity&&identity.currentUser();
 const msg=document.querySelector("#profileMsg");
 if(!user){msg.style.color="#c0392b";msg.textContent="A tua sessão expirou. Fecha e volta a iniciar sessão.";return}
 const data={
  full_name:document.querySelector("#pf-name").value,
  phone:document.querySelector("#pf-phone").value,
  address:document.querySelector("#pf-address").value,
  zip:document.querySelector("#pf-zip").value,
  city:document.querySelector("#pf-city").value,
  country:document.querySelector("#pf-country").value
 };
 msg.style.color="#777";msg.textContent="A guardar...";
 try{
  await user.jwt(true);
  await user.update({data});
  msg.style.color="#5e8f5e";msg.textContent="Dados guardados com sucesso.";
 }catch(err){
  console.error("Erro ao guardar perfil:",err);
  msg.style.color="#c0392b";
  msg.textContent="Erro ao guardar"+(err&&err.message?": "+err.message:". Tenta novamente.");
 }
});

renderProducts();renderCart();

/* ---------- Checkout (login obrigatório + PayPal / MB WAY) ---------- */
function cartTotalValue(){return cart.reduce((s,i)=>s+i.price,0)}

function openCheckout(){
 if(!cart.length){alert("O teu carrinho está vazio.");return}
 const user=window.netlifyIdentity&&netlifyIdentity.currentUser();
 if(!user){
  alert("Precisas de iniciar sessão para finalizar a compra.");
  window.netlifyIdentity&&netlifyIdentity.open("login");
  return;
 }
 document.querySelector("#checkoutTotal").textContent=euro(cartTotalValue());
 document.querySelector("#checkoutMsg").textContent="";
 document.querySelector("#mbwayStatus").textContent="";
 document.querySelector("#checkoutModal").classList.add("open");
 document.querySelector("#overlay").classList.add("show");
}
function closeCheckout(){document.querySelector("#checkoutModal").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}
document.querySelector("#checkoutClose").onclick=closeCheckout;

let paypalSdkLoaded=false,paypalButtonsRendered=false;
function loadPaypalSdk(){
 if(paypalSdkLoaded){renderPaypalButtons();return}
 fetch("/.netlify/functions/paypal-config").then(r=>r.json()).then(cfg=>{
  if(!cfg.clientId){document.querySelector("#checkoutMsg").textContent="PayPal ainda não está configurado (falta PAYPAL_CLIENT_ID nas variáveis de ambiente do Netlify).";return}
  const s=document.createElement("script");
  s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&currency=EUR`;
  s.onload=()=>{paypalSdkLoaded=true;renderPaypalButtons()};
  s.onerror=()=>{document.querySelector("#checkoutMsg").textContent="Não foi possível carregar o PayPal."};
  document.body.appendChild(s);
 }).catch(()=>{document.querySelector("#checkoutMsg").textContent="Erro ao contactar o servidor para configurar o PayPal."});
}
function renderPaypalButtons(){
 if(paypalButtonsRendered||!window.paypal)return;
 paypalButtonsRendered=true;
 paypal.Buttons({
  createOrder:()=>fetch("/.netlify/functions/paypal-create-order",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({amount:cartTotalValue().toFixed(2)})
  }).then(r=>r.json()).then(d=>{if(!d.id)throw new Error(d.error||"Falha ao criar encomenda.");return d.id}),
  onApprove:(data)=>fetch("/.netlify/functions/paypal-capture-order",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({orderID:data.orderID})
  }).then(r=>r.json()).then(details=>onPaymentSuccess("paypal",details)),
  onError:()=>{document.querySelector("#checkoutMsg").style.color="#c0392b";document.querySelector("#checkoutMsg").textContent="Ocorreu um erro no pagamento PayPal. Tenta novamente."}
 }).render("#paypal-button-container");
}

document.querySelectorAll(".pay-method-btn").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".pay-method-btn").forEach(x=>x.classList.remove("active"));
 b.classList.add("active");
 const method=b.dataset.method;
 document.querySelector("#payPaypalBox").classList.toggle("active",method==="paypal");
 document.querySelector("#payMbwayBox").classList.toggle("active",method==="mbway");
 if(method==="paypal")loadPaypalSdk();
}));

document.querySelector("#mbwayPayBtn").onclick=async ()=>{
 const phone=document.querySelector("#mbwayPhone").value.trim();
 const statusEl=document.querySelector("#mbwayStatus");
 if(!/^9\d{8}$/.test(phone)){statusEl.textContent="Introduz um número de telemóvel português válido (9 dígitos, começado em 9).";return}
 statusEl.textContent="A enviar pedido para a tua app MB WAY...";
 const orderId="DIVAD-"+Date.now();
 try{
  const res=await fetch("/.netlify/functions/mbway-request",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({amount:cartTotalValue().toFixed(2),mobileNumber:phone,orderId})
  });
  const json=await res.json();
  if(!res.ok){statusEl.textContent="Erro ao pedir pagamento: "+(json.error||json.Message||"tenta novamente.");return}
  statusEl.textContent="Pedido enviado! Abre a app MB WAY e aprova o pagamento.";
  pollMbwayStatus(orderId,json.RequestId||json.requestId,statusEl);
 }catch(err){statusEl.textContent="Erro: "+err.message}
};

function pollMbwayStatus(orderId,requestId,statusEl){
 let tries=0;
 const iv=setInterval(async ()=>{
  tries++;
  try{
   const res=await fetch(`/.netlify/functions/mbway-status?orderId=${encodeURIComponent(orderId)}&requestId=${encodeURIComponent(requestId||"")}`);
   const json=await res.json();
   if(json.paid){
    clearInterval(iv);
    statusEl.textContent="Pagamento confirmado! Obrigado.";
    onPaymentSuccess("mbway",{orderId});
   }else if(json.failed){
    clearInterval(iv);
    statusEl.textContent="Pagamento não concluído: "+(json.message||"tenta novamente.");
   }
  }catch(e){/* mantém a tentar */}
  if(tries>40){clearInterval(iv);statusEl.textContent="Tempo esgotado a aguardar aprovação. Verifica a app MB WAY."}
 },3000);
}

async function onPaymentSuccess(method,details){
 const user=window.netlifyIdentity&&netlifyIdentity.currentUser();
 const order={id:"ORD-"+Date.now(),items:cart.map(i=>({name:i.name,price:i.price})),total:cartTotalValue(),method,status:"pendente",date:new Date().toISOString()};
 if(user){
  try{
   await user.jwt(true);
   const existing=(user.user_metadata&&user.user_metadata.orders)||[];
   await user.update({data:{orders:[...existing,order]}});
  }catch(e){console.error("Não foi possível guardar o histórico da encomenda:",e)}
 }
 cart=[];renderCart();
 const msg=document.querySelector("#checkoutMsg");
 msg.style.color="#5e8f5e";
 msg.textContent="Obrigado! A tua encomenda foi confirmada.";
 setTimeout(()=>{closeCheckout();closeCart()},2500);
}
