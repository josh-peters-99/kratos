import mongoose from "mongoose";
import User from "./models/User.js";
import Workout from "./models/Workout.js";
import bcrypt from "bcryptjs";

const seedData = async () => {
    try {
        const uri = 'mongodb+srv://joshpetersdev:GoMdPRNnhSYtm20M@cluster0.lqoxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace this with your actual Mongo URI
        await mongoose.connect(uri);
        
        console.log("Connected to MongoDB");

        console.log("Seeding data...");

        // Sample data
        const user1 = await User.findOne({ email: 'john@example.com' });
        if (!user1) {
            const hashedPassword1 = await bcrypt.hash('hashedPassword1', 10);
            await User.create({
                username: 'JohnDoe',
                email: 'john@example.com',
                password: hashedPassword1,
            });
            console.log('Created John Doe');
        } else {
            console.log('John Doe already exists');
        }

        const user2 = await User.findOne({ email: 'jane@example.com' });
        if (!user2) {
            const hashedPassword2 = await bcrypt.hash('hashedPassword2', 10);
            await User.create({
                username: 'JaneSmith',
                email: 'jane@example.com',
                password: hashedPassword2,
            });
            console.log('Created Jane Smith');
        } else {
            console.log('Jane Smith already exists');
        }

        // Example: Create some sample workouts for the users
        const workout1 = await Workout.create({
            user: user1 ? user1._id : (await User.findOne({ email: 'john@example.com' }))._id,
            title: 'Difficult Push Day',
            notes: 'Focus on chest and shoulders.',
        });

        const workout2 = await Workout.create({
            user: user2 ? user2._id : (await User.findOne({ email: 'jane@example.com' }))._id,
            title: 'Light Leg Day',
            notes: 'Was sore so I kept it light today.',
        });

        console.log("Data seeded successfully!");

    } catch (error) {
        console.log("Error seeding data:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();

