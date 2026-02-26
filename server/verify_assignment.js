const axios = require('axios');
const https = require('https');
const fs = require('fs');

const logStream = fs.createWriteStream('verification_results.log', {flags: 'w'});
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}
function error(msg) {
    console.error(msg);
    logStream.write('ERROR: ' + msg + '\n');
}

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const client = axios.create({
  baseURL: 'https://localhost:3443',
  httpsAgent: agent,
  validateStatus: () => true // Resolve all promises even for 4xx/5xx
});

async function runTests() {
    log("Starting Verification Tests...");

    let adminToken, user1Token, user2Token;
    let quizId, questionId1;

    // 1. Sign Up Admin
    log("\n--- 1. Register Admin ---");
    const resAdmin = await client.post('/users/signup', { username: 'admin', password: 'password', admin: true });
    log(`Status: ${resAdmin.status} ${resAdmin.statusText}`, resAdmin.data);

    // 2. Sign Up User 1
    log("\n--- 2. Register User 1 ---");
    const resUser1 = await client.post('/users/signup', { username: 'user1', password: 'password' });
    log(`Status: ${resUser1.status} ${resUser1.statusText}`, resUser1.data);

     // 3. Sign Up User 2
    log("\n--- 3. Register User 2 ---");
    const resUser2 = await client.post('/users/signup', { username: 'user2', password: 'password' });
    log(`Status: ${resUser2.status} ${resUser2.statusText}`, resUser2.data);

    // 4. Login Admin
    log("\n--- 4. Login Admin ---");
    const loginAdmin = await client.post('/users/login', { username: 'admin', password: 'password' });
    log(`Status: ${loginAdmin.status}`);
    if (loginAdmin.data.success) {
        adminToken = loginAdmin.data.token;
        log("Admin Logged In");
    } else {
        console.error("Admin Login Failed");
        return;
    }

    // 5. Login User 1
    log("\n--- 5. Login User 1 ---");
    const loginUser1 = await client.post('/users/login', { username: 'user1', password: 'password' });
    if (loginUser1.data.success) {
        user1Token = loginUser1.data.token;
        log("User 1 Logged In");
    }

    // 6. Login User 2
    log("\n--- 6. Login User 2 ---");
    const loginUser2 = await client.post('/users/login', { username: 'user2', password: 'password' });
    if (loginUser2.data.success) {
        user2Token = loginUser2.data.token;
        log("User 2 Logged In");
    }

    // 7. Test Quiz Creation (Admin Only)
    log("\n--- 7. User 1 tries to create Quiz (Expect Fail) ---");
    const createQuizFail = await client.post('/quizzes', { title: "User Quiz", description: "Fail" }, {
        headers: { Authorization: `Bearer ${user1Token}` }
    });
    log(`Status: ${createQuizFail.status} (Expected 403)`);

    log("\n--- 8. Admin creates Quiz (Expect Success) ---");
    const createQuizSuccess = await client.post('/quizzes', { title: "Admin Quiz", description: "Success" }, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    log(`Status: ${createQuizSuccess.status} (Expected 200/201)`);
    if (createQuizSuccess.status < 300) {
        quizId = createQuizSuccess.data._id;
        log(`Quiz Created ID: ${quizId}`);
    } else {
        console.error("Admin failed to create quiz, stopping.");
        return;
    }

    // 9. Test Question Creation (Author Only checks)
    log("\n--- 9. User 1 creates Question (Expect Success) ---");
    const createQ1 = await client.post('/questions', { 
        text: "User 1 Question", 
        options: ["A", "B"], 
        correctAnswerIndex: 0,
        quiz: quizId // Assuming we just link it for now, though model update removed 'quiz' requirement? No, I kept it.
        // Wait, Question model has 'quiz' required?
        // Let's check model. The 'quiz' field is required in Question model viewed earlier.
        // My createQuestion endpoint doesn't seem to enforce quiz ID in body if the model requires it?
        // Ah, creates generic question? 
        // Let's assume generic for now or provide quizId.
    }, {
        headers: { Authorization: `Bearer ${user1Token}` }
    });
    log(`Status: ${createQ1.status} (Expected 201)`);
    if (createQ1.status === 201) {
        questionId1 = createQ1.data._id;
        log(`Question 1 Created ID: ${questionId1}`);
    } else {
        console.error("Failed to create question 1", createQ1.data);
    }

    // 10. User 1 updates Question 1 (Expect Success)
    log("\n--- 10. User 1 updates Question 1 (Expect Success) ---");
    const updateQ1 = await client.put(`/questions/${questionId1}`, { text: "User 1 Updated" }, {
        headers: { Authorization: `Bearer ${user1Token}` }
    });
    log(`Status: ${updateQ1.status} (Expected 200)`);

    // 11. User 2 updates Question 1 (Expect Fail - Not Author)
    log("\n--- 11. User 2 updates Question 1 (Expect Fail 403) ---");
    const updateQ1Fail = await client.put(`/questions/${questionId1}`, { text: "User 2 Updated" }, {
        headers: { Authorization: `Bearer ${user2Token}` }
    });
    log(`Status: ${updateQ1Fail.status} (Expected 403)`);

    // 12. Admin updates Question 1 (Expect Fail - Strict Author Rule)
    log("\n--- 12. Admin updates Question 1 (Expect Fail 403) ---");
    const updateQ1Admin = await client.put(`/questions/${questionId1}`, { text: "Admin Updated" }, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    log(`Status: ${updateQ1Admin.status} (Expected 403)`);

    // 13. Test /users endpoint
    log("\n--- 13. User 1 GET /users (Expect Fail 403) ---");
    const getUsersFail = await client.get('/users', {
        headers: { Authorization: `Bearer ${user1Token}` }
    });
    log(`Status: ${getUsersFail.status} (Expected 403)`);

    log("\n--- 14. Admin GET /users (Expect Success) ---");
    const getUsersSuccess = await client.get('/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    log(`Status: ${getUsersSuccess.status} (Expected 200)`);
    log(`Users found: ${getUsersSuccess.data.length}`);

    log("\n--- Tests Completed ---");
}

runTests();
