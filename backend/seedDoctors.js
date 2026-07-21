
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import Doctor from './models/doctorModel.js';

const MONGODB_URI = process.env.MONGODB_URI;

const sampleDoctors = [
  {
    fullName: 'Dr. Arjun Mehta',
    email: 'arjun.mehta@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    speciality: 'General Physician',
    degree: 'MBBS, MD (Internal Medicine)',
    experience: 12,
    about: 'Dr. Arjun Mehta is a highly experienced general physician with over 12 years of clinical practice. He specializes in managing chronic conditions like diabetes, hypertension, and thyroid disorders. Known for his patient-first approach and thorough diagnostic skills.',
    available: true,
    fees: 500,
    address: 'Apollo Clinic, MG Road, Bengaluru'
  },
  {
    fullName: 'Dr. Priya Sharma',
    email: 'priya.sharma@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (Obstetrics & Gynaecology)',
    experience: 15,
    about: 'Dr. Priya Sharma is a senior gynecologist and obstetrician with expertise in high-risk pregnancies, fertility treatments, and minimally invasive gynecological surgeries. She has delivered over 3,000 babies and is deeply committed to women\'s health.',
    available: true,
    fees: 700,
    address: 'Fortis Hospital, Sector 62, Noida'
  },
  {
    fullName: 'Dr. Rajesh Iyer',
    email: 'rajesh.iyer@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: 9,
    about: 'Dr. Rajesh Iyer is a board-certified dermatologist specializing in acne treatment, skin allergies, psoriasis management, and cosmetic dermatology including laser treatments. He combines evidence-based medicine with the latest dermatological advances.',
    available: true,
    fees: 600,
    address: 'Skin & Glow Clinic, Anna Nagar, Chennai'
  },
  {
    fullName: 'Dr. Sneha Kulkarni',
    email: 'sneha.kulkarni@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Paediatrics), Fellowship in Neonatology',
    experience: 11,
    about: 'Dr. Sneha Kulkarni is a compassionate pediatrician with special interest in newborn care and childhood immunization. She has worked extensively in neonatal ICUs and is passionate about preventive child healthcare and developmental milestones tracking.',
    available: true,
    fees: 550,
    address: 'Rainbow Children\'s Hospital, Banjara Hills, Hyderabad'
  },
  {
    fullName: 'Dr. Vikram Singh',
    email: 'vikram.singh@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    speciality: 'Neurologist',
    degree: 'MBBS, DM (Neurology)',
    experience: 18,
    about: 'Dr. Vikram Singh is a distinguished neurologist with 18 years of experience in treating epilepsy, stroke, migraine disorders, and neurodegenerative diseases. He has published over 30 research papers in international neurology journals and is a sought-after speaker.',
    available: true,
    fees: 900,
    address: 'AIIMS Referral Clinic, Connaught Place, New Delhi'
  },
  {
    fullName: 'Dr. Ananya Desai',
    email: 'ananya.desai@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 14,
    about: 'Dr. Ananya Desai is an expert gastroenterologist specializing in liver diseases, inflammatory bowel disease, and advanced endoscopic procedures. She has performed over 5,000 endoscopies and is known for her meticulous approach to GI disorders.',
    available: true,
    fees: 800,
    address: 'Lilavati Hospital, Bandra West, Mumbai'
  },
  {
    fullName: 'Dr. Karthik Nair',
    email: 'karthik.nair@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
    speciality: 'General Physician',
    degree: 'MBBS, DNB (Family Medicine)',
    experience: 7,
    about: 'Dr. Karthik Nair is a dedicated family medicine practitioner who believes in holistic patient care. He excels in preventive health checkups, lifestyle disease management, and acute care. His friendly demeanor makes patients feel at ease.',
    available: true,
    fees: 400,
    address: 'MedPlus Clinic, Koramangala, Bengaluru'
  },
  {
    fullName: 'Dr. Meera Joshi',
    email: 'meera.joshi@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    speciality: 'Dermatologist',
    degree: 'MBBS, DVD, Fellowship in Cosmetic Dermatology',
    experience: 10,
    about: 'Dr. Meera Joshi is a renowned dermatologist with expertise in hair loss treatment, pigmentation disorders, and anti-aging therapies. She runs a state-of-the-art skin clinic equipped with the latest laser and light-based technologies.',
    available: true,
    fees: 650,
    address: 'SkinFirst Derma Centre, Deccan Gymkhana, Pune'
  },
  {
    fullName: 'Dr. Siddharth Reddy',
    email: 'siddharth.reddy@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Paediatrics)',
    experience: 8,
    about: 'Dr. Siddharth Reddy is a caring pediatrician focused on childhood nutrition, growth monitoring, and managing common childhood illnesses. He is known for his patience with young patients and for making clinic visits stress-free for both children and parents.',
    available: true,
    fees: 450,
    address: 'Care Kids Clinic, Jubilee Hills, Hyderabad'
  },
  {
    fullName: 'Dr. Nandini Chatterjee',
    email: 'nandini.chatterjee@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/72.jpg',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (OBG), DNB',
    experience: 20,
    about: 'Dr. Nandini Chatterjee is one of the most experienced gynecologists in the region with two decades of practice. She specializes in laparoscopic surgeries, PCOS management, and infertility treatment. She has trained numerous junior doctors and is a mentor figure in her field.',
    available: true,
    fees: 850,
    address: 'Ruby General Hospital, EM Bypass, Kolkata'
  },
  {
    fullName: 'Dr. Aditya Kapoor',
    email: 'aditya.kapoor@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    speciality: 'Neurologist',
    degree: 'MBBS, MD (Medicine), DM (Neurology)',
    experience: 13,
    about: 'Dr. Aditya Kapoor specializes in headache disorders, movement disorders like Parkinson\'s disease, and multiple sclerosis. He uses cutting-edge neurodiagnostic tools including EEG, EMG, and advanced neuroimaging for precise diagnosis and treatment planning.',
    available: true,
    fees: 950,
    address: 'Max Super Speciality Hospital, Saket, New Delhi'
  },
  {
    fullName: 'Dr. Kavitha Rangan',
    email: 'kavitha.rangan@medisync.com',
    password: 'Doctor@123',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 16,
    about: 'Dr. Kavitha Rangan is a leading gastroenterologist with special expertise in hepatology and pancreatic disorders. She pioneered several minimally invasive endoscopic techniques in her hospital and actively participates in clinical trials for novel GI treatments.',
    available: true,
    fees: 750,
    address: 'Apollo Hospital, Greams Road, Chennai'
  },
];

async function seedDoctors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check how many doctors already exist
    const existingCount = await Doctor.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} doctors. Skipping seed to avoid duplicates.`);
      console.log('   To re-seed, first clear the doctors collection manually.');
      process.exit(0);
    }

    // Hash all passwords
    const salt = await bcrypt.genSalt(10);
    const doctorsToInsert = await Promise.all(
      sampleDoctors.map(async (doc) => ({
        ...doc,
        password: await bcrypt.hash(doc.password, salt),
      }))
    );

    const result = await Doctor.insertMany(doctorsToInsert);
    console.log(`🎉 Successfully seeded ${result.length} doctors:`);
    result.forEach((doc, i) => {
      console.log(`   ${i + 1}. ${doc.fullName} — ${doc.speciality} (${doc.email})`);
    });

    console.log('\n📋 All doctors can log in with password: Doctor@123');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDoctors();
