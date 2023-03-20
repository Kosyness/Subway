import { Router } from 'express';
import { getMongoConnection } from '../../models';
import StoreModel, { Store } from '../../models/store';
import * as csv from 'csv';
import axios from 'axios';
import { Request, Response } from 'express';

const router = Router();

export const get_all_stores = async (req: Request , res: Response) => {
    await getMongoConnection();

    const limit = parseInt(req.query.limit as string) || 10;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const skip = (page - 1) * limit;

    const stores = await StoreModel.find().limit(limit).skip(skip);

    res.json(stores);
};

router.get('/', get_all_stores);

export const search_store = async (req: Request , res: Response) => {
    await getMongoConnection();

    const limit = parseInt(req.query.limit as string) || 10;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const skip = (page - 1) * limit;

    const stores = await StoreModel.find({
        // Although not the most secure way, this is a quick and easy way to search for other fields, including city
        ...req.query,
    }).limit(limit).skip(skip).exec();

    res.status(200).json(stores)
}

router.get('/search', search_store);

export const get_store_by_id = async (req: Request , res: Response) => {
    await getMongoConnection();

    const store = await StoreModel.findById(req.params.id);

    if (!store) {
        return res.status(404).json({
            error: 'Store not found',
        });
    }

    res.json(store);
};
router.get('/:id', get_store_by_id);


const store_open_hours = (store: { open_hours?: string }) => {
    if (!store.open_hours) return [];
  
    const open_hours = store.open_hours?.split(',') || [];
  
    return open_hours.map((open_hour: string) => {
      // format: Day 9:00 AM - 5:00 PM
      const regex = /(\w+)\s(\d{1,2}:\d{2}\s\w{2})\s-\s(\d{1,2}:\d{2}\s\w{2})/;
  
      const match = open_hour.match(regex);
  
      if (!match) {
        return null;
      }
  
      const [_, day, start, end] = match;
  
      return {
        day: day.toLowerCase(),
        // Should parse into actual Numbers, for searchability
        start: start,
        // Should parse into actual Numbers, for searchability
        end: end,
      };
    }).filter(Boolean);
  };

// CREATE STORES:
router.post('/', async (req, res) => { 
    await getMongoConnection();
    
    const stores_exist = await StoreModel.countDocuments().exec();

    if(stores_exist > 0) {
        res.status(400).json({
            error: 'Stores already exist',
        });
    }
    
    const STORES_URI = process.env.STORES_URI || 'https://query.data.world/s/e7j36w22izsnudnygv6yytjp5so64a?dws=00000';

    const stores_res = await axios.get(
        STORES_URI, 
    );

    const stores_csv = stores_res.data;

    const stores_parser = csv.parse(stores_csv, {
        columns: true,
        skip_empty_lines: true,
      });
    
      const stores: Partial<Store>[] = [];
      for await (const store of stores_parser) {
        stores.push(
          new StoreModel({
            name: store.name,
            url: store.url,
            address: {
              street: store.street_address,
              city: store.city,
              state: store.state,
              zip: store.zip_code,
              country: store.country,
            },
            phone_numbers: [store.phone_number_1, store.phone_number_2].filter(
              Boolean
            ),
            fax_numbers: [store.fax_number_1, store.fax_number_2].filter(Boolean),
            emails: [store.email_1, store.email_2].filter(Boolean),
            open_hours: store_open_hours(store),
          })
        );
      }
    
      const saved_stores = await StoreModel.insertMany(stores);
    

    res.status(200).json({
        stores_added: stores.length,
    });

})


export default router;