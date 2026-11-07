export const WHATSAPP_TEXT = 'I have a little Diwali surprise for you! 🪔✨ Open this link and enjoy!';

/** Builds the shareable link, optionally personalised with ?from=&to= */
export function buildLink(from = '', to = '') {
  const u = new URL(window.location.href);
  u.search = '';
  u.hash = '';
  if (from.trim()) u.searchParams.set('from', from.trim());
  if (to.trim()) u.searchParams.set('to', to.trim());
  return u.toString();
}

export function whatsappHref(link) {
  return `https://wa.me/?text=${encodeURIComponent(`${WHATSAPP_TEXT}\n${link}`)}`;
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
