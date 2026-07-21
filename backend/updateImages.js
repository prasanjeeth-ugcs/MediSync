import mongoose from 'mongoose';
import 'dotenv/config';
import Doctor from './models/doctorModel.js';

const MONGODB_URI = process.env.MONGODB_URI;

// Updated image URLs — replaced with portrait IDs that look more South Asian
const imageUpdates = [
  // Original doctors (seedDoctors.js)
  { email: 'arjun.mehta@medisync.com',       image: 'https://randomuser.me/api/portraits/men/78.jpg' },
  { email: 'priya.sharma@medisync.com',       image: 'https://randomuser.me/api/portraits/women/56.jpg' },
  { email: 'rajesh.iyer@medisync.com',        image: 'https://randomuser.me/api/portraits/men/83.jpg' },
  { email: 'sneha.kulkarni@medisync.com',     image: 'https://randomuser.me/api/portraits/women/74.jpg' },
  { email: 'vikram.singh@medisync.com',       image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { email: 'ananya.desai@medisync.com',       image: 'https://randomuser.me/api/portraits/women/54.jpg' },
  { email: 'karthik.nair@medisync.com',       image: 'https://randomuser.me/api/portraits/men/57.jpg' },
  { email: 'meera.joshi@medisync.com',        image: 'https://randomuser.me/api/portraits/women/34.jpg' },
  { email: 'siddharth.reddy@medisync.com',    image: 'https://randomuser.me/api/portraits/men/39.jpg' },
  { email: 'nandini.chatterjee@medisync.com', image: 'https://randomuser.me/api/portraits/women/58.jpg' },
  { email: 'aditya.kapoor@medisync.com',      image: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { email: 'kavitha.rangan@medisync.com',     image: 'https://randomuser.me/api/portraits/women/26.jpg' },

  // Additional doctors (seedMore.js)
  { email: 'rohan.patel@medisync.com',        image: 'https://randomuser.me/api/portraits/men/43.jpg' },
  { email: 'lakshmi.venkatesh@medisync.com',  image: 'https://randomuser.me/api/portraits/women/36.jpg' },
  { email: 'sameer.khan@medisync.com',        image: 'https://randomuser.me/api/portraits/men/68.jpg' },
  { email: 'divya.krishnan@medisync.com',     image: 'https://randomuser.me/api/portraits/women/90.jpg' },
  { email: 'harsh.gupta@medisync.com',        image: 'https://randomuser.me/api/portraits/men/73.jpg' },
  { email: 'ritu.agarwal@medisync.com',       image: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { email: 'manoj.tiwari@medisync.com',       image: 'https://randomuser.me/api/portraits/men/87.jpg' },
  { email: 'pooja.bansal@medisync.com',       image: 'https://randomuser.me/api/portraits/women/79.jpg' },
];

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0, notFound = 0;

    for (const { email, image } of imageUpdates) {
      const result = await Doctor.updateOne({ email }, { $set: { image } });
      if (result.matchedCount > 0) {
        console.log(`✅ Updated image for ${email}`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${email}`);
        notFound++;
      }
    }

    console.log(`\n🎉 Done! Updated ${updated} doctors. Not found: ${notFound}.`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

updateImages();
