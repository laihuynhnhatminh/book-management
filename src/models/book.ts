import { model, Schema } from 'mongoose';

export interface IBook {
  _id: Schema.Types.ObjectId;
  title: string;
  author: string;
  description?: string;
  enabled: boolean;
  image_url?: string;
  user_id: Schema.Types.ObjectId;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    image_url: {
      type: String
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export const Book = model<IBook>('Book', bookSchema);
