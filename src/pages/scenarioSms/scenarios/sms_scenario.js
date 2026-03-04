export const smsScenario = {
  start: "step1",

  steps: {
    step1: {
      from: "KyrgyzBank_Security",
      text: "🚨 ВНИМАНИЕ! Попытка списания 4500 KGS в магазине 'O!Store'. Если это не вы, немедленно ответьте 'НЕТ'.",
      delay: 1000,
      answers: [
        { text: "НЕТ, ЭТО НЕ Я!", next: "panic_branch", risk: 20 },
        { text: "Проигнорировать", next: "delayed_attack", risk: -10 },
        { text: "Проверить баланс в приложении", next: "safe_end", risk: -30 }
      ]
    },

    // Ветка ПАНИКИ (наиболее опасная)
    panic_branch: {
      from: "KyrgyzBank_Security",
      text: "Операция заморожена. Чтобы отменить транзакцию и заблокировать доступ мошенникам, введите код из следующего SMS.",
      answers: [
        { text: "Жду код", next: "step_code", risk: 30 },
        { text: "Почему вы спрашиваете код?", next: "step_pressure", risk: 10 }
      ]
    },

    step_pressure: {
      from: "KyrgyzBank_Security",
      text: "Регламент безопасности 4.2. При отказе ваш счет будет заблокирован на 15 дней до выяснения обстоятельств. Вы подтверждаете отмену?",
      answers: [
        { text: "Да, отменяйте!", next: "step_code", risk: 40 },
        { text: "Я сам доеду до отделения", next: "safe_end", risk: -40 }
      ]
    },

    step_code: {
      from: "1414", // Имитация сервисного номера
      text: "Код восстановления доступа к приложению: 8829. НИКОМУ НЕ СООБЩАЙТЕ ЕГО!",
      answers: [
        { text: "Ввести код в чат", next: "fail_end", risk: 100 },
        { text: "Стоп, в SMS написано не сообщать код!", next: "safe_end", risk: -50 }
      ]
    },

    // Ветка с задержкой (если проигнорировал сразу)
    delayed_attack: {
      from: "KyrgyzBank_Security",
      text: "Ваш аккаунт будет удален через 10 минут из-за подозрительных входов. Сохраните данные по ссылке: bit.ly/kgz-back-up",
      answers: [
        { text: "Перейти по ссылке", next: "fail_end", risk: 60 },
        { text: "Заблокировать номер", next: "safe_end", risk: -20 }
      ]
    },

    safe_end: {
      from: "System",
      text: "✅ Победа! Вы проявили бдительность. Банки никогда не просят коды из SMS и не угрожают удалением аккаунта через 10 минут.",
      end: true
    },

    fail_end: {
      from: "System",
      text: "❌ Проигрыш. Мошенники получили доступ к вашему банкингу. Деньги списаны, на ваше имя оформлен микрокредит.",
      end: true
    }
  }
};