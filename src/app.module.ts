import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from './redis/redis.module'
import { GeographyModule } from './geography/geography.module'
import { CustomerModule } from './customer/customer.module'
import { MenuModule } from './menu/menu.module'

@Module({
  imports: [UserModule, AuthModule, RedisModule, GeographyModule, CustomerModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
