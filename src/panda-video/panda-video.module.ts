import { Module } from '@nestjs/common'
import { PandaVideoService } from './panda-video.service'
import { PandaVideoController } from './panda-video.controller'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'

@Module({
	imports: [
		HttpModule,
		ConfigModule,
		MulterModule.register({
			dest: './uploads'
		})
	],
	controllers: [PandaVideoController],
	providers: [PandaVideoService],
	exports: [PandaVideoService]
})
export class PandaVideoModule {}
