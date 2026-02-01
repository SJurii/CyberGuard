import { bankMoney } from "./bank_money";
import { smsScenario } from "./sms_scenario";
import {interestingSC} from "./interesting_sc"; 
import { deliveryScenario } from "./deliveryScenario";
import { prizeScenario } from "./prizeScenario";
import { deliveryServiceScenario } from "./deliveryServiceScenario";
import { telegramSupportScenario } from "./telegramSupportScenario";
import { googleSecurityScenario } from "./googleSecurityScenario";

export const scenarios = {
  interesting_sc: interestingSC,
  bank_money: bankMoney,
  sms_scenario: smsScenario,
  delivery_scenario: deliveryScenario,
  prize_scenario: prizeScenario,
  delivery_service_scenario: deliveryServiceScenario,
  telegram_support_scenario: telegramSupportScenario,
  google_security_scenario: googleSecurityScenario
  
};

export const scenarioOrder = [
  "interesting_sc",
  "bank_money",
  "sms_scenario",
  "delivery_scenario",
  "prize_scenario",
  "delivery_service_scenario",
  "telegram_support_scenario",
  "google_security_scenario"
];

