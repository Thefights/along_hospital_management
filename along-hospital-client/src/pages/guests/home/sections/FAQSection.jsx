import useTranslation from '@/hooks/useTranslation'
import { Add, Remove } from '@mui/icons-material'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Chip,
	Container,
	Stack,
	Typography,
	useTheme,
} from '@mui/material'
import { useState } from 'react'

const FAQSection = () => {
	const { t } = useTranslation()
	const theme = useTheme()
	const [expanded, setExpanded] = useState('q1')

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false)
	}

	const faqs = ['q1', 'q2', 'q3', 'q4', 'q5']

	return (
		<Box
			sx={{
				py: { xs: 6, md: 10 },
				background:
					theme.palette.mode === 'dark'
						? 'linear-gradient(180deg, rgba(156,39,176,0.03) 0%, rgba(0,0,0,0) 100%)'
						: 'linear-gradient(180deg, rgba(156,39,176,0.05) 0%, rgba(255,255,255,1) 100%)',
			}}
		>
			<Container maxWidth='md'>
				{/* Header */}
				<Stack spacing={2} alignItems='center' textAlign='center' mb={6}>
					<Chip
						label='FAQ'
						color='info'
						variant='outlined'
						sx={{ borderRadius: 2, fontSize: 14, fontWeight: 600 }}
					/>
					<Typography variant='h3' fontWeight={700}>
						{t('home.faq.title')}
					</Typography>
					<Typography variant='h6' color='text.secondary' maxWidth={600}>
						{t('home.faq.subtitle')}
					</Typography>
				</Stack>

				{/* FAQ Accordion */}
				<Stack spacing={2}>
					{faqs.map((faq, index) => (
						<Accordion
							key={faq}
							expanded={expanded === faq}
							onChange={handleChange(faq)}
							elevation={0}
							sx={{
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: '12px !important',
								overflow: 'hidden',
								'&:before': { display: 'none' },
								'&.Mui-expanded': {
									margin: 0,
									borderColor: theme.palette.primary.main,
									boxShadow: theme.shadows[4],
								},
							}}
						>
							<AccordionSummary
								expandIcon={
									expanded === faq ? (
										<Remove
											sx={{
												color: 'primary.main',
												fontSize: 28,
											}}
										/>
									) : (
										<Add
											sx={{
												color: 'text.secondary',
												fontSize: 28,
											}}
										/>
									)
								}
								sx={{
									minHeight: 72,
									py: 2,
									px: 3,
									'&.Mui-expanded': {
										minHeight: 72,
										borderBottom: `1px solid ${theme.palette.divider}`,
									},
									'& .MuiAccordionSummary-content': {
										my: 0,
									},
								}}
							>
								<Stack direction='row' spacing={2} alignItems='center'>
									<Box
										sx={{
											minWidth: 40,
											height: 40,
											borderRadius: '10px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											background:
												expanded === faq
													? theme.palette.primary.main
													: theme.palette.mode === 'dark'
													? 'rgba(255,255,255,0.05)'
													: 'rgba(0,0,0,0.03)',
											color: expanded === faq ? 'white' : 'text.secondary',
											fontWeight: 700,
											fontSize: 16,
											transition: 'all 0.3s ease',
										}}
									>
										{index + 1}
									</Box>
									<Typography
										variant='h6'
										fontWeight={600}
										sx={{
											color: expanded === faq ? 'primary.main' : 'text.primary',
											transition: 'color 0.3s ease',
										}}
									>
										{t(`home.faq.items.${faq}.question`)}
									</Typography>
								</Stack>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									px: 3,
									py: 3,
									background:
										theme.palette.mode === 'dark' ? 'rgba(33,150,243,0.02)' : 'rgba(33,150,243,0.03)',
								}}
							>
								<Typography
									variant='body1'
									color='text.secondary'
									sx={{
										lineHeight: 1.8,
										pl: 7,
									}}
								>
									{t(`home.faq.items.${faq}.answer`)}
								</Typography>
							</AccordionDetails>
						</Accordion>
					))}
				</Stack>

				{/* Bottom CTA */}
				<Stack
					spacing={2}
					mt={6}
					p={4}
					textAlign='center'
					sx={{
						background:
							theme.palette.mode === 'dark'
								? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(156,39,176,0.1) 100%)'
								: 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(156,39,176,0.08) 100%)',
						borderRadius: 3,
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<Typography variant='h5' fontWeight={600}>
						{t('text.still_have_questions')}
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						{t('text.contact_support')}
					</Typography>
				</Stack>
			</Container>
		</Box>
	)
}

export default FAQSection
