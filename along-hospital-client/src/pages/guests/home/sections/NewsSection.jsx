import EmptyPage from '@/components/placeholders/EmptyPage'
import { ApiUrls } from '@/configs/apiUrls'
import { defaultBlogTypeStyle, defaultLineClampStyle } from '@/configs/defaultStylesConfig'
import { routeUrls } from '@/configs/routeUrls'
import useEnum from '@/hooks/useEnum'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { getEnumLabelByValue } from '@/utils/handleStringUtil'
import { ArrowForward } from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Container,
	Grid,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NewsCard = ({ blog }) => {
	const { t } = useTranslation()
	const { blogTypeOptions } = useEnum()
	const navigate = useNavigate()

	const formattedDate = blog.publicationDate
		? new Date(blog.publicationDate).toLocaleDateString()
		: ''

	const blogTypeString =
		getEnumLabelByValue(blogTypeOptions, blog.blogType) || t('enum.blog_type.other')
	const blogTypeStyle = (theme) => defaultBlogTypeStyle(theme, blog.blogType)

	const handleCardClick = () => {
		navigate(`${routeUrls.HOME.BLOG}/${blog.id}`)
	}

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				borderRadius: 3,
				boxShadow: 2,
				transition: 'all 0.3s',
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: 8,
				},
			}}
		>
			<CardActionArea
				onClick={handleCardClick}
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
			>
				<CardMedia
					component='img'
					height='220'
					image={getImageFromCloud(blog.image) || '/placeholder-image.png'}
					alt={blog.title || t('blog.text.image_alt')}
					onError={(event) => {
						event.currentTarget.src = '/placeholder-image.png'
					}}
					sx={{ bgcolor: 'background.default' }}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Stack spacing={1.5}>
						<Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
							<Typography
								variant='caption'
								sx={(theme) => ({
									fontWeight: 700,
									fontSize: '0.75rem',
									textTransform: 'uppercase',
									color: blogTypeStyle(theme).color,
								})}
							>
								{blogTypeString}
							</Typography>
							<Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
								{formattedDate}
							</Typography>
						</Stack>
						<Typography
							variant='h6'
							component='div'
							sx={{
								...defaultLineClampStyle(2),
								fontWeight: 600,
								fontSize: '1.125rem',
								minHeight: '3em',
								lineHeight: 1.4,
							}}
						>
							{blog.title || t('blog.title.untitled')}
						</Typography>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

const NewsSection = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const { data, loading } = useFetch(ApiUrls.BLOG.INDEX, { page: 1, pageSize: 5 }, [])

	const blogs = data?.collection || []

	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
			<Container
				maxWidth='xl'
				sx={{
					px: { xs: 3, sm: 4, md: 6 },
					maxWidth: '1200px !important',
				}}
			>
				<Stack spacing={5}>
					{/* Section Header */}
					<Stack spacing={2} alignItems='center' textAlign='center'>
						<Typography
							variant='h3'
							component='h2'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
								color: 'text.primary',
							}}
						>
							{t('home.news.title')}
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{
								maxWidth: '700px',
								fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
							}}
						>
							{t('home.news.subtitle')}
						</Typography>
					</Stack>

					{/* News Grid */}
					{loading ? (
						<Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
							{Array.from({ length: 5 }).map((_, index) => (
								<Grid
									size={{ xs: 12, sm: 6, md: index === 0 ? 12 : 6, lg: index === 0 ? 6 : 3 }}
									key={index}
								>
									<Card sx={{ height: '100%' }}>
										<Skeleton variant='rectangular' height={220} />
										<CardContent>
											<Stack direction='row' justifyContent='space-between' sx={{ mb: 1.5 }}>
												<Skeleton variant='text' width={80} height={20} />
												<Skeleton variant='text' width={70} height={20} />
											</Stack>
											<Skeleton variant='text' height={28} sx={{ mb: 0.5 }} />
											<Skeleton variant='text' height={28} width='85%' />
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					) : blogs.length === 0 ? (
						<EmptyPage
							title={t('home.news.no_news')}
							subtitle={t('home.news.subtitle')}
							showButton={false}
						/>
					) : (
						<Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
							{blogs.map((blog, index) => (
								<Grid
									size={{ xs: 12, sm: 6, md: index === 0 ? 12 : 6, lg: index === 0 ? 6 : 3 }}
									key={blog.id || blog.blogId || index}
								>
									<NewsCard blog={blog} />
								</Grid>
							))}
						</Grid>
					)}

					{/* View All Button */}
					{blogs.length > 0 && (
						<Stack alignItems='center' sx={{ pt: 2 }}>
							<Button
								variant='outlined'
								size='large'
								endIcon={<ArrowForward />}
								onClick={() => navigate(routeUrls.HOME.BLOG)}
								sx={{
									px: 4,
									py: 1.5,
									fontWeight: 600,
									fontSize: '1rem',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: 2,
									},
									transition: 'all 0.3s',
								}}
							>
								{t('button.view_all')}
							</Button>
						</Stack>
					)}
				</Stack>
			</Container>
		</Box>
	)
}

export default NewsSection
