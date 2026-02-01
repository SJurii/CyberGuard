export const deliveryServiceScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "MegaMarket",
      text: "📦 Ваш заказ №48291 передан курьеру. Ожидаемая доставка сегодня с 18:00 до 21:00.",
      delay: 1500,
      answers: [
        { text: "Хорошо, жду", next: "step2", risk: 0 },
        { text: "Уточнить детали", next: "step3", risk: 0 }
      ]
    },

    step2: {
      from: "MegaMarket",
      text: "Если вас не будет дома, вы можете изменить время доставки в приложении.",
      delay: 1500,
      answers: [
        { text: "Ок", next: "success_end", risk: 0 },
        { text: "Изменить адрес", next: "step4", risk: 0 }
      ]
    },

    step3: {
      from: "MegaMarket",
      text: "Курьер свяжется с вами за 30 минут до прибытия. Оплата — при получении.",
      delay: 1500,
      answers: [
        { text: "Отлично", next: "success_end", risk: 0 }
      ]
    },

    step4: {
      from: "MegaMarket",
      text: "Изменение адреса доступно только через официальное приложение или сайт.",
      delay: 1500,
      answers: [
        { text: "Понятно", next: "success_end", risk: 0 }
      ]
    },

    success_end: {
      from: "System",
      text: "✅ Это реальное уведомление сервиса. Нет давления, нет ссылок в SMS, нет запроса данных.",
      end: true
    }
  }
};
