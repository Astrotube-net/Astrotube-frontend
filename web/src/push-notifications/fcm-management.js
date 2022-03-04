// @flow
/*
 * This module is responsible for persisting information about push notification
 * registrations to local storage.
 */
const log = true;
const registrations = (): Array<string> => {
  if (window.cordova) return localStorage.getItem('fcm') || '[]';
  return JSON.parse(localStorage.getItem('fcm') || '[]');
};

const updateRegistrations = (data) => {
  console.log('updateRegistrations: ', data);
  localStorage.setItem('fcm', JSON.stringify(data));
};

export const addRegistration = (userId: number) => {
  console.log('addRegistration, userId: ', userId);
  const data = Array.from(new Set(registrations().concat(userId)));
  console.log('addRegistration, data: ', data);
  updateRegistrations(data);
};

export const removeRegistration = (userId: number) => {
  if (log) console.log('removeRegistration, registrations: ', registrations());
  const data = registrations().filter((id) => id !== userId);
  if (log) console.log('removeRegistration, data: ', data);
  updateRegistrations(data);
};

export const hasRegistration = (userId: number): boolean => {
  if (log) console.log('hasRegistration, registrations: ', registrations());
  return registrations().includes(userId);
};
