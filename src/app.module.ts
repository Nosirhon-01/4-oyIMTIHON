import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule,
    UsersModule,
    MoviesModule,
    SubscriptionsModule,
    ReviewsModule,
    FavoritesModule,
    WatchHistoryModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}