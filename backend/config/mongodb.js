import mongoose from "mongoose";

const connectDB = async () => {
    const atlasUri = process.env.MONGODB_URI;
    const localUri = process.env.MONGODB_URI_LOCAL; // optional fallback

    const mask = (uri) => {
        try {
            const u = new URL(uri);
            if (u.password) {
                u.password = "****";
                return u.toString();
            }
            return uri;
        } catch {
            return uri || "";
        }
    };

    const tryConnect = async (uri, label) => {
        const dbName = process.env.MONGODB_DB_NAME || "prescripto";
        try {
            await mongoose.connect(uri, {
                dbName,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 20000,
                socketTimeoutMS: 45000,
            });
            console.log(`✅ MongoDB Connected (${label})`);
            return true;
        } catch (error) {
            console.error(`❌ MongoDB Connection Error (${label}):`, error.message);
            console.error(`   URI: ${mask(uri)}`);
            if (label === "Atlas" && error.name === "MongooseServerSelectionError") {
                console.error("   Tip: In MongoDB Atlas, add your current IP under Network Access or allow 0.0.0.0/0 temporarily for development.");
                console.error("   Docs: https://www.mongodb.com/docs/atlas/security-whitelist/");
            }
            return false;
        }
    };

    if (!atlasUri && !localUri) {
        console.error("❌ No MongoDB URI found. Set MONGODB_URI (Atlas) or MONGODB_URI_LOCAL (.env) to continue.");
        process.exit(1);
    }

    // Prefer Atlas, then fallback to local if provided
    let connected = false;
    if (atlasUri) {
        connected = await tryConnect(atlasUri, "Atlas");
    }
    if (!connected && localUri) {
        console.warn("⚠️ Falling back to local MongoDB (MONGODB_URI_LOCAL)");
        connected = await tryConnect(localUri, "Local");
    }

    if (!connected) {
        console.error("❌ MongoDB connection failed. Server will exit.");
        process.exit(1); // Stop server if DB fails
    }
};

export default connectDB;
