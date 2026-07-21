import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import Doctor from './models/doctorModel.js';

const MONGODB_URI = process.env.MONGODB_URI;

const moreDoctors = [
  {
    fullName: 'Dr. Rohan Patel',
    email: 'rohan.patel@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    speciality: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: 6,
    about: 'Dr. Rohan Patel is a young and dynamic general physician known for his evidence-based approach. He specializes in managing respiratory infections, seasonal allergies, and metabolic syndrome. Fluent in English, Hindi, and Gujarati.',
    available: true,
    fees: 350,
    address: 'Sterling Hospital, Drive-In Road, Ahmedabad'
  },
  {
    fullName: 'Dr. Lakshmi Venkatesh',
    email: 'lakshmi.venkatesh@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/51.jpg',
    speciality: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 22,
    about: 'Dr. Lakshmi Venkatesh is a veteran neurologist with over 22 years of experience in treating complex neurological conditions including ALS, multiple sclerosis, and refractory epilepsy. She heads the neurology department at her hospital and trains residents.',
    available: true,
    fees: 1000,
    address: 'Manipal Hospital, HAL Airport Road, Bengaluru'
  },
  {
    fullName: 'Dr. Sameer Khan',
    email: 'sameer.khan@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology), Fellowship in Trichology',
    experience: 11,
    about: 'Dr. Sameer Khan is an acclaimed dermatologist with deep expertise in hair transplantation, vitiligo treatment, and surgical dermatology. He has successfully treated over 8,000 patients and regularly conducts dermatology awareness camps.',
    available: true,
    fees: 700,
    address: 'Kaya Skin Clinic, Linking Road, Mumbai'
  },
  {
    fullName: 'Dr. Divya Krishnan',
    email: 'divya.krishnan@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/37.jpg',
    speciality: 'Pediatricians',
    degree: 'MBBS, DCH, DNB (Paediatrics)',
    experience: 14,
    about: 'Dr. Divya Krishnan is a senior pediatrician with extensive experience in childhood asthma management, vaccination counseling, and adolescent health. She is a certified lactation consultant and runs a popular parenting workshop series.',
    available: true,
    fees: 600,
    address: 'Amrita Hospital, Ponekkara, Kochi'
  },
  {
    fullName: 'Dr. Harsh Gupta',
    email: 'harsh.gupta@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/58.jpg',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 17,
    about: 'Dr. Harsh Gupta is a nationally recognized gastroenterologist specializing in therapeutic ERCP, liver transplant evaluation, and Crohn\'s disease management. He is associated with multiple hospitals in the NCR region and has authored a textbook on GI emergencies.',
    available: true,
    fees: 900,
    address: 'Medanta – The Medicity, Sector 38, Gurugram'
  },
  {
    fullName: 'Dr. Ritu Agarwal',
    email: 'ritu.agarwal@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/62.jpg',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (OBG), Fellowship in Reproductive Medicine',
    experience: 13,
    about: 'Dr. Ritu Agarwal is a fertility specialist and gynecologist with expertise in IVF, IUI, and reproductive endocrinology. She has helped over 500 couples achieve successful pregnancies and is passionate about destigmatizing infertility treatment.',
    available: true,
    fees: 800,
    address: 'Cloudnine Hospital, Malad West, Mumbai'
  },
  {
    fullName: 'Dr. Manoj Tiwari',
    email: 'manoj.tiwari@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/48.jpg',
    speciality: 'General Physician',
    degree: 'MBBS, FCGP',
    experience: 25,
    about: 'Dr. Manoj Tiwari is a veteran family physician with 25 years of practice in community healthcare. He is trusted by generations of families for routine checkups, elderly care, and managing multi-organ conditions. Known for his calm, reassuring bedside manner.',
    available: true,
    fees: 300,
    address: 'Tiwari Family Clinic, Hazratganj, Lucknow'
  },
  {
    fullName: 'Dr. Pooja Bansal',
    email: 'pooja.bansal@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/42.jpg',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology & Venereology)',
    experience: 5,
    about: 'Dr. Pooja Bansal is a young dermatologist bringing fresh, research-driven perspectives to skin care. She specializes in acne scar revision, chemical peels, and PRP therapy for hair loss. Active on social media, she educates thousands about skin health daily.',
    available: true,
    fees: 500,
    address: 'GlowDerm Aesthetics, Rajouri Garden, New Delhi'
  },
];

async function addMoreDoctors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    let added = 0, skipped = 0;

    for (const doc of moreDoctors) {
      const exists = await Doctor.findOne({ email: doc.email });
      if (exists) {
        console.log(`   ⏭️  Skipping ${doc.fullName} — already exists`);
        skipped++;
        continue;
      }
      const hashed = await bcrypt.hash(doc.password, salt);
      await Doctor.create({ ...doc, password: hashed });
      console.log(`   ✅ Added ${doc.fullName} — ${doc.speciality}`);
      added++;
    }

    console.log(`\n🎉 Done! Added ${added} new doctors, skipped ${skipped} existing.`);
    console.log('📋 Password for all new doctors: Doctor@123');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

addMoreDoctors();
