import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Video } from './entities/video.entity'
import { Repository } from 'typeorm'
import { PandaVideoService } from 'src/panda-video/panda-video.service'

@Injectable()
export class VideosService {
	constructor(
		@InjectRepository(Video)
		private readonly repository: Repository<Video>,
		private readonly pandaService: PandaVideoService
	) {}

	async create(
		createVideoDto: CreateVideoDto,
		video: Express.Multer.File
	): Promise<Video> {
		createVideoDto.videoId = await this.uploadVideo(createVideoDto.title, video)

		const createVideo = this.repository.create(createVideoDto)

		return await this.repository.save(createVideo)
	}

	async findAll(): Promise<Video[]> {
		const queryBuilder = this.repository.createQueryBuilder('video')
		queryBuilder.leftJoinAndSelect('video.user', 'user')
		queryBuilder.select([
			'video.id',
			'video.title',
			'video.videoId',
			'video.status',
			'user.id',
			'user.name'
		])

		return queryBuilder.getMany()
	}

	async findOne(id: number): Promise<Video> {
		// return await this.repository.findOne({
		// 	where: { id }
		// })
		const queryBuilder = this.repository.createQueryBuilder('video')
		queryBuilder.leftJoinAndSelect('video.user', 'user')
		queryBuilder.select([
			'video.id',
			'video.title',
			'video.videoId',
			'video.status',
			'user.id',
			'user.name'
		])
		queryBuilder.where('video.id = :id', { id: id })

		return queryBuilder.getOne()
	}

	async findByUserId(id: number): Promise<Video[]> {
		return await this.repository.find({
			where: {
				user: {
					id
				}
			}
		})
	}

	async update(id: number, updateVideoDto: UpdateVideoDto): Promise<any> {
		const video = await this.findOne(id)

		if (!video) {
			throw new NotFoundException(`Não achei um video com o id ${id}`)
		}

		this.repository.merge(video, updateVideoDto)
		await this.repository.save(video)
	}

	async remove(id: number): Promise<any> {
		const video = await this.findOne(id)

		if (!video) {
			throw new NotFoundException(`Não achei um video com o id ${id}`)
		}
		this.repository.softDelete({ id })
	}

	async uploadVideo(videoName: string, video: Express.Multer.File) {
		const videoPanda = await this.pandaService.uploadVideo(videoName, video)

		return videoPanda.videoId
	}
}
