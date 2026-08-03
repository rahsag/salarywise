export function inr(n: number): string {
  n = Math.round(n);
  const s = n.toString();
  const last = s.slice(-3);
  let rest = s.slice(0, -3);
  if (rest) rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',';
  return '₹' + rest + last;
}

export function short(n: number): string {
  n = Math.round(n);
  if (n >= 10000000)
    return '₹' + (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 2).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 100000)
    return '₹' + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1).replace(/\.0$/, '') + ' L';
  if (n >= 1000) return '₹' + Math.round(n / 1000) + 'k';
  return '₹' + n;
}

export interface ScoreBreakdown {
  savePts: number;
  debtPts: number;
  investPts: number;
  total: number;
}

export function computeScore(salary: number, rent: number, emi: number, expenses: number, sip: number): ScoreBreakdown {
  const s = Math.max(salary, 1);
  const savings = salary - rent - emi - expenses;
  const saveRate = savings / s;
  const savePts = Math.max(0, Math.min(40, Math.round((saveRate / 0.4) * 40)));
  const emiBurden = emi / s;
  const debtPts = Math.max(0, Math.min(30, Math.round((1 - emiBurden / 0.4) * 30)));
  const investPts = Math.max(0, Math.min(30, Math.round((sip / s / 0.2) * 30)));
  return { savePts, debtPts, investPts, total: savePts + debtPts + investPts };
}

export function scoreBand(total: number): string {
  return total >= 80 ? 'Excellent' : total >= 65 ? 'Good' : total >= 45 ? 'Fair' : 'Needs work';
}

export interface EmiResult {
  m: number;
  total: number;
  interest: number;
}

export function emiCalc(emiP: number, emiR: number, emiN: number): EmiResult {
  const r = emiR / 1200;
  const n = emiN * 12;
  const m = r === 0 ? emiP / n : (emiP * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { m, total: m * n, interest: m * n - emiP };
}

export interface SipResult {
  fv: number;
  invested: number;
  gain: number;
}

export function sipCalc(sipAmt: number, sipR: number, sipY: number): SipResult {
  const i = sipR / 1200;
  const n = sipY * 12;
  const fv = i === 0 ? sipAmt * n : sipAmt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = sipAmt * n;
  return { fv, invested, gain: fv - invested };
}

export interface AffordResult {
  emi: number;
  loan: number;
  price: number;
}

export function affCalc(affIncome: number, affDown: number, affRate: number, affTenure: number): AffordResult {
  const maxEmi = affIncome * 0.4;
  const r = affRate / 1200;
  const n = affTenure * 12;
  const loan = r === 0 ? maxEmi * n : (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  return { emi: maxEmi, loan, price: loan + affDown };
}

export type TaxRegime = 'new' | 'old';

export function taxCalc(gross: number, regime: TaxRegime, d80c: number, hra: number): number {
  let taxable: number;
  let slabs: [number, number][];
  let std: number;
  if (regime === 'new') {
    std = 75000;
    taxable = Math.max(0, gross - std);
    slabs = [
      [300000, 0],
      [700000, 0.05],
      [1000000, 0.1],
      [1200000, 0.15],
      [1500000, 0.2],
      [Infinity, 0.3],
    ];
    if (taxable <= 700000) return 0;
  } else {
    std = 50000;
    taxable = Math.max(0, gross - std - Math.min(d80c, 150000) - hra);
    slabs = [
      [250000, 0],
      [500000, 0.05],
      [1000000, 0.2],
      [Infinity, 0.3],
    ];
    if (taxable <= 500000) return 0;
  }
  let tax = 0;
  let prev = 0;
  for (const [cap, rate] of slabs) {
    if (taxable > prev) {
      tax += (Math.min(taxable, cap) - prev) * rate;
      prev = cap;
    } else break;
  }
  return Math.round(tax * 1.04);
}

export interface CoachContext {
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  sipAmt: number;
  sipR: number;
  sipY: number;
  taxIncome: number;
  tax80c: number;
  taxHra: number;
  affIncome: number;
  affDown: number;
  affRate: number;
  affTenure: number;
  scoreTotal: number;
}

export function coachReply(t: string, ctx: CoachContext): string {
  const q = t.toLowerCase();
  if (/tax|regime|80c/.test(q)) {
    const nw = taxCalc(ctx.taxIncome, 'new', 0, 0);
    const old = taxCalc(ctx.taxIncome, 'old', ctx.tax80c, ctx.taxHra);
    const best = nw <= old ? 'New' : 'Old';
    return `On your ${short(ctx.taxIncome)} income, the ${best} regime is cheaper — about ${inr(Math.abs(nw - old))} saved a year. Max out 80C only if you'll stay on the Old regime; otherwise the higher standard deduction on New usually wins.`;
  }
  if (/home|house|loan|afford|buy/.test(q)) {
    const a = affCalc(ctx.affIncome, ctx.affDown, ctx.affRate, ctx.affTenure);
    return `Keeping EMIs under 40% of income, you could comfortably service a loan of ~${short(a.loan)}. With your down payment that's a home budget around ${short(a.price)}. Want me to open the Affordability tool?`;
  }
  if (/save|saving|budget|spend/.test(q)) {
    const left = ctx.salary - ctx.rent - ctx.emi - ctx.expenses;
    return `You're keeping about ${inr(left)} each month after essentials. A simple 50/30/20 split on your ${short(ctx.salary)} take-home would target ${short(ctx.salary * 0.2)} to savings. Automate a SIP on payday so it happens first.`;
  }
  if (/invest|sip|mutual|wealth|retire/.test(q)) {
    const s = sipCalc(ctx.sipAmt, ctx.sipR, ctx.sipY);
    return `A ${short(ctx.sipAmt)}/mo SIP at ${ctx.sipR}% could grow to ~${short(s.fv)} in ${ctx.sipY} years — ${short(s.gain)} of that is compounding, not your money. Time in the market beats timing it.`;
  }
  if (/score|health/.test(q)) {
    return `Your Financial Health Score is ${ctx.scoreTotal}/100. The quickest lever right now is your savings rate — nudging monthly investing up by even ₹3–5k moves the needle fast.`;
  }
  return `Good question. I can help with budgeting, taxes, home affordability, SIPs and your health score. Try asking "should I pick the new or old tax regime?" or "how much home can I afford?"`;
}
