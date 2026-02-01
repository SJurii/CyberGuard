export const telegramSupportScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "Telegram",
      text: "ℹ️ В ваш аккаунт Telegram выполнен вход с нового устройства (Windows, IP: Германия).",
      delay: 1500,
      answers: [
        { text: "Это я", next: "step2", risk: 0 },
        { text: "Это не я", next: "step3", risk: 0 }
      ]
    },

    step2: {
      from: "Telegram",
      text: "Отлично. Для дополнительной защиты рекомендуем включить двухэтапную аутентификацию в настройках.",
      delay: 1500,
      answers: [
        { text: "Хорошо", next: "safe_end", risk: 0 }
      ]
    },

    step3: {
      from: "Telegram",
      text: "Если это не вы, срочно завершите все активные сессии в настройках приложения.",
      delay: 1500,
      answers: [
        { text: "Завершить сессии", next: "step4", risk: 0 },
        { text: "Проигнорировать", next: "step5", risk: 5 }
      ]
    },

    step4: {
      from: "Telegram",
      text: "Все сессии завершены. Пароль не запрашивался, ссылки не отправлялись.",
      delay: 1500,
      answers: [
        { text: "Понял", next: "safe_end", risk: 0 }
      ]
    },

    step5: {
      from: "System",
      text: "⚠️ Игнорирование уведомлений безопасности может привести к взлому аккаунта.",
      delay: 1500,
      answers: [
        { text: "Вернуться и защитить аккаунт", next: "step4", risk: -5 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Telegram никогда не просит коды или пароли через сообщения.",
      end: true
    }
  }
};
