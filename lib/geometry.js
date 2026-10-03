// أدوات رسم بسيطة: نقاط على دائرة + أشكال هندسية

export function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

const f = (n) => n.toFixed(2);

/** إنشاء مسار مضلع منتظم */
export function polyPath(cx, cy, r, sides, rotation = 0) {
  const points = [];

  for (let i = 0; i < sides; i++) {
    const [x, y] = polar(cx, cy, r, rotation + (360 / sides) * i);

    points.push(`${f(x)} ${f(y)}`);
  }

  return `M${points.join(" L")} Z`;
}

/** ورقة شجر تشير للأعلى، بطول len وعرض w، قاعدتها عند (0,0) */
export function leafPath(len, w) {
  return (
    `M0 0 C${f(w)} ${f(-len * 0.28)} ${f(w)} ${f(-len * 0.72)} 0 ${f(-len)} ` +
    `C${f(-w)} ${f(-len * 0.72)} ${f(-w)} ${f(-len * 0.28)} 0 0Z`
  );
}
