import { Schema, model, Document } from 'mongoose';
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
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
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

userSchema.methods.checkPassword = function(
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const Users = model<IUser>('Users', userSchema);
export default Users;

export interface IUser extends Document {
  avatar?: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalCode: string;
  password: string;
  isVerified?: boolean;
  addresses?: [IUserAddress];
  createdAt: Date;
  updatedAt: Date;

  checkPassword(password: string): Promise<boolean>;
}

export interface IUserAddress extends Document {
  receiverName: string;
  phone?: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
}
