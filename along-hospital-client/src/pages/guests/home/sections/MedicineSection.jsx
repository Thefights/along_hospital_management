import EmptyPage from '@/components/placeholders/EmptyPage'
import { ApiUrls } from '@/configs/apiUrls'
import { routeUrls } from '@/configs/routeUrls'
import useFetch from '@/hooks/useFetch'
import useTranslation from '@/hooks/useTranslation'
import { getImageFromCloud } from '@/utils/commons'
import { formatCurrencyBasedOnCurrentLanguage } from '@/utils/formatNumberUtil'
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

const MedicineCard = ({ medicine }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate(routeUrls.HOME.MEDICINE)
	}

	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
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
				onClick={handleClick}
				sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
			>
				<CardMedia
					component='img'
					height='200'
					image={getImageFromCloud(medicine.image)}
					alt={medicine.name}
					sx={{
						objectFit: 'cover',
						bgcolor: 'background.default',
					}}
					onError={(e) => {
						e.currentTarget.src = '/placeholder-image.png'
					}}
				/>
				<CardContent sx={{ flexGrow: 1, width: '100%' }}>
					<Stack spacing={1}>
						<Typography
							variant='h6'
							component='h3'
							sx={{
								fontWeight: 600,
								fontSize: '1.1rem',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								minHeight: '3.3em',
							}}
						>
							{medicine.name}
						</Typography>

						{medicine.brand && (
							<Typography variant='body2' color='text.secondary'>
								{medicine.brand}
							</Typography>
						)}

						<Typography
							variant='h6'
							color='primary.main'
							sx={{ fontWeight: 700, fontSize: '1.25rem', mt: 1 }}
						>
							{formatCurrencyBasedOnCurrentLanguage(medicine.price)}
						</Typography>

						{medicine.unit && (
							<Typography variant='caption' color='text.secondary'>
								{medicine.unit}
							</Typography>
						)}
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

const MedicineSection = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const { data, loading } = useFetch(ApiUrls.MEDICINE.INDEX, { page: 1, pageSize: 8 }, [])

	const medicines = data?.collection || []

	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
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
							{t('home.medicine.title')}
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{
								maxWidth: '700px',
								fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
							}}
						>
							{t('home.medicine.subtitle')}
						</Typography>
					</Stack>

					{/* Medicine Grid */}
					{loading ? (
						<Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
							{Array.from({ length: 8 }).map((_, index) => (
								<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
									<Card sx={{ height: '100%' }}>
										<Skeleton variant='rectangular' height={200} />
										<CardContent>
											<Skeleton variant='text' height={32} sx={{ mb: 1 }} />
											<Skeleton variant='text' height={24} width='60%' sx={{ mb: 1 }} />
											<Skeleton variant='text' height={28} width='40%' />
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					) : medicines.length === 0 ? (
						<EmptyPage
							title={t('medicine.placeholder.no_data')}
							subtitle={t('home.medicine.subtitle')}
							showButton={false}
						/>
					) : (
						<Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
							{medicines.map((medicine) => (
								<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={medicine.id}>
									<MedicineCard medicine={medicine} />
								</Grid>
							))}
						</Grid>
					)}

					{/* View All Button */}
					{medicines.length > 0 && (
						<Stack alignItems='center' sx={{ pt: 2 }}>
							<Button
								variant='contained'
								size='large'
								endIcon={<ArrowForward />}
								onClick={() => navigate(routeUrls.HOME.MEDICINE)}
								sx={{
									px: 4,
									py: 1.5,
									fontWeight: 600,
									fontSize: '1rem',
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: 4,
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

export default MedicineSection
