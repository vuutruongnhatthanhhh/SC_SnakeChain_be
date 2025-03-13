import { Module } from '@nestjs/common';
import { SourcecodeService } from './sourcecode.service';
import { SourcecodeController } from './sourcecode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceCode, SourceCodeSchema } from './schemas/sourcecode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SourceCode.name, schema: SourceCodeSchema },
    ]),
  ],
  controllers: [SourcecodeController],
  providers: [SourcecodeService],
  exports: [SourcecodeService],
})
export class SourcecodeModule {}
