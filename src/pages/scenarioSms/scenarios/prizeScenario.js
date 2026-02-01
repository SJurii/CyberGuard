export const prizeScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "Promo",
      text: "🎉 Поздравляем! Вы выиграли смартфон. Заберите приз сегодня.",
      answers: [
        { text: "Как получить?", next: "step2", risk: 10 },
        { text: "Это мошенничество", next: "safe_end", risk: -20 }
      ]
    },

    step2: {
      from: "Promo",
      text: "Для получения приза подтвердите личность по ссылке.",
      answers: [
        { text: "Перейти", next: "fail_end", risk: 50 },
        { text: "Отказаться", next: "safe_end", risk: -15 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Вы не поддались на приманку.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Данные украдены. Это была мошенническая акция.",
      end: true
    }
  }
};
