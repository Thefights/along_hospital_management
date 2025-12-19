import FilterButton from '@/components/buttons/FilterButton'
import ResetFilterButton from '@/components/buttons/ResetFilterButton'
import useEnum from '@/hooks/useEnum'
import useFieldRenderer from '@/hooks/useFieldRenderer'
import { useForm } from '@/hooks/useForm'
import useTranslation from '@/hooks/useTranslation'
import { Grid, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

const ManagerOrderManagementFilterBarSection = ({ filters, setFilters, loading = false }) => {
	const { t } = useTranslation()
	const _enum = useEnum()

	const initialValues = {
		orderStatus: filters.orderStatus || '',
		orderDate: filters.orderDate || '',
		deliveryDate: filters.deliveryDate || '',
	}

	const { values, handleChange, setField, registerRef, reset } = useForm(initialValues)
	const { renderField } = useFieldRenderer(
		values,
		setField,
		handleChange,
		registerRef,
		false,
		'outlined',
		'small'
	)

	useEffect(() => {
		reset(initialValues)
	}, [filters])

	const statusOptions = [{ value: '', label: t('text.all') }, ..._enum.orderStatusOptions]

	const fields = [
		{
			key: 'orderStatus',
			title: t('order_management.field.status'),
			type: 'select',
			options: statusOptions,
			required: false,
		},
		{
			key: 'orderDate',
			title: t('order_management.field.order_date'),
			required: false,
			type: 'date',
		},
		{
			key: 'deliveryDate',
			title: t('order_management.field.delivery_date'),
			required: false,
			type: 'date',
		},
	]

	const applyFilters = () => setFilters(values)
	const resetFilters = () => {
		const empty = { orderStatus: '', orderDate: '', deliveryDate: '' }
		reset(empty)
		setFilters(empty)
	}

	return (
		<Stack
			spacing={1.5}
			size={{
				pt: 1,
				pb: 2,
				px: 2,
				borderRadius: 1,
				border: (theme) => `1px solid ${theme.palette.divider}`,
			}}
		>
			<Typography variant='caption'>{t('order_management.title.filters')}</Typography>
			<Grid container spacing={2} alignItems='flex-end'>
				{fields.map((field) => (
					<Grid key={field.key}>{renderField({ ...field, props: { sx: { width: 200 } } })}</Grid>
				))}
				<Grid>
					<Stack direction='row' spacing={0.5}>
						<FilterButton loading={loading} onFilterClick={applyFilters} />
						<ResetFilterButton loading={loading} onResetFilterClick={resetFilters} />
					</Stack>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default ManagerOrderManagementFilterBarSection
