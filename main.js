
document.addEventListener('DOMContentLoaded',function(){
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile nav */
  var t=document.querySelector('.nav-toggle'),m=document.querySelector('nav ul');
  if(t){t.addEventListener('click',function(){m.classList.toggle('open');});}

  /* header shadow on scroll */
  var hd=document.querySelector('header');
  var onScroll=function(){if(hd){hd.classList.toggle('scrolled',window.scrollY>10);}
    if(topBtn){topBtn.classList.toggle('show',window.scrollY>600);}};

  /* back-to-top */
  var topBtn=document.createElement('button');
  topBtn.className='to-top';topBtn.innerHTML='↑';topBtn.setAttribute('aria-label','Back to top');
  topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});});
  document.body.appendChild(topBtn);
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* quote form -> whatsapp */
  var f=document.getElementById('quote-form');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(n){var el=f.querySelector('[name='+n+']');return el?el.value:'';};
    var msg='Hello Motion Woods! I would like a quote.%0A'+
      'Name: '+encodeURIComponent(g('name'))+'%0A'+
      'Phone: '+encodeURIComponent(g('phone'))+'%0A'+
      'Project Type: '+encodeURIComponent(g('ptype'))+'%0A'+
      'Details: '+encodeURIComponent(g('details'));
    window.open('https://wa.me/919860785024?text='+msg,'_blank');
  });}

  /* scroll-reveal with stagger */
  if(!reduced && 'IntersectionObserver' in window){
    var sel='.section-head,.card,.quote,.stats .grid>div,.grid2>div,.prose>h2,.prose>p,.prose>ul,.prose>ol,.prose>table,.prose>blockquote,.prose>details,.post-card,.info-item';
    var els=Array.prototype.slice.call(document.querySelectorAll(sel));
    els.forEach(function(el){
      el.classList.add('reveal');
      var sibs=Array.prototype.filter.call(el.parentNode.children,function(c){return c.classList&&c.classList.contains('reveal');});
      var i=sibs.indexOf(el);
      el.style.transitionDelay=Math.min(i*90,450)+'ms';
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  }

  /* animated counters (stats band + project stats) */
  var fmt=function(n){return n.toLocaleString('en-IN');};
  var animateCount=function(el){
    var raw=el.textContent.trim();
    var mch=raw.match(/^([^\d]*)([\d,]+)(.*)$/);
    if(!mch)return;
    var target=parseInt(mch[2].replace(/,/g,''),10);
    if(isNaN(target)||target<2)return;
    var pre=mch[1],suf=mch[3],dur=1400,start=null;
    var step=function(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      el.textContent=pre+fmt(Math.round(target*eased))+suf;
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if(!reduced && 'IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){animateCount(en.target);cio.unobserve(en.target);}
      });
    },{threshold:0.6});
    document.querySelectorAll('.stats b,.proj .stats-row b').forEach(function(el){cio.observe(el);});
  }

  /* smooth accordion open/close */
  document.querySelectorAll('details').forEach(function(d){
    var s=d.querySelector('summary');if(!s)return;
    var body=document.createElement('div');body.className='acc-body';
    while(s.nextSibling){body.appendChild(s.nextSibling);}
    d.appendChild(body);
    s.addEventListener('click',function(e){
      if(reduced)return; /* native behaviour */
      e.preventDefault();
      if(d.open){
        var h=body.offsetHeight;
        body.style.height=h+'px';body.offsetHeight;
        body.style.transition='height .3s ease';body.style.height='0px';
        setTimeout(function(){d.open=false;body.style.cssText='';},300);
      }else{
        d.open=true;
        var h2=body.offsetHeight;
        body.style.height='0px';body.offsetHeight;
        body.style.transition='height .3s ease';body.style.height=h2+'px';
        setTimeout(function(){body.style.cssText='';},320);
      }
    });
  });

  /* auto table-of-contents on blog articles */
  if(location.pathname.indexOf('/blog/')===0 && !/\/blog\/?$/.test(location.pathname)){
    var prose=document.querySelector('.prose');
    var hs=prose?prose.querySelectorAll('h2'):[];
    if(hs.length>=3){
      var toc=document.createElement('nav');toc.className='toc';
      var html='<b>On this page</b>';
      hs.forEach(function(h,i){
        var id='sec-'+(i+1);h.id=id;
        html+='<a href="#'+id+'">'+h.textContent+'</a>';
      });
      toc.innerHTML=html;
      prose.insertBefore(toc,prose.firstElementChild.nextSibling);
    }
  }
});
