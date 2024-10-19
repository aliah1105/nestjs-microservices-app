import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as joi from 'joi';

@Module({
    imports: [NestConfigModule.forRoot({
        validationSchema: joi.object({
            MONGODB_URL: joi.string().required()
        })
    })]
})
export class ConfigModule {}
