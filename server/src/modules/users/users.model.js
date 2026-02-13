// server/src/modules/users/users.model.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    city: String,
    street: String,
    number: Number,
    zipcode: String,
    geo: {
      lat: String,
      long: String,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    source: { type: String, default: "local" }, // local | fakestore
    sourceId: { type: String, index: true },    // fakestore user id
    email: { type: String, index: true },
    username: String,
    phone: String,

    name: String,
    firstName: String,
    lastName: String,
    address: AddressSchema,

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

export const User = mongoose.model("User", UserSchema);
