import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  initializeNotifications,
  scheduleWeeklyNotifications,
  scheduleMonthlyNotifications,
  scheduleChargeNotifications,
  cancelAllNotifications,
  sendTestNotification
} from './notifications';

const NotificationsHandler = () => {
  // Accéder aux comptes et aux paramètres depuis le store Redux
  const accounts = useSelector((state) => state.user.value.user.accounts);
  const settings = useSelector((state) => state.user.value.user.settings);

  // Initialisation des notifications au démarrage
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await initializeNotifications();
        console.log('Notifications initialisées.');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des notifications :', error);
      }
    };

    initNotifications();
  }, []);

  // Replanification dynamique des notifications
  useEffect(() => {
    const updateNotifications = async () => {
      try {
        // Annuler toutes les notifications existantes
        await cancelAllNotifications();

        // Planifier les notifications activées dans les paramètres
        if (settings?.weeklyNotificationsEnabled) {
          await scheduleWeeklyNotifications(accounts);
        }
        if (settings?.monthlyNotificationsEnabled) {
          await scheduleMonthlyNotifications(accounts);
        }
        if (settings?.chargeNotificationsEnabled) {
          await scheduleChargeNotifications(accounts);
        }

        await sendTestNotification();

        console.log('Notifications mises à jour.');
      } catch (error) {
        console.error('Erreur lors de la mise à jour des notifications :', error);
      }
    };

    updateNotifications();
  }, [accounts, settings]); // Met à jour lorsque accounts ou settings changent

  return null; // Aucun rendu visuel nécessaire
};

export default NotificationsHandler;
