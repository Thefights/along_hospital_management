import DashboardDrawer from '@/components/layouts/DashboardDrawer'
import { default as DashboardHeader } from '@/components/layouts/DashboardHeader'
import { routeUrls } from '@/configs/routeUrls'
import useAuth from '@/hooks/useAuth'
import useReduxStore from '@/hooks/useReduxStore'
import useTranslation from '@/hooks/useTranslation'
import { setProfileStore } from '@/redux/reducers/patientReducer'
import {
	ApartmentRounded,
	ArticleRounded,
	AssignmentRounded,
	BadgeRounded,
	CategoryRounded,
	CheckBoxRounded,
	DashboardRounded,
	Delete,
	DescriptionRounded,
	DiscountRounded,
	DomainRounded,
	EventAvailableRounded,
	FileUploadRounded,
	FlagRounded,
	Inventory2Rounded,
	LocalPharmacyRounded,
	Person,
	PersonAddAlt1Rounded,
	PersonRounded,
	QuestionAnswerRounded,
	ReceiptLongRounded,
	SettingsRounded,
	WorkHistoryRounded,
	WorkOutlineRounded,
} from '@mui/icons-material'
import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const LayoutManager = () => {
	const [collapsedDrawer, setCollapsedDrawer] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const { logout } = useAuth()
	const { t } = useTranslation()

	const profileStore = useReduxStore({
		selector: (s) => s.patient.profile,
		setStore: setProfileStore,
	})

	const sections = [
		{
			items: [
				{
					key: 'dashboard',
					label: t('sidebar.dashboard'),
					icon: <DashboardRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(),
				},
			],
		},
		{
			title: t('sidebar.clinical_management'),
			items: [
				{
					key: 'appointment',
					label: t('sidebar.appointment'),
					icon: <EventAvailableRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.APPOINTMENT_MANAGEMENT),
				},
				{
					key: 'medical-history',
					label: t('sidebar.medical_history'),
					icon: <DescriptionRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICAL_HISTORY.INDEX),
				},
				{
					key: 'medical-service',
					label: t('sidebar.medical_service'),
					icon: <AssignmentRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICAL_SERVICE_MANAGEMENT),
				},
			],
		},
		{
			title: t('sidebar.commerce_inventory'),
			items: [
				{
					key: 'order',
					label: t('sidebar.order'),
					icon: <ReceiptLongRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.ORDER_MANAGEMENT),
				},
				{
					key: 'voucher',
					label: t('sidebar.voucher'),
					icon: <DiscountRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.VOUCHER_MANAGEMENT),
				},
				{
					key: 'inventory',
					label: t('sidebar.inventory'),
					icon: <Inventory2Rounded />,
					of: [
						{
							key: 'medicine',
							label: t('sidebar.medicine'),
							icon: <LocalPharmacyRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICINE_MANAGEMENT.INDEX),
						},
						{
							key: 'medicine-category',
							label: t('sidebar.medicine_category'),
							icon: <CategoryRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.MEDICINE_CATEGORY_MANAGEMENT.INDEX),
						},
						{
							key: 'import',
							label: t('sidebar.import'),
							icon: <FileUploadRounded />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.IMPORT_MANAGEMENT),
						},
						{
							key: 'supplier',
							label: t('sidebar.supplier'),
							icon: <BadgeRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SUPPLIER_MANAGEMENT),
						},
					],
				},
				{
					key: 'import',
					label: t('sidebar.import_management'),
					icon: <FileUploadRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.IMPORT_MANAGEMENT.INDEX),
				},
			],
		},
		{
			title: t('sidebar.human_resource'),
			items: [
				{
					key: 'organization',
					label: t('sidebar.organization'),
					icon: <ApartmentRounded />,
					of: [
						{
							key: 'department',
							label: t('sidebar.department'),
							icon: <DomainRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.DEPARTMENT_MANAGEMENT),
						},
						{
							key: 'specialty',
							label: t('sidebar.specialty'),
							icon: <WorkOutlineRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SPECIALTY_MANAGEMENT),
						},
					],
				},
				{
					key: 'employee',
					label: t('sidebar.employee'),
					icon: <PersonRounded />,
					of: [
						{
							key: 'doctor',
							label: t('sidebar.doctor'),
							icon: <PersonAddAlt1Rounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.DOCTOR_MANAGEMENT),
						},
					],
				},
				{
					key: 'workforce',
					label: t('sidebar.workforce'),
					icon: <WorkHistoryRounded />,
					of: [
						{
							key: 'attendance',
							label: t('sidebar.attendance'),
							icon: <CheckBoxRounded />,
							url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.ATTENDANCE_MANAGEMENT),
						},
						{
							key: 'shift',
							label: t('sidebar.shift'),
							icon: <Delete />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.SHIFT_MANAGEMENT),
						},
						{
							key: 'payroll',
							label: t('sidebar.payroll'),
							icon: <Delete />,
							// url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.PAYROLL_MANAGEMENT),
						},
					],
				},
			],
		},
		{
			title: t('sidebar.customer_support'),
			items: [
				{
					key: 'blog',
					label: t('sidebar.blog'),
					icon: <ArticleRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.BLOG.INDEX),
				},
				{
					key: 'feedback-report',
					label: t('sidebar.feedback_report'),
					icon: <QuestionAnswerRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.FEEDBACK_REPORT_MANAGEMENT),
				},
				{
					key: 'complaint',
					label: t('sidebar.complaint'),
					icon: <FlagRounded />,
					url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.COMPLAINT_MANAGEMENT),
				},
			],
		},
		{
			title: 'System',
			items: [
				{ key: 'settings', label: 'Settings', icon: <SettingsRounded />, url: '/admin/settings' },
			],
		},
	]

	const userMenuItems = [
		{
			label: t('header.user_menu.profile'),
			url: routeUrls.BASE_ROUTE.MANAGER(routeUrls.MANAGER.PROFILE),
			icon: <Person />,
		},
	]

	return (
		<Stack direction={'row'}>
			<DashboardDrawer
				sections={sections}
				collapsed={collapsedDrawer}
				onToggleCollapse={() => setCollapsedDrawer((prev) => !prev)}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>
			<Stack flexGrow={1}>
				<DashboardHeader
					profile={profileStore.data}
					onLogout={logout}
					onOpenDrawer={() => setMobileOpen(true)}
					userMenuItems={userMenuItems}
				/>
				<Container sx={{ flexGrow: 1, py: 3 }} maxWidth='xl'>
					<Outlet />
				</Container>
			</Stack>
		</Stack>
	)
}

export default LayoutManager
