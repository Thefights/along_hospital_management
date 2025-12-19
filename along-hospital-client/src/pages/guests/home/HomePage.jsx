import { Box } from '@mui/material'
import FAQSection from './sections/FAQSection'
import HeroSection from './sections/HeroSection'
import MedicineSection from './sections/MedicineSection'
import NewsSection from './sections/NewsSection'
import StatisticsSection from './sections/StatisticsSection'
import TestimonialSection from './sections/TestimonialSection'

const HomePage = () => {
	return (
		<Box>
			<HeroSection />
			<StatisticsSection />
			<TestimonialSection />
			<MedicineSection />
			<NewsSection />
			<FAQSection />
		</Box>
	)
}

export default HomePage
