import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { FormatQuote, NavigateBefore, NavigateNext, Star } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	Container,
	IconButton,
	Rating,
	Stack,
	Typography,
	useTheme,
} from '@mui/material'
import { useState } from 'react'

const TestimonialSection = () => {
	const { t } = useTranslation()
	const theme = useTheme()
	const [activeIndex, setActiveIndex] = useState(0)

	// Mock data - Replace with real API call
	const testimonials = [
		{
			id: 1,
			name: 'Nguyễn Văn A',
			avatar: null,
			rating: 5,
			comment:
				'Dịch vụ tuyệt vời! Bác sĩ rất tận tâm và chu đáo. Tôi rất hài lòng với chất lượng khám chữa bệnh tại đây.',
			date: '2024-01-15',
			service: 'Khám tổng quát',
		},
		{
			id: 2,
			name: 'Trần Thị B',
			avatar: null,
			rating: 5,
			comment:
				'Cơ sở vật chất hiện đại, nhân viên thân thiện. Đội ngũ y bác sĩ chuyên nghiệp và giàu kinh nghiệm.',
			date: '2024-01-20',
			service: 'Xét nghiệm',
		},
		{
			id: 3,
			name: 'Lê Văn C',
			avatar: null,
			rating: 5,
			comment:
				'Quy trình khám nhanh gọn, không mất thời gian chờ đợi. Bác sĩ tư vấn rất kỹ càng và dễ hiểu.',
			date: '2024-02-01',
			service: 'Chẩn đoán hình ảnh',
		},
		{
			id: 4,
			name: 'Phạm Thị D',
			avatar: null,
			rating: 5,
			comment:
				'Tôi đã khám ở nhiều bệnh viện nhưng đây là nơi tôi cảm thấy yên tâm nhất. Cảm ơn đội ngũ bác sĩ!',
			date: '2024-02-10',
			service: 'Cấp cứu',
		},
	]

	const handlePrev = () => {
		setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
	}

	const handleNext = () => {
		setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
	}

	const getVisibleTestimonials = () => {
		const visible = []
		for (let i = 0; i < 3; i++) {
			const index = (activeIndex + i) % testimonials.length
			visible.push(testimonials[index])
		}
		return visible
	}

	return (
		<Box
			sx={{
				py: { xs: 6, md: 10 },
				background:
					theme.palette.mode === 'dark'
						? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(156,39,176,0.03) 100%)'
						: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(156,39,176,0.05) 100%)',
			}}
		>
			<Container maxWidth='lg'>
				{/* Header */}
				<Stack spacing={2} alignItems='center' textAlign='center' mb={6}>
					<Chip
						icon={<FormatQuote />}
						label={t('home.testimonial.subtitle')}
						color='secondary'
						variant='outlined'
						sx={{ borderRadius: 2 }}
					/>
					<Typography variant='h3' fontWeight={700}>
						{t('home.testimonial.title')}
					</Typography>
				</Stack>

				{/* Carousel */}
				<Box sx={{ position: 'relative' }}>
					{/* Navigation Buttons */}
					<IconButton
						onClick={handlePrev}
						sx={{
							position: 'absolute',
							left: { xs: -16, md: -60 },
							top: '50%',
							transform: 'translateY(-50%)',
							bgcolor: 'background.paper',
							border: `1px solid ${theme.palette.divider}`,
							boxShadow: theme.shadows[4],
							zIndex: 2,
							'&:hover': {
								bgcolor: 'primary.main',
								color: 'white',
							},
						}}
					>
						<NavigateBefore />
					</IconButton>

					<IconButton
						onClick={handleNext}
						sx={{
							position: 'absolute',
							right: { xs: -16, md: -60 },
							top: '50%',
							transform: 'translateY(-50%)',
							bgcolor: 'background.paper',
							border: `1px solid ${theme.palette.divider}`,
							boxShadow: theme.shadows[4],
							zIndex: 2,
							'&:hover': {
								bgcolor: 'primary.main',
								color: 'white',
							},
						}}
					>
						<NavigateNext />
					</IconButton>

					{/* Testimonial Cards */}
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={3}
						sx={{
							transition: 'all 0.5s ease',
						}}
					>
						{getVisibleTestimonials().map((testimonial, index) => (
							<Card
								key={testimonial.id}
								elevation={0}
								sx={{
									flex: 1,
									border: `1px solid ${theme.palette.divider}`,
									background:
										index === 0
											? theme.palette.mode === 'dark'
												? 'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(33,150,243,0.05) 100%)'
												: 'linear-gradient(135deg, rgba(156,39,176,0.08) 0%, rgba(33,150,243,0.05) 100%)'
											: 'background.paper',
									transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
									transition: 'all 0.3s ease',
									opacity: index === 2 ? 0.7 : 1,
									display: { xs: index > 0 ? 'none' : 'block', md: 'block' },
								}}
							>
								<CardContent sx={{ p: 3 }}>
									<Stack spacing={3}>
										{/* Quote Icon */}
										<FormatQuote
											sx={{
												fontSize: 48,
												color: 'secondary.main',
												opacity: 0.3,
												transform: 'rotate(180deg)',
											}}
										/>

										{/* Comment */}
										<Typography
											variant='body1'
											color='text.secondary'
											sx={{
												minHeight: { md: 100 },
												fontStyle: 'italic',
											}}
										>
											"{testimonial.comment}"
										</Typography>

										{/* Rating */}
										<Rating
											value={testimonial.rating}
											precision={0.5}
											readOnly
											icon={<Star fontSize='small' />}
										/>

										{/* Patient Info */}
										<Stack direction='row' spacing={2} alignItems='center'>
											<Avatar
												src={getImageFromCloud(testimonial.avatar)}
												sx={{
													width: 56,
													height: 56,
													border: `2px solid ${theme.palette.secondary.main}`,
												}}
											>
												{testimonial.name[0]}
											</Avatar>
											<Box>
												<Typography variant='subtitle1' fontWeight={600}>
													{testimonial.name}
												</Typography>
												<Typography variant='caption' color='text.secondary'>
													{testimonial.service}
												</Typography>
											</Box>
										</Stack>
									</Stack>
								</CardContent>
							</Card>
						))}
					</Stack>

					{/* Dots Indicator */}
					<Stack direction='row' spacing={1} justifyContent='center' mt={4}>
						{testimonials.map((_, index) => (
							<Box
								key={index}
								onClick={() => setActiveIndex(index)}
								sx={{
									width: activeIndex === index ? 32 : 8,
									height: 8,
									borderRadius: 4,
									bgcolor: activeIndex === index ? 'secondary.main' : 'divider',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
								}}
							/>
						))}
					</Stack>
				</Box>
			</Container>
		</Box>
	)
}

export default TestimonialSection
