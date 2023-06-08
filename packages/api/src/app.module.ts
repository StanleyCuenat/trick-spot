import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule.forRoot('./googleApplicationCredentials.json', {
      storageBucket: 'gs://trickspot-20ae3.appspot.com',
    }),
    UsersModule,
  ],
})
export class AppModule {}
