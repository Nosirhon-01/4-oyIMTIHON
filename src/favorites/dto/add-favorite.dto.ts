import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiPropertyOptional({ example: 12, description: 'Movie ID (snake_case)' })
  movie_id?: number;

  @ApiPropertyOptional({ example: 12, description: 'Movie ID (camelCase)' })
  movieId?: number;
}
