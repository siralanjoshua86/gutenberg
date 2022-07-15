/**
 * External dependencies
 */
import { kebabCase } from 'lodash';

/**
 * WordPress dependencies
 */
import { serialize } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TemplatePartSelectionModal from '../components/selection-modal';

function createTemplatePartPostData(
	area,
	blocks = [],
	title = __( 'Untitled Template Part' )
) {
	// Currently template parts only allow latin chars.
	// Fallback slug will receive suffix by default.
	const cleanSlug =
		kebabCase( title ).replace( /[^\w-]+/g, '' ) || 'wp-custom-part';

	// If we have `area` set from block attributes, means an exposed
	// block variation was inserted. So add this prop to the template
	// part entity on creation. Afterwards remove `area` value from
	// block attributes.
	return {
		title,
		slug: cleanSlug,
		content: serialize( blocks ),
		// `area` is filterable on the server and defaults to `UNCATEGORIZED`
		// if provided value is not allowed.
		area,
	};
}

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
