/* ================= TEMPO ================= */

function agora() {
  return new Date().getTime();
}

function minutos(min) {
  return min * 60 * 1000;
}

function dias(d) {
  return d * 24 * 60 * 60 * 1000;
}

/* ================= KEYS ================= */

const KEYS = {
  "TEST-5MIN": { duracao: minutos(5) },
};

/* ================= DEVICE ================= */

function getDevice() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = Math.random().toString(36).slice(2, 12);
    localStorage.setItem("device_id", id);
  }
  return id;
}

/* ================= LOGIN ================= */

function verificarKey() {
  const input = document.getElementById("keyInput");
  const msg = document.getElementById("msg");
  if (!input || !msg) return;

  const key = input.value.trim().toUpperCase();
  input.value = key;

  if (!KEYS[key]) {
    msg.innerText = "Key inválida";
    return;
  }

  const device = getDevice();
  const salvo = JSON.parse(localStorage.getItem("key_" + key));

  // PRIMEIRO USO
  if (!salvo) {
    const dados = {
      inicio: agora(),
      validade: agora() + KEYS[key].duracao,
      device: device
    };
    localStorage.setItem("key_" + key, JSON.stringify(dados));
    localStorage.setItem("keyAtiva", key);
    window.location.href = "painel.html";
    return;
  }

  // OUTRO USUÁRIO
  if (salvo.device !== device) {
    msg.innerText = "Essa key já está em uso";
    return;
  }

  // EXPIRADA
  if (agora() > salvo.validade) {
    msg.innerText = "Key expirada";
    localStorage.removeItem("key_" + key);
    return;
  }

  // OK
  localStorage.setItem("keyAtiva", key);
  window.location.href = "painel.html";
}

/* ================= PAINEL ================= */

function protegerPainel() {
  const key = localStorage.getItem("keyAtiva");
  if (!key) {
    window.location.href = "index.html";
    return;
  }

  const dados = JSON.parse(localStorage.getItem("key_" + key));
  if (!dados || agora() > dados.validade) {
    localStorage.removeItem("keyAtiva");
    window.location.href = "index.html";
  }
}

// RODA SOMENTE NO PAINEL
if (window.location.pathname.includes("painel")) {
  protegerPainel();
  setInterval(protegerPainel, 5000);
}

/* ================= ABAS ================= */

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const alvo = document.getElementById(tab.dataset.tab);
      if (alvo) alvo.classList.add("active");
    });
  });
});