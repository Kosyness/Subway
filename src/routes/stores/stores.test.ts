import { get_all_stores, get_store_by_id, search_store } from '.';
import { createMocks} from 'node-mocks-http';
import { app, app as express_app } from '../../app';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getMongoConnection } from '../../models';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import StoreModel, { Store } from '../../models/store';

describe('Stores', () => {
    jest.setTimeout(30000);

    
    it('should get all stores', async () => { 
        const req_mock = getMockReq({
            query: {
            }
        });

        const { res: res_mock } = getMockRes();

        await get_all_stores(req_mock, res_mock);

        const res: any[] = (res_mock.json as any).mock.calls[0][0]

        expect(res.length).toBeGreaterThan(0);  
    })

    it('should get a store', async () => { 
        const store = await StoreModel.findOne().exec();
        
        const req_mock = getMockReq({
            params: { 
                id: `${store?._id}`
            },
            query: {
            }
        });

        const { res: res_mock } = getMockRes();

        await get_store_by_id(req_mock, res_mock);

        const res: Partial<Store> = (res_mock.json as any).mock.calls[0][0]
        
        expect(res.name).toBeTruthy();  
    })

    it('should get all stores with city: Alexandria', async () => { 
        const store = await StoreModel.findOne().exec();
        
        const req_mock = getMockReq({
            params: { 
            },
            query: {
                'address.city': 'Alexandria'
            }
        });

        const { res: res_mock } = getMockRes();

        await search_store(req_mock, res_mock);

        const res: Partial<Store>[] = (res_mock.json as any).mock.calls[0][0]
        
        expect(res.length).toBeGreaterThan(0);  
    })

    beforeAll(async () => {

        dotenv.config();
        await getMongoConnection();

        await new Promise((resolve, reject) => app.listen(3080, async () => {
            try {
                await axios.post('http://localhost:3000/stores')
            }
            catch (e) {}
            finally { 
            resolve(undefined);
            }
        }));
    });

    afterAll(async () => {
        mongoose.disconnect();
    })
})
