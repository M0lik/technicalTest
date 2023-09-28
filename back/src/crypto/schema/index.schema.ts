import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Price } from './price.schema';

export type CryptoIndexDocument = HydratedDocument<CryptoIndex>;

@Schema()
export class CryptoIndex {
  @Prop()
  id: string;

  @Prop()
  symbol: string;

  @Prop()
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Price' }] })
  prices: Price[];
}

export const CryptoIndexSchema = SchemaFactory.createForClass(CryptoIndex);
