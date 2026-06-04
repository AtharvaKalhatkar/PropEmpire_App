import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize stores
const invoicesStore = localforage.createInstance({ name: 'PropEmpire', storeName: 'invoices' });
const clientsStore = localforage.createInstance({ name: 'PropEmpire', storeName: 'clients' });
const profileStore = localforage.createInstance({ name: 'PropEmpire', storeName: 'profile' });

// Default Profile
const defaultProfile = {
  agentName: 'Saurabh Shivaji Gade',
  email: 'saurabhgade32@gmail.com',
  mobile: '9730953309',
  reraNo: 'A52100041995',
  panNo: 'DDHPG6896K',
  bankFavouringName: 'Saurabh Shivaji Gade',
  bankName: 'HDFC Bank,S No, 648 Pune, Pune - Ahmednagar Hwy Near Lifeline Hospital, Wagholi, Pune, Maharashtra 412207',
  accountType: 'Saving',
  accountNo: '50100560608282',
  ifscCode: 'HDFC0009332'
};

// Profile API
export const getProfile = async () => {
  const profile = await profileStore.getItem('user_profile');
  if (!profile) {
    await profileStore.setItem('user_profile', defaultProfile);
    return defaultProfile;
  }
  return profile;
};

export const saveProfile = async (profile) => {
  await profileStore.setItem('user_profile', profile);
  return profile;
};

// Clients API
export const getClients = async () => {
  const clients = [];
  await clientsStore.iterate((value) => {
    clients.push(value);
  });
  return clients.sort((a, b) => b.createdAt - a.createdAt);
};

export const addClient = async (clientData) => {
  const id = uuidv4();
  const client = { ...clientData, id, createdAt: Date.now() };
  await clientsStore.setItem(id, client);
  return client;
};

export const updateClientStatus = async (id, status) => {
  const client = await clientsStore.getItem(id);
  if (client) {
    client.status = status;
    await clientsStore.setItem(id, client);
  }
};

export const deleteClient = async (id) => {
  await clientsStore.removeItem(id);
};

// Invoices API
export const getInvoices = async () => {
  const invoices = [];
  await invoicesStore.iterate((value) => {
    invoices.push(value);
  });
  return invoices.sort((a, b) => b.createdAt - a.createdAt);
};

export const saveInvoice = async (invoiceData) => {
  const id = uuidv4();
  const invoice = { ...invoiceData, id, createdAt: Date.now() };
  await invoicesStore.setItem(id, invoice);
  return invoice;
};
