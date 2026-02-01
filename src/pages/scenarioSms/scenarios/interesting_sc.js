export const interestingSC = {
  start: "step1",
  steps: {
    step1: {
      from: "Bank",
      text: "⚠️ Подозрительная операция на 12 400₽. Подтвердите немедленно.",
      delay: 1200,
      answers: [
        { text: "Что за операция?", next: "step2", risk: 5, trust: 5 },
        { text: "Я ничего не делал", next: "step3", risk: 10, trust: 10 },
        { text: "Игнорировать", next: "safe_end", risk: -20 }
      ]
    },

    step2: {
      from: "Bank",
      text: "Платёж в другом регионе. Если не подтвердите — карта будет заблокирована.",
      answers: [
        { text: "Назовите мои данные", next: "step4", risk: -10, trust: -10 },
        { text: "Хорошо, что делать?", next: "step5", risk: 15, trust: 10 }
      ]
    },

    step3: {
      from: "Bank",
      text: "❗ Последнее предупреждение. Блокировка через 2 минуты.",
      answers: [
        { text: "Давайте быстрее", next: "step5", risk: 25 },
        { text: "Я проверю банк сам", next: "safe_end", risk: -25 }
      ]
    },

    step4: {
      from: "Bank",
      text: "Мы не можем раскрывать данные. Срочно подтвердите операцию.",
      answers: [
        { text: "Я перезвоню в банк", next: "safe_end", risk: -30 },
        { text: "Ладно", next: "step5", risk: 20 }
      ]
    },

    step5: {
      from: "Bank",
      text: "Перейдите по ссылке и введите код из SMS.",
      answers: [
        { text: "Ввожу код", next: "fail_end", risk: 50 },
        { text: "Это мошенничество", next: "safe_end", risk: -40 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Вы не попались на мошенничество.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Деньги списаны. Это была SMS-атака.",
      end: true
    }
  }
};
