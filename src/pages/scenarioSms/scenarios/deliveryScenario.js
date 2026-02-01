export const deliveryScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "DeliveryService",
      text: "📦 Ваша посылка не может быть доставлена. Требуется уточнение адреса.",
      answers: [
        { text: "Что за посылка?", next: "step2", risk: 5 },
        { text: "Перейти по ссылке", next: "fail_end", risk: 40 },
        { text: "Игнорировать", next: "safe_end", risk: -10 }
      ]
    },

    step2: {
      from: "DeliveryService",
      text: "Уточните данные по ссылке:\nhttps://delivery-check.info",
      answers: [
        { text: "Перейти", next: "fail_end", risk: 50 },
        { text: "Я ничего не заказывал", next: "safe_end", risk: -20 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Вы не попались на поддельное уведомление.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Вы ввели данные на фейковом сайте доставки.",
      end: true
    }
  }
};
