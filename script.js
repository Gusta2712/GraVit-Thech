const products = [
 {id:1,brand:"Nike",name:"Downshifter 13",category:"Corrida",price:299.99,tag:"Corrida",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",description:"Tênis esportivo de visual versátil, pensado para acompanhar caminhadas e treinos leves.",specs:["Cabedal em material têxtil (varia por versão)","Entressola macia","Indicado para corrida leve e caminhada"],store:"https://www.nike.com.br/"},
 {id:2,brand:"Adidas",name:"Runfalcon",category:"Sports",price:279.90,tag:"Bom custo-benefício",image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",description:"Modelo esportivo versátil para atividades e combinações casuais.",specs:["Design esportivo","Solado de borracha (conforme versão)","Uso esportivo e casual"],store:"https://www.adidas.com.br/"},
 {id:3,brand:"New Balance",name:"574",category:"Casual",price:499.90,tag:"Clássico",image:"https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",description:"Silhueta clássica que combina com diferentes estilos do dia a dia.",specs:["Visual retrô","Construção com materiais variados","Estilo casual"],store:"https://www.newbalance.com.br/"},
 {id:4,brand:"Puma",name:"Smash V2",category:"Dia a dia",price:229.90,tag:"Preço em destaque",image:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",description:"Tênis de inspiração clássica para compor looks casuais.",specs:["Design inspirado no tênis de quadra","Perfil casual","Materiais variam conforme a versão"],store:"https://br.puma.com/"},
 {id:5,brand:"Mizuno",name:"Wave Mirai",category:"Corrida",price:389.90,tag:"Corrida",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",description:"Tênis esportivo para quem procura uma opção voltada a atividades físicas.",specs:["Construção esportiva","Solado desenvolvido para uso esportivo","Confira a ficha técnica da versão"],store:"https://www.mizuno.com.br/"},
 {id:6,brand:"Olympikus",name:"Corre",category:"Sports",price:349.90,tag:"Esportivo",image:"https://images.unsplash.com/photo-1490384921480-4a1e6c3b6f9b?auto=format&fit=crop&w=800&q=80",description:"Linha esportiva brasileira com modelos voltados à prática de corrida.",specs:["Linha de corrida","Tecnologias variam por modelo","Consulte a versão disponível"],store:"https://www.olympikus.com.br/"},
 {id:7,brand:"Asics",name:"Gel-Contend",category:"Corrida",price:399.90,tag:"Corrida",image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",description:"Modelo da linha de corrida da marca, indicado para conhecer as opções de entrada.",specs:["Linha esportiva","Amortecimento conforme a versão","Confira indicação de uso do fabricante"],store:"https://www.asics.com.br/"},
 {id:8,brand:"Democrata",name:"Air Spot",category:"Social",price:289.90,tag:"Social",image:"https://images.unsplash.com/photo-1614252369475-531144e3e8c8?auto=format&fit=crop&w=800&q=80",description:"Calçado de visual mais alinhado para ocasiões sociais e ambientes de trabalho.",specs:["Estilo social","Acabamento varia conforme a versão","Confira material e forma na loja"],store:"https://www.democrata.com.br/"}
];

let selectedCategory = "Todos";
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function money(value){return value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function renderProducts(){
  let list = products.filter(p => (selectedCategory==="Todos" || p.category===selectedCategory) &&
    (p.name+" "+p.brand+" "+p.category).toLowerCase().includes(searchInput.value.toLowerCase()));
  if(sortSelect.value==="low") list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value==="high") list.sort((a,b)=>b.price-a.price);
  document.getElementById("resultCount").textContent = `${list.length} ${list.length===1?"modelo encontrado":"modelos encontrados"}`;
  document.getElementById("productsTitle").textContent = selectedCategory==="Todos"?"Tênis em destaque":`Tênis: ${selectedCategory}`;
  document.getElementById("emptyState").hidden = list.length!==0;
  productGrid.innerHTML = list.map(p=>`
    <article class="product-card" tabindex="0" role="button" aria-label="Ver detalhes de ${p.brand} ${p.name}" data-id="${p.id}">
      <div class="product-image"><img src="${p.image}" alt="${p.brand} ${p.name}" loading="lazy"><span class="product-badge">${p.tag}</span></div>
      <div class="product-content"><div class="product-brand">${p.brand}</div><div class="product-name">${p.name}</div><div class="product-category">${p.category}</div>
        <div class="product-bottom"><div><div class="price-label">PREÇO DE REFERÊNCIA</div><div class="price">${money(p.price)}</div></div><span class="details-link">Ver detalhes ↗</span></div>
      </div>
    </article>`).join("");
  productGrid.querySelectorAll(".product-card").forEach(card=>{
    card.addEventListener("click",()=>openProduct(Number(card.dataset.id)));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openProduct(Number(card.dataset.id));}});
  });
}
function openProduct(id){
  const p=products.find(item=>item.id===id); if(!p)return;
  document.getElementById("modalImage").src=p.image;
  document.getElementById("modalImage").alt=`${p.brand} ${p.name}`;
  document.getElementById("modalCategory").textContent=p.category.toUpperCase();
  document.getElementById("modalBrand").textContent=p.brand;
  document.getElementById("modalName").textContent=p.name;
  document.getElementById("modalDescription").textContent=p.description;
  document.getElementById("modalSpecs").innerHTML=p.specs.map(s=>`<li>${s}</li>`).join("");
  document.getElementById("modalPrice").textContent=money(p.price);
  const buy=document.getElementById("buyButton"); buy.href=p.store; buy.classList.remove("disabled");
  document.getElementById("modalBackdrop").hidden=false;
  document.body.style.overflow="hidden";
}
function closeModal(){document.getElementById("modalBackdrop").hidden=true;document.body.style.overflow="";}
document.getElementById("categoryGrid").addEventListener("click",e=>{
  const btn=e.target.closest("[data-category]");if(!btn)return;
  selectedCategory=btn.dataset.category;
  document.querySelectorAll(".category-card").forEach(b=>b.classList.toggle("active",b===btn));
  renderProducts();document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
});
searchInput.addEventListener("input",renderProducts);
sortSelect.addEventListener("change",renderProducts);
document.getElementById("modalClose").addEventListener("click",closeModal);
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
renderProducts();
