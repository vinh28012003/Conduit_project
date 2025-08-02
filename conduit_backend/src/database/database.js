import { PrismaClient } from "@prisma/client";
import "dotenv/config";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Disconnected from the database successfully");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    throw error;
  }
};
