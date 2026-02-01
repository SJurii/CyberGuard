export const smsScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "KyrgyzBank",
      text: "⚠️ Зафиксирована подозрительная активность. Подтвердите, что это были вы.",
      delay: 1500,
      answers: [
        { text: "Это был я", next: "step2", risk: 5, trust: 5 },
        { text: "Нет, не я", next: "step3", risk: 0 },
        { text: "Игнорировать", next: "safe_end", risk: -15 }
      ]
    },

    step2: {
      from: "KyrgyzBank",
      text: "Для подтверждения входа требуется быстрая верификация.",
      answers: [
        { text: "Продолжить", next: "step4", risk: 15 },
        { text: "Я проверю сам", next: "safe_end", risk: -20 }
      ]
    },

    step3: {
      from: "KyrgyzBank",
      text: "Вход был выполнен с нового устройства. Если это не вы — аккаунт будет заблокирован.",
      answers: [
        { text: "Срочно исправить", next: "step4", risk: 20 },
        { text: "Позвонить в банк", next: "safe_end", risk: -25 }
      ]
    },

    step4: {
      from: "KyrgyzBank",
      text: "Перейдите по защищённой ссылке:\nhttps://kgz-secure-login.com",
      answers: [
        { text: "Перейти", next: "fail_end", risk: 50 },
        { text: "Это похоже на мошенничество", next: "safe_end", risk: -30 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Вы распознали попытку социальной инженерии.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Вы ввели данные на поддельном сайте. Аккаунт скомпрометирован.",
      end: true
    }
  }
};
