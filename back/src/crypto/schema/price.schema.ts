import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CryptoIndex } from './index.schema';

export type PriceDocument = HydratedDocument<Price>;

@Schema({ timestamps: true })
export class Price {
  @Prop()
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'CryptoIndex' })
  currency: CryptoIndex;

  @Prop()
  usdPrice: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
