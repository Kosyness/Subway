import { Schema, model } from 'mongoose';

export interface OpenHour {
  day: string;
  start: string;
  end: string;
}

export interface Store {
  name: string;
  url?: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  phone_numbers: string[];
  fax_numbers: string[];
  emails: string[];
  website: string;
  open_hours: OpenHour[];

  coordinates: {
    latitude: number;
    longitude: number;
  };

  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    pinterest: string;
    youtube: string;
    [name: string]: string;
  };
}

const RequiredString = {
  type: String,
  required: true,
};

const StoreSchema = new Schema<Store>(
  {
    name: RequiredString,
    url: String,
    address: {
      street: RequiredString,
      city: RequiredString,
      state: RequiredString,
      zip: RequiredString,
      country: RequiredString,
    },

    phone_numbers: [String],

    fax_numbers: [String],

    emails: [String],

    website: String,

    open_hours: [
      {
        _id: false,
        day: {
          type: String,
          required: true,
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
        start: RequiredString,
        end: RequiredString,
      },
    ],

    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const StoreModel = model('store', StoreSchema);

export default StoreModel;
