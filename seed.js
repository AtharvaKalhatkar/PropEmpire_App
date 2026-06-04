import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase keys in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('Seeding demo data...');

  // 1. Seed Profile
  const profileData = {
    id: 1,
    agentName: 'SAURABH SHIVAJI GADE',
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
  
  const { error: profileError } = await supabase.from('profile').upsert(profileData);
  if (profileError) console.error('Error seeding profile:', profileError);
  else console.log('Profile seeded successfully.');

  // 2. Seed Client
  const clientData = {
    name: 'Mrs. Priyanka Swapnil Patil',
    phone: '9876543210',
    email: 'priyanka@example.com',
    project: 'Vision 24 Degree',
    propertyType: 'Flat',
    budget: '60 Lacs',
    leadSource: 'Reference',
    status: 'Closed',
    notes: 'Demo client from invoice.'
  };

  const { error: clientError } = await supabase.from('clients').insert([clientData]);
  if (clientError) console.error('Error seeding client:', clientError);
  else console.log('Client seeded successfully.');

  // 3. Seed Invoice
  const invoiceData = {
    invoiceNo: '10',
    date: new Date('2026-03-23T00:00:00Z'),
    customerName: 'Mrs. Priyanka Swapnil Patil',
    customerPhone: '9876543210',
    customerEmail: 'priyanka@example.com',
    billedToAddress: 'GAT NO-519,520, Opp Ganesh mandir,\nNashik-Pune Highway, Borate wasti Moshi,\nPune, Maharashtra, 412105',
    billedToGstin: '27AASFG1860AIZI',
    projectName: 'Vision 24 Degree',
    tower: 'B',
    flatNo: '1904',
    agreementValue: 5924700,
    brokeragePercent: 3,
    executiveBonus: 21000
  };

  const { error: invoiceError } = await supabase.from('invoices').insert([invoiceData]);
  if (invoiceError) console.error('Error seeding invoice:', invoiceError);
  else console.log('Invoice seeded successfully.');

  console.log('Seeding complete!');
}

seedData();
