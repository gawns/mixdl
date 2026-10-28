document.documentElement.classList.add('js');

/* ===== Pengaturan ===== */
const MAX = 50;                 // maks. box per menu
const PAY_NO = '083141740173';  // ShopeePay
const WA_NO = '6283141740173';  // WhatsApp (format 62…)
const MENU = [
  {id:'original',   name:'Original',   label:'Original',           price:12000, pcs:4, note:'4 donat / box',       dot:'#d9a066', rgb:'217,160,102', img:'assets/original.jpg'},
  {id:'coklat',     name:'Coklat',     label:'Variant Coklat',     price:17000, pcs:4, note:'4 donat / box',       dot:'#6b3f2a', rgb:'107,63,42', img:'assets/coklat.jpg'},
  {id:'strawberry', name:'Strawberry', label:'Variant Strawberry', price:17000, pcs:4, note:'4 donat / box',       dot:'#d4506c', rgb:'212,80,108', img:'assets/strawberry.jpg'},
  {id:'blueberry',  name:'Blueberry',  label:'Variant Blueberry',  price:17000, pcs:4, note:'4 donat / box',       dot:'#5560b0', rgb:'85,96,176', img:'assets/blueberry.jpg'},
  {id:'keju',       name:'Keju',       label:'Variant Keju',       price:17000, pcs:4, note:'4 donat / box',       dot:'#e3a82b', rgb:'227,168,43', img:'assets/keju.jpg'},
  {id:'mix',        name:'Mix',        label:'Variant Mix',        price:17000, pcs:4, note:'4 donat campur rasa / box', dot:'conic-gradient(#6b3f2a,#d4506c,#5560b0,#e3a82b,#6b3f2a)', rgb:'150,100,90', img:'assets/mix.jpg'}
];
/* Foto latar tiap menu ada di folder assets/ (ubah nama file pada img:'...' bila perlu) */
/* ====================== */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const qty = {};
MENU.forEach(m => qty[m.id] = 0);
const $ = id => document.getElementById(id);
const rp = n => 'Rp ' + n.toLocaleString('id-ID');

/* Harga di header grup mengikuti data MENU, jadi tidak perlu diubah manual */
(() => {
  const og = MENU.find(m => m.id === 'original');
  const vs = MENU.filter(m => m.id !== 'original').map(m => m.price);
  const lo = Math.min(...vs), hi = Math.max(...vs);
  $('origPrice').textContent = rp(og.price);
  $('varPrice').textContent = lo === hi ? rp(lo) : rp(lo) + ' – ' + hi.toLocaleString('id-ID');
})();
const clean = s => s.replace(/\s+/g, ' ').trim();
let toastTimer;

function toast(t) {
  const el = $('toast');
  el.textContent = t;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* Total = Σ harga × jumlah box; jumlah wajib bilangan bulat 0..MAX */
function totals() {
  let t = 0, b = 0, p = 0;
  MENU.forEach(m => { t += m.price * qty[m.id]; b += qty[m.id]; p += m.pcs * qty[m.id]; });
  return {t, b, p};
}

function setQty(id, raw) {
  const prev = qty[id];
  const s = String(raw).trim();
  let v = s === '' ? 0 : Number(s);
  if (!Number.isInteger(v) || v < 0) {
    toast('Jumlah harus bilangan bulat, minimal 0');
    v = prev;
  } else if (v > MAX) {
    toast('Maksimal ' + MAX + ' box per menu. Untuk jumlah lebih besar, tulis di catatan.');
    v = MAX;
  }
  qty[id] = v;
  render();
  if (v !== prev && v > 0 && !reduce) {
    $('q_' + id).animate([{transform:'scale(1.4)'}, {transform:'scale(1)'}], {duration:320, easing:'cubic-bezier(.34,1.56,.64,1)'});
  }
}

/* Bangun daftar menu dan baris ringkasan sekali, lalu hanya diperbarui */
MENU.forEach(m => {
  const host = m.id === 'original' ? $('origList') : $('varList');
  host.insertAdjacentHTML('beforeend', `<div class="row${m.img ? ' has-photo' : ''}" id="row_${m.id}" style="--rgb:${m.rgb}${m.img ? ';--photo:url(' + m.img + ')' : ''}">
    <span class="dot" style="background:${m.dot}" aria-hidden="true"></span>
    <div class="rname">${m.name}<small>${m.note}</small></div>
    <div class="stepper">
      <button class="sbtn minus" type="button" data-id="${m.id}" data-d="-1" aria-label="Kurangi ${m.label}">−</button>
      <input class="sinput" id="q_${m.id}" data-id="${m.id}" type="number" inputmode="numeric" min="0" max="${MAX}" step="1" value="0" aria-label="Jumlah box ${m.label}">
      <button class="sbtn plus" type="button" data-id="${m.id}" data-d="1" aria-label="Tambah ${m.label}">+</button>
    </div></div>`);
  $('sLines').insertAdjacentHTML('beforeend', `<div class="col" id="sl_${m.id}"><div><div class="sline"><span>${m.label}<small id="sls_${m.id}"></small></span><b id="slp_${m.id}"></b></div></div></div>`);
});

document.addEventListener('click', e => {
  const b = e.target.closest('.sbtn');
  if (b) setQty(b.dataset.id, qty[b.dataset.id] + Number(b.dataset.d));
  const c = e.target.closest('[data-copy]');
  if (c) copyText(c.dataset.copy, 'Nomor tersalin', c);
});
document.addEventListener('change', e => {
  if (e.target.classList.contains('sinput')) setQty(e.target.dataset.id, e.target.value);
});

/* Validasi form */
function normPhone(v) {
  const p = v.replace(/[\s\-().]/g, '');
  return /^(\+62|62|0)8\d{8,12}$/.test(p) ? '0' + p.replace(/^(\+62|62|0)/, '') : null;
}
const F = [
  {el:'fName',  err:'eName',  test:() => { const v = clean($('fName').value); return v.length >= 2 && v.length <= 60 ? '' : 'Nama minimal 2 huruf'; }},
  {el:'fPhone', err:'ePhone', test:() => normPhone($('fPhone').value) ? '' : 'Nomor tidak valid. Contoh: 081234567890'},
  {el:'fAddr',  err:'eAddr',  test:() => clean($('fAddr').value).length >= 10 ? '' : 'Alamat minimal 10 karakter, tulis selengkapnya'}
];
function checkField(f) {
  const msg = f.test();
  $(f.err).textContent = msg;
  $(f.el).setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
F.forEach(f => {
  $(f.el).addEventListener('blur', () => checkField(f));
  $(f.el).addEventListener('input', () => { if ($(f.el).getAttribute('aria-invalid') === 'true') checkField(f); updateBar(); });
});
const formReady = () => totals().b > 0 && F.every(f => !f.test());
const updateBar = () => { $('barBtn').textContent = formReady() ? 'Kirim pesanan' : 'Lanjut'; };

/* Hitung naik/turun untuk total */
let shown = 0, raf = 0;
function tweenTotal(to) {
  cancelAnimationFrame(raf);
  const from = shown, start = performance.now(), dur = reduce ? 0 : 450;
  const els = ['sumTotal', 'payTotal', 'barTotal'].map($);
  const step = now => {
    const k = dur ? Math.min(1, (now - start) / dur) : 1;
    shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    els.forEach(el => el.textContent = rp(shown));
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function render() {
  const {t, b, p} = totals();
  MENU.forEach(m => {
    const q = qty[m.id];
    $('q_' + m.id).value = q;
    $('row_' + m.id).classList.toggle('on', q > 0);
    $('sl_' + m.id).classList.toggle('open', q > 0);
    if (q > 0) {
      $('sls_' + m.id).textContent = q + ' × ' + rp(m.price);
      $('slp_' + m.id).textContent = rp(m.price * q);
    }
  });
  $('sEmpty').classList.toggle('open', b === 0);
  $('sTot').classList.toggle('open', b > 0);
  if (b > 0) $('sMeta').textContent = b + ' box · ' + p + ' donat';
  $('barInfo').textContent = b + ' box · ' + p + ' donat';
  $('bar').classList.toggle('show', b > 0);
  $('bar').setAttribute('aria-hidden', b > 0 ? 'false' : 'true');
  tweenTotal(t);
  updateBar();
}

async function copyText(text, okMsg, btn) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; }
  catch (err) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      ok = document.execCommand('copy');
      ta.remove();
    } catch (e2) { ok = false; }
  }
  toast(ok ? okMsg : 'Gagal menyalin, salin manual ya');
  if (ok && btn) {
    const old = btn.textContent;
    btn.textContent = 'Tersalin ✓';
    setTimeout(() => { btn.textContent = old; }, 1500);
  }
}

function buildMessage() {
  const {t, b, p} = totals();
  const items = MENU.filter(m => qty[m.id] > 0).map(m => `- ${m.label}: ${qty[m.id]} box × ${rp(m.price)} = ${rp(m.price * qty[m.id])}`);
  const note = clean($('fNote').value);
  return `*PESANAN PREORDER MILKLUXE D’LECHE*

*Data pemesan*
Nama: ${clean($('fName').value)}
No. HP: ${normPhone($('fPhone').value)}
Alamat: ${clean($('fAddr').value)}
${note ? 'Catatan: ' + note + '\n' : ''}
*Detail pesanan*
${items.join('\n')}

${b} box · ${p} donat
*Total: ${rp(t)}*

*Pembayaran*
QRIS / ShopeePay: ${PAY_NO}
Bukti bayar saya kirim di chat ini.

Mohon konfirmasi jam antar ya. Terima kasih!`;
}

function validateAll() {
  const bad = F.filter(f => !checkField(f));
  if (!bad.length) return true;
  const el = $(bad[0].el);
  el.focus({preventScroll:true});
  el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'});
  if (!reduce) el.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(7px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}], {duration:360});
  toast('Lengkapi data pemesan dulu ya');
  return false;
}

function submitOrder() {
  if (totals().b === 0) {
    toast('Pilih minimal 1 box dulu ya');
    $('menu').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
    return;
  }
  if (!validateAll()) return;
  const a = $('waLink');
  a.href = 'https://wa.me/' + WA_NO + '?text=' + encodeURIComponent(buildMessage());
  a.click();
  toast('Membuka WhatsApp. Kirim bukti bayar di chat yang sama.');
}

/* Lokasi real time: dibaca di browser, tidak dikirim ke server mana pun */
const locBtn = $('locBtn');
locBtn.addEventListener('click', () => {
  if (!('geolocation' in navigator)) { toast('Perangkat ini tidak mendukung lokasi. Tulis alamat manual ya'); return; }
  const old = locBtn.textContent;
  locBtn.disabled = true; locBtn.textContent = 'Mencari lokasi…';
  const done = () => { locBtn.disabled = false; locBtn.textContent = old; };
  navigator.geolocation.getCurrentPosition(pos => {
    const link = 'https://maps.google.com/?q=' + pos.coords.latitude.toFixed(6) + ',' + pos.coords.longitude.toFixed(6);
    const ta = $('fAddr');
    const base = ta.value.split('\n').filter(l => !l.includes('maps.google.com/?q=')).join('\n').trim();
    ta.value = (base ? base + '\n' : '') + '📍 ' + link;
    ta.dispatchEvent(new Event('input', {bubbles:true}));
    done();
    toast('Lokasi terisi. Tambahkan nomor rumah atau patokan ya');
  }, err => {
    done();
    toast(err && err.code === 1 ? 'Izin lokasi ditolak. Tulis alamat manual ya' : 'Lokasi belum bisa diambil. Tulis alamat manual ya');
  }, {enableHighAccuracy:true, timeout:12000, maximumAge:0});
});

$('form').addEventListener('submit', e => { e.preventDefault(); submitOrder(); });
$('barBtn').addEventListener('click', () => {
  if (!formReady() && $('data').getBoundingClientRect().top > window.innerHeight * 0.5) {
    $('data').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
    return;
  }
  submitOrder();
});
$('copyTotal').addEventListener('click', e => copyText(String(totals().t), 'Nominal tersalin', e.currentTarget));
$('copyMsg').addEventListener('click', () => {
  if (totals().b === 0) { toast('Pilih minimal 1 box dulu ya'); return; }
  if (!validateAll()) return;
  copyText(buildMessage(), 'Teks pesanan tersalin');
});

/* Muncul halus saat di-scroll */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), {threshold:.12, rootMargin:'0px 0px -6% 0px'});
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

render();
