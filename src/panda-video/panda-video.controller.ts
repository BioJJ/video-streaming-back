import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { PandaVideoService } from './panda-video.service'

@Controller('panda-video')
export class PandaVideoController {
	constructor(private readonly pandaVideoService: PandaVideoService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('video'))
	async videoUpload(@UploadedFile() video: Express.Multer.File, @Body() body) {
		const { folderId, videoName } = body

		return await this.pandaVideoService.uploadVideo(videoName, video, folderId)
	}

	@Get()
	findAll() {
		return this.pandaVideoService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.pandaVideoService.findOne(id)
	}
}
