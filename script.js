// ==========================================
// ۱. مدیریت لودینگ، انیمیشن‌ها و اسلایدر
// ==========================================
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader && loader.style.display !== 'none') {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 600, once: true });
      }
    }, 350);
  }
}

// رویدادهای تضمین‌کننده رفع گیر کردن لودینگ
window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 1000); // محافظ در صورت تاخیر فونت یا اینترنت

if (typeof Swiper !== 'undefined') {
  new Swiper(".mySwiper", {
    autoplay: { delay: 3500 },
    loop: true
  });
}

// ==========================================
// ۲. ساعت دیجیتال و خوش‌آمدگویی پویا
// ==========================================
setInterval(() => {
  const d = new Date();
  const el = document.getElementById('clock');
  if (el) {
    el.innerText = 
      String(d.getHours()).padStart(2, '0') + ':' + 
      String(d.getMinutes()).padStart(2, '0') + ':' + 
      String(d.getSeconds()).padStart(2, '0');
  }
}, 1000);

const h = new Date().getHours();
const welcomeDesc = document.getElementById('welcomeDesc');
if (welcomeDesc) {
  welcomeDesc.innerText = 
    h < 12 ? "صبح زیبا بخیر! آماده یک روز پر از کدنویسی و محاسبه؟" : 
    h < 18 ? "عصر دلپذیر بخیر! امیدوارم خستگی در کرده باشی." : "شب آرام و پرسکونی داشته باشی.";
}

// ==========================================
// ۳. منوها، دکمه Top و آکاردئون
// ==========================================
const dropBtn = document.getElementById('dropBtn');
const dropMenu = document.getElementById('dropMenu');
if (dropBtn && dropMenu) {
  dropBtn.onclick = (e) => {
    e.stopPropagation();
    dropMenu.classList.toggle('show');
  };
  document.addEventListener('click', () => dropMenu.classList.remove('show'));
}

// مودال راهنما
const helpModal = document.getElementById('modalBox');
document.getElementById('openModal').onclick = () => helpModal.classList.add('show');
document.getElementById('closeModal').onclick = () => helpModal.classList.remove('show');

// دکمه بازگشت به بالا
const topBtn = document.getElementById('topBtn');
window.onscroll = () => {
  topBtn.style.display = window.scrollY > 250 ? 'flex' : 'none';
};
topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// آکاردئون
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.onclick = () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
    const body = item.querySelector('.accordion-body');
    body.style.maxHeight = item.classList.contains('active') ? body.scrollHeight + "px" : null;
  };
});

// بستن مودال‌ها با کلیک خارج از کادر
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});

// ==========================================
// ۴. ماشین حساب کارت اصلی (حل ساده تشریحی)
// ==========================================
function runDetailedCalc() {
  let exp = document.getElementById('calcInput').value.replace(/\s+/g, '');
  const stepsList = document.getElementById('calcSteps');
  stepsList.innerHTML = '';
  const steps = [];

  try {
    let current = exp;
    steps.push(`عبارت ورودی: ${current}`);

    // پرانتزها
    while (current.includes('(')) {
      current = current.replace(/\(([^()]+)\)/g, (match, sub) => {
        let res = Function('"use strict";return (' + sub + ')')();
        steps.push(`حل داخل پرانتز: (${sub}) = ${res}`);
        return res;
      });
    }

    // ضرب و تقسیم
    while (/(-?\d+\.?\d*)([\*\/])(-?\d+\.?\d*)/.test(current)) {
      current = current.replace(/(-?\d+\.?\d*)([\*\/])(-?\d+\.?\d*)/, (m, a, op, b) => {
        let val = op === '*' ? Number(a) * Number(b) : Number(a) / Number(b);
        steps.push(`محاسبه اولویت: ${a} ${op} ${b} = ${val}`);
        return val;
      });
    }

    // نتیجه نهایی
    let finalVal = Function('"use strict";return (' + current + ')')();
    document.getElementById('calcResult').innerText = `پاسخ نهایی: ${finalVal}`;
    steps.forEach(st => {
      const li = document.createElement('li');
      li.innerText = '← ' + st;
      stepsList.appendChild(li);
    });
  } catch (err) {
    document.getElementById('calcResult').innerText = "خطا در فرمول نویسی!";
  }
}

// ==========================================
// ۵. ماشین حساب و معلم مبناها (Any-Base Teacher)
// ==========================================
(() => {
  const elInput = document.getElementById("baseInput");
  const elFrom = document.getElementById("fromBase");
  const elTo = document.getElementById("toBase");
  const elPrec = document.getElementById("fracPrecision");
  const elOut = document.getElementById("baseOutput");
  const elSteps = document.getElementById("baseSteps");

  const btnConvert = document.getElementById("btnConvertBase");
  const btnSwap = document.getElementById("btnSwapBase");
  const btnClear = document.getElementById("btnClearBase");

  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function formatDigit(val, targetBase) {
    if (val < 36n && targetBase <= 36n) {
      return CHARS[Number(val)];
    }
    return `[${val.toString()}]`;
  }

  function parseDigits(str, base) {
    const tokens = [];
    let i = 0;
    const s = str.trim().toUpperCase();

    while (i < s.length) {
      if (s[i] === '[') {
        const closeIdx = s.indexOf(']', i);
        if (closeIdx === -1) throw new Error("براکت بسته نشده است: علامت ']' پیدا نشد.");
        const sub = s.slice(i + 1, closeIdx).trim();
        if (!/^\d+$/.test(sub)) throw new Error(`مقدار درون براکت نامعتبر است: [${sub}]`);
        const val = BigInt(sub);
        if (val >= base) throw new Error(`رقم [${val}] نمی‌تواند مساوی یا بزرگتر از مبنای ${base} باشد.`);
        tokens.push(val);
        i = closeIdx + 1;
      } else {
        const ch = s[i];
        const valNum = CHARS.indexOf(ch);
        if (valNum === -1) throw new Error(`کاراکتر تعریف‌نشده: '${ch}'`);
        const val = BigInt(valNum);
        if (val >= base) throw new Error(`رقم '${ch}' (معادل ${val}) در مبنای ${base} تعریف نشده است.`);
        tokens.push(val);
        i++;
      }
    }
    return tokens;
  }

  function runTeacher() {
    if (!elInput || !elFrom || !elTo || !elSteps || !elOut) return;
    try {
      const rawInput = elInput.value.trim();
      const fromBase = BigInt(elFrom.value);
      const toBase = BigInt(elTo.value);
      const precision = parseInt(elPrec?.value || "10", 10);

      if (!rawInput) {
        elSteps.textContent = "لطفاً عددی برای تبدیل وارد کنید.";
        elOut.textContent = "—";
        return;
      }
      if (fromBase < 2n || toBase < 2n) {
        elSteps.textContent = "مبناها باید حداقل ۲ یا بزرگتر باشند.";
        return;
      }

      let steps = [];
      steps.push(`══════════════════════════════════════════════════════════════`);
      steps.push(`  کلاس درس تبدیل مبنا: ${rawInput} (Base ${fromBase})  ➜  (Base ${toBase})`);
      steps.push(`══════════════════════════════════════════════════════════════\n`);

      const parts = rawInput.split('.');
      const intStr = parts[0];
      const fracStr = parts[1] || "";

      // ۱. بسط بخش صحیح به مبنای ۱۰
      steps.push(`▶ گام ۱: تبدیل بخش صحیح از مبنای ${fromBase} به مبنای ۱۰ (روش بسط توان‌ها)`);
      const intDigits = parseDigits(intStr, fromBase);
      let decInt = 0n;
      const terms = [];
      const len = intDigits.length;

      for (let i = 0; i < len; i++) {
        const d = intDigits[i];
        const power = BigInt(len - 1 - i);
        const weight = fromBase ** power;
        const termVal = d * weight;
        decInt += termVal;
        terms.push(`${d} × (${fromBase}^${power}) = ${termVal}`);
      }

      steps.push(terms.map(t => "   • " + t).join("\n"));
      steps.push(`   ─────────────────────────────────────────────`);
      steps.push(`   جمع کل بخش صحیح در مبنای ۱۰ = ${decInt.toString()}\n`);

      // ۲. بسط بخش اعشاری به مبنای ۱۰
      let decFrac = 0;
      if (fracStr) {
        steps.push(`▶ گام ۲: تبدیل بخش اعشاری به مبنای ۱۰`);
        const fracDigits = parseDigits(fracStr, fromBase);
        const fracTerms = [];
        for (let i = 0; i < fracDigits.length; i++) {
          const d = Number(fracDigits[i]);
          const pow = -(i + 1);
          const weight = Math.pow(Number(fromBase), pow);
          const val = d * weight;
          decFrac += val;
          fracTerms.push(`${d} × (${fromBase}^${pow}) = ${val}`);
        }
        steps.push(fracTerms.map(t => "   • " + t).join("\n"));
        steps.push(`   جمع بخش اعشاری در مبنای ۱۰ ≈ ${decFrac}\n`);
      }

      // ۳. تبدیل به مبنای مقصد با تقسیم‌های متوالی
      steps.push(`▶ گام ۳: تبدیل بخش صحیح (${decInt}) از مبنای ۱۰ به مبنای مقصد (${toBase}) با تقسیم متوالی`);
      let outIntDigits = [];
      if (decInt === 0n) {
        outIntDigits.push(0n);
        steps.push(`   عدد صفر است ➜ رقم = 0`);
      } else {
        let temp = decInt;
        let stepCount = 1;
        while (temp > 0n) {
          const quotient = temp / toBase;
          const remainder = temp % toBase;
          steps.push(`   ${stepCount}) ${temp} ÷ ${toBase} = خارج‌قسمت: ${quotient} | باقیمانده: ${remainder} ➜ نماد: ${formatDigit(remainder, toBase)}`);
          outIntDigits.push(remainder);
          temp = quotient;
          stepCount++;
        }
        steps.push(`   ➜ باقیمانده‌ها را از آخر به اول می‌چینیم.`);
      }

      outIntDigits.reverse();
      const finalIntStr = outIntDigits.map(d => formatDigit(d, toBase)).join(toBase > 36n ? " " : "");

      // ۴. ضرب متوالی برای بخش اعشاری
      let finalFracStr = "";
      if (decFrac > 0) {
        steps.push(`\n▶ گام ۴: تبدیل بخش اعشاری (${decFrac}) به مبنای مقصد (${toBase}) با ضرب متوالی`);
        let fTemp = decFrac;
        let outFracDigits = [];

        for (let i = 1; i <= precision; i++) {
          const mul = fTemp * Number(toBase);
          const digit = Math.floor(mul);
          const rest = mul - digit;
          outFracDigits.push(BigInt(digit));
          steps.push(`   ${i}) ${fTemp.toFixed(6)} × ${toBase} = ${mul.toFixed(6)} ➜ رقم صحیح: ${digit} (${formatDigit(BigInt(digit), toBase)}) | باقیمانده: ${rest.toFixed(6)}`);
          fTemp = rest;
          if (fTemp < 1e-12) {
            steps.push(`   ✓ باقیمانده به صفر میل کرد (توقف ضرب).`);
            break;
          }
        }
        finalFracStr = "." + outFracDigits.map(d => formatDigit(d, toBase)).join(toBase > 36n ? " " : "");
      }

      const fullResult = finalIntStr + finalFracStr;
      steps.push(`\n==============================================================`);
      steps.push(`🏁 پاسخ نهایی در مبنای ${toBase}:  ${fullResult}`);
      steps.push(`==============================================================`);

      elOut.textContent = fullResult;
      elSteps.textContent = steps.join("\n");

    } catch (err) {
      elOut.textContent = "خطا";
      elSteps.textContent = `❌ خطا در محاسبه و پارس اعداد:\n${err.message}`;
    }
  }

  btnConvert?.addEventListener("click", runTeacher);
  
  btnSwap?.addEventListener("click", () => {
    const temp = elFrom.value;
    elFrom.value = elTo.value;
    elTo.value = temp;
    runTeacher();
  });

  btnClear?.addEventListener("click", () => {
    elInput.value = "";
    elOut.textContent = "—";
    elSteps.textContent = "آماده دریافت عدد و مبناها...";
    elInput.focus();
  });

  elInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runTeacher();
  });
})();

// ==========================================
// ۶. ماشین حساب پیشرفته علمی (محاسبه عمیق‌تر)
// ==========================================
const deepCalcModal = document.getElementById('deepCalcModal');
const deepDisplay = document.getElementById('deepDisplay');
const deepStepsList = document.getElementById('deepStepsList');
const angleModeBtn = document.getElementById('angleModeBtn');

let deepFormula = "";
let isDeg = true;

function openDeepCalcModal() {
  deepCalcModal.classList.add('show');
  const mainInputVal = document.getElementById('calcInput').value.trim();
  if (mainInputVal && !deepFormula) {
    deepFormula = mainInputVal;
    updateDeepDisplay();
  }
}
document.getElementById('closeDeepCalc').onclick = () => deepCalcModal.classList.remove('show');

function toggleAngleMode() {
  isDeg = !isDeg;
  angleModeBtn.innerText = isDeg ? "حالت زاویه: DEG" : "حالت زاویه: RAD";
}

function insertChar(char) {
  const ops = ['+', '-', '*', '/', '^', '%'];
  if (ops.includes(char) && ops.includes(deepFormula.slice(-1))) {
    deepFormula = deepFormula.slice(0, -1);
  }
  deepFormula += char;
  updateDeepDisplay();
}

function insertFunc(funcStr) {
  deepFormula += funcStr;
  updateDeepDisplay();
}

function deepClearAll() {
  deepFormula = "";
  updateDeepDisplay();
  deepStepsList.innerHTML = '<div style="color: #64748b; font-size: 0.85rem; text-align: center; margin-top: 5px;">فرمول را با دکمه‌ها وارد کنید و دکمه محاسبه را بزنید.</div>';
}

function deepBackspace() {
  const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', 'abs(', '1/('];
  let matched = funcs.find(fn => deepFormula.endsWith(fn));
  if (matched) {
    deepFormula = deepFormula.slice(0, -matched.length);
  } else {
    deepFormula = deepFormula.slice(0, -1);
  }
  updateDeepDisplay();
}

function updateDeepDisplay() {
  deepDisplay.innerText = deepFormula;
}

function addDeepStepLog(text, isFinal = false) {
  const item = document.createElement("div");
  item.className = "step-badge" + (isFinal ? " final" : "");
  item.innerText = text;
  deepStepsList.appendChild(item);
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function runDeepCalcStepByStep() {
  if (!deepFormula.trim()) return;
  deepStepsList.innerHTML = "";
  let expr = deepFormula.replace(/ /g, '');

  try {
    addDeepStepLog(`فرمول اولیه: ${expr}`);

    // جایگزینی ثوابت
    if (expr.includes('π') || expr.includes('e')) {
      expr = expr.replace(/π/g, Math.PI.toFixed(5));
      expr = expr.replace(/e/g, Math.E.toFixed(5));
      addDeepStepLog(`جایگذاری ثابت‌ها (π, e): ${expr}`);
    }

    // توابع علمی
    const funcRegex = /(sin|cos|tan|sqrt|log|ln|abs)\(([^()]+)\)/;
    while (funcRegex.test(expr)) {
      expr = expr.replace(funcRegex, (m, fn, argStr) => {
        let argVal = evaluateBasic(argStr);
        let res = 0;
        let rad = isDeg ? (argVal * Math.PI / 180) : argVal;

        if (fn === 'sin') res = Math.sin(rad);
        else if (fn === 'cos') res = Math.cos(rad);
        else if (fn === 'tan') res = Math.tan(rad);
        else if (fn === 'sqrt') res = Math.sqrt(argVal);
        else if (fn === 'log') res = Math.log10(argVal);
        else if (fn === 'ln') res = Math.log(argVal);
        else if (fn === 'abs') res = Math.abs(argVal);

        res = Number(res.toFixed(6));
        addDeepStepLog(`محاسبه تابع ${fn}(${argVal}) = ${res}`);
        return res;
      });
    }

    // فاکتوریل
    const factRegex = /(\d+\.?\d*)!/;
    while (factRegex.test(expr)) {
      expr = expr.replace(factRegex, (m, num) => {
        let res = factorial(parseInt(num));
        addDeepStepLog(`محاسبه فاکتوریل ${num}! = ${res}`);
        return res;
      });
    }

    // پرانتزها
    const parenRegex = /\(([^()]+)\)/;
    while (parenRegex.test(expr)) {
      let match = parenRegex.exec(expr);
      let innerRes = evaluateBasic(match[1], (log) => addDeepStepLog(`پرانتز (${match[1]}): ${log}`));
      expr = expr.replace(match[0], innerRes);
      addDeepStepLog(`ساده‌سازی پرانتز ➔ ${expr}`);
    }

    // نتیجه قطعی
    let finalResult = evaluateBasic(expr, (log) => addDeepStepLog(log));
    addDeepStepLog(`نتیجه نهایی = ${Number(parseFloat(finalResult).toFixed(6))}`, true);

  } catch (err) {
    deepStepsList.innerHTML = `<div style="color:#ef4444; font-size:0.85rem; padding: 4px;">⚠️ ساختار عبارت نامعتبر است. پرانتزها و عملگرها را بررسی کنید.</div>`;
  }
}

function evaluateBasic(str, logger = null) {
  let s = str;
  // توان
  const powRegex = /(-?\d+\.?\d*)\^(\d+\.?\d*)/;
  while (powRegex.test(s)) {
    s = s.replace(powRegex, (m, a, b) => {
      let res = Math.pow(parseFloat(a), parseFloat(b));
      if (logger) logger(`${a} ^ ${b} = ${res}`);
      return res;
    });
  }

  // ضرب، تقسیم و پیمانه
  const mulDivRegex = /(-?\d+\.?\d*)([\*\/%])(-?\d+\.?\d*)/;
  while (mulDivRegex.test(s)) {
    s = s.replace(mulDivRegex, (m, a, op, b) => {
      let n1 = parseFloat(a), n2 = parseFloat(b), res = 0;
      if (op === '*') res = n1 * n2;
      if (op === '/') {
        if (n2 === 0) throw new Error("تقسیم بر صفر");
        res = n1 / n2;
      }
      if (op === '%') res = n1 % n2;
      if (logger) logger(`${a} ${op} ${b} = ${res}`);
      return res;
    });
  }

  // جمع و تفریق
  const addSubRegex = /(-?\d+\.?\d*)([\+])(-?\d+\.?\d*)|(\d+\.?\d*)([\-])(-?\d+\.?\d*)/;
  while (addSubRegex.test(s)) {
    s = s.replace(addSubRegex, (m, a1, op1, b1, a2, op2, b2) => {
      let a = a1 !== undefined ? a1 : a2;
      let op = op1 !== undefined ? op1 : op2;
      let b = b1 !== undefined ? b1 : b2;
      let n1 = parseFloat(a), n2 = parseFloat(b), res = 0;
      if (op === '+') res = n1 + n2;
      if (op === '-') res = n1 - n2;
      if (logger) logger(`${a} ${op} ${b} = ${res}`);
      return res;
    });
  }
  return s;
}

// ==========================================
// ۷. حساب ابجد کبیر
// ==========================================
const abjadMap = {
  'ا':1,'آ':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ی':10,'ک':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
  'پ':2,'چ':3,'ژ':7,'گ':20
};
function calcAbjad() {
  const text = document.getElementById('abjadInput').value;
  let total = 0;
  for (let ch of text) {
    if (abjadMap[ch]) total += abjadMap[ch];
  }
  document.getElementById('abjadResult').innerText = `عدد ابجد: ${total}`;
}

// ==========================================
// ۸. رمزنگاری سزار و ویژنر
// ==========================================
function processCipher(encode) {
  const text = document.getElementById('cipherText').value;
  const key = document.getElementById('cipherKey').value;
  const type = document.getElementById('cipherType').value;
  let res = '';

  if (type === 'caesar') {
    let shift = parseInt(key) || 3;
    if (!encode) shift = (26 - (shift % 26)) % 26;
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code >= 65 && code <= 90) res += String.fromCharCode(((code - 65 + shift) % 26) + 65);
      else if (code >= 97 && code <= 122) res += String.fromCharCode(((code - 97 + shift) % 26) + 97);
      else res += text[i];
    }
  } else {
    let k = key.toLowerCase();
    if (!k) return;
    let ki = 0;
    for (let i = 0; i < text.length; i++) {
      let c = text.charCodeAt(i);
      if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
        let base = c >= 65 && c <= 90 ? 65 : 97;
        let shift = k.charCodeAt(ki % k.length) - 97;
        if (!encode) shift = (26 - shift) % 26;
        res += String.fromCharCode(((c - base + shift) % 26) + base);
        ki++;
      } else {
        res += text[i];
      }
    }
  }
  document.getElementById('cipherResult').innerText = res || "نتیجه خالی است.";
}

// ==========================================
// ۹. رمزنگاری Base64
// ==========================================
function encBase64(isEnc) {
  try {
    const str = document.getElementById('encInput').value;
    const res = isEnc ? btoa(unescape(encodeURIComponent(str))) : decodeURIComponent(escape(atob(str)));
    document.getElementById('encResult').innerText = res;
  } catch (e) {
    document.getElementById('encResult').innerText = "خطا در تبدیل!";
  }
}

// ==========================================
// ۱۰. تعویض و جایگزینی متن Farsa
// ==========================================
function applyFarsa() {
  const src = document.getElementById('farsaSource').value;
  const find = document.getElementById('farsaFind').value;
  const rep = document.getElementById('farsaReplace').value;
  if (!find) return;
  const res = src.split(find).join(rep);
  document.getElementById('farsaResult').innerText = res;
}

// ==========================================
// ۱۱. واژه‌نامه تک‌گزینه‌ای (Oneselect)
// ==========================================
const dictData = {
  algorithm: "روشی گام‌به‌گام و معین برای حل یک مسئله ریاضی یا محاسباتی.",
  cipher: "الگوریتمی برای اجرای رمزگذاری یا رمزگشایی یک پیام.",
  gamification: "به‌کارگیری ویژگی‌ها و مکانیک‌های بازی در بسترهای غیربازی برای ترغیب کاربران.",
  abjad: "سامانه‌ای الفبایی که در آن هر حرف نشان‌دهنده یک مقدار عددی ویژه است."
};
function lookupDict() {
  const val = document.getElementById('dictSelect').value;
  document.getElementById('dictResult').innerText = dictData[val] || "لطفاً گزینه‌ای را انتخاب کنید.";
}

// ==========================================
// ۱۲. فال حافظ تعاملی
// ==========================================
const falDB = [
  {
    verse: "یوسف گمگشته بازآید به کنعان غم مخور\nکلبه احزان شود روزی گلستان غم مخور",
    desc: "تعبیر: غم و نگرانی‌ها به‌زودی رفع خواهند شد. امید خود را از دست مده که گشایش نزدیک است."
  },
  {
    verse: "ساقیا آمدن عید مبارک بادت\nوان مواعید که دادی مرواد از یادت",
    desc: "تعبیر: روزهای سرور و شادمانی در پیش است. به عهد و پیمان‌هایت وفادار باش."
  },
  {
    verse: "دوش وقت سحر از غصه نجاتم دادند\nواندر آن ظلمت شب آب حیاتم دادند",
    desc: "تعبیر: پاداش صبر خود را دریافت خواهی کرد. دریچه‌های موفقیت به رویت باز می‌شود."
  }
];
function getFal() {
  const rand = falDB[Math.floor(Math.random() * falDB.length)];
  document.getElementById('falResult').innerText = `${rand.verse}\n\n${rand.desc}`;
  if (typeof confetti === 'function') {
    confetti({ particleCount: 50, spread: 60 });
  }
}

// ==========================================
// ۱۳. گیمیفیکیشن: بازی دوز همراه با Confetti
// ==========================================
let board = ["","","","","","","","",""];
let turn = "X";
let active = true;

function cellClicked(index) {
  if (board[index] !== "" || !active) return;
  board[index] = turn;
  document.getElementsByClassName('ttt-cell')[index].innerText = turn;
  checkWin();
}

function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let w of wins) {
    if (board[w[0]] && board[w[0]] === board[w[1]] && board[w[0]] === board[w[2]]) {
      document.getElementById('gameStatus').innerText = `🎉 بازیکن ${turn} برنده شد!`;
      active = false;
      if (typeof confetti === 'function') {
        confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
      }
      return;
    }
  }
  if (!board.includes("")) {
    document.getElementById('gameStatus').innerText = "بازی مساوی شد!";
    active = false;
    return;
  }
  turn = turn === "X" ? "O" : "X";
  document.getElementById('gameStatus').innerText = `نوبت بازیکن: ${turn}`;
}

function resetGame() {
  board = ["","","","","","","","",""];
  turn = "X";
  active = true;
  document.getElementById('gameStatus').innerText = "نوبت بازیکن: X";
  document.querySelectorAll('.ttt-cell').forEach(c => c.innerText = "");
}

// ==========================================
// ۱۴. نوت‌پد با ذخیره‌سازی LocalStorage
// ==========================================
const noteArea = document.getElementById('quickNote');
if (noteArea) {
  noteArea.value = localStorage.getItem('user_quick_note') || '';
  noteArea.addEventListener('input', () => {
    localStorage.setItem('user_quick_note', noteArea.value);
    const status = document.getElementById('noteSavedStatus');
    status.innerText = "ذخیره شد ✓";
    setTimeout(() => status.innerText = "ذخیره خودکار فعال است.", 1400);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const sigBadge = document.getElementById("studioSig");
  const brandName = document.getElementById("sigBrandName");

  if (sigBadge && brandName) {
    let isSigned = false;

    sigBadge.addEventListener("click", () => {
      // انیمیشن نرم محو شدن و برگشت
      brandName.style.opacity = "0";
      brandName.style.transform = "translateY(-4px)";

      setTimeout(() => {
        if (!isSigned) {
          brandName.textContent = "حسین رسولی";
          sigBadge.classList.add("revealed");
          isSigned = true;
        } else {
          brandName.textContent = "Golden Rakham";
          sigBadge.classList.remove("revealed");
          isSigned = false;
        }
        brandName.style.opacity = "1";
        brandName.style.transform = "translateY(0)";
      }, 180);
    });
  }
});

