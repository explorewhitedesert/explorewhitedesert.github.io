/* Explore White Desert - sitewide conversion layer (no dependencies) */
(function(){
"use strict";
var WA = "201278220004";
var lang = (document.documentElement.lang || "en").slice(0,2);
var T = {
 en:{fab:"WhatsApp",title:"Plan your trip",sub:"Tell us your dates - we reply the same day.",date:"Your dates (e.g. 12-13 December)",size:"Group size",send:"Send on WhatsApp",msg:"Hi Explore White Desert! I'd like to book the 2-day White Desert safari from Cairo.",when:"Dates",people:"people",share:"Share this page:",price:"Please send me the price and available dates."},
 de:{fab:"WhatsApp",title:"Plane deine Tour",sub:"Sag uns deine Termine - wir antworten noch am selben Tag.",date:"Deine Termine (z.B. 12.-13. Dezember)",size:"Gruppengroesse",send:"Auf WhatsApp senden",msg:"Hallo Explore White Desert! Ich moechte die 2-Tage-Safari in die Weisse Wueste ab Kairo buchen.",when:"Termine",people:"Personen",share:"Seite teilen:",price:"Bitte senden Sie mir den Preis und freie Termine."},
 fr:{fab:"WhatsApp",title:"Planifiez votre voyage",sub:"Donnez-nous vos dates - nous repondons le jour meme.",date:"Vos dates (ex. 12-13 decembre)",size:"Taille du groupe",send:"Envoyer sur WhatsApp",msg:"Bonjour Explore White Desert ! Je voudrais reserver le safari de 2 jours dans le Desert Blanc au depart du Caire.",when:"Dates",people:"personnes",share:"Partager cette page :",price:"Merci de m'envoyer le prix et les dates disponibles."},
 es:{fab:"WhatsApp",title:"Planifica tu viaje",sub:"Dinos tus fechas - respondemos el mismo dia.",date:"Tus fechas (ej. 12-13 de diciembre)",size:"Tamano del grupo",send:"Enviar por WhatsApp",msg:"Hola Explore White Desert! Me gustaria reservar el safari de 2 dias al Desierto Blanco desde El Cairo.",when:"Fechas",people:"personas",share:"Compartir esta pagina:",price:"Por favor envienme el precio y las fechas disponibles."},
 it:{fab:"WhatsApp",title:"Pianifica il tuo viaggio",sub:"Dicci le tue date - rispondiamo lo stesso giorno.",date:"Le tue date (es. 12-13 dicembre)",size:"Dimensione del gruppo",send:"Invia su WhatsApp",msg:"Ciao Explore White Desert! Vorrei prenotare il safari di 2 giorni nel Deserto Bianco dal Cairo.",when:"Date",people:"persone",share:"Condividi questa pagina:",price:"Per favore inviatemi il prezzo e le date disponibili."},
 pt:{fab:"WhatsApp",title:"Planeje sua viagem",sub:"Diga-nos suas datas - respondemos no mesmo dia.",date:"Suas datas (ex. 12-13 de dezembro)",size:"Tamanho do grupo",send:"Enviar no WhatsApp",msg:"Ola Explore White Desert! Gostaria de reservar o safari de 2 dias no Deserto Branco saindo do Cairo.",when:"Datas",people:"pessoas",share:"Compartilhar esta pagina:",price:"Por favor enviem-me o preco e as datas disponiveis."},
 nl:{fab:"WhatsApp",title:"Plan je trip",sub:"Vertel ons je data - we reageren dezelfde dag.",date:"Je data (bijv. 12-13 december)",size:"Groepsgrootte",send:"Verstuur via WhatsApp",msg:"Hoi Explore White Desert! Ik wil graag de 2-daagse Witte Woestijn safari vanuit Caïro boeken.",when:"Data",people:"personen",share:"Deel deze pagina:",price:"Stuur me de prijs en beschikbare data."},
 sv:{fab:"WhatsApp",title:"Planera din resa",sub:"Berätta dina datum - vi svarar samma dag.",date:"Dina datum (t.ex. 12-13 december)",size:"Gruppstorlek",send:"Skicka via WhatsApp",msg:"Hej Explore White Desert! Jag vill gärna boka 2-dagars safarin i Vita öknen från Kairo.",when:"Datum",people:"personer",share:"Dela den här sidan:",price:"Skicka mig priset och lediga datum."}
};
var t = T[lang] || T.en;
function openWa(text){ window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(text), "_blank", "noopener"); }

/* Floating WhatsApp button + inquiry panel */
var fab = document.createElement("button");
fab.className = "ewd-wa-fab";
fab.setAttribute("aria-label","WhatsApp");
fab.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.6 1.2 1.9 2.7 3.4 4.7 4.4 1.6.8 2.4.9 3.2.8.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3z"/></svg><span>'+t.fab+'</span>';
var panel = document.createElement("div");
panel.className = "ewd-panel";
panel.innerHTML = '<button class="ewd-close" aria-label="close">&times;</button><h3>'+t.title+'</h3><p>'+t.sub+'</p>'+
 '<label for="ewd-dates">'+t.date+'</label><input id="ewd-dates" type="text">'+
 '<label for="ewd-size">'+t.size+'</label><select id="ewd-size"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6+</option></select>'+
 '<a class="ewd-send" href="#" rel="noopener">'+t.send+'</a>';
fab.addEventListener("click", function(){ panel.classList.toggle("ewd-open"); });
panel.querySelector(".ewd-close").addEventListener("click", function(){ panel.classList.remove("ewd-open"); });
panel.querySelector(".ewd-send").addEventListener("click", function(e){
 e.preventDefault();
 var d = panel.querySelector("#ewd-dates").value.trim();
 var n = panel.querySelector("#ewd-size").value;
 var msg = t.msg + " " + t.price + (d ? " " + t.when + ": " + d + "." : "") + " " + n + " " + t.people + ".";
 openWa(msg);
});
document.body.appendChild(fab);
document.body.appendChild(panel);
/* lift the FAB/panel above the sticky mobile CTA bar when the page has one */
var sticky = document.querySelector(".sticky");
if (sticky) {
 var h = sticky.offsetHeight || 64;
 fab.style.bottom = (h + 14) + "px";
 panel.style.bottom = (h + 74) + "px";
 var langSel = document.querySelector(".ewd-lang");
}

/* Language switcher (built from hreflang alternates) */
var alts = document.querySelectorAll('link[rel="alternate"][hreflang]');
if (alts.length > 1) {
 var names = {en:"EN",de:"DE",fr:"FR",es:"ES",it:"IT",pt:"PT",ru:"RU",ja:"JA",ko:"KO"};
 var sel = document.createElement("select");
 sel.className = "ewd-lang";
 sel.setAttribute("aria-label","Language");
 alts.forEach(function(l){
   var hl = l.getAttribute("hreflang");
   if (hl === "x-default") return;
   var o = document.createElement("option");
   o.value = l.href; o.textContent = names[hl] || hl.toUpperCase();
   if (hl === lang) o.selected = true;
   sel.appendChild(o);
 });
 sel.addEventListener("change", function(){ location.href = sel.value; });
 if (sticky) sel.style.bottom = (sticky.offsetHeight || 64) + 12 + "px";
 document.body.appendChild(sel);
}

/* Share buttons after the main article/trip content */
var art = document.querySelector("article");
if (art) {
 var sh = document.createElement("p");
 sh.className = "ewd-share";
 var u = location.href;
 var ttl = document.title;
 sh.innerHTML = t.share + ' <a href="https://wa.me/?text='+encodeURIComponent(ttl+" "+u)+'" rel="noopener">WhatsApp</a>'+
  '<a href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u)+'" rel="noopener">Facebook</a>'+
  '<a href="https://twitter.com/intent/tweet?text='+encodeURIComponent(ttl)+'&url='+encodeURIComponent(u)+'" rel="noopener">X</a>'+
  '<a href="mailto:?subject='+encodeURIComponent(ttl)+'&body='+encodeURIComponent(u)+'" rel="noopener">Email</a>';
 art.appendChild(sh);
}
})();

