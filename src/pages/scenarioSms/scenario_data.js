export const smsScenario = [
  {
    id: 1,
    from: "BankSupport",
    text: "❗ Подозрительная активность по вашей карте. Срочно подтвердите личность.",
    choices: [
      { label: "Перейти по ссылке", next: 2, risk: true },
      { label: "Игнорировать сообщение", next: 3, risk: false }
    ]
  },
  {
    id: 2,
    from: "BankSupport",
    text: "🔗 https://secure-bank-check.info\nВведите данные карты для подтверждения.",
    choices: [
      { label: "Ввести данные", next: "fail", risk: true },
      { label: "Закрыть сообщение", next: 3, risk: false }
    ]
  },
  {
    id: 3,
    from: "System",
    text: "Вы избежали возможной атаки. Настоящие банки не запрашивают данные по SMS.",
    end: "success"
  }
];
