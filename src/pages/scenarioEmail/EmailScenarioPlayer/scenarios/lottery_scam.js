export const lottery_scam = {
  subject: "You have (1) New Pending Refund! ID: #99281",
  start: "step1",
  steps: {
    step1: {
      from: "Google Rewards Program",
      text: "Поздравляем! Ваш e-mail был выбран в качестве победителя в ежегодном розыгрыше призов. Вам полагается выплата в размере $1,200.\n\nДля получения средств скачайте форму во вложении и заполните её.",
      answers: [
        { text: "Скачать вложенный файл 'Refund_Form.zip'", next: "download_virus", risk: 80 },
        { text: "Посмотреть на заголовок письма", next: "check_header", risk: 0 }
      ]
    },
    check_header: {
      from: "System",
      text: "Письмо отправлено с адреса 'winner-prize-12@gmail.com'. Официальные программы Google никогда не используют бесплатные @gmail.com адреса для рассылки уведомлений.",
      answers: [
        { text: "Игнорировать и удалить", next: "win_clean", risk: 0 },
        { text: "Ответить и спросить, когда будут деньги", next: "respond_scam", risk: 30 }
      ]
    },
    download_virus: {
      from: "System",
      text: "В архиве оказался исполняемый файл .exe. Вы запустили его, и теперь на вашем компьютере работает вирус-шифровальщик. Все ваши файлы заблокированы.",
      end: true,
      risk: 100
    },
    respond_scam: {
      from: "System",
      text: "Ответив мошенникам, вы подтвердили, что ваша почта активна. Теперь количество спама и фишинговых атак на ваш ящик увеличится в 10 раз.",
      end: true,
      risk: 40
    },
    win_clean: {
      from: "System",
      text: "Верно! Бесплатный сыр бывает только в мышеловке. Вы сэкономили свои нервы и сохранили устройство в безопасности.",
      end: true,
      risk: 0
    }
  }
};