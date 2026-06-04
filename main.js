// ═══════════════════════════════════════════
//  MAIN.JS — Carrossel e interações do site
// ═══════════════════════════════════════════

(function() {
  'use strict';

  // ── Header scroll ──────────────────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Hamburger mobile ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // ── Carrossel ─────────────────────────────────
  let currentCat = 'nago';
  let trackOffset = 0;
  let itemWidth   = 0;
  let visibleCount = 4;
  let totalItems   = 0;
  let isAnimating  = false;

  const track    = document.getElementById('carrosselTrack');
  const viewport = document.getElementById('carrosselViewport');
  const btnPrev  = document.getElementById('carrPrev');
  const btnNext  = document.getElementById('carrNext');
  const precoCard= document.getElementById('precoCard');

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 900)  return 2;
    if (w < 1200) return 3;
    return 4;
  }

  function buildCarrossel(cat) {
    currentCat = cat;
    const imgs = IMAGENS[cat] || [];
    if (!imgs.length) return;

    visibleCount = getVisibleCount();
    // Clone para infinito: [clone_fim ... imgs ... clone_inicio]
    const clonesAtras = [...imgs].slice(-visibleCount);
    const clonesFrente= [...imgs].slice(0, visibleCount);
    const allImgs = [...clonesAtras, ...imgs, ...clonesFrente];

    track.innerHTML = '';
    allImgs.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'carr-item';
      div.innerHTML = `<img src="${src}" alt="Trança ${cat}" loading="lazy">`;
      track.appendChild(div);
    });

    totalItems = allImgs.length;
    const itemEl = track.querySelector('.carr-item');
    // Position to real start
    requestAnimationFrame(() => {
      itemWidth = itemEl ? itemEl.offsetWidth + 16 : 300;
      trackOffset = visibleCount; // índice real de início
      setTrackPos(false);
    });

    buildPrecoCard(cat);
  }

  function setTrackPos(animate = true) {
    track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = `translateX(${-trackOffset * itemWidth}px)`;
  }

  function slide(dir) {
    if (isAnimating) return;
    isAnimating = true;
    trackOffset += dir;
    setTrackPos(true);

    track.addEventListener('transitionend', function onEnd() {
      track.removeEventListener('transitionend', onEnd);
      const imgs = IMAGENS[currentCat] || [];
      const realLen = imgs.length;

      // Loop wrap
      if (trackOffset >= visibleCount + realLen) {
        trackOffset = visibleCount;
        setTrackPos(false);
      } else if (trackOffset < visibleCount) {
        trackOffset = visibleCount + realLen - 1;
        setTrackPos(false);
      }
      isAnimating = false;
    }, { once: true });
  }

  btnNext?.addEventListener('click', () => slide(1));
  btnPrev?.addEventListener('click', () => slide(-1));

  // Touch/swipe
  let touchStartX = 0;
  viewport?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slide(diff > 0 ? 1 : -1);
  });

  // Auto-slide
  let autoSlideTimer;
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => slide(1), 3500);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
  }
  viewport?.addEventListener('mouseenter', stopAutoSlide);
  viewport?.addEventListener('mouseleave', startAutoSlide);

  // ── Preço Card ──────────────────────────────────
  function buildPrecoCard(cat) {
    const data = CATALOGO[cat];
    if (!data || !precoCard) return;

    let html = `<div class="preco-header"><h3>${data.label}</h3>`;
    if (data.nota_especial) html += `<div class="preco-nota-esp">${data.nota_especial}</div>`;
    html += `</div><div class="preco-body">`;

    // Nagô / Fulani / Box / Knotless com subtipo sexo
    if (data.subtipo_sexo) {
      if (data.feminino) {
        html += `<div class="preco-grupo"><div class="preco-grupo-label">♀ Feminino</div>`;
        html += renderItens(data.feminino.itens);
        if (data.feminino.adicionais) {
          html += `<div class="preco-adicionais"><strong>Adicionais:</strong> `;
          html += data.feminino.adicionais.map(a => `${a.nome} <em>+R$ ${a.preco}</em>`).join(' · ');
          html += `</div>`;
        }
        html += `</div>`;
      }
      if (data.masculino) {
        html += `<div class="preco-grupo"><div class="preco-grupo-label">♂ Masculino</div>`;
        html += renderItens(data.masculino.itens);
        if (data.masculino.profissionais) {
          const nomes = data.masculino.profissionais.map(id => PROFISSIONAIS.find(p=>p.id===id)?.nome).join(', ');
          html += `<div class="preco-prof-note">👩‍🎨 Atende: ${nomes}</div>`;
        }
        html += `</div>`;
      }
    }
    // Boxeadora / Ghana com jumbo
    else if (data.itens_sem_jumbo) {
      html += `<div class="preco-grupo"><div class="preco-grupo-label">Sem Jumbo</div>${renderItens(data.itens_sem_jumbo)}</div>`;
      html += `<div class="preco-grupo"><div class="preco-grupo-label">Com Jumbo</div>${renderItens(data.itens_com_jumbo)}</div>`;
      if (data.adicional_cachos) html += `<div class="preco-adicionais">✦ Adicional cachos: <em>+R$ ${data.adicional_cachos}</em></div>`;
    }
    // Simples
    else if (data.itens) {
      html += renderItens(data.itens);
    }

    if (data.profissional_only) {
      const prof = PROFISSIONAIS.find(p => p.id === data.profissional_only);
      html += `<div class="preco-prof-note">👩‍🎨 Exclusivo com ${prof?.nome}</div>`;
    }

    html += `</div>`;
    html += `<a href="agendamento.html?cat=${cat}" class="btn-agendar-card">Agendar este serviço →</a>`;
    precoCard.innerHTML = html;
    precoCard.classList.add('visible');
  }

  function renderItens(itens) {
    return `<div class="preco-lista">${itens.map(it => `
      <div class="preco-item">
        <span class="preco-nome">${it.nome}</span>
        <span class="preco-duracao">${it.duracao}</span>
        <span class="preco-valor">${it.preco ? 'R$ '+it.preco : 'Consulte'}</span>
      </div>
    `).join('')}</div>`;
  }

  // ── Filtros ────────────────────────────────────
  const filtros = document.querySelectorAll('.filtro');
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      stopAutoSlide();
      buildCarrossel(btn.dataset.cat);
      startAutoSlide();
    });
  });

  // ── Init ───────────────────────────────────────
  window.addEventListener('resize', () => {
    buildCarrossel(currentCat);
  });

  buildCarrossel('nago');
  startAutoSlide();

  // ── Filtros scroll horizontal (arrastar) ───────
  const filtrosEl = document.getElementById('filtros');
  let isDragging = false, startX, scrollLeft;
  filtrosEl?.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - filtrosEl.offsetLeft;
    scrollLeft = filtrosEl.scrollLeft;
  });
  filtrosEl?.addEventListener('mouseleave', () => isDragging = false);
  filtrosEl?.addEventListener('mouseup', () => isDragging = false);
  filtrosEl?.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - filtrosEl.offsetLeft;
    filtrosEl.scrollLeft = scrollLeft - (x - startX);
  });

})();
