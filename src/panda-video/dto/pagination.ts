import { Video } from 'src/videos/entities/video.entity'

export class Pagination {
	videos: Video[]
	pages: number
	total: number
}
