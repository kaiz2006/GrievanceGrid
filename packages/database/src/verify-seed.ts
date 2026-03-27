import * as dotenv from "dotenv";
import { db } from "./index";
import { users, grievances } from "./schema";

dotenv.config({ path: ".env.local" });

async function verifySeed() {
  try {
    const userCount = await db.select().from(users);
    const grievanceCount = await db.select().from(grievances);
    
    console.log('✅ Demo Seed Verification:');
    console.log(`   Users: ${userCount.length}`);
    console.log(`   Grievances: ${grievanceCount.length}`);
    
    console.log('\n👤 Demo Users:');
    userCount.forEach(u => console.log(`   ${u.email} (${u.role})`));
    
    console.log('\n📋 Officer-Assigned Grievances:');
    const officerGrievances = grievanceCount.filter(g => 
      g.assigned_officer_id || 
      ["IN_PROGRESS", "ASSIGNED", "ROUTED", "AI_PROCESSED"].includes(g.status)
    );
    console.log(`   Count: ${officerGrievances.length}`);
    
    officerGrievances.slice(0, 5).forEach(g => {
      console.log(`   ${g.grid_id} - ${g.title} (${g.status})`);
    });
    
    console.log('\n🎯 Ready for testing!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifySeed().then(() => process.exit(0));
