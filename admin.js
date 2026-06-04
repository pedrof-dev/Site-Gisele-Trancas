// ═══════════════════════════════════════════
//  ADMIN.JS
// ═══════════════════════════════════════════

const SENHA_ADMIN = 'gisele2025'; // ← TROCAR

// ── Auth ──────────────────────────────────
window.fazerLogin = function () {
  const s = document.getElementById('loginSenha').value;
  if (s === SENHA_ADMIN) {
    localStorage.setItem('adminAuth', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display   = 'flex';
    initAdmin();
  } else {
    document.getElementById('loginErro').style.display = 'block';
  }
};

window.sair = function () {
  localStorage.removeItem('adminAuth');
  location.reload();
};

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('adminAuth') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display   = 'flex';
    initAdmin();
  }
});

// ── Storage helpers ────────────────────────
function getAgendamentos()  { try{return JSON.parse(localStorage.getItem('agendamentos')||'[]');}catch{return[];} }
function setAgendamentos(a) { localStorage.setItem('agendamentos', JSON.stringify(a)); }
function getEstoque()       { try{return JSON.parse(localStorage.getItem('estoque')||'[]');}catch{return[];} }
function setEstoque(e)      { localStorage.setItem('estoque', JSON.stringify(e)); }

// ── Init ──────────────────────────────────
function initAdmin() {
  document.getElementById('dataHoje').textContent = new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  mudarAba('dashboard', document.querySelector('[data-aba="dashboard"]'));
}

// ── Abas ──────────────────────────────────
window.mudarAba = function (aba, el) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('ativo'));
  document.getElementById('aba-'+aba)?.classList.add('ativa');
  el?.classList.add('ativo');
  ({
    dashboard:    renderDashboard,
    agendamentos: renderAgendamentos,
    profissionais:renderProfissionaisAdmin,
    clientes:     renderClientes,
    faturamento:  renderFaturamento,
    estoque:      renderEstoque,
  }[aba] || (()=>{}))();
  return false;
};

// ── DASHBOARD ─────────────────────────────
function renderDashboard() {
  const ags    = getAgendamentos();
  const hoje   = new Date().toISOString().split('T')[0];
  const analise     = ags.filter(a => a.status === 'analise');
  const confirmados = ags.filter(a => a.status === 'confirmado');
  const hoje_c      = ags.filter(a => a.data === hoje && a.status !== 'cancelado');
  const mes_rec     = ags.filter(a => a.status === 'concluido' && a.data?.startsWith(new Date().toISOString().slice(0,7)));
  const fat_mes     = mes_rec.reduce((s,a) => s+(a.precoTotal||0), 0);

  document.getElementById('kpis').innerHTML = `
    <div class="kpi-card"><div class="kpi-label">Hoje</div><div class="kpi-val">${hoje_c.length}</div><div class="kpi-sub">atendimentos</div></div>
    <div class="kpi-card"><div class="kpi-label">Em análise</div><div class="kpi-val" style="color:var(--amarelo)">${analise.length}</div><div class="kpi-sub">aguardando confirmação</div></div>
    <div class="kpi-card verde"><div class="kpi-label">Confirmados</div><div class="kpi-val">${confirmados.length}</div><div class="kpi-sub">próximos</div></div>
    <div class="kpi-card roxo"><div class="kpi-label">Receita do mês</div><div class="kpi-val">R$${fat_mes}</div><div class="kpi-sub">${mes_rec.length} concluídos</div></div>`;

  const liA = document.getElementById('listaAnalise');
  liA.innerHTML = analise.length ? analise.slice(0,5).map(a => agMiniHtml(a)).join('') : '<div class="ag-vazio">Nenhum em análise ✓</div>';

  const prox = confirmados.filter(a => a.data >= hoje).sort((a,b)=>a.data.localeCompare(b.data)).slice(0,5);
  const liP  = document.getElementById('listaProximos');
  liP.innerHTML = prox.length ? prox.map(a => agMiniHtml(a)).join('') : '<div class="ag-vazio">Sem próximos agendamentos</div>';
}

function agMiniHtml(a) {
  const dataFmt = a.data ? new Date(a.data+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}) : '—';
  return `<div class="ag-mini" onclick="abrirModalAg('${a.id}')">
    <div class="ag-mini-nome">${a.nome}</div>
    <div class="ag-mini-det">${CATALOGO[a.categoria]?.label||a.categoria} — ${a.item} · ${dataFmt} ${a.horario||''} · ${a.profissionalNome||''}</div>
  </div>`;
}

// ── AGENDAMENTOS ──────────────────────────
let filtroAtual = 'todos';
window.filtrarStatus = function (s, el) {
  filtroAtual = s;
  document.querySelectorAll('.fs-btn').forEach(b => b.classList.toggle('ativo', b.dataset.s === s));
  renderAgendamentos();
};

function renderAgendamentos() {
  let ags = getAgendamentos();
  if (filtroAtual !== 'todos') ags = ags.filter(a => a.status === filtroAtual);
  ags = ags.sort((a,b) => (b.criadoEm||'').localeCompare(a.criadoEm||''));

  const wrap = document.getElementById('tabelaAgendamentos');
  if (!ags.length) { wrap.innerHTML = '<p style="padding:24px;color:var(--texto-cl)">Nenhum agendamento encontrado.</p>'; return; }

  wrap.innerHTML = `<table>
    <thead><tr>
      <th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Data/Hora</th><th>Valor</th><th>Status</th><th>Ações</th>
    </tr></thead>
    <tbody>
      ${ags.map(a => {
        const dataFmt = a.data ? new Date(a.data+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
        return `<tr>
          <td><strong>${a.nome}</strong><br><small style="color:var(--texto-cl)">${a.telefone||''}</small></td>
          <td>${CATALOGO[a.categoria]?.label||a.categoria||'—'}<br><small style="color:var(--texto-cl)">${a.item||''}</small></td>
          <td>${a.profissionalNome||'—'}</td>
          <td>${dataFmt} ${a.horario||''}</td>
          <td><strong style="color:var(--roxo)">${a.precoTotal?'R$'+a.precoTotal:'—'}</strong></td>
          <td><span class="badge ${a.status}">${{ analise:'Em análise', confirmado:'Confirmado', cancelado:'Cancelado', concluido:'Concluído' }[a.status]||a.status}</span></td>
          <td>
            <div class="acoes-cell">
              <button class="btn-sm btn-ver-sm" onclick="abrirModalAg('${a.id}')">Ver</button>
              ${a.status==='analise'?`<button class="btn-sm btn-confirmar-sm" onclick="mudarStatus('${a.id}','confirmado')">Confirmar</button>`:''}
              ${['analise','confirmado'].includes(a.status)?`<button class="btn-sm btn-cancelar-sm" onclick="mudarStatus('${a.id}','cancelado')">Cancelar</button>`:''}
              ${a.status==='confirmado'?`<button class="btn-sm btn-reagendar-sm" onclick="abrirReagendar('${a.id}')">Reagendar</button>`:''}
              ${a.status==='confirmado'?`<button class="btn-sm" style="background:var(--lilas);color:var(--roxo)" onclick="mudarStatus('${a.id}','concluido')">Concluir</button>`:''}
            </div>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

window.mudarStatus = function (id, novoStatus) {
  const ags = getAgendamentos();
  const ag  = ags.find(a => a.id === id);
  if (!ag) return;
  if (!confirm(`Confirmar: mudar status de "${ag.nome}" para "${novoStatus}"?`)) return;
  ag.status = novoStatus;
  setAgendamentos(ags);

  // Notificação WhatsApp
  if (novoStatus === 'confirmado') {
    const dataFmt = ag.data ? new Date(ag.data+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}) : '';
    const msg = encodeURIComponent(
      `Olá ${ag.nome}! 💜\n\n` +
      `Seu agendamento foi *confirmado*!\n\n` +
      `✦ *Serviço:* ${CATALOGO[ag.categoria]?.label||ag.categoria} — ${ag.item}\n` +
      `✦ *Data:* ${dataFmt} às ${ag.horario}\n` +
      `✦ *Profissional:* ${ag.profissionalNome}\n` +
      (ag.precoTotal ? `✦ *Valor:* R$ ${ag.precoTotal}\n` : '') +
      `\nLembre-se: cancelamentos com até 24h de antecedência.\n` +
      `Estúdio Gisele Souza Cardoso 💇‍♀️`
    );
    const tel = ag.telefone?.replace(/\D/g,'');
    if (tel) {
      const wppLink = `https://wa.me/55${tel}?text=${msg}`;
      if (confirm('Abrir WhatsApp para notificar o cliente?')) window.open(wppLink,'_blank');
    }
  }

  renderAgendamentos();
  renderDashboard();
  fecharModal();
};

// Modal agendamento
window.abrirModalAg = function (id) {
  const ag = getAgendamentos().find(a => a.id === id);
  if (!ag) return;
  const dataFmt = ag.data ? new Date(ag.data+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}) : '—';
  const adics   = ag.adicionais?.join(', ') || '—';

  let html = `<div class="modal-titulo">${ag.nome}</div>`;
  const rows = [
    ['Telefone', ag.telefone],
    ['Nascimento', ag.nascimento],
    ['Serviço', `${CATALOGO[ag.categoria]?.label||ag.categoria} — ${ag.item}`],
    ['Adicionais', adics],
    ag.cor    ? ['Cor',    ag.cor]    : null,
    ag.tamanho? ['Tamanho',ag.tamanho]: null,
    ['Profissional', ag.profissionalNome],
    ['Data', `${dataFmt} às ${ag.horario}`],
    ['Duração', ag.duracao||'—'],
    ['Valor', ag.precoTotal ? 'R$ '+ag.precoTotal : 'A confirmar'],
    ['Status', ag.status],
    ['Solicitado em', new Date(ag.criadoEm).toLocaleString('pt-BR')],
  ].filter(Boolean);

  html += rows.map(([k,v])=>`<div class="modal-row"><span class="modal-key">${k}</span><span class="modal-val">${v}</span></div>`).join('');

  // Fotos
  if (ag.fotoCabelo || ag.fotoRef) {
    html += `<div style="margin-top:16px">`;
    if (ag.fotoCabelo) html += `<div class="modal-foto-label">Cabelo atual</div><div class="modal-foto"><img src="${ag.fotoCabelo}" alt="cabelo"></div>`;
    if (ag.fotoRef)    html += `<div class="modal-foto-label" style="margin-top:10px">Referência</div><div class="modal-foto"><img src="${ag.fotoRef}" alt="ref"></div>`;
    html += `</div>`;
  }

  html += `<div class="modal-acoes">`;
  if (ag.status==='analise')    html += `<button class="btn-modal btn-confirmar-m" onclick="mudarStatus('${id}','confirmado')">✓ Confirmar</button>`;
  if (['analise','confirmado'].includes(ag.status)) html += `<button class="btn-modal btn-cancelar-m" onclick="mudarStatus('${id}','cancelado')">✕ Cancelar</button>`;
  if (ag.status==='confirmado') html += `<button class="btn-modal btn-reagendar-m" onclick="abrirReagendar('${id}')">↻ Reagendar</button>`;
  if (ag.status==='confirmado') html += `<button class="btn-modal" style="background:var(--roxo);color:#fff" onclick="mudarStatus('${id}','concluido')">✓ Concluir</button>`;
  html += `</div>`;

  document.getElementById('modalConteudo').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
};

window.abrirReagendar = function (id) {
  const ag = getAgendamentos().find(a => a.id === id);
  if (!ag) return;
  const el = document.getElementById('modalConteudo');
  let wrap = document.getElementById('reagendarWrap');
  if (!wrap) {
    const div = document.createElement('div');
    div.id = 'reagendarWrap';
    div.className = 'reagendar-wrap';
    div.innerHTML = `<h4>↻ Reagendar</h4>
      <div class="form-row2">
        <div class="form-group"><label>Nova data</label><input type="date" id="reagData" min="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Novo horário</label><input type="text" id="reagHora" placeholder="Ex: 14:00"></div>
      </div>
      <div class="form-group"><label>Observação (opcional)</label><input type="text" id="reagObs" placeholder="Motivo do reagendamento"></div>
      <button class="btn-login" onclick="confirmarReagendar('${id}')" style="margin-top:12px">Confirmar reagendamento</button>`;
    el.appendChild(div);
  }
};

window.confirmarReagendar = function (id) {
  const novaData = document.getElementById('reagData')?.value;
  const novaHora = document.getElementById('reagHora')?.value;
  if (!novaData || !novaHora) { alert('Informe data e horário.'); return; }
  const ags = getAgendamentos();
  const ag  = ags.find(a => a.id === id);
  if (!ag) return;
  ag.data     = novaData;
  ag.horario  = novaHora;
  ag.status   = 'confirmado';
  ag.reagendado = true;
  setAgendamentos(ags);

  // WhatsApp aviso
  const dataFmt = new Date(novaData+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
  const msg = encodeURIComponent(
    `Olá ${ag.nome}! 💜\n\nSeu agendamento foi *reagendado*:\n\n` +
    `✦ *Nova data:* ${dataFmt} às ${novaHora}\n✦ *Profissional:* ${ag.profissionalNome}\n\n` +
    `Qualquer dúvida, estamos à disposição! Estúdio Gisele Souza Cardoso 💇‍♀️`
  );
  const tel = ag.telefone?.replace(/\D/g,'');
  if (tel && confirm('Notificar cliente pelo WhatsApp?')) window.open(`https://wa.me/55${tel}?text=${msg}`,'_blank');

  fecharModal();
  renderAgendamentos();
  renderDashboard();
};

window.fecharModal = function () { document.getElementById('modalOverlay').classList.remove('open'); };

// ── PROFISSIONAIS ─────────────────────────
function renderProfissionaisAdmin() {
  const wrap = document.getElementById('profCards');
  wrap.innerHTML = PROFISSIONAIS.map(p => {
    const cats = p.especialidades.map(k => CATALOGO[k]?.label).filter(Boolean).join(', ');
    const hRows = DIAS_SEMANA.map((d,i) => {
      const h = p.horarios[d];
      if (!h) return '';
      return `<div class="prof-hor-row"><span class="prof-hor-dia">${DIAS_LABEL[i]}</span><span class="prof-hor-h">${h.inicio}–${h.fim}</span></div>`;
    }).join('');
    return `<div class="prof-admin-card">
      <div class="prof-admin-av">${p.avatar}</div>
      <h3>${p.nome}</h3>
      <div class="prof-servicos"><strong>Especialidades:</strong><br>${cats}</div>
      <div class="prof-horarios">${hRows}</div>
    </div>`;
  }).join('');
}

// ── CLIENTES ──────────────────────────────
window.renderClientes = function () {
  const busca = (document.getElementById('buscaCliente')?.value||'').toLowerCase();
  const ags   = getAgendamentos();
  const mapa  = {};
  ags.forEach(a => {
    const chave = a.telefone || a.nome;
    if (!mapa[chave]) mapa[chave] = { nome:a.nome, telefone:a.telefone, nascimento:a.nascimento, total:0, visitas:0, servicos:[] };
    mapa[chave].visitas++;
    mapa[chave].total += a.precoTotal||0;
    if (a.item && !mapa[chave].servicos.includes(a.item)) mapa[chave].servicos.push(a.item);
  });

  let clientes = Object.values(mapa).filter(c => !busca || c.nome?.toLowerCase().includes(busca) || c.telefone?.includes(busca));
  const wrap = document.getElementById('tabelaClientes');
  if (!clientes.length) { wrap.innerHTML='<p style="padding:24px;color:var(--texto-cl)">Nenhum cliente encontrado.</p>'; return; }

  wrap.innerHTML = `<table>
    <thead><tr><th>Nome</th><th>Telefone</th><th>Nascimento</th><th>Visitas</th><th>Total gasto</th><th>Serviços</th></tr></thead>
    <tbody>${clientes.map(c=>`<tr>
      <td><strong>${c.nome}</strong></td>
      <td>${c.telefone||'—'}</td>
      <td>${c.nascimento||'—'}</td>
      <td>${c.visitas}</td>
      <td><strong style="color:var(--roxo)">R$${c.total}</strong></td>
      <td><small style="color:var(--texto-cl)">${c.servicos.slice(0,3).join(', ')}${c.servicos.length>3?'…':''}</small></td>
    </tr>`).join('')}</tbody>
  </table>`;
};

// ── FATURAMENTO ───────────────────────────
window.renderFaturamento = function () {
  const dias   = parseInt(document.getElementById('periodoFat')?.value || '30');
  const limite = new Date(); limite.setDate(limite.getDate()-dias);
  const limStr = limite.toISOString().split('T')[0];
  const ags    = getAgendamentos().filter(a => a.status==='concluido' && a.data >= limStr);

  const total  = ags.reduce((s,a)=>s+(a.precoTotal||0),0);
  const media  = ags.length ? Math.round(total/ags.length) : 0;

  document.getElementById('fatKpis').innerHTML = `
    <div class="kpi-card roxo"><div class="kpi-label">Receita total</div><div class="kpi-val">R$${total}</div><div class="kpi-sub">${ags.length} serviços</div></div>
    <div class="kpi-card"><div class="kpi-label">Ticket médio</div><div class="kpi-val">R$${media}</div><div class="kpi-sub">por serviço</div></div>
    <div class="kpi-card verde"><div class="kpi-label">Atendimentos</div><div class="kpi-val">${ags.length}</div><div class="kpi-sub">no período</div></div>
    <div class="kpi-card"><div class="kpi-label">Clientes únicos</div><div class="kpi-val">${new Set(ags.map(a=>a.telefone)).size}</div><div class="kpi-sub">diferentes</div></div>`;

  // Por serviço
  const porServ = {};
  ags.forEach(a => { const k = CATALOGO[a.categoria]?.label||a.categoria||'Outro'; porServ[k]=(porServ[k]||0)+(a.precoTotal||0); });
  const maxS = Math.max(1,...Object.values(porServ));
  document.getElementById('fatPorServico').innerHTML = Object.entries(porServ).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
    <div class="fat-bar-wrap">
      <div class="fat-bar-label"><span>${k}</span><span>R$${v}</span></div>
      <div class="fat-bar-track"><div class="fat-bar-fill" style="width:${Math.round(v/maxS*100)}%"></div></div>
    </div>`).join('') || '<p style="color:var(--texto-cl);font-size:14px">Sem dados</p>';

  // Por profissional
  const porProf = {};
  ags.forEach(a => { const k = a.profissionalNome||'—'; porProf[k]=(porProf[k]||0)+(a.precoTotal||0); });
  const maxP = Math.max(1,...Object.values(porProf));
  document.getElementById('fatPorProf').innerHTML = Object.entries(porProf).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
    <div class="fat-bar-wrap">
      <div class="fat-bar-label"><span>${k}</span><span>R$${v}</span></div>
      <div class="fat-bar-track"><div class="fat-bar-fill" style="width:${Math.round(v/maxP*100)}%"></div></div>
    </div>`).join('');

  // Histórico
  document.getElementById('fatHistorico').innerHTML = ags.sort((a,b)=>b.data.localeCompare(a.data)).slice(0,20).map(a=>`
    <div class="fat-hist-item">
      <div>
        <div class="fat-nome">${a.nome}</div>
        <small style="color:var(--texto-cl)">${CATALOGO[a.categoria]?.label||a.categoria} — ${a.item} · ${a.profissionalNome}</small>
      </div>
      <div style="text-align:right">
        <div class="fat-val">${a.precoTotal?'R$'+a.precoTotal:'—'}</div>
        <small style="color:var(--texto-cl)">${new Date(a.data+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</small>
      </div>
    </div>`).join('') || '<p style="color:var(--texto-cl);font-size:14px">Sem registros</p>';
};

// ── ESTOQUE ───────────────────────────────
function renderEstoque() {
  const produtos = getEstoque();
  const wrap = document.getElementById('tabelaEstoque');
  if (!produtos.length) { wrap.innerHTML='<p style="padding:24px;color:var(--texto-cl)">Nenhum produto cadastrado. Clique em "+ Novo produto".</p>'; return; }
  wrap.innerHTML = `<table>
    <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Mín.</th><th>Custo</th><th>Ações</th></tr></thead>
    <tbody>${produtos.map(p=>`<tr class="${p.quantidade<=p.minimo?'estoque-baixo':''}">
      <td><strong>${p.nome}</strong>${p.quantidade<=p.minimo?'<span class="badge analise" style="margin-left:8px">Baixo</span>':''}</td>
      <td>${p.categoria||'—'}</td>
      <td><div class="qtd-cell">
        <button class="qtd-btn" onclick="ajustarQtd('${p.id}',-1)">−</button>
        <strong>${p.quantidade}</strong>
        <button class="qtd-btn" onclick="ajustarQtd('${p.id}',1)">+</button>
      </div></td>
      <td>${p.minimo}</td>
      <td>${p.preco?'R$'+Number(p.preco).toFixed(2):'—'}</td>
      <td><div class="acoes-cell">
        <button class="btn-sm btn-ver-sm" onclick="editarProduto('${p.id}')">Editar</button>
        <button class="btn-sm btn-cancelar-sm" onclick="deletarProduto('${p.id}')">Excluir</button>
      </div></td>
    </tr>`).join('')}</tbody>
  </table>`;
}

window.ajustarQtd = function (id, delta) {
  const est = getEstoque();
  const p   = est.find(x => x.id === id);
  if (p) { p.quantidade = Math.max(0, p.quantidade+delta); setEstoque(est); renderEstoque(); }
};

window.abrirModalEstoque = function (id) {
  document.getElementById('esEditId').value = id||'';
  if (id) {
    const p = getEstoque().find(x=>x.id===id);
    if (p) { document.getElementById('esNome').value=p.nome; document.getElementById('esQtd').value=p.quantidade; document.getElementById('esMin').value=p.minimo; document.getElementById('esPreco').value=p.preco||''; document.getElementById('esCat').value=p.categoria||'Fio'; }
  } else {
    ['esNome','esQtd','esMin','esPreco'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('esQtd').value=0; document.getElementById('esMin').value=1;
  }
  document.getElementById('modalEstoqueOverlay').classList.add('open');
};

window.editarProduto = function (id) { abrirModalEstoque(id); };

window.salvarProduto = function () {
  const nome = document.getElementById('esNome').value.trim();
  if (!nome) { alert('Informe o nome do produto.'); return; }
  const est   = getEstoque();
  const editId= document.getElementById('esEditId').value;
  const prod  = { id: editId||Date.now().toString(), nome, quantidade:parseInt(document.getElementById('esQtd').value)||0, minimo:parseInt(document.getElementById('esMin').value)||1, preco:document.getElementById('esPreco').value, categoria:document.getElementById('esCat').value };
  if (editId) { const idx=est.findIndex(x=>x.id===editId); if(idx>=0) est[idx]=prod; else est.push(prod); }
  else est.push(prod);
  setEstoque(est);
  fecharModalEstoque();
  renderEstoque();
};

window.deletarProduto = function (id) {
  if (!confirm('Excluir produto?')) return;
  setEstoque(getEstoque().filter(x=>x.id!==id));
  renderEstoque();
};

window.fecharModalEstoque = function () { document.getElementById('modalEstoqueOverlay').classList.remove('open'); };
