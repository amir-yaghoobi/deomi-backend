import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new Schema(
  {
    receiverName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    postalCode: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true, autoIndex: true }
);

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    nationalCode: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      set: function(password: string): string {
        return bcrypt.hashSync(password, 10);
      },
    },
    isVerified: { type: Boolean, default: false },
    addresses: [addressSchema],
  },
  { timestamps: true, autoIndex: true }
);

userSchema.methods.checkPassword = function(password: string) {
  return bcrypt.compare(this.password, password);
};

const User = model('Users', userSchema);
export default User;
