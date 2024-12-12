import * as Notifications from 'expo-notifications';

// Initialiser les notifications
export async function initializeNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Les permissions de notification ont été refusées.');
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  console.log('Notifications initialisées avec succès.');
}

// Fonction utilitaire : calculer les charges pour une semaine
function calculateWeeklyCharges(charges, startDate, endDate) {
  let totalCharges = 0;

  for (const charge of charges) {
    const chargeDay = new Date(charge.date).getDate();
    const chargeRecurrenceMonths = charge.recurrenceList;

    for (let current = new Date(startDate); current <= endDate; current.setDate(current.getDate() + 1)) {
      if (
        chargeRecurrenceMonths.includes(current.getMonth()) && // Mois inclus dans recurrenceList
        current.getDate() === chargeDay // Jour précis
      ) {
        totalCharges += parseFloat(charge.amount);
      }
    }
  }

  return totalCharges;
}

// Fonction utilitaire : calculer les charges pour un mois
function calculateMonthlyCharges(charges, month) {
  let totalCharges = 0;

  for (const charge of charges) {
    const chargeDay = new Date(charge.date).getDate();
    const chargeRecurrenceMonths = charge.recurrenceList;

    if (chargeRecurrenceMonths.includes(month)) {
      totalCharges += parseFloat(charge.amount);
    }
  }

  return totalCharges;
}

// Planifier des notifications hebdomadaires
export async function scheduleWeeklyNotifications(accounts) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé de la semaine',
      body: 'Les charges prévues pour cette semaine seront incluses dans cette notification.',
      data: { accounts }, // Passer les comptes dans les données
    },
    trigger: {
      weekday: 7, // Samedi
      hour: 9,
      minute: 0,
      repeats: true, // Répétition hebdomadaire
    },
  });

  console.log('Notifications hebdomadaires programmées.');
}

// Planifier des notifications mensuelles
export async function scheduleMonthlyNotifications(accounts) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Résumé du mois',
      body: 'Les charges prévues pour ce mois seront incluses dans cette notification.',
      data: { accounts },
    },
    trigger: {
      day: 1, // Premier jour du mois
      hour: 9,
      minute: 0,
      repeats: true, // Répétition mensuelle
    },
  });

  console.log('Notifications mensuelles programmées.');
}

// Planifier des notifications pour chaque charge (3 jours avant)
export async function scheduleChargeNotifications(accounts) {
  for (const account of accounts) {
    for (const charge of account.charges) {
      const chargeDate = new Date(charge.date);
      const chargeDay = chargeDate.getDate();
      const chargeRecurrenceMonths = charge.recurrenceList;

      const now = new Date();

      // Vérifier si la charge doit être déclenchée ce mois-ci
      if (chargeRecurrenceMonths.includes(now.getMonth())) {
        const notificationDate = new Date(now);
        notificationDate.setDate(chargeDay - 3); // 3 jours avant
        notificationDate.setHours(9, 0, 0, 0);

        if (notificationDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Prélèvement imminent : ${charge.name}`,
              body: `Un prélèvement de ${charge.amount}€ est prévu le ${chargeDay}.`,
            },
            trigger: {
              date: notificationDate, // Déclenchement 3 jours avant
            },
          });

          console.log(
            `Notification planifiée pour ${charge.name} sur ${account.name} le ${notificationDate.toLocaleDateString()}`
          );
        }
      }
    }
  }
}

// Envoie une notification de test
export async function sendTestNotification() {
  const now = new Date();
  now.setSeconds(now.getSeconds() + 5); // 5 secondes dans le futur
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Notification de test',
      body: 'Ceci est une notification de test pour vérifier que tout fonctionne bien.',
    },
    trigger: {
      date: now,
    },
  });

  console.log('Notification de test envoyée.');
}

// Gérer la notification au moment du déclenchement
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { accounts } = notification.request.content.data;

    if (notification.request.trigger.repeatFrequency === 'WEEKLY') {
      const now = new Date();
      const thisSaturday = new Date(now);
      thisSaturday.setDate(thisSaturday.getDate() - thisSaturday.getDay() + 6); // Samedi
      thisSaturday.setHours(0, 0, 0, 0);

      const nextFriday = new Date(thisSaturday);
      nextFriday.setDate(thisSaturday.getDate() + 6); // Vendredi suivant
      nextFriday.setHours(23, 59, 59, 999);

      for (const account of accounts) {
        const totalCharges = calculateWeeklyCharges(
          account.charges,
          thisSaturday,
          nextFriday
        );

        console.log(
          `Charges hebdomadaires pour ${account.name}: ${totalCharges.toFixed(2)}€`
        );
      }
    }

    if (notification.request.trigger.repeatFrequency === 'MONTHLY') {
      const now = new Date();
      const currentMonth = now.getMonth();

      for (const account of accounts) {
        const totalCharges = calculateMonthlyCharges(
          account.charges,
          currentMonth
        );

        console.log(
          `Charges mensuelles pour ${account.name}: ${totalCharges.toFixed(2)}€`
        );
      }
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

// Annuler toutes les notifications programmées
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Toutes les notifications programmées ont été annulées.');
}
