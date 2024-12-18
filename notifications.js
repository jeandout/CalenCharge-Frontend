import * as Notifications from 'expo-notifications';

// Initialiser les notifications
export async function initializeNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Les permissions de notification ont été refusées.');
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const { type, accounts } = notification.request.content.data;

      if (type === 'WEEKLY') {
        // Reprogrammer la prochaine notification hebdomadaire
        await scheduleNextWeeklyNotification(accounts);
      }

      if (type === 'MONTHLY') {
        // Reprogrammer la prochaine notification mensuelle
        await scheduleNextMonthlyNotification(accounts);
      }

      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  });

  console.log('Notifications initialisées avec succès.');
}

// Calculer les montants totaux par compte pour une période donnée
function calculateChargesByAccount(accounts, startDate, endDate) {
  const chargesByAccount = accounts.map((account) => {
    const total = account.charges.reduce((sum, charge) => {
      const chargeDate = new Date(charge.date);
      if (chargeDate >= startDate && chargeDate <= endDate) {
        return sum + parseFloat(charge.amount);
      }
      return sum;
    }, 0);

    return {
      accountName: account.name,
      totalCharges: total,
    };
  });

  return chargesByAccount;
}

// Planifier une notification hebdomadaire (manuellement)
export async function scheduleWeeklyNotifications(accounts) {
  const now = new Date();
  const nextSaturday = new Date(now);
  const daysUntilNextSaturday = (6 - now.getUTCDay() + 7) % 7 || 7; // Calculer le prochain samedi
  nextSaturday.setUTCDate(now.getUTCDate() + daysUntilNextSaturday);
  nextSaturday.setUTCHours(9, 0, 0, 0); // Samedi à 9h UTC

  // Calculer le total des charges par compte pour la semaine suivante
  const startDate = new Date(nextSaturday);
  const endDate = new Date(nextSaturday);
  endDate.setUTCDate(startDate.getUTCDate() + 6); // Jusqu'au vendredi suivant
  const chargesByAccount = calculateChargesByAccount(accounts, startDate, endDate);

  // Construire le corps de la notification
  const body = chargesByAccount
    .map((account) => `${account.accountName} : ${account.totalCharges.toFixed(2)}€`)
    .join('\n');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé de la semaine',
      body: body || 'Aucune charge prévue pour cette semaine.',
      data: { type: 'WEEKLY', accounts, chargesByAccount },
    },
    trigger: { date: nextSaturday }, // Notification unique pour la première occurrence
  });

  console.log(`Notification hebdomadaire programmée pour ${nextSaturday.toISOString()}`);
}

// Reprogrammer la prochaine notification hebdomadaire
async function scheduleNextWeeklyNotification(accounts) {
  const now = new Date();
  const nextSaturday = new Date(now);
  nextSaturday.setUTCDate(now.getUTCDate() + 7); // 7 jours plus tard (prochain samedi)
  nextSaturday.setUTCHours(9, 0, 0, 0);

  // Calculer le total des charges par compte pour la prochaine semaine
  const startDate = new Date(nextSaturday);
  const endDate = new Date(nextSaturday);
  endDate.setUTCDate(startDate.getUTCDate() + 6); // Jusqu'au vendredi suivant
  const chargesByAccount = calculateChargesByAccount(accounts, startDate, endDate);

  // Construire le corps de la notification
  const body = chargesByAccount
    .map((account) => `${account.accountName} : ${account.totalCharges.toFixed(2)}€`)
    .join('\n');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé de la semaine',
      body: body || 'Aucune charge prévue pour cette semaine.',
      data: { type: 'WEEKLY', accounts, chargesByAccount },
    },
    trigger: { date: nextSaturday },
  });

  console.log(`Prochaine notification hebdomadaire programmée pour ${nextSaturday.toISOString()}`);
}

// Planifier une notification mensuelle (manuellement)
export async function scheduleMonthlyNotifications(accounts) {
  const now = new Date();
  const firstOfNextMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
  firstOfNextMonth.setUTCHours(9, 0, 0, 0); // 1er jour du mois à 9h UTC

  // Calculer le total des charges pour le mois suivant
  const startDate = new Date(firstOfNextMonth);
  const endDate = new Date(firstOfNextMonth);
  endDate.setUTCMonth(startDate.getUTCMonth() + 1); // Jusqu'à la fin du mois
  endDate.setUTCDate(0); // Dernier jour du mois
  const chargesByAccount = calculateChargesByAccount(accounts, startDate, endDate);

  // Construire le corps de la notification
  const body = chargesByAccount
    .map((account) => `${account.accountName} : ${account.totalCharges.toFixed(2)}€`)
    .join('\n');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé du mois',
      body: body || 'Aucune charge prévue pour ce mois.',
      data: { type: 'MONTHLY', accounts, chargesByAccount },
    },
    trigger: { date: firstOfNextMonth }, // Notification unique pour la première occurrence
  });

  console.log(`Notification mensuelle programmée pour ${firstOfNextMonth.toISOString()}`);
}

// Reprogrammer la prochaine notification mensuelle
async function scheduleNextMonthlyNotification(accounts) {
  const now = new Date();
  const firstOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1); // Premier jour du mois suivant
  firstOfMonth.setUTCHours(9, 0, 0, 0);

  // Calculer le total des charges pour le mois suivant
  const startDate = new Date(firstOfMonth);
  const endDate = new Date(firstOfMonth);
  endDate.setUTCMonth(startDate.getUTCMonth() + 1); // Jusqu'à la fin du mois
  endDate.setUTCDate(0); // Dernier jour du mois
  const chargesByAccount = calculateChargesByAccount(accounts, startDate, endDate);

  // Construire le corps de la notification
  const body = chargesByAccount
    .map((account) => `${account.accountName} : ${account.totalCharges.toFixed(2)}€`)
    .join('\n');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé du mois',
      body: body || 'Aucune charge prévue pour ce mois.',
      data: { type: 'MONTHLY', accounts, chargesByAccount },
    },
    trigger: { date: firstOfMonth },
  });

  console.log(`Prochaine notification mensuelle programmée pour ${firstOfMonth.toISOString()}`);
}

// Planifier des notifications pour chaque charge
export async function scheduleChargeNotifications(accounts) {
  const now = new Date();

  for (const account of accounts) {
    for (const charge of account.charges) {
      const chargeDate = new Date(charge.date);
      const chargeDay = chargeDate.getUTCDate(); // Jour du prélèvement
      const chargeRecurrenceMonths = charge.recurrenceList; // Mois concernés

      if (chargeRecurrenceMonths.includes(now.getUTCMonth())) {
        const notificationDate = new Date(chargeDate);
        notificationDate.setUTCDate(chargeDay - 3); // 3 jours avant le prélèvement
        notificationDate.setUTCHours(9, 0, 0, 0); // 9h UTC

        if (notificationDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Prélèvement imminent : ${charge.name}`,
              body: `Un prélèvement de ${charge.amount}€ est prévu sur le compte ${account.name}.`,
            },
            trigger: { date: notificationDate },
          });

          console.log(
            `Notification programmée pour ${charge.name} sur ${account.name} le ${notificationDate.toISOString()}.`
          );
        } else {
          console.warn(
            `Notification ignorée pour ${charge.name} : la date ${notificationDate.toISOString()} est passée.`
          );
        }
      }
    }
  }
}

export async function sendTestNotification() {
  try {
    console.log('Début de l\'envoi de la notification de test...');

    // Définir une date dans les 5 secondes à venir
    const now = new Date();
    now.setSeconds(now.getSeconds() + 5);

    console.log('Date actuelle :', new Date().toISOString());
    console.log('Date prévue pour la notification :', now.toISOString());

    // Planification immédiate
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Notification de Test',
        body: 'Ceci est une notification de test pour vérifier le fonctionnement.',
      },
      trigger: {
        date: now, // Déclenchement exact dans 5 secondes
      },
    });

    console.log('Notification de test programmée.');

    // Vérifier les notifications programmées
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notifications programmées actuellement :', notifications);

    if (notifications.length === 0) {
      console.error('Aucune notification n\'a été enregistrée.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de test :', error);
  }
}

export async function logScheduledNotifications() {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Notifications programmées :', notifications);
}

export async function debugNotificationFlow() {
  console.log('Début du processus de notification...');

  try {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 5); // 5 secondes dans le futur
    console.log('Date actuelle :', new Date().toISOString());
    console.log('Date prévue pour la notification :', now.toISOString());

    // Planification de la notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Notification Debug',
        body: 'Cette notification est utilisée pour tester le processus.',
      },
      trigger: {
        date: now,
      },
    });

    console.log(`Notification programmée pour ${now.toISOString()}`);

    // Vérification des notifications programmées
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notifications programmées actuellement :', notifications);

    if (notifications.length === 0) {
      console.error('Aucune notification n\'a été enregistrée.');
    }
  } catch (error) {
    console.error('Erreur lors de la programmation de la notification :', error);
  }

  console.log('Fin du processus de notification.');
}

// Annuler toutes les notifications programmées
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Toutes les notifications programmées ont été annulées.');
}
