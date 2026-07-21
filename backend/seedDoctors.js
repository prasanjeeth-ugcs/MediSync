import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import Doctor from './models/doctorModel.js';

const MONGODB_URI = process.env.MONGODB_URI;

// ─── Fetch real Indian-looking portraits from randomuser.me ──────────────────
async function fetchIndianPortraits() {
  try {
    const res = await fetch(`https://randomuser.me/api/?nat=in&results=25&inc=picture&noinfo`);
    const json = await res.json();
    const men = json.results.filter(r => r).map(r => r.picture.large);
    // Fetch women separately
    const res2 = await fetch(`https://randomuser.me/api/?nat=in&gender=female&results=15&inc=picture&noinfo`);
    const json2 = await res2.json();
    const women = json2.results.map(r => r.picture.large);
    return { men, women };
  } catch (e) {
    console.warn('⚠️  Could not fetch portraits from API, using fallback URLs');
    return null;
  }
}

// ─── Doctor seed data ─────────────────────────────────────────────────────────
const doctors = [
  // ── General Physicians ──────────────────────────────────────────────────────
  {
    fullName: 'Dr. Arjun Mehta',
    email: 'arjun.mehta@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'General Physician',
    degree: 'MBBS, MD (Internal Medicine)',
    experience: 12,
    about: 'Dr. Arjun Mehta is a highly experienced general physician with over 12 years of clinical practice. He specializes in managing chronic conditions like diabetes, hypertension, and thyroid disorders. Known for his patient-first approach and thorough diagnostic skills.',
    available: true,
    fees: 500,
    address: 'Apollo Clinic, MG Road, Bengaluru'
  },
  {
    fullName: 'Dr. Karthik Nair',
    email: 'karthik.nair@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'General Physician',
    degree: 'MBBS, DNB (Family Medicine)',
    experience: 7,
    about: 'Dr. Karthik Nair is a dedicated family medicine practitioner who believes in holistic patient care. He excels in preventive health checkups, lifestyle disease management, and acute care. His friendly demeanor makes patients feel at ease.',
    available: true,
    fees: 400,
    address: 'MedPlus Clinic, Koramangala, Bengaluru'
  },
  {
    fullName: 'Dr. Rohan Patel',
    email: 'rohan.patel@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: 6,
    about: 'Dr. Rohan Patel is a young and dynamic general physician known for his evidence-based approach. He specializes in managing respiratory infections, seasonal allergies, and metabolic syndrome. Fluent in English, Hindi, and Gujarati.',
    available: true,
    fees: 350,
    address: 'Sterling Hospital, Drive-In Road, Ahmedabad'
  },
  {
    fullName: 'Dr. Manoj Tiwari',
    email: 'manoj.tiwari@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'General Physician',
    degree: 'MBBS, FCGP',
    experience: 25,
    about: 'Dr. Manoj Tiwari is a veteran family physician with 25 years of practice in community healthcare. He is trusted by generations of families for routine checkups, elderly care, and managing multi-organ conditions. Known for his calm, reassuring bedside manner.',
    available: true,
    fees: 300,
    address: 'Tiwari Family Clinic, Hazratganj, Lucknow'
  },

  // ── Gynecologists ────────────────────────────────────────────────────────────
  {
    fullName: 'Dr. Priya Sharma',
    email: 'priya.sharma@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (Obstetrics & Gynaecology)',
    experience: 15,
    about: 'Dr. Priya Sharma is a senior gynecologist and obstetrician with expertise in high-risk pregnancies, fertility treatments, and minimally invasive gynecological surgeries. She has delivered over 3,000 babies and is deeply committed to women\'s health.',
    available: true,
    fees: 700,
    address: 'Fortis Hospital, Sector 62, Noida'
  },
  {
    fullName: 'Dr. Nandini Chatterjee',
    email: 'nandini.chatterjee@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (OBG), DNB',
    experience: 20,
    about: 'Dr. Nandini Chatterjee is one of the most experienced gynecologists in the region with two decades of practice. She specializes in laparoscopic surgeries, PCOS management, and infertility treatment. She has trained numerous junior doctors and is a mentor figure in her field.',
    available: true,
    fees: 850,
    address: 'Ruby General Hospital, EM Bypass, Kolkata'
  },
  {
    fullName: 'Dr. Ritu Agarwal',
    email: 'ritu.agarwal@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (OBG), Fellowship in Reproductive Medicine',
    experience: 13,
    about: 'Dr. Ritu Agarwal is a fertility specialist and gynecologist with expertise in IVF, IUI, and reproductive endocrinology. She has helped over 500 couples achieve successful pregnancies and is passionate about destigmatizing infertility treatment.',
    available: true,
    fees: 800,
    address: 'Cloudnine Hospital, Malad West, Mumbai'
  },

  // ── Dermatologists ───────────────────────────────────────────────────────────
  {
    fullName: 'Dr. Rajesh Iyer',
    email: 'rajesh.iyer@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: 9,
    about: 'Dr. Rajesh Iyer is a board-certified dermatologist specializing in acne treatment, skin allergies, psoriasis management, and cosmetic dermatology including laser treatments. He combines evidence-based medicine with the latest dermatological advances.',
    available: true,
    fees: 600,
    address: 'Skin & Glow Clinic, Anna Nagar, Chennai'
  },
  {
    fullName: 'Dr. Meera Joshi',
    email: 'meera.joshi@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Dermatologist',
    degree: 'MBBS, DVD, Fellowship in Cosmetic Dermatology',
    experience: 10,
    about: 'Dr. Meera Joshi is a renowned dermatologist with expertise in hair loss treatment, pigmentation disorders, and anti-aging therapies. She runs a state-of-the-art skin clinic equipped with the latest laser and light-based technologies.',
    available: true,
    fees: 650,
    address: 'SkinFirst Derma Centre, Deccan Gymkhana, Pune'
  },
  {
    fullName: 'Dr. Sameer Khan',
    email: 'sameer.khan@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology), Fellowship in Trichology',
    experience: 11,
    about: 'Dr. Sameer Khan is an acclaimed dermatologist with deep expertise in hair transplantation, vitiligo treatment, and surgical dermatology. He has successfully treated over 8,000 patients and regularly conducts dermatology awareness camps.',
    available: true,
    fees: 700,
    address: 'Kaya Skin Clinic, Linking Road, Mumbai'
  },
  {
    fullName: 'Dr. Pooja Bansal',
    email: 'pooja.bansal@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology & Venereology)',
    experience: 5,
    about: 'Dr. Pooja Bansal is a young dermatologist bringing fresh, research-driven perspectives to skin care. She specializes in acne scar revision, chemical peels, and PRP therapy for hair loss. Active on social media, she educates thousands about skin health daily.',
    available: true,
    fees: 500,
    address: 'GlowDerm Aesthetics, Rajouri Garden, New Delhi'
  },

  // ── Pediatricians ────────────────────────────────────────────────────────────
  {
    fullName: 'Dr. Sneha Kulkarni',
    email: 'sneha.kulkarni@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Paediatrics), Fellowship in Neonatology',
    experience: 11,
    about: 'Dr. Sneha Kulkarni is a compassionate pediatrician with special interest in newborn care and childhood immunization. She has worked extensively in neonatal ICUs and is passionate about preventive child healthcare and developmental milestones tracking.',
    available: true,
    fees: 550,
    address: 'Rainbow Children\'s Hospital, Banjara Hills, Hyderabad'
  },
  {
    fullName: 'Dr. Siddharth Reddy',
    email: 'siddharth.reddy@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Paediatrics)',
    experience: 8,
    about: 'Dr. Siddharth Reddy is a caring pediatrician focused on childhood nutrition, growth monitoring, and managing common childhood illnesses. He is known for his patience with young patients and for making clinic visits stress-free for both children and parents.',
    available: true,
    fees: 450,
    address: 'Care Kids Clinic, Jubilee Hills, Hyderabad'
  },
  {
    fullName: 'Dr. Divya Krishnan',
    email: 'divya.krishnan@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Pediatricians',
    degree: 'MBBS, DCH, DNB (Paediatrics)',
    experience: 14,
    about: 'Dr. Divya Krishnan is a senior pediatrician with extensive experience in childhood asthma management, vaccination counseling, and adolescent health. She is a certified lactation consultant and runs a popular parenting workshop series.',
    available: true,
    fees: 600,
    address: 'Amrita Hospital, Ponekkara, Kochi'
  },

  // ── Neurologists ─────────────────────────────────────────────────────────────
  {
    fullName: 'Dr. Vikram Singh',
    email: 'vikram.singh@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Neurologist',
    degree: 'MBBS, DM (Neurology)',
    experience: 18,
    about: 'Dr. Vikram Singh is a distinguished neurologist with 18 years of experience in treating epilepsy, stroke, migraine disorders, and neurodegenerative diseases. He has published over 30 research papers in international neurology journals and is a sought-after speaker.',
    available: true,
    fees: 900,
    address: 'AIIMS Referral Clinic, Connaught Place, New Delhi'
  },
  {
    fullName: 'Dr. Aditya Kapoor',
    email: 'aditya.kapoor@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Neurologist',
    degree: 'MBBS, MD (Medicine), DM (Neurology)',
    experience: 13,
    about: 'Dr. Aditya Kapoor specializes in headache disorders, movement disorders like Parkinson\'s disease, and multiple sclerosis. He uses cutting-edge neurodiagnostic tools including EEG, EMG, and advanced neuroimaging for precise diagnosis and treatment planning.',
    available: true,
    fees: 950,
    address: 'Max Super Speciality Hospital, Saket, New Delhi'
  },
  {
    fullName: 'Dr. Lakshmi Venkatesh',
    email: 'lakshmi.venkatesh@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 22,
    about: 'Dr. Lakshmi Venkatesh is a veteran neurologist with over 22 years of experience in treating complex neurological conditions including ALS, multiple sclerosis, and refractory epilepsy. She heads the neurology department at her hospital and trains residents.',
    available: true,
    fees: 1000,
    address: 'Manipal Hospital, HAL Airport Road, Bengaluru'
  },

  // ── Gastroenterologists ──────────────────────────────────────────────────────
  {
    fullName: 'Dr. Ananya Desai',
    email: 'ananya.desai@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 14,
    about: 'Dr. Ananya Desai is an expert gastroenterologist specializing in liver diseases, inflammatory bowel disease, and advanced endoscopic procedures. She has performed over 5,000 endoscopies and is known for her meticulous approach to GI disorders.',
    available: true,
    fees: 800,
    address: 'Lilavati Hospital, Bandra West, Mumbai'
  },
  {
    fullName: 'Dr. Kavitha Rangan',
    email: 'kavitha.rangan@medisync.com',
    password: 'Doctor@123',
    gender: 'female',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 16,
    about: 'Dr. Kavitha Rangan is a leading gastroenterologist with special expertise in hepatology and pancreatic disorders. She pioneered several minimally invasive endoscopic techniques in her hospital and actively participates in clinical trials for novel GI treatments.',
    available: true,
    fees: 750,
    address: 'Apollo Hospital, Greams Road, Chennai'
  },
  {
    fullName: 'Dr. Harsh Gupta',
    email: 'harsh.gupta@medisync.com',
    password: 'Doctor@123',
    gender: 'male',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 17,
    about: 'Dr. Harsh Gupta is a nationally recognized gastroenterologist specializing in therapeutic ERCP, liver transplant evaluation, and Crohn\'s disease management. He is associated with multiple hospitals in the NCR region and has authored a textbook on GI emergencies.',
    available: true,
    fees: 900,
    address: 'Medanta – The Medicity, Sector 38, Gurugram'
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────
async function seedDoctors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Fetch Indian-nationality portraits from randomuser.me
    console.log('🌐 Fetching Indian portraits from randomuser.me...');
    const portraits = await fetchIndianPortraits();

    let maleIdx = 0, femaleIdx = 0;
    const getPortrait = (gender) => {
      if (!portraits) return null; // will use existing image if already in DB
      return gender === 'female'
        ? portraits.women[femaleIdx++ % portraits.women.length]
        : portraits.men[maleIdx++ % portraits.men.length];
    };

    const salt = await bcrypt.genSalt(10);
    let added = 0, updated = 0, skipped = 0;

    for (const doc of doctors) {
      const { gender, ...docData } = doc;
      const portrait = getPortrait(gender);
      const existing = await Doctor.findOne({ email: doc.email });

      if (existing) {
        // Only update image if portrait fetched successfully
        if (portrait) {
          await Doctor.updateOne({ email: doc.email }, { $set: { image: portrait } });
          console.log(`🔄 Updated image: ${doc.fullName}`);
          updated++;
        } else {
          console.log(`⏭️  Skipped (already exists): ${doc.fullName}`);
          skipped++;
        }
        continue;
      }

      const hashed = await bcrypt.hash(docData.password, salt);
      await Doctor.create({
        ...docData,
        password: hashed,
        image: portrait || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=0d9488&color=fff&size=200`,
      });
      console.log(`✅ Added: ${doc.fullName} — ${doc.speciality}`);
      added++;
    }

    console.log(`\n🎉 Done! Added: ${added}, Images updated: ${updated}, Skipped: ${skipped}`);
    console.log('📋 Doctor login password: Doctor@123');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDoctors();
