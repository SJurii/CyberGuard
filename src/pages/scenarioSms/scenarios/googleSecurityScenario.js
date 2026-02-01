export const googleSecurityScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "Google",
      text: "🔐 Обнаружен вход в аккаунт Google с нового устройства (Android, г. Стамбул).",
      delay: 1500,
      answers: [
        { text: "Это я", next: "step2", risk: 0 },
        { text: "Это не я", next: "step3", risk: 0 }
      ]
    },

    step2: {
      from: "Google",
      text: "Спасибо за подтверждение. Рекомендуем проверить настройки безопасности аккаунта.",
      delay: 1500,
      answers: [
        { text: "Проверить позже", next: "safe_end", risk: 0 }
      ]
    },

    step3: {
      from: "Google",
      text: "Мы временно ограничили доступ к аккаунту. Подтвердите вход через приложение Google.",
      delay: 1500,
      answers: [
        { text: "Подтвердить в приложении", next: "step4", risk: 0 }
      ]
    },

    step4: {
      from: "Google",
      text: "Доступ восстановлен. Мы не отправляем ссылки для ввода пароля через SMS.",
      delay: 1500,
      answers: [
        { text: "Хорошо", next: "safe_end", risk: 0 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Это настоящее уведомление безопасности Google. Все действия выполняются внутри официального приложения.",
      end: true
    }
  }
};
