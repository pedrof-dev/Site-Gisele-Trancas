// ═══════════════════════════════════════════
//  AGENDAR.JS — Lógica completa do agendamento
// ═══════════════════════════════════════════

(function () {
  'use strict';

  // ── Estado global ──────────────────────────
  const state = {
    telaAtual: 1,
    totalTelas: 8,
    // Tela 1
    nome: '', nascimento: '', telefone: '',
    // Tela 2
    categoria: null, sexo: null, item: null, variante: null,
    adicionais: [], precoBase: 0, precoTotal: 0, duracao: '',
    // Tela 3
    fotoCabelo: null, fotoRef: null,
    // Tela 4
    cor: null, tamanho: null,
    // Tela 5
    profissional: null,
    // Tela 6
    data: null, horario: null,
    // Calendário
    calMes: new Date().getMonth(),
    calAno: new Date().getFullYear(),
  };

  // ── Agendamentos salvos (localStorage) ────
  function getAgendamentos() {
    try { return JSON.parse(localStorage.getItem('agendamentos') || '[]'); }
    catch { return []; }
  }
  function salvarAgendamento(ag) {
    const lista = getAgendamentos();
    lista.push(ag);
    localStorage.setItem('agendamentos', JSON.stringify(lista));
  }

  // ── URL param ─────────────────────────────
  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  // ── Navegação entre telas ─────────────────
  window.irParaTela = function (n) {
    // Validações
    if (n > state.telaAtual) {
      const err = validarTela(state.telaAtual);
      if (err) { mostrarErro(err); return; }
    }
    limparErro();
    const telaAtual = document.getElementById('tela' + state.telaAtual);
    const telaProx  = document.getElementById('tela' + n);
    if (!telaAtual || !telaProx) return;
    telaAtual.classList.remove('ativa');
    telaProx.classList.add('ativa');
    state.telaAtual = n;
    atualizarProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hooks de entrada
    if (n === 2) renderServicos();
    if (n === 4) { if (devePularCorTam()) { irParaTela(5); return; } }
    if (n === 5) renderProfissionais();
    if (n === 6) renderCalendario();
    if (n === 7) renderResumoFinal();
  };

  function validarTela(n) {
    if (n === 1) {
      if (!document.getElementById('nomeCliente').value.trim()) return 'Informe seu nome completo.';
      if (!document.getElementById('nascimento').value.trim()) return 'Informe sua data de nascimento.';
      const tel = document.getElementById('telefone').value.trim();
      if (tel.replace(/\D/g,'').length < 10) return 'Informe um telefone válido.';
      state.nome       = document.getElementById('nomeCliente').value.trim();
      state.nascimento = document.getElementById('nascimento').value.trim();
      state.telefone   = document.getElementById('telefone').value.trim();
    }
    if (n === 2) {
      if (!state.item) return 'Selecione o serviço desejado.';
    }
    if (n === 3) {
      if (!state.fotoRef) return 'Envie pelo menos a foto de referência (obrigatória).';
    }
    if (n === 5) {
      if (!state.profissional) return 'Selecione a profissional.';
    }
    if (n === 6) {
      if (!state.data || !state.horario) return 'Selecione data e horário.';
    }
    return null;
  }

  function atualizarProgress() {
    const total = state.totalTelas;
    const pct   = ((state.telaAtual - 1) / (total - 1)) * 100;
    document.getElementById('progressBar').style.width = pct + '%';

    const ind = document.getElementById('stepsIndicator');
    ind.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const d = document.createElement('div');
      d.className = 'step-dot' + (i === state.telaAtual ? ' ativo' : i < state.telaAtual ? ' done' : '');
      ind.appendChild(d);
    }
  }

  function mostrarErro(msg) {
    let el = document.getElementById('erroMsg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'erroMsg';
      el.style.cssText = 'background:#fff0f0;border:1px solid #f5c2c7;border-radius:12px;padding:12px 18px;font-size:14px;font-weight:600;color:#c0392b;margin-bottom:16px;';
      const tela = document.getElementById('tela' + state.telaAtual);
      tela.insertBefore(el, tela.querySelector('.tela-actions'));
    }
    el.textContent = '⚠️ ' + msg;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function limparErro() {
    document.getElementById('erroMsg')?.remove();
  }

  // ── TELA 1: Máscaras ──────────────────────
  document.getElementById('nascimento')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4) v = v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4);
    else if (v.length > 2) v = v.slice(0,2)+'/'+v.slice(2);
    this.value = v;
  });
  document.getElementById('telefone')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
    else if (v.length > 2) v = '('+v.slice(0,2)+') '+v.slice(2);
    this.value = v;
  });

  // ── TELA 2: Serviços ──────────────────────
  function renderServicos() {
    const wrap = document.getElementById('servicoCategorias');
    wrap.innerHTML = '';
    const cats = Object.keys(CATALOGO);
    cats.forEach(key => {
      const d = CATALOGO[key];
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (state.categoria === key ? ' selecionado' : '');
      let nota = '';
      if (key === 'cristal') nota = '<span class="cat-nota">48h antec.</span>';
      btn.innerHTML = d.label + nota;
      btn.onclick = () => selecionarCategoria(key);
      wrap.appendChild(btn);
    });
    if (state.categoria) renderSubSelecao(state.categoria);

    // Pré-selecionar da URL
    const catUrl = getParam('cat');
    if (catUrl && !state.categoria) selecionarCategoria(catUrl);
  }

  function selecionarCategoria(key) {
    state.categoria = key;
    state.sexo = null; state.item = null; state.variante = null;
    state.adicionais = []; state.precoBase = 0; state.precoTotal = 0;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('selecionado', b.textContent.trim().startsWith(CATALOGO[key].label)));
    document.getElementById('servicoResumo').style.display = 'none';
    document.getElementById('adicionaisWrap').style.display = 'none';
    document.getElementById('btnProxServico').disabled = true;
    renderSubSelecao(key);
  }

  function renderSubSelecao(key) {
    const wrap = document.getElementById('subSelecao');
    wrap.innerHTML = '';
    const d = CATALOGO[key];
    if (!d) return;

    // Nagô feminino: lateral/topo/frontal sem subitem de sexo
    // Serviços com sexo
    if (d.subtipo_sexo) {
      const div = document.createElement('div');
      div.innerHTML = `<div class="sub-label">Qual público?</div><div class="sub-opts" id="sexoOpts">
        <button class="sub-opt${state.sexo==='feminino'?' sel':''}" onclick="selecionarSexo('feminino')">♀ Feminino</button>
        <button class="sub-opt${state.sexo==='masculino'?' sel':''}" onclick="selecionarSexo('masculino')">♂ Masculino</button>
      </div>`;
      wrap.appendChild(div);
      if (state.sexo) renderItensServico(key, state.sexo);
      return;
    }

    // Boxeadora / Ghana: jumbo
    if (d.itens_sem_jumbo) {
      const div = document.createElement('div');
      div.innerHTML = `<div class="sub-label">Com ou sem Jumbo?</div><div class="sub-opts" id="jumboOpts">
        <button class="sub-opt${state.variante==='sem'?' sel':''}" onclick="selecionarJumbo('sem')">Sem Jumbo</button>
        <button class="sub-opt${state.variante==='com'?' sel':''}" onclick="selecionarJumbo('com')">Com Jumbo</button>
      </div>`;
      wrap.appendChild(div);
      if (state.variante) renderItensServico(key, state.variante);
      return;
    }

    // Simples
    if (d.itens) renderItensServico(key, null);
  }

  window.selecionarSexo = function (sexo) {
    state.sexo = sexo; state.item = null;
    document.querySelectorAll('#sexoOpts .sub-opt').forEach(b => b.classList.toggle('sel', b.textContent.trim().toLowerCase().includes(sexo)));
    renderItensServico(state.categoria, sexo);
  };

  window.selecionarJumbo = function (v) {
    state.variante = v; state.item = null;
    document.querySelectorAll('#jumboOpts .sub-opt').forEach(b => b.classList.toggle('sel', (v==='sem'&&b.textContent.includes('Sem'))||(v==='com'&&b.textContent.includes('Com'))));
    renderItensServico(state.categoria, v);
  };

  function renderItensServico(key, sub) {
    const d = CATALOGO[key];
    let itens = [];
    if (d.subtipo_sexo) itens = sub === 'feminino' ? d.feminino.itens : d.masculino?.itens || [];
    else if (d.itens_sem_jumbo) itens = sub === 'sem' ? d.itens_sem_jumbo : d.itens_com_jumbo;
    else itens = d.itens || [];

    // Remove lista anterior
    document.getElementById('subSelecao').querySelectorAll('.itens-wrap').forEach(e=>e.remove());

    const wrap = document.createElement('div');
    wrap.className = 'itens-wrap';
    wrap.style.marginTop = '16px';
    const lista = document.createElement('div');
    lista.className = 'itens-lista';

    itens.forEach(it => {
      const div = document.createElement('div');
      div.className = 'item-opt' + (state.item && state.item.nome === it.nome ? ' sel' : '');
      div.innerHTML = `<span class="item-nome">${it.nome}</span><span class="item-dur">${it.duracao}</span><span class="item-preco">${it.preco ? 'R$ '+it.preco : 'Consulte'}</span>`;
      div.onclick = () => selecionarItem(it, key, sub);
      lista.appendChild(div);
    });
    wrap.appendChild(lista);
    document.getElementById('subSelecao').appendChild(wrap);
  }

  function selecionarItem(it, key, sub) {
    state.item = it;
    state.precoBase = it.preco || 0;
    state.adicionais = [];
    document.querySelectorAll('.item-opt').forEach(b => b.classList.toggle('sel', b.querySelector('.item-nome').textContent === it.nome));

    // Adicionais nagô feminino
    const d = CATALOGO[key];
    const adWrap = document.getElementById('adicionaisWrap');
    const adLista = document.getElementById('adicionaisLista');
    if (key === 'nago' && sub === 'feminino' && d.feminino?.adicionais) {
      adWrap.style.display = 'block';
      adLista.innerHTML = '';
      d.feminino.adicionais.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'adic-opt';
        btn.innerHTML = `${a.nome} <span class="adic-preco">+R$${a.preco}</span>`;
        btn.onclick = () => toggleAdicional(a, btn);
        adLista.appendChild(btn);
      });
    } else {
      adWrap.style.display = 'none';
    }

    // Adicional de cachos boxeadora/ghana
    if ((key === 'boxeadora' || key === 'ghana') && d.adicional_cachos) {
      adWrap.style.display = 'block';
      adLista.innerHTML = '';
      const btn = document.createElement('button');
      const valor = d.adicional_cachos;
      btn.className = 'adic-opt';
      btn.innerHTML = `Adicionar Cachos <span class="adic-preco">+R$${valor}</span>`;
      btn.onclick = () => toggleAdicional({ nome: 'Cachos', preco: valor }, btn);
      adLista.appendChild(btn);
    }

    calcularTotal();
    atualizarResumoServico();
    document.getElementById('btnProxServico').disabled = false;
  }

  function toggleAdicional(a, btn) {
    const idx = state.adicionais.findIndex(x => x.nome === a.nome);
    if (idx >= 0) { state.adicionais.splice(idx, 1); btn.classList.remove('sel'); }
    else          { state.adicionais.push(a); btn.classList.add('sel'); }
    calcularTotal();
    atualizarResumoServico();
  }

  function calcularTotal() {
    state.precoTotal = state.precoBase + state.adicionais.reduce((s,a)=>s+a.preco,0);
    state.duracao = state.item?.duracao || '';
  }

  function atualizarResumoServico() {
    const el = document.getElementById('servicoResumo');
    if (!state.item) { el.style.display='none'; return; }
    let txt = `${CATALOGO[state.categoria].label} — ${state.item.nome}`;
    if (state.adicionais.length) txt += ` + ${state.adicionais.map(a=>a.nome).join(', ')}`;
    txt += ` &nbsp;|&nbsp; <strong>R$ ${state.precoTotal || 'Consulte'}</strong>`;
    if (state.duracao) txt += ` &nbsp;·&nbsp; ${state.duracao}`;
    el.innerHTML = txt; el.style.display = 'block';
  }

  window.avancarDeServico = function () { irParaTela(3); };

  // ── TELA 3: Fotos ─────────────────────────
  ['Cabelo','Ref'].forEach(tipo => {
    const input = document.getElementById('input'+tipo);
    const drop  = document.getElementById('drop'+tipo);
    const prev  = document.getElementById('prev'+tipo);
    input?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        prev.src = ev.target.result;
        prev.classList.add('visible');
        drop.classList.add('tem-foto');
        if (tipo === 'Cabelo') state.fotoCabelo = ev.target.result;
        else                   state.fotoRef    = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    // Drag
    drop?.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor='var(--roxo)'; });
    drop?.addEventListener('dragleave', () => { drop.style.borderColor=''; });
    drop?.addEventListener('drop', e => {
      e.preventDefault(); drop.style.borderColor='';
      const file = e.dataTransfer.files[0];
      if (file) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
    });
  });

  window.pularFoto = function () {
    if (!state.fotoRef) { mostrarErro('A foto de referência é obrigatória. Você pode pular apenas a foto do cabelo atual.'); return; }
    limparErro();
    const tela = devePularCorTam() ? 5 : 4;
    irParaTela(tela);
  };

  window.avancarDeFoto = function () {
    if (!state.fotoRef) { mostrarErro('Envie a foto de referência (obrigatória).'); return; }
    limparErro();
    irParaTela(devePularCorTam() ? 5 : 4);
  };

  function devePularCorTam() {
    return state.categoria && SEM_COR_TAMANHO.includes(state.categoria);
  }

  // ── TELA 4: Cor / Tamanho ─────────────────
  window.selecionarCor = function (el) {
    document.querySelectorAll('.cor-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    state.cor = el.dataset.cor;
    const inp = document.getElementById('corPersonalizada');
    inp.style.display = (state.cor === 'Outra') ? 'block' : 'none';
    if (state.cor !== 'Outra') inp.value = '';
    checarCorTam();
  };

  window.selecionarTam = function (el) {
    document.querySelectorAll('.tam-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    state.tamanho = el.dataset.tam;
    checarCorTam();
  };

  function checarCorTam() {
    const ok = state.cor && state.tamanho && (state.cor !== 'Outra' || document.getElementById('corPersonalizada').value.trim());
    document.getElementById('btnProxCorTam').disabled = !ok;
  }

  document.getElementById('corPersonalizada')?.addEventListener('input', checarCorTam);

  window.avancarDeCorTam = function () {
    if (state.cor === 'Outra') {
      const v = document.getElementById('corPersonalizada').value.trim();
      if (!v) { mostrarErro('Descreva a cor desejada.'); return; }
      state.cor = v;
    }
    irParaTela(5);
  };

  // ── TELA 5: Profissional ──────────────────
  function renderProfissionais() {
    const wrap = document.getElementById('profSelecao');
    wrap.innerHTML = '';
    const catData = CATALOGO[state.categoria];
    const disponiveis = PROFISSIONAIS.filter(p => {
      if (catData?.profissional_only && p.id !== catData.profissional_only) return false;
      if (!p.especialidades.includes(state.categoria)) return false;
      if (state.sexo === 'masculino' && p.feminino_only) return false;
      return true;
    });

    if (disponiveis.length === 0) {
      wrap.innerHTML = '<p style="color:var(--texto-cl);font-size:15px">Nenhuma profissional disponível para este serviço. Entre em contato pelo WhatsApp.</p>';
      return;
    }

    disponiveis.forEach(p => {
      const div = document.createElement('div');
      div.className = 'prof-item' + (state.profissional?.id === p.id ? ' sel' : '');
      const dias = Object.entries(p.horarios).filter(([,v])=>v).map(([d])=>DIAS_LABEL[DIAS_SEMANA.indexOf(d)].slice(0,3)).join(', ');
      div.innerHTML = `
        <div class="prof-avatar">${p.avatar}</div>
        <div class="prof-info">
          <strong>${p.nome}</strong>
          <small>${dias}</small>
        </div>
        <div class="prof-check">${state.profissional?.id === p.id ? '✓' : ''}</div>`;
      div.onclick = () => selecionarProf(p.id);
      wrap.appendChild(div);
    });
  }

  function selecionarProf(id) {
    state.profissional = PROFISSIONAIS.find(p => p.id === id);
    document.querySelectorAll('.prof-item').forEach(el => {
      const nome = el.querySelector('strong').textContent;
      const sel  = state.profissional.nome === nome;
      el.classList.toggle('sel', sel);
      el.querySelector('.prof-check').textContent = sel ? '✓' : '';
    });
    document.getElementById('btnProxProf').disabled = false;
  }

  window.avancarDeProf = function () { irParaTela(6); };
  window.voltarDeProfissional = function () { irParaTela(devePularCorTam() ? 3 : 4); };

  // ── TELA 6: Calendário ────────────────────
  function renderCalendario() {
    const wrap = document.getElementById('calendario');
    const { calMes, calAno } = state;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const nomesMes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const primeiroDia = new Date(calAno, calMes, 1).getDay();
    const diasNoMes   = new Date(calAno, calMes+1, 0).getDate();
    const prof = state.profissional;

    wrap.innerHTML = `
      <div class="cal-header">
        <button class="cal-nav" onclick="calNavegar(-1)">‹</button>
        <span class="cal-mes">${nomesMes[calMes]} ${calAno}</span>
        <button class="cal-nav" onclick="calNavegar(1)">›</button>
      </div>
      <div class="cal-grid">
        ${['D','S','T','Q','Q','S','S'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
        ${Array(primeiroDia).fill('<div></div>').join('')}
        ${Array.from({length:diasNoMes},(_,i)=>{
          const dia = i+1;
          const data = new Date(calAno, calMes, dia);
          data.setHours(0,0,0,0);
          const diaSemana = DIAS_SEMANA[data.getDay()];
          const horProf   = prof?.horarios[diaSemana];
          const passado   = data < hoje;
          const semHorario= !horProf;
          const eSelecionado = state.data && state.data.toDateString() === data.toDateString();
          const disabled  = passado || semHorario;
          return `<button class="cal-day${eSelecionado?' sel':''}${data.toDateString()===hoje.toDateString()?' hoje':''}" 
            ${disabled?'disabled':''} onclick="selecionarDia(${dia})">${dia}</button>`;
        }).join('')}
      </div>`;
  }

  window.calNavegar = function (dir) {
    state.calMes += dir;
    if (state.calMes > 11) { state.calMes = 0; state.calAno++; }
    if (state.calMes < 0)  { state.calMes = 11; state.calAno--; }
    renderCalendario();
  };

  window.selecionarDia = function (dia) {
    state.data    = new Date(state.calAno, state.calMes, dia);
    state.horario = null;
    document.getElementById('btnProxAgenda').disabled = true;
    renderCalendario();
    renderHorarios();
  };

  function renderHorarios() {
    const prof = state.profissional;
    const data = state.data;
    if (!prof || !data) return;
    const diaSemana = DIAS_SEMANA[data.getDay()];
    const horProf   = prof.horarios[diaSemana];
    const titulo = document.getElementById('horariosTitulo');
    const grid   = document.getElementById('horariosGrid');

    if (!horProf) { titulo.textContent = 'Sem horários neste dia'; grid.innerHTML=''; return; }
    titulo.textContent = `Horários disponíveis — ${data.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}`;

    const dur = duracaoEmMinutos(state.item?.duracao || '60min');
    const agendamentos = getAgendamentos();

    const slots = gerarSlots(horProf.inicio, horProf.fim, dur);
    grid.innerHTML = '';
    slots.forEach(hora => {
      const ocupado = agendamentos.some(ag =>
        ag.profissionalId === prof.id &&
        ag.data === data.toISOString().split('T')[0] &&
        ag.horario === hora &&
        ag.status !== 'cancelado'
      );
      const btn = document.createElement('button');
      btn.className = 'hora-btn' + (state.horario === hora ? ' sel' : '');
      btn.textContent = hora;
      btn.disabled = ocupado;
      if (ocupado) btn.title = 'Horário ocupado';
      btn.onclick = () => {
        state.horario = hora;
        document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');
        document.getElementById('btnProxAgenda').disabled = false;
      };
      grid.appendChild(btn);
    });
  }

  function gerarSlots(inicio, fim, durMin) {
    const slots = [];
    let [h,m] = inicio.split(':').map(Number);
    const [fh,fm] = fim.split(':').map(Number);
    const fimTotal = fh*60+fm;
    while (h*60+m+durMin <= fimTotal) {
      slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
      m += durMin;
      if (m >= 60) { h += Math.floor(m/60); m = m%60; }
    }
    return slots;
  }

  function duracaoEmMinutos(str) {
    if (!str || str === 'Consulte') return 60;
    let min = 0;
    const hM = str.match(/(\d+)h/);  if (hM) min += parseInt(hM[1])*60;
    const mM = str.match(/(\d+)min/);if (mM) min += parseInt(mM[1]);
    return min || 60;
  }

  window.avancarDeAgenda = function () { irParaTela(7); };

  // ── TELA 7: Resumo ────────────────────────
  function renderResumoFinal() {
    const el = document.getElementById('resumoFinal');
    const d  = state.data;
    const dataFmt = d ? d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}) : '';
    const catLabel = CATALOGO[state.categoria]?.label || '';
    const itemNome = state.item?.nome || '';
    const adicStr  = state.adicionais.length ? state.adicionais.map(a=>a.nome+' +R$'+a.preco).join(', ') : '—';
    const corStr   = state.cor    || '—';
    const tamStr   = state.tamanho|| '—';

    const rows = [
      ['Nome',           state.nome],
      ['Telefone',       state.telefone],
      ['Serviço',        `${catLabel} — ${itemNome}`],
      ['Adicionais',     adicStr],
      state.cor    ? ['Cor',          corStr]  : null,
      state.tamanho? ['Tamanho',      tamStr]  : null,
      ['Profissional',   state.profissional?.nome],
      ['Data',           dataFmt],
      ['Horário',        state.horario],
    ].filter(Boolean);

    el.innerHTML = `
      <div class="resumo-lista">
        ${rows.map(([k,v])=>`<div class="resumo-row"><span class="resumo-key">${k}</span><span class="resumo-val">${v}</span></div>`).join('')}
      </div>
      <div class="resumo-total">
        <span>Total estimado</span>
        <strong>${state.precoTotal ? 'R$ '+state.precoTotal : 'A confirmar'}</strong>
      </div>`;

    // Aceite
    const aceite = document.getElementById('aceiteTermos');
    const btnConf = document.getElementById('btnConfirmar');
    aceite.checked = false;
    btnConf.disabled = true;
    aceite.onchange = () => { btnConf.disabled = !aceite.checked; };
  }

  window.confirmarAgendamento = function () {
    const ag = {
      id:              Date.now().toString(),
      status:          'analise',
      criadoEm:        new Date().toISOString(),
      nome:            state.nome,
      nascimento:      state.nascimento,
      telefone:        state.telefone,
      categoria:       state.categoria,
      item:            state.item?.nome,
      adicionais:      state.adicionais.map(a=>a.nome),
      cor:             state.cor,
      tamanho:         state.tamanho,
      profissionalId:  state.profissional?.id,
      profissionalNome:state.profissional?.nome,
      data:            state.data?.toISOString().split('T')[0],
      horario:         state.horario,
      precoTotal:      state.precoTotal,
      duracao:         state.item?.duracao,
      fotoCabelo:      state.fotoCabelo,
      fotoRef:         state.fotoRef,
    };
    salvarAgendamento(ag);

    // Preenche tela 8
    const info = document.getElementById('analiseInfo');
    const catLabel = CATALOGO[state.categoria]?.label || '';
    const d = state.data;
    const dataFmt = d ? d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}) : '';
    info.innerHTML = `<strong>${catLabel} — ${state.item?.nome}</strong><br>${dataFmt} às ${state.horario}<br>Com ${state.profissional?.nome}<br>📱 ${state.telefone}`;

    // Link WhatsApp
    const msg = encodeURIComponent(
      `Olá Gisele! Acabei de solicitar um agendamento pelo site.\n\n` +
      `*Nome:* ${state.nome}\n*Serviço:* ${catLabel} — ${state.item?.nome}\n` +
      `*Data:* ${dataFmt} às ${state.horario}\n*Profissional:* ${state.profissional?.nome}\n` +
      (state.precoTotal ? `*Valor:* R$ ${state.precoTotal}\n` : '') +
      `\nAguardo a confirmação! 💜`
    );
    document.getElementById('btnWppFinal').href = `https://wa.me/${STUDIO.whatsapp}?text=${msg}`;

    irParaTela(8);
  };

  // ── INIT ─────────────────────────────────
  atualizarProgress();

})();
