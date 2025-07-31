/* Ф-ція перевіряє, чи існує хоча б один товар у куках з позначкою clicked.
Повертає true, якщо хоча б один такий товар знайдено, інакше false. */
export function hasClickedItemsInCookies() {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => {
        const [key, value] = cookie.trim().split('=');
        return key.startsWith('cart_button_') && value === 'clicked';
    });
}

/* Провірка чи існує в document.cookie кука з конкретним ключем cookieKey і значенням 'clicked'.
Якщо є повертає true, інакше false. */
export function isCookieClicked(cookieKey) {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => {
        const [key, value] = cookie.trim().split('=');
        return key === cookieKey && value === 'clicked';
    });
}

// Ф-ція встановлює cookie в браузері
export function setCookie(name, value, maxAgeSeconds = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

// Ф-ція шукає і повертає значення cookie за ключем name. Якщо не знаходить, повертає null
export function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
