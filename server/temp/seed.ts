require("dotenv").config();

import { ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { Listing, ListingType, User } from "../src/lib/types";
import { listings as mockListings } from "./mock-listings";
import { users as mockUsers } from "./mock-users";

const listings: Listing[] = mockListings;
const users: User[] = mockUsers;

const seed = async () => {
  try {
    console.log("[seed] : running...");

    const db = await connectDatabase();

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }

    for (const user of users) {
      await db.users.insertOne(user);
    }

    console.log("[seed] : success");
  } catch {
    throw new Error("failed to seed database");
  }
};

seed();
