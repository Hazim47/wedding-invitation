// فاصل ذهبي: خطين + غصن صغير (أو رمز تمرّره مثل ♡)
export default function Ornament({ symbol }) {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      {symbol ? (
        <b>{symbol}</b>
      ) : (
        <svg width="44" height="18" viewBox="0 0 44 18" fill="currentColor">
          <path d="M22 9 C16 2 8 3 3 9 C9 15 17 16 22 9Z" opacity="0.85" />
          <path d="M22 9 C28 2 36 3 41 9 C35 15 27 16 22 9Z" opacity="0.85" />
          <circle cx="22" cy="9" r="2.2" />
        </svg>
      )}
      <span />
    </div>
  );
}
