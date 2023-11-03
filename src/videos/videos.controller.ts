import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common'
import { VideosService } from './videos.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { Video } from './entities/video.entity'
import { FileInterceptor } from '@nestjs/platform-express/multer'

@Controller('videos')
export class VideosController {
	constructor(private readonly videosService: VideosService) {}

	@Post()
	@UseInterceptors(FileInterceptor('video'))
	async create(
		@UploadedFile() video: Express.Multer.File,
		@Body() createVideoDto: CreateVideoDto
	): Promise<Video> {
		return await this.videosService.create(createVideoDto, video)
	}

	@Get()
	async findAll(): Promise<Video[]> {
		return await this.videosService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Video> {
		return await this.videosService.findOne(id)
	}
	@Get('/user:userId')
	async findByUserId(@Param('userId') id: number): Promise<Video[]> {
		return await this.videosService.findByUserId(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateVideoDto: UpdateVideoDto
	): Promise<any> {
		return await this.videosService.update(id, updateVideoDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: number): Promise<any> {
		return await this.videosService.remove(id)
	}
}
