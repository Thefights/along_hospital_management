import { routeUrls } from '@/configs/routeUrls'
import useTranslation from '@/hooks/useTranslation'
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material'
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const theme = useTheme()

	const stats = [
		{ value: '50k+', label: t('home.hero.stats.happy_patient') },
		{ value: '350+', label: t('home.hero.stats.specialist_doctor') },
		{ value: '98%', label: t('home.hero.stats.success_rate') },
	]

	const socialIcons = [
		{ icon: <Facebook />, color: '#1877F2' },
		{ icon: <Twitter />, color: '#1877F2' },
		{ icon: <Instagram />, color: '#E4405F' },
		{ icon: <YouTube />, color: '#FF0000' },
	]

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 80px)' },
				height: '100%',
				background: theme.palette.gradients.calm,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			{/* Background decorative elements */}
			<Box
				sx={{
					position: 'absolute',
					top: '20%',
					right: '5%',
					width: '400px',
					height: '400px',
					borderRadius: '50%',
					background: `radial-gradient(circle, ${
						theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.15)'
					} 0%, transparent 70%)`,
					filter: 'blur(40px)',
				}}
			/>

			<Box
				sx={{
					position: 'relative',
					height: '100%',
					width: '100%',
					py: { xs: 6, md: 8 },
					px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Grid container spacing={{ xs: 2, md: 4 }} alignItems='center' sx={{ width: '100%' }}>
					{/* Left Content */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Stack spacing={{ xs: 2.5, md: 3.5 }}>
							<Typography
								variant='h1'
								component='h1'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
									lineHeight: 1.2,
									color: theme.palette.text.primary,
									letterSpacing: '-0.02em',
								}}
							>
								{t('home.hero.title')}
							</Typography>

							<Typography
								variant='body1'
								sx={{
									fontSize: { xs: '0.9rem', sm: '1rem' },
									color: theme.palette.text.secondary,
									lineHeight: 1.7,
									maxWidth: '500px',
								}}
							>
								{t('home.hero.description')}
							</Typography>

							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
								<Button
									variant='contained'
									size='large'
									onClick={() =>
										navigate(routeUrls.BASE_ROUTE.PATIENT(routeUrls.PATIENT.APPOINTMENT.CREATE))
									}
									sx={{
										bgcolor: theme.palette.primary.main,
										color: theme.palette.primary.contrastText,
										fontWeight: 600,
										px: 4,
										py: 1.5,
										borderRadius: 2,
										textTransform: 'none',
										fontSize: '1rem',
										'&:hover': {
											bgcolor: theme.palette.primary.dark,
										},
									}}
								>
									{t('button.book_appointment')}
								</Button>

								<Button
									variant='text'
									size='large'
									onClick={() => navigate(routeUrls.HOME.MEDICAL_SERVICE)}
									sx={{
										color: theme.palette.text.secondary,
										fontWeight: 500,
										px: 3,
										py: 1.5,
										textTransform: 'none',
										fontSize: '1rem',
										'&:hover': {
											bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
										},
									}}
								>
									{t('button.view_services')}
								</Button>
							</Stack>

							{/* Stats */}
							<Stack direction='row' spacing={{ xs: 3, sm: 5 }} sx={{ pt: { xs: 2, md: 3 } }}>
								{stats.map((stat, index) => (
									<Box key={index}>
										<Typography
											variant='h4'
											sx={{
												fontWeight: 700,
												fontSize: { xs: '1.5rem', sm: '2rem' },
												color: theme.palette.primary.main,
												mb: 0.5,
											}}
										>
											{stat.value}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												fontSize: { xs: '0.75rem', sm: '0.875rem' },
												color: theme.palette.text.disabled,
											}}
										>
											{stat.label}
										</Typography>
									</Box>
								))}
							</Stack>
						</Stack>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Box
							sx={{
								position: 'relative',
								height: { xs: '400px', sm: '450px', md: '550px' },
								display: 'flex',
								alignItems: 'center',
								justifyContent: { xs: 'center', md: 'flex-start' },
								pl: { xs: 0, md: 4 },
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									right: { xs: '20%', md: '16%' },
									top: '50%',
									transform: 'translateY(-50%)',
									width: { xs: '250px', md: '350px' },
									height: { xs: '250px', md: '350px' },
									bgcolor:
										theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.12)' : 'rgba(33, 150, 243, 0.25)',
									borderRadius: '50%',
									filter: 'blur(60px)',
									zIndex: 0,
								}}
							/>
							<Box
								sx={{
									position: 'absolute',
									right: { xs: '8%', md: '12%' },
									top: '50%',
									transform: 'translateY(-50%)',
									width: '4px',
									height: '65%',
									bgcolor: theme.palette.primary.main,
									borderRadius: '4px',
									zIndex: 1,
								}}
							/>
							{/* Doctor image */}
							<Box
								component='img'
								src='/doctor-hero.png'
								alt='Healthcare Professional'
								onError={(e) => {
									e.currentTarget.style.display = 'none'
								}}
								sx={{
									position: 'relative',
									width: '90%',
									maxWidth: '450px',
									height: 'auto',
									objectFit: 'contain',
									zIndex: 1,
									ml: { xs: 0, md: 2 },
								}}
							/>
							{/* Social media icons - vertical */}
							<Stack
								spacing={2}
								sx={{
									position: 'absolute',
									right: { xs: 5, md: 10 },
									top: '50%',
									transform: 'translateY(-50%)',
									zIndex: 3,
								}}
							>
								{socialIcons.map((social, index) => (
									<Box
										key={index}
										sx={{
											width: 44,
											height: 44,
											borderRadius: '50%',
											bgcolor: theme.palette.background.paper,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
											boxShadow:
												theme.palette.mode === 'dark'
													? '0 2px 8px rgba(0,0,0,0.3)'
													: '0 2px 8px rgba(0,0,0,0.1)',
											color: social.color,
											transition: 'all 0.3s',
											'&:hover': {
												transform: 'translateY(-3px)',
												boxShadow:
													theme.palette.mode === 'dark'
														? '0 4px 12px rgba(0,0,0,0.4)'
														: '0 4px 12px rgba(0,0,0,0.15)',
											},
										}}
									>
										{social.icon}
									</Box>
								))}
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}

export default HeroSection
