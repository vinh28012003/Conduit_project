const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Disconnected from the database successfully");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    throw error;
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
};
