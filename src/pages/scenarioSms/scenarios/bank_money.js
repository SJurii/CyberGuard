export const bankMoney = {
  start: "step1",

  steps: {
    step1: {
      from: "KyrgyzBank",
      text: "💳 Вам одобрен возврат средств в размере 5 490 сом. Подтвердите получение в течение 10 минут.",
      delay: 1500,
      answers: [
        { text: "Что за возврат?", next: "step2", risk: 2, trust: 5 },
        { text: "Да, подтверждаю", next: "step3", risk: 10, trust: 10 },
        { text: "Игнорировать", next: "safe_end", risk: -20 }
      ]
    },

    step2: {
      from: "KyrgyzBank",
      text: "Возврат по отменённой операции. Для продолжения требуется подтверждение личности.",
      answers: [
        { text: "Как вы меня идентифицируете?", next: "step4", risk: -10, trust: -5 },
        { text: "Хорошо, что нужно?", next: "step3", risk: 15, trust: 10 }
      ]
    },

    step3: {
      from: "KyrgyzBank",
      text: "Перейдите по ссылке для подтверждения:\nhttps://kgz-bank-secure.com/confirm",
      answers: [
        { text: "Перейти по ссылке", next: "fail_end", risk: 50 },
        { text: "Я перезвоню в банк", next: "safe_end", risk: -30 }
      ]
    },

    step4: {
      from: "KyrgyzBank",
      text: "Мы не можем раскрывать данные. В противном случае возврат будет отменён.",
      answers: [
        { text: "Ладно, подтверждаю", next: "fail_end", risk: 40 },
        { text: "Откажусь и проверю сам", next: "safe_end", risk: -25 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Вы приняли правильное решение и не попались на фишинг.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Вы перешли по фишинговой ссылке. Деньги были списаны.",
      end: true
    }
  }
};
