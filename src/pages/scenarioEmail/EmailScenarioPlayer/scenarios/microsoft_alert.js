export const microsoft_alert = {
  subject: "[SECURITY ALERT] Unusual sign-in activity for your account",
  start: "step1",
  steps: {
    step1: {
      from: "Microsoft Account Team",
      text: "Уважаемый пользователь,\n\nМы обнаружили подозрительный вход в ваш аккаунт из нового местоположения: Лагос, Нигерия.\n\nЕсли это были не вы, пожалуйста, немедленно подтвердите свою личность, чтобы мы могли защитить ваши данные.",
      answers: [
        { text: "Проверить адрес отправителя", next: "check_sender", risk: 0 },
        { text: "Нажать кнопку 'Подтвердить личность'", next: "click_phishing", risk: 50 }
      ]
    },
    check_sender: {
      from: "System",
      text: "Вы навели курсор на отправителя. Адрес: account-security@rnicrosoft-support.com.\n\nЗаметили? В слове 'microsoft' вместо 'm' написаны буквы 'r' and 'n'. Это классическая атака-двойник.",
      answers: [
        { text: "Пометить как спам и удалить", next: "win_clean", risk: -10 },
        { text: "Все равно нажать, вдруг это важно", next: "click_phishing", risk: 60 }
      ]
    },
    click_phishing: {
      from: "System",
      text: "Вы перешли по ссылке. Открылась страница, полностью копирующая вход в Microsoft. Вы ввели свой логин и пароль.\n\nХакеры только что получили доступ к вашей почте.",
      end: true,
      risk: 100
    },
    win_clean: {
      from: "System",
      text: "Отличная работа! Вы распознали 'гомограф' (подмену символов) и не дали себя обмануть. Настоящие письма от Microsoft приходят только с домена @microsoft.com.",
      end: true,
      risk: 0
    }
  }
};