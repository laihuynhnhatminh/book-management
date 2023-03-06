import { model, Schema } from 'mongoose';

export interface IUserRole {
  _id: Schema.Types.ObjectId;
  role: string;
}

const roleSchema = new Schema<IUserRole>({
  role: {
    type: String,
    required: true
  }
});

export const Role = model<IUserRole>('Role', roleSchema);
