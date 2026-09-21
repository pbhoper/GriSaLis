import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from "./entity/rating.entity";
import { RatingResolver } from "./rated.resolver";
import { RatingService } from "./rated.service";

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingService, RatingResolver],
  exports: [RatingService],
})
export class RatingModule {}