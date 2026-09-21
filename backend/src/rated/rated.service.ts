import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingInput } from './dto/create-rating.input';
import {Rating} from "./entity/rating.entity";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {
  }

  async createRating(input: CreateRatingInput): Promise<Rating> {
    const newRating = this.ratingRepository.create(input);
    return this.ratingRepository.save(newRating);
  }
}