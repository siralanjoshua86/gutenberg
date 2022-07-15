/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import TemplatePartSelectionModal from '../components/selection-modal';
import createTemplatePartPostData from '../utils/create-template-part-post-data';

export default function NewTemplatePartInsert( {
	rootClientId,
	item,
	onSelect,
	onCancel,
} ) {
	const area = item?.initialAttributes?.area;
	const { saveEntityRecord } = useDispatch( coreStore );

	return (
		<TemplatePartSelectionModal
			area={ area }
			rootClientId={ rootClientId }
			onTemplatePartSelect={ async ( pattern ) => {
				const templatePart = pattern.templatePart;
				const inserterItem = {
					name: 'core/template-part',
					initialAttributes: {
						slug: templatePart.slug,
						theme: templatePart.theme,
					},
				};
				const focusBlock = true;
				onSelect( inserterItem, focusBlock );
			} }
			onPatternSelect={ async ( pattern, blocks ) => {
				const templatePartPostData = await createTemplatePartPostData(
					area,
					blocks,
					pattern.title
				);

				const templatePart = await saveEntityRecord(
					'postType',
					'wp_template_part',
					templatePartPostData
				);

				const inserterItem = {
					name: 'core/template-part',
					initialAttributes: {
						slug: templatePart.slug,
						theme: templatePart.theme,
					},
				};
				const focusBlock = true;
				onSelect( inserterItem, focusBlock );
			} }
			onClose={ onCancel }
		/>
	);
}
