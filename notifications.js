import * as Notifications from 'expo-notifications';

// Initialiser les notifications
export async function initializeNotifications() {
  // Demander les permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Les permissions de notification ont été refusées.');
    return;
  }

  // Configurer le comportement des notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  console.log('Notifications initialisées avec succès.');
}

// Planifier des notifications hebdomadaires pour chaque compte
export async function scheduleWeeklyNotifications(accounts) {
  const now = new Date();

  // Définir le prochain samedi
  const day = now.getDay(); // Jour actuel (0 = dimanche, 6 = samedi)
  const daysUntilSaturday = (6 - day + 7) % 7;
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(9, 0, 0, 0);

  // Fin de la semaine (vendredi suivant)
  const endOfWeek = new Date(nextSaturday);
  endOfWeek.setDate(nextSaturday.getDate() + 6);

  // Planifier une notification pour chaque compte
  for (const account of accounts) {
    let totalCharges = 0;

    for (const charge of account.charges) {
      const chargeDate = new Date(charge.date);
      const chargeMonth = chargeDate.getMonth();
      const chargeYear = chargeDate.getFullYear();

      // Calculer la différence de mois par rapport à charge.date
      const monthDifference =
        (nextSaturday.getFullYear() - chargeYear) * 12 +
        nextSaturday.getMonth() -
        chargeMonth;

      // Vérifier si le mois de récurrence est inclus
      if (charge.recurrenceList.includes((monthDifference % 12 + 12) % 12)) {
        totalCharges += parseFloat(charge.amount);
      }
    }

    if (totalCharges > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Résumé de la semaine pour ${account.name}`,
          body: `${totalCharges.toFixed(2)}€ passeront sur votre compte ${account.name} entre samedi et vendredi.`,
        },
        trigger: {
          weekday: 7, // Dimanche (dimanche = 1, samedi = 7)
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    }
  }
}

// Planifier des notifications mensuelles pour chaque compte
export async function scheduleMonthlyNotifications(accounts) {
  const now = new Date();

  // Premier jour du mois suivant
  const firstDayNextMonth = new Date(now);
  firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + 1);
  firstDayNextMonth.setDate(1);
  firstDayNextMonth.setHours(9, 0, 0, 0);

  // Planifier une notification pour chaque compte
  for (const account of accounts) {
    let totalCharges = 0;

    for (const charge of account.charges) {
      const chargeDate = new Date(charge.date);
      const chargeMonth = chargeDate.getMonth();
      const chargeYear = chargeDate.getFullYear();

      // Calculer la différence de mois par rapport à charge.date
      const monthDifference =
        (firstDayNextMonth.getFullYear() - chargeYear) * 12 +
        firstDayNextMonth.getMonth() -
        chargeMonth;

      // Vérifier si le mois de récurrence est inclus
      if (charge.recurrenceList.includes((monthDifference % 12 + 12) % 12)) {
        totalCharges += parseFloat(charge.amount);
      }
    }

    if (totalCharges > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Résumé du mois pour ${account.name}`,
          body: `${totalCharges.toFixed(2)}€ passeront sur votre compte ${account.name} le mois prochain.`,
        },
        trigger: {
          day: 1, // Premier jour du mois
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    }
  }
}

// Planifier des notifications pour chaque charge
export async function scheduleChargeNotifications(accounts) {
  for (const account of accounts) {
    for (const charge of account.charges) {
      const chargeDate = new Date(charge.date);

      // Calculer si la charge doit être déclenchée ce mois-ci
      const currentMonth = new Date().getMonth();
      const chargeMonth = chargeDate.getMonth();
      const chargeYear = chargeDate.getFullYear();

      const monthDifference =
        (new Date().getFullYear() - chargeYear) * 12 +
        currentMonth -
        chargeMonth;

      if (!charge.recurrenceList.includes((monthDifference % 12 + 12) % 12)) {
        continue;
      }

      // Date de la notification : 3 jours avant la charge
      const notificationDate = new Date(chargeDate);
      notificationDate.setDate(chargeDate.getDate() - 3);
      notificationDate.setHours(9, 0, 0, 0);

      // Vérification que la notification n'est pas dans le passé
      if (notificationDate.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Prélèvement imminent : ${charge.name}`,
            body: `Un prélèvement de ${charge.amount}€ est prévu le ${chargeDate.toLocaleDateString()} sur ${account.name}.`,
          },
          trigger: {
            date: notificationDate,
          },
        });
      }
    }
  }
}

export async function sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notification de test',
          body: 'Ceci est une notification de test pour vérifier que tout fonctionne bien.',
          sound: true,
        },
        trigger: null, // Notification immédiate
      });
  
      console.log('Notification de test envoyée.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test :', error);
    }
  }

// Annuler toutes les notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Toutes les notifications programmées ont été annulées.');
}
