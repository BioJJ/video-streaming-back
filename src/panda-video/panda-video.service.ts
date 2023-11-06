import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { Pagination } from './dto/pagination'
import { Video } from 'src/videos/entities/video.entity'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PandaVideoService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}

	async uploadVideo(
		videoName: string,
		video: Express.Multer.File,
		folderId?: string | null
	) {
		const VIDEO_ID = uuidv4()

		const api_panda = this.configService.get('URL_PANDA_UPLOAD')

		let metadata = `authorization ${Buffer.from(
			this.configService.get('CHAVE_API')
		).toString('base64')}`

		if (folderId) {
			metadata += `, folder_id ${Buffer.from(folderId).toString('base64')}`
		}
		metadata += `, filename ${Buffer.from(videoName).toString('base64')}`
		metadata += `, video_id ${Buffer.from(VIDEO_ID).toString('base64')}`

		const fileData = fs.readFileSync(video.path)
		try {
			await lastValueFrom(
				this.httpService.post(`${api_panda}/files`, fileData, {
					headers: {
						'Tus-Resumable': '1.0.0',
						'Upload-Length': fileData.byteLength,
						'Content-Type': 'application/offset+octet-stream',
						'Upload-Metadata': metadata
					}
				})
			)
			console.log('Upload concluído com sucesso')
			return { videoId: VIDEO_ID, title: videoName }
		} catch (error) {
			console.log('UPLOAD ERROR')
			console.log(error)
		}
	}

	async findAll() {
		const api_panda = this.configService.get('URL_PANDA')
		try {
			const config = {
				headers: {
					Accept: 'application/json',
					Authorization: this.configService.get('CHAVE_API')
				}
			}
			const response = await lastValueFrom(
				this.httpService.get<Pagination>(`${api_panda}/videos`, config)
			)
			return response.data
		} catch (error) {
			console.error(error)
			throw new Error('Error fetching high video data from PANDA API.')
		}
	}

	async findOne(id: string) {
		const api_panda = this.configService.get('URL_PANDA')
		try {
			const config = {
				headers: {
					Accept: 'application/json',
					Authorization: this.configService.get('CHAVE_API')
				}
			}
			const response = await lastValueFrom(
				this.httpService.get<Video>(`${api_panda}/videos/${id}`, config)
			)
			return response.data
		} catch (error) {
			console.error(error)
			throw new Error('Error fetching high video data from PANDA API.')
		}
	}
}
